interface enemyConfig {
  velocity: {
    start: number
    add: number
    max: number
  }
  size: {
    start: number
    max: number
    maxAbsolute?: number
  }
  timer: {
    start: number
    repeat: number
    increase?: number
  }
  key: string
  animate: {
    key: string
    start: number
    end: number
  }
  customConfig: {
    bodySize: number
  }
}
interface groupItemsConfig {
  size: {
    start: number
    max: number
  }
  timer: {
    start: number
    repeat: number
  }
  key: string
}
interface groupItemsConfig {
  size: {
    start: number
    max: number
  }
  timer: {
    start: number
    repeat: number
  }
  key: string
}
interface groupPhysics {
  group: Phaser.Physics.Arcade.Group
  interval: NodeJS.Timeout
  timeOut: NodeJS.Timeout
  intervalIncress?: NodeJS.Timeout
}
export type { enemyConfig, groupItemsConfig, groupPhysics }
