import Phaser from 'phaser'
import config from './utils/stageConfig'
import { animateWithGenerateFrames, carHit, handleGameOver, hudControll, createEnemyGroup, createItemGroup } from './utils/gameFunction'

interface groupPhysics {
  group: Phaser.Physics.Arcade.Group
  interval: NodeJS.Timeout
  timeOut: NodeJS.Timeout
}

let itemRepair: groupPhysics,
  zombies: groupPhysics,
  itemGasTanks: groupPhysics,
  isGameOver = false,
  isGamePlaying = false,
  directionX = 0,
  directionY = 0,
  hudFillHp: Phaser.GameObjects.Image,
  hudFillFuel: Phaser.GameObjects.Image,
  score = 0,
  cursors: Phaser.Types.Input.Keyboard.CursorKeys,
  car: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  playArea: Phaser.GameObjects.Rectangle,
  textStatus: Phaser.GameObjects.Text
const carData = {
    hp: 100,
    hpMax: 100,
    fuel: 200,
    fuelMax: 200,
    speed: 5,
  },
  progressConfig = config.stageNolimit

// const progressConfig = stageNolimit

export class ScenePlay extends Phaser.Scene {
  constructor() {
    super({ key: 'snakeScene' })
  }
  preload() {
    cursors = this.input.keyboard.createCursorKeys()
  }
  create() {
    score = 0
    isGamePlaying = false
    isGameOver = false
    directionX = 0
    directionY = 0
    carData.hp = 100
    carData.fuel = 200
    zombies = null
    itemRepair = null
    itemGasTanks = null
    const hudCover = this.add.image(1024 / 2, 768 / 2, 'hudCover')
    hudFillHp = this.add.image(35, 600, 'hudFillRed')
    const hudGlassHp = this.add.image(35, 600, 'hudGlass')
    hudFillFuel = this.add.image(75, 600, 'hudFillYellow')
    const hudGlassFuel = this.add.image(75, 600, 'hudGlass')
    textStatus = this.add.text(900, 40, `survive as long as you can`, { color: '#ffffff', align: 'right' }).setOrigin(1, 0.5)
    const textHowto = this.add.text(900, 725, `arrow key to move the car\nshift to boost`, { color: '#ffffff' }).setOrigin(1, 0.5)
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
    animateWithGenerateFrames(this, 'blood', 'bloodSplash', 5, { duration: 450 })
    animateWithGenerateFrames(this, 'explosion', 'startExplosion', 15, {})
    animateWithGenerateFrames(this, 'smoke', 'startSmoke', 11, {})
    zombies = createEnemyGroup(
      this,
      progressConfig.enemy.zombie,
      car,
      (actor: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, object: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => {
        if (isGamePlaying) {
          carData.hp -= carHit(this, object)
          if (carData.hp < 1) {
            isGameOver = handleGameOver(this, car, true)
          }
        }
      }
    )
    itemGasTanks = createItemGroup(
      this,
      progressConfig.items.gas,
      car,
      (actor: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, object: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => {
        if (isGamePlaying) {
          carData.fuel += Phaser.Math.Between(20, 40)
          object.destroy()
        }
      }
    )
    itemRepair = createItemGroup(
      this,
      progressConfig.items.repair,
      car,
      (actor: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, object: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => {
        if (isGamePlaying) {
          carData.hp += Phaser.Math.Between(20, 40)
          object.destroy()
        }
      }
    )
    zombies.group.children.entries.forEach((zombie, index) => {
      zombie.setData({ key: index })
    })
  }
  update() {
    zombies.group.children.entries.forEach((zombie) => {
      this.physics.world.wrapObject(zombie)
    })
    const speedmodify = cursors.shift.isDown ? 100 : 50
    if (isGamePlaying && !isGameOver) {
      score += speedmodify / 50
      textStatus.setText(`score : ${score}`)
      if (carData.fuel <= 0) {
        isGameOver = handleGameOver(this, car, false)
      } else if (carData.fuel > 0) {
        carData.fuel -= (0.3 * speedmodify) / 50
      }
    }
    if (carData.fuel > carData.fuelMax) {
      carData.fuel = carData.fuelMax
    }
    if (carData.hp > carData.hpMax) {
      carData.hp = carData.hpMax
    }
    hudControll(carData.fuelMax, carData.fuel, hudFillFuel)
    hudControll(carData.hpMax, carData.hp, hudFillHp)
    if (!isGameOver) {
      if (cursors.left.isDown) {
        directionX = -carData.speed
        directionY = 0
        car.setAngle(270).setSize(48, 24)
        isGamePlaying = true
        car.setAlpha(1)
      }
      if (cursors.right.isDown) {
        directionX = carData.speed
        directionY = 0
        car.setAngle(90).setSize(48, 24)
        isGamePlaying = true
        car.setAlpha(1)
      }
      if (cursors.up.isDown) {
        directionY = -carData.speed
        directionX = 0
        car.setAngle(0).setSize(24, 48)
        isGamePlaying = true
        car.setAlpha(1)
      }
      if (cursors.down.isDown) {
        directionY = carData.speed
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
      textStatus.setText(`GAME OVER\nscore : ${score}\npress space to continue`)
      if (cursors.space.isDown) {
        clearInterval(itemRepair.interval)
        clearInterval(itemRepair.timeOut)
        clearInterval(itemGasTanks.interval)
        clearInterval(itemGasTanks.timeOut)
        clearInterval(zombies.interval)
        clearTimeout(zombies.timeOut)
        // this.scene.restart()
        this.scene.start('logoScene')
      }
    }
  }
}

export default ScenePlay
