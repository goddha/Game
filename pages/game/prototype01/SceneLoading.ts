import Phaser from 'phaser'

const imageList = [
	'snakeHead',
	'snakePoints',
	'btnInfo',
	'grass1',
	'grass2',
	'mp_cs_tilemap_all',
	'platform',
	'car1',
	'car0',
	'hudGlass',
	'hudFillYellow',
	'hudFillRed',
	'hudCover',
	'gasTank',
]
const gameCenterX = 1024 / 2
const gameCenterY = 768 / 2
let velocitySpeed = 300
let getInput = true
let moveX = false
let moveY = false
let cursors: Phaser.Types.Input.Keyboard.CursorKeys
let actor: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
let textInput: Phaser.GameObjects.Text
export class SceneLoading extends Phaser.Scene {
	constructor() {
		super({ key: 'loadingScene', active: true })
	}

	preload() {
		const loadingTxt = this.add.text(1024 / 2, 768 / 2, '', { color: '#ffffff' }).setOrigin(0.5)
		imageList.map((name) => {
			this.load.image(name, name + '.png')
		})
		this.load.multiatlas('blood', 'blood.json')
		this.load.multiatlas('human', 'human.json')
		this.load.multiatlas('zombie', 'zombie.json')
		this.load.multiatlas('explosion', 'explosion.json')
		this.load.on('progress', (progress) => {
			loadingTxt.setText(JSON.stringify(Math.floor(progress * 100)) + ' %')
		})
	}

	create() {
		this.scene.start('snakeScene')
		this.physics.world.setBoundsCollision(true, true, true, true)
		this.add.image(gameCenterX, gameCenterY, 'grass1')
		const squidtst = this.add.image(gameCenterX, gameCenterY, 'snakeHead')
		const SnowBall = this.add.image(gameCenterX, gameCenterY, 'snakeHead')
		const checkOvlp = (A: Phaser.GameObjects.Image, B: Phaser.GameObjects.Image) => {
			const recIntersec = Phaser.Geom.Intersects.GetRectangleIntersection(A.getBounds(), B.getBounds())
			if (!!recIntersec.height && !!recIntersec.width) console.log(recIntersec)
		}
		this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
			const graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x0000aa } })
			graphics.strokeRectShape(squidtst.getBounds())
			graphics.strokeRectShape(SnowBall.getBounds())
			squidtst.setPosition(pointer.x, pointer.y)
			checkOvlp(squidtst, SnowBall)
		})
		actor = this.physics.add.image(gameCenterX, gameCenterY, 'snakeHead').setBounce(0, 0).setCollideWorldBounds(true).setMass(0)
		const monster = this.physics.add.image(400, 400, 'btnInfo').setBounce(0, 0).setCollideWorldBounds(true).setPushable(false)
		const platform = this.physics.add.staticGroup()
		const food = this.physics.add.group({
			max: 50,
			maxSize: 50,
		})
		const bullet = this.physics.add.group({
			collideWorldBounds: true,
			maxSize: 5,
		})

		this.physics.world.on('worldbounds', () => {
			console.log('sadasdadaskajdklakjdklasjl')
		})
		this.physics.world.on('worldbounds', function (body) {
			console.log('sadasdadaskajdklakjdklasjl')
		})
		platform
			.create(1024 / 2, 760, 'platform')
			.setScale(0.5)
			.refreshBody()
		this.physics.add.collider(actor, food, (thisActor, thisFood) => {
			const foodobj: Phaser.GameObjects.Sprite = thisFood.body.gameObject
			const actorobj: Phaser.GameObjects.Sprite = thisActor.body.gameObject
			foodobj.destroy()
			actorobj.setTint(0x00ffff)
			setTimeout(() => {
				actorobj.isTinted && actorobj.clearTint()
			}, 100)
		})
		this.physics.add.collider(actor, platform)

		this.physics.add.collider(actor, monster, (thisActor, thisMonster) => {
			getInput = false
			monster.setVelocity(0, 0)
			actor.setVelocity(0, 0).setTint(0xff0000)
			moveX && actor.setVelocityX(+(thisMonster.body.x < thisActor.body.x) * 200 - 50)
			moveY && actor.setVelocityY(+(thisMonster.body.y < thisActor.body.y) * 200 - 50)
			setTimeout(() => {
				actor.setVelocity(0, 0)
				actor.isTinted && actor.clearTint()
				getInput = true
			}, 200)
		})
		this.input.on('pointerdown', () => {
			console.clear()
			console.table({ thisActorX: actor.body.x, thisActorY: actor.body.y })
			console.table({ thisMonsterX: monster.body.x, thisMonsterY: monster.body.y })
			getInput = false
		})
		this.input.on('pointerup', () => {
			getInput = true
		})
		cursors = this.input.keyboard.createCursorKeys()
		for (let i = Phaser.Math.Between(10, 30); i > 0; i--) {
			food.create(Phaser.Math.Between(100, 1000), Phaser.Math.Between(100, 700), 'snakePoints')
		}
		setInterval(() => {
			if (this.scene.isActive()) food.create(Phaser.Math.Between(100, 1000), Phaser.Math.Between(100, 700), 'snakePoints')
		}, 100)
		textInput = this.add.text(900, 100, '', { color: '#ffffff' }).setOrigin(0.5)
		this.input.keyboard.on('keydown-' + 'W', () => {
			this.scene.start('playScene')
		})
		this.input.keyboard.on('keydown-' + 'S', () => {
			this.scene.start('snakeScene')
		})
		this.input.keyboard.on('keydown-SPACE', () => {
			console.log(actor.body.blocked)
			bullet.create(actor.x, actor.y, 'btnInfo')
			if (getInput) {
				const velo = velocitySpeed * 5
				const buleltX = cursors.right.isDown || cursors.left.isDown
				const buleltY = cursors.up.isDown || cursors.down.isDown
				bullet.setVelocityX(velo)
				bullet.setVelocityY(velo)
			}
		})
	}
	update() {
		// this.game.events.on('hidden', () => {
		// 	console.log('hidden')
		// })
		// this.game.events.on('visible', () => {
		// 	console.log('visible')
		// })
		textInput.setText(`${getInput}`)
		if (getInput) {
			moveX = cursors.right.isDown || cursors.left.isDown
			moveY = cursors.up.isDown || cursors.down.isDown
			cursors.right.isDown
				? actor.setVelocityX(velocitySpeed)
				: cursors.left.isDown
				? actor.setVelocityX(-velocitySpeed)
				: !moveX
				? actor.setVelocityX(0)
				: null
			cursors.down.isDown ? actor.setVelocityY(velocitySpeed) : cursors.up.isDown ? actor.setVelocityY(-velocitySpeed) : !moveY ? actor.setVelocityY(0) : null
		}
		velocitySpeed = cursors.shift.isDown ? 600 : 300
	}
}
