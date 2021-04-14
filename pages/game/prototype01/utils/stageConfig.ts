import { groupItemsConfig, enemyConfig } from './interfaceType'
// interface groupItemsConfig {
//   size: {
//     start: number
//     max: number
//   }
//   timer: {
//     start: number
//     repeat: number
//   }
//   key: string
// }
// interface enemyConfig {
//   velocity: {
//     start: number
//     add: number
//     max: number
//   }
//   size: {
//     start: number
//     max: number
//   }
//   timer: {
//     start: number
//     repeat: number
//     increase?: number
//   }
//   key: string
//   animate: {
//     key: string
//     start: number
//     end: number
//   }
//   customConfig: {
//     bodySize: number
//   }
// }
const stageConFig = [
  {
    info: {
      stageNo: 1,
      bg: 'grass1',
      startingHp: 100,
      startingGas: 200,
      timer: 5000,
    },
    items: {
      gas: {
        maxCount: 5,
        point: [30, 40],
        timer: 500,
      },
      repairItem: {
        maxCount: 2,
        point: [30, 40],
        timer: 5000,
      },
    },
    enemy: {
      zombies: {
        maxCount: 15,
      },
      skeletons: {
        maxCount: 0,
      },
    },
  },
  {
    info: {
      stageNo: 2,
      bg: 'grass1',
      startingHp: 100,
      startingGas: 200,
      timer: 5000,
    },
    items: {
      gas: {
        maxCount: 4,
        point: [30, 40],
        timer: 500,
      },
      repairItem: {
        maxCount: 2,
        point: [30, 40],
        timer: 5000,
      },
    },
    enemy: {
      zombies: {
        maxCount: 20,
      },
      skeletons: {
        maxCount: 2,
      },
    },
  },
  {
    info: {
      stageNo: 3,
      bg: 'grass1',
      startingHp: 100,
      startingGas: 200,
      timer: 5000,
    },
    items: {
      gas: {
        maxCount: 4,
        point: [30, 40],
        timer: 500,
      },
      repairItem: {
        maxCount: 2,
        point: [30, 40],
        timer: 5000,
      },
    },
    enemy: {
      zombies: {
        maxCount: 15,
      },
      skeletons: {
        maxCount: 5,
      },
    },
  },
]
const stageNolimit = {
  enemy: {
    zombie: <enemyConfig>{
      velocity: {
        start: 20,
        add: 10,
        max: 100,
      },
      size: {
        start: 10,
        max: 15,
        maxAbsolute: 25,
      },
      timer: {
        start: 2000,
        repeat: 1000,
        increase: 10000,
      },
      key: 'zombie',
      animate: {
        key: 'zombieWalk',
        start: 0,
        end: 1,
      },
      customConfig: {
        bodySize: 35,
      },
    },
    skeleton: <enemyConfig>{
      velocity: {
        start: 10,
        add: 10,
        max: 50,
      },
      size: {
        start: 1,
        max: 5,
      },
      timer: {
        start: 50000,
        repeat: 2000,
      },
      key: 'skeleton',
      animate: {
        key: 'zombieWalk',
        start: 0,
        end: 1,
      },
      customConfig: {
        bodySize: 35,
      },
    },
  },
  items: {
    gas: <groupItemsConfig>{
      size: {
        start: 2,
        max: 5,
      },
      timer: {
        start: 500,
        repeat: 500,
      },
      key: 'gasTank',
    },
    repair: <groupItemsConfig>{
      size: {
        start: 0,
        max: 2,
      },
      timer: {
        start: 2000,
        repeat: 1000,
      },
      key: 'repair',
    },
  },
}

export default { stageNolimit, stageConFig }
