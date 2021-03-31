import Phaser from 'phaser'

let cursors: Phaser.Types.Input.Keyboard.CursorKeys
let actor: Phaser.GameObjects.Image
// let isWorldBounds: boolean
let world: Phaser.GameObjects.Rectangle
let monster: Phaser.GameObjects.Image
let textScore: Phaser.GameObjects.Text
const isIntersect = (scene: Phaser.Scene, objA, objB) => {
	const graphics = scene.add.graphics({ lineStyle: { width: 2, color: 0x0000aa } })
	// graphics.clear()
	// graphics.strokeRectShape(objA.getBounds())
	// graphics.strokeRectShape(objB.getBounds())
	const intersect = Phaser.Geom.Intersects.GetRectangleIntersection(objA.getBounds(), objB.getBounds())
	if (!!intersect.width || !!intersect.height) console.log({ intersect })
	return !!intersect.width || !!intersect.height
}
export class ScenePlay extends Phaser.Scene {
	constructor() {
		super({ key: 'playScene' })
	}

	preload() {
		cursors = this.input.keyboard.createCursorKeys()
		// console.log(this.scene.get('playScene'))
	}
	create() {
		world = this.add.rectangle(1024 / 2, 768 / 2, 800, 600, 0, 0.01)
		textScore = this.add.text(970, 50, 'score : 0', { color: '#ffffff' }).setOrigin(0.5).setData({ score: 0 })
		this.add.image(1024 / 2, 768 / 2, 'grass1').setDisplaySize(800, 600)
		actor = this.add.image(250, 180, 'Skull')
		monster = this.add.image(400, 400, 'SnowBall')
		// this.input.keyboard.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, function (event) {
		// const isActorHit = isIntersect(this,actor,monster)
		// if (isActorHit) {
		//   console.log(hit)
		// }
		// })
	}
	update() {
		if (isIntersect(this, actor, monster)) {
			monster.setPosition(Phaser.Math.Between(250, 950), Phaser.Math.Between(150, 650))
			textScore.data.list.score += 10
			textScore.setText(`score : ${textScore.data.list.score}`)
		}
		const leftover = actor.getBounds().left - world.getBounds().left > 10
		const rightover = world.getBounds().right - actor.getBounds().right > 10
		const topover = actor.getBounds().top - world.getBounds().top > 10
		const bottomtover = world.getBounds().bottom - actor.getBounds().bottom > 10
		cursors.left.isDown && leftover && actor.setX(actor.x - 10)
		cursors.right.isDown && rightover && actor.setX(actor.x + 10)
		cursors.up.isDown && topover && actor.setY(actor.y - 10)
		cursors.down.isDown && bottomtover && actor.setY(actor.y + 10)
	}
}

export default ScenePlay
