// Boot scene - loads textures and shows title screen
import Phaser from 'phaser';
import {
    createGoblinTexture, createOrcTexture, createTrollTexture, createBossTexture,
    createItemTextures, createEnvironmentTextures, createParticleTextures
} from './sprites.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Load sprite image files
        this.load.image('axe', 'assets/axe.png');
        this.load.image('thrown-axe', 'assets/thrown-axe.png');
        this.load.image('dwarf-stand', 'assets/dwarf-stand.png');
        this.load.image('dwarf-walk1', 'assets/dwarf-walk1.png');
        this.load.image('dwarf-walk2', 'assets/dwarf-walk2.png');
        this.load.image('dwarf-jump', 'assets/dwarf-jump.png');
        this.load.image('dwarf-hit', 'assets/dwarf-hit.png');
    }

    create() {
        // Create dwarf animations from loaded images
        this.anims.create({
            key: 'dwarf-walk',
            frames: [{ key: 'dwarf-walk1' }, { key: 'dwarf-walk2' }],
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'dwarf-idle',
            frames: [{ key: 'dwarf-stand' }],
            frameRate: 1,
            repeat: -1
        });

        // Generate procedural textures (enemies, items, environment)
        createGoblinTexture(this);
        createOrcTexture(this);
        createTrollTexture(this);
        createBossTexture(this);
        createItemTextures(this);
        createEnvironmentTextures(this);
        createParticleTextures(this);

        this.scene.start('TitleScene');
    }
}
