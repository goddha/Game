import Phaser from 'phaser'
let cursors
export class ScenePlay extends Phaser.Scene {
  constructor() {
    super({ key: 'logoScene' })
  }
  preload() {
    cursors = this.input.keyboard.createCursorKeys()
  }
  create() {
    this.add.text(400, 300, 'press space', { color: '#ff00ff', font: 'bold 30px' })
  }
  update() {
    if (cursors.space.isDown) {
      this.scene.start('snakeScene')
    }
  }
}

export default ScenePlay
