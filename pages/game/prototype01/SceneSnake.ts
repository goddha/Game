import Phaser from 'phaser'

let cursors: Phaser.Types.Input.Keyboard.CursorKeys
let car: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
let zombie: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
let playArea: Phaser.GameObjects.Rectangle
let textStatus: Phaser.GameObjects.Text
let directionX = 0
let directionY = 0
const speed = 5
let zombies: Phaser.Physics.Arcade.Group
let gasTanks: Phaser.Physics.Arcade.Group
let isGameOver = false
let isGamePlaying = false
const carData = {
	hp: 100,
	hpMax: 100,
	fuel: 200,
	fuelMax: 200,
}
let hudFillHp: Phaser.GameObjects.Image
let hudFillFuel: Phaser.GameObjects.Image
// const isIntersect = (scene: Phaser.Scene, objA, objB) => {
// 	const intersect = Phaser.Geom.Intersects.GetRectangleIntersection(objA.getBounds(), objB.getBounds())
// 	if (!!intersect.width || !!intersect.height) console.log({ intersect })
// 	return !!intersect.width || !!intersect.height
// }
const carHit = (
	// actor: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
	object: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
	effect: Phaser.GameObjects.Sprite
) => {
	const minusScore = 10
	effect.setPosition(object.body.x, object.body.y).setVisible(true).anims.play('bloodSplash')
	object.destroy()
	return minusScore
}
const handleGameOver = (scene: Phaser.Scene, actor: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, hpOut: boolean) => {
	if (hpOut) {
		const explode = scene.add.sprite(car.x, car.y, 'explosion', 'explosion-0.png').setVisible(false)
		explode.setPosition(actor.x, actor.y).setVisible(true).anims.play('startExplosion')
		actor
			.setPosition(1024 / 2, 768 / 2)
			.setVisible(false)
			.disableBody()
	}
	actor.body.setEnable(false)
	return true
}
const hudControll = (scoreMax: number, score: number, hudFillImg: Phaser.GameObjects.Image) => {
	hudFillImg.setCrop(0, hudFillImg.height - (hudFillImg.height * score) / scoreMax, hudFillImg.width, hudFillImg.height)
}
const animateWithGenerateFrames = (
	scene: Phaser.Scene,
	atlasKey: string,
	animKey: string,
	end: number,
	animateConfig?: Phaser.Types.Animations.Animation,
	framesConfig?,
	start?: number
) => {
	const genFrames = scene.anims.generateFrameNames(atlasKey, {
		start: start || 0,
		end: end,
		prefix: atlasKey + '-',
		suffix: '.png',
		...framesConfig,
	})
	scene.anims.create({ key: animKey, frames: genFrames, duration: 450, hideOnComplete: true, showOnStart: false, ...animateConfig })
}
export class ScenePlay extends Phaser.Scene {
	constructor() {
		super({ key: 'snakeScene' })
	}
	preload() {
		cursors = this.input.keyboard.createCursorKeys()
	}
	create() {
		isGamePlaying = false
		isGameOver = false
		directionX = 0
		directionY = 0
		carData.hp = 100
		carData.fuel = 200
		const hudCover = this.add.image(1024 / 2, 768 / 2, 'hudCover')
		hudFillHp = this.add.image(35, 600, 'hudFillRed')
		const hudGlassHp = this.add.image(35, 600, 'hudGlass')
		hudFillFuel = this.add.image(75, 600, 'hudFillYellow')
		// const hudCropFuel = this.add.rectangle()
		const hudGlassFuel = this.add.image(75, 600, 'hudGlass')
		textStatus = this.add
			.text(900, 50, `hp : ${carData.hp} | fuel : ${carData.fuel}`, { color: '#ffffff' })
			.setOrigin(1, 0.5)
			.setData({ hp: JSON.stringify(carData.hp) })
		const textHowto = this.add.text(900, 700, `arrow key to move the car\nshift to boost`, { color: '#ffffff' }).setOrigin(1, 0.5)
		this.add.container(0, 0, [hudCover, hudFillHp, hudGlassHp, hudFillFuel, hudGlassFuel, textStatus, textHowto]).setDepth(999)
		hudFillFuel.setCrop(hudFillFuel.getBounds())
		playArea = this.add.rectangle(1024 / 2, 768 / 2, 800, 600, 0, 0.01)
		this.add.image(1024 / 2, 768 / 2, 'grass1').setDisplaySize(800, 600)
		car = this.physics.add
			.sprite(1024 / 2, 768 / 2, 'car1')
			.setPushable(false)
			.setVelocity(0, 0)
			.setDepth(99)
			.setCollideWorldBounds(true)
			.setAlpha(0.2)
		// this.anims.create({ key: 'startExplosion', frames: explosionFrames, duration: 600, hideOnComplete: true, showOnStart: false })
		animateWithGenerateFrames(this, 'blood', 'bloodSplash', 5, { duration: 450 })
		animateWithGenerateFrames(this, 'explosion', 'startExplosion', 15, {})
		zombies = this.physics.add.group({
			maxSize: 20,
		})
		gasTanks = this.physics.add.group({
			maxSize: 5,
		})
		this.physics.add.overlap(
			car,
			gasTanks,
			(object1: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, object2: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => {
				carData.fuel += 30
				object2.destroy()
			}
		)
		const zombieController = {
			tween: [],
			zombie: [],
			effect: [],
		}
		for (let i = 0; i < 15; i++) {
			zombie = this.physics.add
				.sprite(Phaser.Math.Between(150, 850), Phaser.Math.Between(100, 650), 'zombie', 'zombie-0.png')
				.setData({ key: i })
				.setDebug(true, true, 0x000fff)
			zombie.setSize(35, 35)
			const bloodSplash = this.add.sprite(0, 0, 'blood', 'blood-0.png').setScale(Phaser.Math.FloatBetween(0.25, 0.45)).setVisible(false)
			zombieController.effect.push(bloodSplash)
			zombies.add(zombie)
			const randomVelocity = {
				x: 20 * Phaser.Math.Between(-5, 5),
				y: 20 * Phaser.Math.Between(-5, 5),
				// x: 20,
				// y: 20,
			}
			zombie.setVelocity(randomVelocity.x, randomVelocity.y)
			const frameLimit = { start: 0, end: 1 }
			animateWithGenerateFrames(
				this,
				'zombie',
				'zombieWalk' + i,
				frameLimit.end,
				{ showOnStart: true, hideOnComplete: false, repeat: -1, duration: 600 },
				null,
				frameLimit.start
			)
			zombie.anims.play('zombieWalk' + i)
		}
		this.physics.add.overlap(
			car,
			zombies,
			(actor: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, object: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => {
				if (isGamePlaying) {
					const objectKey = object.data.list.key
					carData.hp -= carHit(object, zombieController.effect[objectKey])
					// carData.hp -= carHit(actor, object, zombieController.effect[objectKey])
					textStatus.data.list.hp = JSON.stringify(carData.hp)
					if (carData.hp < 1) {
						isGameOver = handleGameOver(this, car, true)
					}
				}
			}
		)
		// this.input.keyboard.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, (event) => {
		////// here just something don't want to do as often as update
		// 	gamestart = true
		// })
	}
	update() {
		const speedmodify = cursors.shift.isDown ? 100 : 50
		gasTanks.create(Phaser.Math.Between(150, 850), Phaser.Math.Between(100, 650), 'gasTank')
		if (isGamePlaying && !isGameOver) {
			if (carData.fuel <= 0) {
				isGameOver = handleGameOver(this, car, false)
			} else if (carData.fuel > 0) {
				carData.fuel -= (0.3 * speedmodify) / 50
			}
		}
		if (carData.fuel > carData.fuelMax) {
			carData.fuel = carData.fuelMax
		}
		hudControll(carData.fuelMax, carData.fuel, hudFillFuel)
		hudControll(carData.hpMax, carData.hp, hudFillHp)
		textStatus.setText(`hp : ${carData.hp} | fuel : ${Math.floor(carData.fuel)}`)
		zombies.children.entries.forEach((zombie) => {
			this.physics.world.wrapObject(zombie)
		})
		if (!isGameOver) {
			if (cursors.left.isDown) {
				directionX = -speed
				directionY = 0
				car.setAngle(270).setSize(48, 24)
				isGamePlaying = true
				car.setAlpha(1)
			}
			if (cursors.right.isDown) {
				directionX = speed
				directionY = 0
				car.setAngle(90).setSize(48, 24)
				isGamePlaying = true
				car.setAlpha(1)
			}
			if (cursors.up.isDown) {
				directionY = -speed
				directionX = 0
				car.setAngle(0).setSize(24, 48)
				isGamePlaying = true
				car.setAlpha(1)
			}
			if (cursors.down.isDown) {
				directionY = speed
				directionX = 0
				car.setAngle(180).setSize(24, 48)
				isGamePlaying = true
				car.setAlpha(1)
			}
			const allowEdge = -10
			const leftover = car.getBounds().left - playArea.getBounds().left > allowEdge
			const rightover = playArea.getBounds().right - car.getBounds().right > allowEdge
			const topover = car.getBounds().top - playArea.getBounds().top > allowEdge
			const bottomtover = playArea.getBounds().bottom - car.getBounds().bottom > allowEdge
			car.setVelocity(directionX * speedmodify, directionY * speedmodify)
			if (!leftover || !rightover || !topover || !bottomtover) {
				carData.hp = 0
				isGameOver = handleGameOver(this, car, true)
			}
		} else {
			// textStatus.data.list.hp = 'Game Over'
			textStatus.setText('GAME OVER\npress space to continue')
			if (cursors.space.isDown) {
				this.scene.restart()
			}
		}
	}
}

export default ScenePlay
