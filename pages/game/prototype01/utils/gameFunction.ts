import { groupItemsConfig, enemyConfig } from './interfaceType'
const carHit = (scene: Phaser.Scene, object: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => {
  const bloodSplash = scene.add.sprite(0, 0, 'blood', 'blood-0.png').setScale(Phaser.Math.FloatBetween(0.25, 0.45))
  const minusScore = 10
  bloodSplash.setPosition(object.body.x, object.body.y).setVisible(true).anims.play('bloodSplash')
  object.destroy()
  return minusScore
}
const handleGameOver = (scene: Phaser.Scene, actor: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, hpOut: boolean) => {
  if (hpOut) {
    const explode = scene.add.sprite(actor.x, actor.y, 'explosion', 'explosion-0.png')
    explode.anims.play('startExplosion')
    explode.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      explode.destroy()
    })
    actor
      .setPosition(1024 / 2, 768 / 2)
      .setVisible(false)
      .disableBody()
  } else {
    const smoke = scene.add.sprite(actor.x, actor.y, 'smoke', 'smoke-0.png').setScale(0.5)
    smoke.anims.play('startSmoke')
    smoke.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      smoke.destroy()
    })
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
  framesConfig?: Phaser.Types.Animations.GenerateFrameNames
) => {
  const genFrames = scene.anims.generateFrameNames(atlasKey, {
    start: 0,
    end: end,
    prefix: atlasKey + '-',
    suffix: '.png',
    ...framesConfig,
  })
  scene.anims.create({ key: animKey, frames: genFrames, duration: 450, hideOnComplete: true, showOnStart: false, ...animateConfig })
}
const createItemGroup = (scene: Phaser.Scene, prop: groupItemsConfig, actor: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, callFunc: Function) => {
  const groupItem = scene.physics.add.group({
    maxSize: prop.size.max,
    name: 'number' + Phaser.Math.Between(-999, 999),
  })
  let interval: NodeJS.Timeout
  let timeOut: NodeJS.Timeout
  const betweenX = [150, 850]
  const betweenY = [100, 650]
  // const betweenX = rangeX ? [rangeX[0], rangeX[1]] : [150, 850]
  // const betweenY = rangeY ? [rangeY[0], rangeY[1]] : [100, 650]
  for (let i = prop.size.start; i > 0; i--) {
    groupItem.create(Phaser.Math.Between(betweenX[0], betweenX[1]), Phaser.Math.Between(betweenY[0], betweenY[1]), prop.key)
  }
  let permissionCreate = false
  timeOut = setTimeout(() => {
    permissionCreate = true
  }, prop.timer.start)
  if (prop.timer.repeat) {
    interval = setInterval(() => {
      permissionCreate && groupItem.create(Phaser.Math.Between(betweenX[0], betweenX[1]), Phaser.Math.Between(betweenY[0], betweenY[1]), prop.key)
    }, prop.timer.repeat)
  }

  scene.physics.add.overlap(
    actor,
    groupItem,
    (actor: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, object: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => {
      callFunc(actor, object)
    }
  )
  return { group: groupItem, timeOut, interval }
}
const createEnemyGroup = (scene: Phaser.Scene, prop: enemyConfig, actor: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, callFunc: Function) => {
  const group = scene.physics.add.group({
    maxSize: prop.size.max,
    collideWorldBounds: true,
    bounceX: 1,
    bounceY: 1,
  })
  let interval: NodeJS.Timeout
  let timeOut: NodeJS.Timeout
  let intervalIncress: NodeJS.Timeout
  const betweenX = [150, 850]
  const betweenY = [100, 650]
  for (let i = 0; i < prop.size.start; i++) {
    const child = scene.physics.add.sprite(Phaser.Math.Between(betweenX[0], betweenX[1]), Phaser.Math.Between(betweenY[0], betweenY[1]), prop.key)
    if (prop.customConfig.bodySize) {
      child.setBodySize(prop.customConfig.bodySize, prop.customConfig.bodySize)
    }
    group.add(child)
    const randomVelocity = {
      x: 20 * Phaser.Math.Between(-5, 5),
      y: 20 * Phaser.Math.Between(-5, 5),
    }
    child.setVelocity(randomVelocity.x, randomVelocity.y)
    animateWithGenerateFrames(
      scene,
      prop.key,
      prop.animate.key + i,
      prop.animate.end,
      { showOnStart: true, hideOnComplete: false, repeat: -1, duration: 600 },
      { start: prop.animate.start }
    )
    child.anims.play(prop.animate.key + i)
  }
  let permisionCreate = false
  timeOut = setTimeout(() => {
    permisionCreate = true
  }, prop.timer.start)
  if (prop.timer.repeat) {
    interval = setInterval(() => {
      if (group.isFull() || !permisionCreate) return
      const randomVelocity = {
        x: 20 * Phaser.Math.Between(-5, 5),
        y: 20 * Phaser.Math.Between(-5, 5),
      }
      const child = group.create(Phaser.Math.Between(betweenX[0], betweenX[1]), Phaser.Math.Between(betweenY[0], betweenY[1]), prop.key)
      if (prop.customConfig.bodySize) {
        child.setBodySize(prop.customConfig.bodySize, prop.customConfig.bodySize).setVelocity(randomVelocity.x, randomVelocity.y)
      }
      child.setVelocity(randomVelocity.x, randomVelocity.y)
    }, prop.timer.repeat)
  }
  if (prop.timer.increase) {
    intervalIncress = setInterval(() => {
      group.maxSize = group.maxSize < prop.size.maxAbsolute ? group.maxSize + 1 : prop.size.maxAbsolute
      console.log({ maxSize: group.maxSize })
    }, prop.timer.increase)
  }

  scene.physics.add.overlap(
    actor,
    group,
    (actor: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, object: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => {
      callFunc(actor, object)
    }
  )
  group.children.iterateLocal('setDebug', true, true, 0x00ffff)
  group.children.iterateLocal('setCollideWorldBounds', true, 1, 1, true)
  group.children.entries.forEach((child, index) => {
    child.setData({ key: index })
  })
  return { group, interval, timeOut, intervalIncress }
}

export { animateWithGenerateFrames, carHit, handleGameOver, hudControll, createEnemyGroup, createItemGroup }
