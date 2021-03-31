import Phaser from 'phaser'
import { SceneLoading } from './SceneLoading'
import ScenePlay from './ScenePlay'
import SceneSnake from './SceneSnake'

export default function PhaserIndex() {
	return null
}

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'root',
	width: 1024,
	height: 768,
	pixelArt: true,
	scene: [SceneLoading, ScenePlay, SceneSnake],
	// transparent: true,
	loader: {
		baseURL: '../assets/prototype1/',
	},
	audio: {
		disableWebAudio: true,
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: true,
		},
	},
	// scale: {
	// 	mode: Phaser.Scale.CENTER_VERTICALLY,
	// 	// width: 1024,
	// 	// height: 768,
	// 	// autoCenter: Phaser.Scale.CENTER_BOTH,
	// },
}

new Phaser.Game(config)
