// Game Over screen with stats and retry
import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create(data) {
        const { width, height } = this.scale;
        const { score = 0, kills = 0, maxCombo = 0, coins = 0, wave = 1 } = data || {};

        // Dark background
        this.add.rectangle(0, 0, width, height, 0x0a0a0a).setOrigin(0);

        // Blood-red vignette
        const vignette = this.add.graphics();
        vignette.fillStyle(0x330000, 0.4);
        vignette.fillRect(0, 0, width, height);

        // Fallen dwarf
        const dwarf = this.add.image(width / 2, height * 0.35, 'dwarf-stand');
        dwarf.setScale(4).setAngle(90).setTint(0x666666);

        // Broken axe nearby
        const axe = this.add.image(width / 2 + 60, height * 0.38, 'axe');
        axe.setScale(3).setAngle(45).setTint(0x666666);

        // "YOU FELL" text
        const title = this.add.text(width / 2, height * 0.12, 'YOU FELL', {
            fontSize: '52px',
            fontFamily: 'Georgia, serif',
            color: '#CC0000',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // Animate title in
        title.setScale(0);
        this.tweens.add({
            targets: title,
            scaleX: 1, scaleY: 1,
            duration: 600,
            ease: 'Back.easeOut'
        });

        // Stats panel
        const panelY = height * 0.52;
        const stats = [
            { label: 'SCORE', value: score.toLocaleString(), color: '#FFD700' },
            { label: 'KILLS', value: kills.toString(), color: '#FF4444' },
            { label: 'BEST COMBO', value: `${maxCombo}x`, color: '#FF8C00' },
            { label: 'COINS', value: coins.toString(), color: '#FFD700' },
            { label: 'WAVE REACHED', value: wave.toString(), color: '#AA4444' },
        ];

        const statStyle = {
            fontSize: '14px',
            fontFamily: 'monospace',
            color: '#888888',
            stroke: '#000',
            strokeThickness: 2
        };

        const valStyle = {
            fontSize: '22px',
            fontFamily: 'monospace',
            stroke: '#000',
            strokeThickness: 3
        };

        stats.forEach((stat, i) => {
            const y = panelY + i * 38;
            const delay = 400 + i * 150;

            const label = this.add.text(width * 0.3, y, stat.label, statStyle)
                .setOrigin(0, 0.5).setAlpha(0);
            const val = this.add.text(width * 0.7, y, stat.value, { ...valStyle, color: stat.color })
                .setOrigin(1, 0.5).setAlpha(0);

            this.tweens.add({
                targets: [label, val],
                alpha: 1, x: '+=0',
                duration: 400,
                delay
            });
        });

        // Separator line
        this.add.rectangle(width / 2, panelY - 12, width * 0.5, 2, 0x333333);

        // Retry prompt
        const retryPrompt = this.add.text(width / 2, height * 0.9, '[ PRESS ENTER TO TRY AGAIN ]', {
            fontSize: '18px',
            fontFamily: 'monospace',
            color: '#AAAAAA'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: retryPrompt,
            alpha: { from: 0.4, to: 1 },
            duration: 800,
            yoyo: true,
            repeat: -1,
            delay: 1500
        });

        // Title screen option
        const titlePrompt = this.add.text(width / 2, height * 0.95, '[ ESC for Title Screen ]', {
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#555555'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({ targets: titlePrompt, alpha: 0.7, duration: 500, delay: 2000 });

        // Input
        this.input.keyboard.once('keydown-ENTER', () => {
            this.cameras.main.fadeOut(400, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('GameScene');
            });
        });

        this.input.keyboard.once('keydown-ESC', () => {
            this.cameras.main.fadeOut(400, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('TitleScene');
            });
        });

        this.input.once('pointerdown', () => {
            this.cameras.main.fadeOut(400, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('GameScene');
            });
        });
    }
}
