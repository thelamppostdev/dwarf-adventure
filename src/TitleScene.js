// Epic title screen
import Phaser from 'phaser';

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        const { width, height } = this.scale;

        // Animated mountain background
        this.add.rectangle(0, 0, width, height, 0x0a0a1a).setOrigin(0);

        // Stars
        for (let i = 0; i < 80; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height * 0.6);
            const size = Phaser.Math.Between(1, 3);
            const star = this.add.rectangle(x, y, size, size, 0xFFFFFF);
            this.tweens.add({
                targets: star,
                alpha: { from: 0.3, to: 1 },
                duration: Phaser.Math.Between(1000, 3000),
                yoyo: true,
                repeat: -1,
                delay: Phaser.Math.Between(0, 2000)
            });
        }

        // Distant mountains
        const mtnGraphics = this.add.graphics();
        mtnGraphics.fillStyle(0x1a1a2e);
        mtnGraphics.beginPath();
        mtnGraphics.moveTo(0, height);
        mtnGraphics.lineTo(0, height * 0.55);
        mtnGraphics.lineTo(100, height * 0.35);
        mtnGraphics.lineTo(200, height * 0.45);
        mtnGraphics.lineTo(300, height * 0.3);
        mtnGraphics.lineTo(400, height * 0.5);
        mtnGraphics.lineTo(500, height * 0.38);
        mtnGraphics.lineTo(650, height * 0.42);
        mtnGraphics.lineTo(800, height * 0.32);
        mtnGraphics.lineTo(950, height * 0.48);
        mtnGraphics.lineTo(1050, height * 0.36);
        mtnGraphics.lineTo(1150, height * 0.44);
        mtnGraphics.lineTo(width, height * 0.4);
        mtnGraphics.lineTo(width, height);
        mtnGraphics.closePath();
        mtnGraphics.fillPath();

        // Closer mountains
        mtnGraphics.fillStyle(0x12121e);
        mtnGraphics.beginPath();
        mtnGraphics.moveTo(0, height);
        mtnGraphics.lineTo(0, height * 0.6);
        mtnGraphics.lineTo(150, height * 0.5);
        mtnGraphics.lineTo(250, height * 0.55);
        mtnGraphics.lineTo(400, height * 0.45);
        mtnGraphics.lineTo(550, height * 0.52);
        mtnGraphics.lineTo(700, height * 0.48);
        mtnGraphics.lineTo(900, height * 0.53);
        mtnGraphics.lineTo(1050, height * 0.5);
        mtnGraphics.lineTo(width, height * 0.55);
        mtnGraphics.lineTo(width, height);
        mtnGraphics.closePath();
        mtnGraphics.fillPath();

        // Ground
        this.add.rectangle(0, height * 0.75, width, height * 0.25, 0x1a3a1a).setOrigin(0);
        this.add.rectangle(0, height * 0.75, width, 4, 0x2a5a2a).setOrigin(0);

        // Torches on sides
        this.createTorch(width * 0.15, height * 0.6);
        this.createTorch(width * 0.85, height * 0.6);

        // Dwarf silhouette in center
        const dwarf = this.add.image(width / 2, height * 0.68, 'dwarf-stand');
        dwarf.setScale(3);
        this.tweens.add({
            targets: dwarf,
            y: height * 0.68 - 4,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Axe next to dwarf
        const axe = this.add.image(width / 2 + 30, height * 0.66, 'axe');
        axe.setScale(2.5);
        axe.setAngle(-30);

        // Title text
        const titleStyle = {
            fontSize: '56px',
            fontFamily: 'Georgia, serif',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 8,
            shadow: { offsetX: 3, offsetY: 3, color: '#000', blur: 5, fill: true }
        };

        const title = this.add.text(width / 2, height * 0.18, 'DWARF', titleStyle).setOrigin(0.5);
        const title2 = this.add.text(width / 2, height * 0.3, 'ADVENTURE', {
            ...titleStyle,
            fontSize: '42px',
            color: '#C0C0C0'
        }).setOrigin(0.5);

        // Pulse title
        this.tweens.add({
            targets: [title, title2],
            scaleX: { from: 1, to: 1.03 },
            scaleY: { from: 1, to: 1.03 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Subtitle
        this.add.text(width / 2, height * 0.38, 'Into the Deep Mines', {
            fontSize: '18px',
            fontFamily: 'Georgia, serif',
            color: '#8899AA',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // Start prompt
        const prompt = this.add.text(width / 2, height * 0.88, '[ PRESS ENTER OR CLICK TO BEGIN ]', {
            fontSize: '20px',
            fontFamily: 'monospace',
            color: '#AAAAAA'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: prompt,
            alpha: { from: 0.4, to: 1 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Controls hint
        this.add.text(width / 2, height * 0.95, 'A/D: Move  |  W: Jump  |  SPACE: Attack  |  SHIFT: Dash', {
            fontSize: '13px',
            fontFamily: 'monospace',
            color: '#555555'
        }).setOrigin(0.5);

        // Input
        this.input.keyboard.once('keydown-ENTER', () => this.startGame());
        this.input.once('pointerdown', () => this.startGame());
    }

    createTorch(x, y) {
        this.add.image(x, y + 6, 'torch-base').setScale(2);

        // Fire particles
        const colors = [0xFF4500, 0xFF8C00, 0xFFD700, 0xFF6347];
        for (let i = 0; i < 6; i++) {
            const flame = this.add.rectangle(
                x + Phaser.Math.Between(-4, 4),
                y - 4,
                Phaser.Math.Between(3, 6),
                Phaser.Math.Between(4, 8),
                Phaser.Math.RND.pick(colors)
            );
            this.tweens.add({
                targets: flame,
                y: y - Phaser.Math.Between(12, 24),
                alpha: 0,
                scaleX: 0,
                scaleY: 0,
                duration: Phaser.Math.Between(400, 800),
                repeat: -1,
                delay: Phaser.Math.Between(0, 400)
            });
        }
    }

    startGame() {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameScene');
        });
    }
}
