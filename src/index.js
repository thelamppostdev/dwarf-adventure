import Phaser from 'phaser';
import BootScene from './BootScene.js';
import TitleScene from './TitleScene.js';
import GameScene from './GameScene.js';
import GameOverScene from './GameOverScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 1.2 },
            debug: false,
            setBounds: false
        }
    },
    scene: [BootScene, TitleScene, GameScene, GameOverScene],
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#0a0a0a'
};

window.__PHASER_GAME__ = new Phaser.Game(config);
