// Main game scene — the heart of Dwarf Adventure
import Phaser from 'phaser';

// ─── Constants ───────────────────────────────────────────────────────────────

const WORLD_W = 4800;
const WORLD_H = 720;
const GROUND_Y = WORLD_H - 60;
const GRAVITY = 1.2;

const PLAYER = {
    SPEED: 5,
    JUMP: -12,
    DASH_SPEED: 14,
    DASH_DURATION: 150,
    DASH_COOLDOWN: 800,
    MAX_HP: 5,
    INVULN_MS: 1200,
    COMBO_WINDOW: 600,
};

const ENEMY_DEFS = {
    goblin: {
        texture: 'goblin', hp: 1, speed: 3.5, score: 100, damage: 1,
        chaseRange: 800, width: 48, height: 56, coinDrop: 1,
        attackRange: 35, attackCooldown: 800, attackLunge: 8
    },
    orc: {
        texture: 'orc', hp: 3, speed: 2.2, score: 250, damage: 1,
        chaseRange: 800, width: 56, height: 68, coinDrop: 2,
        attackRange: 45, attackCooldown: 1000, attackLunge: 10
    },
    troll: {
        texture: 'troll', hp: 6, speed: 1.5, score: 500, damage: 2,
        chaseRange: 700, width: 68, height: 92, coinDrop: 4,
        attackRange: 55, attackCooldown: 1400, attackLunge: 14
    },
};

// ─── Wave definitions ────────────────────────────────────────────────────────

const WAVES = [
    { enemies: [{ type: 'goblin', count: 4 }], spawnDelay: 1200, message: 'Goblins approach!' },
    { enemies: [{ type: 'goblin', count: 6 }], spawnDelay: 1000, message: 'More goblins!' },
    { enemies: [{ type: 'goblin', count: 4 }, { type: 'orc', count: 2 }], spawnDelay: 900, message: 'Orcs join the fight!' },
    { enemies: [{ type: 'orc', count: 4 }, { type: 'goblin', count: 4 }], spawnDelay: 800, message: 'The horde grows!' },
    { enemies: [{ type: 'orc', count: 4 }, { type: 'troll', count: 1 }], spawnDelay: 800, message: 'A troll appears!' },
    { enemies: [{ type: 'goblin', count: 6 }, { type: 'orc', count: 3 }, { type: 'troll', count: 2 }], spawnDelay: 700, message: 'Brace yourself!' },
    { enemies: [{ type: 'troll', count: 3 }, { type: 'orc', count: 4 }], spawnDelay: 700, message: 'Heavy assault!' },
    { enemies: [{ type: 'goblin', count: 8 }, { type: 'orc', count: 4 }, { type: 'troll', count: 2 }], spawnDelay: 600, message: 'Overwhelming numbers!' },
    { boss: true, message: 'THE WAR CHIEF ARRIVES!' },
];

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        this.cameras.main.fadeIn(500);

        // ── State ────────────────────────────────────────────────────────
        this.hp = PLAYER.MAX_HP;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.comboTimer = 0;
        this.kills = 0;
        this.coins = 0;
        this.waveIndex = 0;
        this.waveEnemiesLeft = [];
        this.waveSpawnTimer = 0;
        this.waveActive = false;
        this.waveCooldown = 0;
        this.enemies = [];
        this.items = [];
        this.isSwinging = false;
        this.isJumping = false;
        this.isDashing = false;
        this.dashCooldownTimer = 0;
        this.invulnTimer = 0;
        this.facingRight = true;
        this.gameOver = false;
        this.isPoweredUp = false;
        this.powerUpTimer = 0;
        this.bossActive = false;
        this.boss = null;
        this.bossHp = 0;
        this.bossMaxHp = 0;
        this.shakeIntensity = 0;
        this.thrownAxes = [];
        this.throwCooldownTimer = 0;

        // ── World ────────────────────────────────────────────────────────
        this.matter.world.setBounds(0, 0, WORLD_W, WORLD_H);
        this.createBackground();
        this.createGround();
        this.createPlatforms();
        this.createDecorations();

        // ── Player ───────────────────────────────────────────────────────
        this.createPlayer();

        // ── Controls ────────────────────────────────────────────────────
        this.keys = {
            A: this.input.keyboard.addKey('A'),
            D: this.input.keyboard.addKey('D'),
            W: this.input.keyboard.addKey('W'),
            SPACE: this.input.keyboard.addKey('SPACE'),
            SHIFT: this.input.keyboard.addKey('SHIFT'),
        };

        // ── Mouse input ─────────────────────────────────────────────────
        this.input.on('pointerdown', (pointer) => {
            if (this.gameOver) return;
            if (pointer.leftButtonDown()) {
                this.swingAxe();
            } else if (pointer.rightButtonDown()) {
                this.throwAxe();
            }
        });
        // Disable right-click context menu on canvas
        this.game.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        // ── Camera ──────────────────────────────────────────────────────
        this.cameras.main.startFollow(this.dwarf, true, 0.08, 0.08);
        this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);

        // ── HUD (fixed to camera) ───────────────────────────────────────
        this.createHUD();

        // ── Particle emitters ───────────────────────────────────────────
        this.deathEmitter = this.add.particles(0, 0, 'particle-green', {
            speed: { min: 60, max: 160 },
            scale: { start: 1.2, end: 0 },
            lifespan: 600,
            gravityY: 300,
            alpha: { start: 1, end: 0 },
            emitting: false
        });

        this.hitEmitter = this.add.particles(0, 0, 'particle-red', {
            speed: { min: 40, max: 100 },
            scale: { start: 1, end: 0 },
            lifespan: 400,
            gravityY: 200,
            emitting: false
        });

        this.coinEmitter = this.add.particles(0, 0, 'particle-yellow', {
            speed: { min: 30, max: 80 },
            scale: { start: 0.8, end: 0 },
            lifespan: 500,
            gravityY: 100,
            emitting: false
        });

        this.dustEmitter = this.add.particles(0, 0, 'particle-dark', {
            speed: { min: 10, max: 30 },
            scale: { start: 0.5, end: 0 },
            lifespan: 400,
            gravityY: -20,
            alpha: { start: 0.5, end: 0 },
            emitting: false
        });

        // Start first wave after a brief delay
        this.time.delayedCall(1500, () => {
            console.log('[WAVE] Starting first wave');
            this.startNextWave();
        });

        // Debug overlay — visible enemy count
        this.debugText = this.add.text(16, 100, '', {
            fontSize: '12px', fontFamily: 'monospace', color: '#00FF00',
            stroke: '#000', strokeThickness: 2
        }).setScrollFactor(0).setDepth(300);

        // Wave announcement text
        this.waveText = this.add.text(640, 280, '', {
            fontSize: '32px',
            fontFamily: 'Georgia, serif',
            color: '#FF4444',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100).setAlpha(0);
    }

    // ─── Background ──────────────────────────────────────────────────────────

    createBackground() {
        // Gradient sky
        const skyGradient = this.add.graphics();
        skyGradient.fillGradientStyle(0x1a0a2e, 0x1a0a2e, 0x2a1a4e, 0x2a1a4e);
        skyGradient.fillRect(0, 0, 1280, WORLD_H * 0.4);
        skyGradient.fillGradientStyle(0x2a1a4e, 0x2a1a4e, 0x0a2a3a, 0x0a2a3a);
        skyGradient.fillRect(0, WORLD_H * 0.4, 1280, WORLD_H * 0.3);
        skyGradient.setScrollFactor(0);

        // Stars
        for (let i = 0; i < 50; i++) {
            const s = this.add.rectangle(
                Phaser.Math.Between(0, 1280),
                Phaser.Math.Between(0, WORLD_H * 0.5),
                Phaser.Math.Between(1, 2), Phaser.Math.Between(1, 2),
                0xFFFFFF, Phaser.Math.FloatBetween(0.3, 0.9)
            ).setScrollFactor(0);
            this.tweens.add({
                targets: s, alpha: { from: s.alpha, to: 0.1 },
                duration: Phaser.Math.Between(1500, 4000),
                yoyo: true, repeat: -1
            });
        }

        // Moon
        this.add.circle(1040, 80, 30, 0xFFFACD, 0.9).setScrollFactor(0);
        this.add.circle(1050, 75, 26, 0x1a0a2e).setScrollFactor(0); // crescent shadow

        // Distant mountains
        const dm = this.add.graphics();
        dm.fillStyle(0x16162e);
        dm.beginPath();
        dm.moveTo(0, WORLD_H);
        for (let x = 0; x <= WORLD_W; x += 80) {
            const h = 150 + Math.sin(x * 0.003) * 80 + Math.sin(x * 0.007) * 40;
            dm.lineTo(x, WORLD_H - h);
        }
        dm.lineTo(WORLD_W, WORLD_H);
        dm.closePath();
        dm.fillPath();
        dm.setScrollFactor(0.15);

        // Mid mountains
        const mm = this.add.graphics();
        mm.fillStyle(0x101020);
        mm.beginPath();
        mm.moveTo(0, WORLD_H);
        for (let x = 0; x <= WORLD_W; x += 60) {
            const h = 120 + Math.sin(x * 0.005 + 1) * 60 + Math.sin(x * 0.012) * 30;
            mm.lineTo(x, WORLD_H - h);
        }
        mm.lineTo(WORLD_W, WORLD_H);
        mm.closePath();
        mm.fillPath();
        mm.setScrollFactor(0.3);

        // Near treeline
        const trees = this.add.graphics();
        trees.fillStyle(0x0a1a0a);
        for (let x = 0; x < WORLD_W; x += Phaser.Math.Between(20, 40)) {
            const h = Phaser.Math.Between(40, 90);
            const w = Phaser.Math.Between(15, 30);
            trees.fillTriangle(x, GROUND_Y, x + w, GROUND_Y, x + w / 2, GROUND_Y - h);
        }
        trees.setScrollFactor(0.5);
    }

    createGround() {
        // Physics ground
        this.ground = this.matter.add.rectangle(
            WORLD_W / 2, GROUND_Y + 30, WORLD_W, 60,
            { isStatic: true, friction: 0.8, label: 'ground' }
        );

        // Visual ground
        const gg = this.add.graphics();
        // Dirt
        gg.fillStyle(0x3a2a1a);
        gg.fillRect(0, GROUND_Y, WORLD_W, 60);
        // Grass top
        gg.fillStyle(0x2a5a2a);
        gg.fillRect(0, GROUND_Y, WORLD_W, 6);
        // Grass highlight
        gg.fillStyle(0x3a7a3a);
        gg.fillRect(0, GROUND_Y, WORLD_W, 2);

        // Grass tufts
        for (let x = 0; x < WORLD_W; x += Phaser.Math.Between(8, 20)) {
            const h = Phaser.Math.Between(4, 10);
            const shade = Phaser.Math.RND.pick([0x228B22, 0x2E8B57, 0x3CB371]);
            gg.fillStyle(shade);
            gg.fillTriangle(x, GROUND_Y, x + 3, GROUND_Y, x + 1, GROUND_Y - h);
        }
    }

    createPlatforms() {
        this.platforms = [];

        const platformData = [
            { x: 600, y: GROUND_Y - 80, key: 'platform' },
            { x: 900, y: GROUND_Y - 140, key: 'platform-small' },
            { x: 1200, y: GROUND_Y - 90, key: 'platform' },
            { x: 1500, y: GROUND_Y - 160, key: 'platform-small' },
            { x: 1800, y: GROUND_Y - 100, key: 'platform' },
            { x: 2200, y: GROUND_Y - 130, key: 'platform-small' },
            { x: 2500, y: GROUND_Y - 80, key: 'platform' },
            { x: 2900, y: GROUND_Y - 150, key: 'platform' },
            { x: 3300, y: GROUND_Y - 100, key: 'platform-small' },
            { x: 3600, y: GROUND_Y - 120, key: 'platform' },
            { x: 4000, y: GROUND_Y - 80, key: 'platform-small' },
            { x: 4300, y: GROUND_Y - 140, key: 'platform' },
        ];

        for (const p of platformData) {
            const tex = this.textures.get(p.key);
            const w = tex.source[0].width;
            const h = tex.source[0].height;

            this.add.image(p.x, p.y, p.key);

            this.matter.add.rectangle(p.x, p.y + h / 2 - 4, w, 8, {
                isStatic: true,
                friction: 0.8,
                label: 'platform'
            });

            this.platforms.push(p);
        }
    }

    createDecorations() {
        // Torches near platforms
        for (let i = 0; i < this.platforms.length; i += 2) {
            const p = this.platforms[i];
            this.add.image(p.x - 50, GROUND_Y - 24, 'torch-base').setScale(1.5);
            this.createFlameEffect(p.x - 50, GROUND_Y - 36);
        }

        // Scattered flowers
        for (let i = 0; i < 80; i++) {
            const x = Phaser.Math.Between(0, WORLD_W);
            const s = Phaser.Math.Between(2, 4);
            const c = Phaser.Math.RND.pick([0xFF69B4, 0xFFD700, 0xFFFFFF, 0x9370DB, 0xFF6347]);
            this.add.circle(x, GROUND_Y - s, s, c);
        }

        // Rocks
        for (let i = 0; i < 40; i++) {
            const x = Phaser.Math.Between(0, WORLD_W);
            const s = Phaser.Math.Between(3, 7);
            this.add.circle(x, GROUND_Y - s / 2, s, Phaser.Math.RND.pick([0x555555, 0x666666, 0x777777]));
        }

        // Banners on some platforms
        for (let i = 1; i < this.platforms.length; i += 3) {
            const p = this.platforms[i];
            this.add.image(p.x, p.y - 30, 'banner').setScale(1.5);
        }
    }

    createFlameEffect(x, y) {
        const colors = [0xFF4500, 0xFF8C00, 0xFFD700, 0xFF6347];
        for (let i = 0; i < 5; i++) {
            const flame = this.add.rectangle(
                x + Phaser.Math.Between(-3, 3), y,
                Phaser.Math.Between(2, 5), Phaser.Math.Between(3, 7),
                Phaser.Math.RND.pick(colors)
            );
            this.tweens.add({
                targets: flame,
                y: y - Phaser.Math.Between(8, 18),
                alpha: 0, scaleX: 0, scaleY: 0,
                duration: Phaser.Math.Between(300, 700),
                repeat: -1, delay: Phaser.Math.Between(0, 300)
            });
        }
    }

    // ─── Player ──────────────────────────────────────────────────────────────

    createPlayer() {
        const sprite = this.add.sprite(200, GROUND_Y - 40, 'dwarf-stand');
        sprite.setDepth(10);

        this.dwarf = this.matter.add.gameObject(sprite, {
            shape: { type: 'rectangle', width: 28, height: 52 },
            friction: 0.3,
            restitution: 0,
            density: 0.002,
            inertia: Infinity,
            label: 'dwarf'
        });
        this.dwarf.setFixedRotation();

        // Axe
        this.axe = this.add.sprite(200, GROUND_Y - 40, 'axe');
        this.axe.setOrigin(0.1, 0.5);
        this.axe.setDepth(11);

        // Ground collision detection
        this.matter.world.on('collisionstart', (event) => {
            for (const pair of event.pairs) {
                const labels = [pair.bodyA.label, pair.bodyB.label];
                if (labels.includes('dwarf') && (labels.includes('ground') || labels.includes('platform'))) {
                    this.isJumping = false;
                    // Landing dust
                    if (this.dwarf.body.velocity.y > 3) {
                        this.dustEmitter.explode(6, this.dwarf.x, this.dwarf.y + 28);
                    }
                }
            }
        });
    }

    // ─── HUD ─────────────────────────────────────────────────────────────────

    createHUD() {
        // Hearts
        this.hearts = [];
        for (let i = 0; i < PLAYER.MAX_HP; i++) {
            const heart = this.add.image(30 + i * 28, 30, 'heart')
                .setScale(1.8).setScrollFactor(0).setDepth(200);
            this.hearts.push(heart);
        }

        // Score
        this.scoreText = this.add.text(16, 55, 'SCORE: 0', {
            fontSize: '16px', fontFamily: 'monospace', color: '#FFD700',
            stroke: '#000', strokeThickness: 3
        }).setScrollFactor(0).setDepth(200);

        // Coins
        this.coinIcon = this.add.image(16, 80, 'coin').setScale(1.2).setScrollFactor(0).setDepth(200).setOrigin(0, 0.5);
        this.coinText = this.add.text(34, 80, '0', {
            fontSize: '16px', fontFamily: 'monospace', color: '#FFD700',
            stroke: '#000', strokeThickness: 3
        }).setScrollFactor(0).setDepth(200).setOrigin(0, 0.5);

        // Combo
        this.comboText = this.add.text(640, 100, '', {
            fontSize: '28px', fontFamily: 'Georgia, serif', color: '#FF8C00',
            stroke: '#000', strokeThickness: 5
        }).setOrigin(0.5).setScrollFactor(0).setDepth(200).setAlpha(0);

        // Wave indicator
        this.waveIndicator = this.add.text(1260, 20, 'WAVE 1', {
            fontSize: '18px', fontFamily: 'monospace', color: '#AA4444',
            stroke: '#000', strokeThickness: 3
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(200);

        // Dash cooldown indicator
        this.dashIndicator = this.add.text(1260, 700, 'DASH [SHIFT]', {
            fontSize: '12px', fontFamily: 'monospace', color: '#4488FF',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(1, 1).setScrollFactor(0).setDepth(200);

        // Boss HP bar (hidden initially)
        this.bossHpBg = this.add.rectangle(640, 680, 400, 16, 0x333333)
            .setScrollFactor(0).setDepth(200).setAlpha(0);
        this.bossHpBar = this.add.rectangle(440, 680, 396, 12, 0xFF0000)
            .setOrigin(0, 0.5).setScrollFactor(0).setDepth(201).setAlpha(0);
        this.bossHpText = this.add.text(640, 665, 'WAR CHIEF', {
            fontSize: '14px', fontFamily: 'monospace', color: '#FF4444',
            stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0).setDepth(200).setAlpha(0);
    }

    updateHUD() {
        // Hearts
        for (let i = 0; i < PLAYER.MAX_HP; i++) {
            this.hearts[i].setTexture(i < this.hp ? 'heart' : 'heart-empty');
        }

        this.scoreText.setText(`SCORE: ${this.score}`);
        this.coinText.setText(`${this.coins}`);
        this.waveIndicator.setText(`WAVE ${this.waveIndex + 1}`);

        // Dash indicator color
        this.dashIndicator.setColor(this.dashCooldownTimer <= 0 ? '#4488FF' : '#333333');

        // Boss HP bar
        if (this.bossActive && this.boss && this.boss.active) {
            this.bossHpBg.setAlpha(1);
            this.bossHpBar.setAlpha(1);
            this.bossHpText.setAlpha(1);
            const ratio = Math.max(0, this.bossHp / this.bossMaxHp);
            this.bossHpBar.setScale(ratio, 1);
        } else {
            this.bossHpBg.setAlpha(0);
            this.bossHpBar.setAlpha(0);
            this.bossHpText.setAlpha(0);
        }
    }

    // ─── Combo System ────────────────────────────────────────────────────────

    addCombo() {
        this.combo++;
        this.comboTimer = PLAYER.COMBO_WINDOW;
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;

        if (this.combo >= 3) {
            this.comboText.setText(`${this.combo}x COMBO!`);
            this.comboText.setAlpha(1);
            this.comboText.setScale(1.3);
            this.tweens.add({
                targets: this.comboText,
                scaleX: 1, scaleY: 1,
                duration: 200,
                ease: 'Back.easeOut'
            });

            // Combo color escalation
            if (this.combo >= 10) this.comboText.setColor('#FF0000');
            else if (this.combo >= 7) this.comboText.setColor('#FF4400');
            else if (this.combo >= 5) this.comboText.setColor('#FF8800');
            else this.comboText.setColor('#FFAA00');
        }
    }

    // ─── Waves ───────────────────────────────────────────────────────────────

    startNextWave() {
        if (this.gameOver) return;
        if (this.waveIndex >= WAVES.length) {
            // Loop waves with scaling difficulty
            this.waveIndex = WAVES.length - 2; // restart from second-to-last
        }

        const wave = WAVES[this.waveIndex];
        this.waveActive = true;

        // Announcement
        this.waveText.setText(wave.message);
        this.waveText.setAlpha(1).setScale(0.5);
        this.tweens.add({
            targets: this.waveText,
            scaleX: 1, scaleY: 1, alpha: 1,
            duration: 400, ease: 'Back.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: this.waveText,
                    alpha: 0, duration: 1500, delay: 1000
                });
            }
        });

        if (wave.boss) {
            this.spawnBoss();
            return;
        }

        // Build spawn queue
        this.waveEnemiesLeft = [];
        for (const group of wave.enemies) {
            for (let i = 0; i < group.count; i++) {
                this.waveEnemiesLeft.push(group.type);
            }
        }
        // Shuffle
        Phaser.Utils.Array.Shuffle(this.waveEnemiesLeft);
        this.waveSpawnTimer = 0;
        console.log(`[WAVE] Built queue:`, this.waveEnemiesLeft.slice());
    }

    // ─── Enemy Spawning ──────────────────────────────────────────────────────

    spawnEnemy(type) {
        const def = ENEMY_DEFS[type];
        if (!def) return;

        const cam = this.cameras.main;
        const side = Phaser.Math.Between(0, 1);
        // Spawn just barely off each edge of the visible screen
        const margin = 80;
        const x = side === 0
            ? cam.scrollX - margin + Phaser.Math.Between(-20, 0)
            : cam.scrollX + cam.width + margin + Phaser.Math.Between(0, 20);

        const y = GROUND_Y - def.height / 2;

        const enemy = this.matter.add.sprite(
            Phaser.Math.Clamp(x, 40, WORLD_W - 40), y, def.texture,
            null,
            {
                shape: { type: 'rectangle', width: def.width * 0.7, height: def.height * 0.8 },
                friction: 0.3, restitution: 0, density: 0.002,
                inertia: Infinity, label: 'enemy'
            }
        );
        enemy.setFixedRotation();
        enemy.setDepth(8);
        enemy.setData('type', type);
        enemy.setData('hp', def.hp);
        enemy.setData('maxHp', def.hp);
        enemy.setData('def', def);
        enemy.setData('hitFlash', 0);
        enemy.setData('attackTimer', 0);
        enemy.setData('isAttacking', false);

        // No scale tricks — just spawn visible immediately
        console.log(`[SPAWN] ${type} at x=${Math.round(enemy.x)} y=${Math.round(enemy.y)} | cam=${Math.round(this.cameras.main.scrollX)}-${Math.round(this.cameras.main.scrollX + this.cameras.main.width)}`);

        this.enemies.push(enemy);
    }

    spawnBoss() {
        this.bossActive = true;
        this.bossMaxHp = 30;
        this.bossHp = this.bossMaxHp;

        const x = this.dwarf.x + 400;
        const y = GROUND_Y - 56;

        this.boss = this.matter.add.sprite(x, y, 'boss', null, {
            shape: { type: 'rectangle', width: 60, height: 90 },
            friction: 0.3, restitution: 0, density: 0.004,
            inertia: Infinity, label: 'boss'
        });
        this.boss.setFixedRotation();
        this.boss.setDepth(9);
        this.boss.setData('hitFlash', 0);
        this.boss.setData('attackTimer', 0);
        this.boss.setData('isAttacking', false);

        console.log(`[BOSS] Spawned at x=${Math.round(x)} y=${Math.round(y)}`);

        this.screenShake(10, 500);
    }

    // ─── Enemy AI ────────────────────────────────────────────────────────────

    updateEnemies(delta) {
        // Wave spawning
        if (this.waveActive && this.waveEnemiesLeft.length > 0) {
            this.waveSpawnTimer -= delta;
            if (this.waveSpawnTimer <= 0) {
                const type = this.waveEnemiesLeft.pop();
                this.spawnEnemy(type);
                const wave = WAVES[Math.min(this.waveIndex, WAVES.length - 1)];
                this.waveSpawnTimer = wave.spawnDelay || 800;
            }
        }

        // Check if wave is complete
        if (this.waveActive && this.waveEnemiesLeft.length === 0 && this.enemies.length === 0 && !this.bossActive) {
            this.waveActive = false;
            this.waveIndex++;
            this.time.delayedCall(2000, () => this.startNextWave());
        }

        // Enemy AI
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (!enemy.active) {
                this.enemies.splice(i, 1);
                continue;
            }

            const def = enemy.getData('def');
            const dx = this.dwarf.x - enemy.x;
            const dist = Math.abs(dx);

            const dir = dx > 0 ? 1 : -1;
            const ady = Math.abs(this.dwarf.y - enemy.y);
            const attackRange = def.attackRange || 40;
            const isAttacking = enemy.getData('isAttacking');
            let atkTimer = enemy.getData('attackTimer');

            // Decrement attack cooldown
            if (atkTimer > 0) {
                atkTimer -= delta;
                enemy.setData('attackTimer', atkTimer);
            }

            // Attack animation state
            if (isAttacking) {
                // Mid-attack: lunge forward with squash/stretch
                enemy.setVelocityX(0);
            } else if (dist < attackRange + def.width * 0.4 && ady < def.height * 0.6 && atkTimer <= 0) {
                // In attack range — start attack animation
                enemy.setData('isAttacking', true);
                enemy.setData('attackTimer', def.attackCooldown || 1000);
                enemy.setFlipX(dir < 0);

                // Attack lunge tween: wind up, lunge, recover
                const lungeDir = dir;
                const lungeDist = def.attackLunge || 10;
                this.tweens.chain({
                    targets: enemy,
                    tweens: [
                        // Wind-up: pull back slightly, squash
                        {
                            x: enemy.x - lungeDir * 4,
                            scaleX: 0.85,
                            scaleY: 1.15,
                            duration: 120,
                            ease: 'Quad.easeOut',
                        },
                        // Lunge forward: stretch toward player
                        {
                            x: enemy.x + lungeDir * lungeDist,
                            scaleX: 1.2,
                            scaleY: 0.85,
                            duration: 100,
                            ease: 'Quad.easeIn',
                            onComplete: () => {
                                // Deal damage at the peak of the lunge
                                if (enemy.active && this.invulnTimer <= 0 && !this.isDashing) {
                                    const edx = Math.abs(this.dwarf.x - enemy.x);
                                    const edy = Math.abs(this.dwarf.y - enemy.y);
                                    if (edx < def.width * 0.7 && edy < def.height * 0.6) {
                                        this.takeDamage(def.damage, enemy.x < this.dwarf.x ? 1 : -1);
                                    }
                                }
                            }
                        },
                        // Tint flash red briefly during strike
                        {
                            duration: 60,
                            onStart: () => { if (enemy.active) enemy.setTint(0xFF6666); },
                        },
                        // Recover: bounce back to normal
                        {
                            scaleX: 1,
                            scaleY: 1,
                            duration: 150,
                            ease: 'Back.easeOut',
                            onStart: () => { if (enemy.active) enemy.clearTint(); },
                            onComplete: () => {
                                if (enemy.active) enemy.setData('isAttacking', false);
                            }
                        }
                    ]
                });
            } else {
                // Chase or wander
                if (dist < def.chaseRange) {
                    enemy.setVelocityX(dir * def.speed);
                    enemy.setFlipX(dir < 0);
                } else {
                    enemy.setVelocityX(dir * def.speed * 0.3);
                    enemy.setFlipX(dir < 0);
                }
            }

            // Hit flash decay
            const flash = enemy.getData('hitFlash');
            if (flash > 0) {
                enemy.setData('hitFlash', flash - delta);
                if (!isAttacking) enemy.setTint(0xFFFFFF);
            } else if (!isAttacking) {
                enemy.clearTint();
            }

            // Remove if way off screen
            if (enemy.x < -200 || enemy.x > WORLD_W + 200) {
                this.tweens.killTweensOf(enemy);
                enemy.destroy();
                this.enemies.splice(i, 1);
            }
        }

        // Boss AI
        if (this.bossActive && this.boss && this.boss.active) {
            const dx = this.dwarf.x - this.boss.x;
            const dist = Math.abs(dx);
            const dir = dx > 0 ? 1 : -1;
            const bossAttacking = this.boss.getData('isAttacking');
            let bossAtkTimer = this.boss.getData('attackTimer');

            if (bossAtkTimer > 0) {
                bossAtkTimer -= delta;
                this.boss.setData('attackTimer', bossAtkTimer);
            }

            if (bossAttacking) {
                // Mid-attack: hold position
                this.boss.setVelocityX(0);
            } else if (dist < 60 && Math.abs(this.dwarf.y - this.boss.y) < 60 && bossAtkTimer <= 0) {
                // Boss attack animation — big slam
                this.boss.setData('isAttacking', true);
                this.boss.setData('attackTimer', 1200);
                this.boss.setFlipX(dir < 0);

                this.tweens.chain({
                    targets: this.boss,
                    tweens: [
                        // Rise up — wind up slam
                        {
                            scaleX: 0.8,
                            scaleY: 1.25,
                            y: this.boss.y - 10,
                            duration: 200,
                            ease: 'Quad.easeOut',
                        },
                        // Slam down — lunge and squash
                        {
                            x: this.boss.x + dir * 20,
                            scaleX: 1.3,
                            scaleY: 0.75,
                            y: this.boss.y + 5,
                            duration: 120,
                            ease: 'Quad.easeIn',
                            onComplete: () => {
                                // Screen shake on slam
                                this.screenShake(4, 150);
                                // Deal damage at slam impact
                                if (this.boss.active && this.invulnTimer <= 0 && !this.isDashing) {
                                    if (Math.abs(this.dwarf.x - this.boss.x) < 55 && Math.abs(this.dwarf.y - this.boss.y) < 60) {
                                        this.takeDamage(2, this.boss.x < this.dwarf.x ? 1 : -1);
                                    }
                                }
                            }
                        },
                        // Flash red
                        {
                            duration: 80,
                            onStart: () => { if (this.boss.active) this.boss.setTint(0xFF2222); },
                        },
                        // Recover
                        {
                            scaleX: 1,
                            scaleY: 1,
                            y: this.boss.y,
                            duration: 250,
                            ease: 'Back.easeOut',
                            onStart: () => { if (this.boss.active) this.boss.clearTint(); },
                            onComplete: () => {
                                if (this.boss.active) this.boss.setData('isAttacking', false);
                            }
                        }
                    ]
                });
            } else {
                // Boss movement - charges when close
                if (dist < 300) {
                    this.boss.setVelocityX(dir * 3);
                } else {
                    this.boss.setVelocityX(dir * 1.5);
                }
                this.boss.setFlipX(dir < 0);
            }

            // Boss hit flash
            const flash = this.boss.getData('hitFlash');
            if (flash > 0) {
                this.boss.setData('hitFlash', flash - delta);
                if (!bossAttacking) this.boss.setTint(0xFF4444);
            } else if (!bossAttacking) {
                this.boss.clearTint();
            }
        }
    }

    // ─── Combat ──────────────────────────────────────────────────────────────

    swingAxe() {
        if (this.isSwinging || this.gameOver) return;
        this.isSwinging = true;

        // Overhead chop: start raised, swing down through
        // Facing right: origin at left end (0.1), negative angle = raised up, positive = swung down
        const startAngle = this.facingRight ? -90 : 90;
        const endAngle = this.facingRight ? 30 : -30;
        this.axe.angle = startAngle;

        this.tweens.add({
            targets: this.axe,
            angle: endAngle,
            duration: 180,
            ease: 'Quad.easeIn',
            onComplete: () => {
                // Hold briefly at end of swing, then reset
                this.time.delayedCall(80, () => {
                    this.isSwinging = false;
                    this.axe.angle = 0;
                });
            }
        });

        // Hit detection — generous hitbox in front of player
        const hitX = this.dwarf.x + (this.facingRight ? 30 : -30);
        const hitW = 50;
        const hitH = 50;

        // Check enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (!enemy.active) continue;

            if (Math.abs(enemy.x - hitX) < hitW && Math.abs(enemy.y - this.dwarf.y) < hitH) {
                this.hitEnemy(enemy, i);
            }
        }

        // Check boss
        if (this.bossActive && this.boss && this.boss.active) {
            if (Math.abs(this.boss.x - hitX) < hitW + 10 && Math.abs(this.boss.y - this.dwarf.y) < hitH + 20) {
                this.hitBoss();
            }
        }
    }

    // ─── Thrown Axe ─────────────────────────────────────────────────────────

    throwAxe() {
        if (this.gameOver || this.throwCooldownTimer > 0) return;
        this.throwCooldownTimer = 500; // 500ms cooldown between throws

        const dir = this.facingRight ? 1 : -1;
        const axe = this.add.image(
            this.dwarf.x + dir * 20,
            this.dwarf.y + 8,
            'thrown-axe'
        ).setDepth(12);

        axe.setData('vx', dir * 10);
        axe.setData('vy', -2);
        axe.setData('spin', 0);
        axe.setData('life', 1500); // disappears after 1.5s
        axe.setFlipX(!this.facingRight);

        this.thrownAxes.push(axe);
    }

    updateThrownAxes(delta) {
        for (let i = this.thrownAxes.length - 1; i >= 0; i--) {
            const axe = this.thrownAxes[i];
            if (!axe.active) {
                this.thrownAxes.splice(i, 1);
                continue;
            }

            // Move
            const vx = axe.getData('vx');
            let vy = axe.getData('vy');
            vy += 0.15; // gravity
            axe.setData('vy', vy);
            axe.x += vx;
            axe.y += vy;

            // Spin
            const spin = axe.getData('spin') + 15;
            axe.setData('spin', spin);
            axe.angle = spin;

            // Life timer
            const life = axe.getData('life') - delta;
            axe.setData('life', life);

            // Hit enemies
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                if (!enemy.active) continue;
                const def = enemy.getData('def');
                if (Math.abs(enemy.x - axe.x) < def.width * 0.5 && Math.abs(enemy.y - axe.y) < def.height * 0.5) {
                    this.hitEnemy(enemy, j);
                    axe.destroy();
                    this.thrownAxes.splice(i, 1);
                    break;
                }
            }

            // Hit boss
            if (axe.active && this.bossActive && this.boss && this.boss.active) {
                if (Math.abs(this.boss.x - axe.x) < 40 && Math.abs(this.boss.y - axe.y) < 50) {
                    this.hitBoss();
                    axe.destroy();
                    this.thrownAxes.splice(i, 1);
                    continue;
                }
            }

            // Remove if off-screen or expired
            if (!axe.active || life <= 0 || axe.y > GROUND_Y + 20 || axe.x < -50 || axe.x > WORLD_W + 50) {
                if (axe.active) axe.destroy();
                this.thrownAxes.splice(i, 1);
            }
        }
    }

    hitEnemy(enemy, index) {
        const def = enemy.getData('def');
        let hp = enemy.getData('hp');
        const dmg = this.isPoweredUp ? def.hp : 1; // power-up one-shots
        hp -= dmg;
        enemy.setData('hp', hp);

        this.hitEmitter.explode(8, enemy.x, enemy.y);
        enemy.setData('hitFlash', 100);
        enemy.setData('isAttacking', false);

        // Knockback — stronger velocity + visual recoil
        const kbDir = enemy.x > this.dwarf.x ? 1 : -1;
        enemy.setVelocityX(kbDir * 10);
        enemy.setVelocityY(-4);

        // Visual knockback tween: squash on hit, stretch as they fly back, settle
        this.tweens.killTweensOf(enemy);
        this.tweens.chain({
            targets: enemy,
            tweens: [
                // Impact squash
                { scaleX: 1.3, scaleY: 0.7, duration: 60, ease: 'Quad.easeOut' },
                // Stretch as knocked back
                { scaleX: 0.8, scaleY: 1.2, duration: 100, ease: 'Quad.easeIn' },
                // Settle back to normal
                { scaleX: 1, scaleY: 1, duration: 120, ease: 'Back.easeOut' },
            ]
        });

        if (hp <= 0) {
            this.killEnemy(enemy, index);
        }
    }

    killEnemy(enemy, index) {
        const def = enemy.getData('def');

        // Effects
        this.deathEmitter.explode(15, enemy.x, enemy.y);
        this.screenShake(3, 100);

        // Score
        const comboMultiplier = Math.max(1, this.combo);
        this.score += def.score * comboMultiplier;
        this.kills++;
        this.addCombo();

        // Floating score text
        const scoreFloat = this.add.text(enemy.x, enemy.y - 20, `+${def.score * comboMultiplier}`, {
            fontSize: '16px', fontFamily: 'monospace',
            color: this.combo >= 5 ? '#FF4400' : '#FFD700',
            stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(150);

        this.tweens.add({
            targets: scoreFloat,
            y: enemy.y - 60, alpha: 0,
            duration: 800,
            onComplete: () => scoreFloat.destroy()
        });

        // Item drops
        this.dropItems(enemy.x, enemy.y, def);

        this.tweens.killTweensOf(enemy);
        enemy.destroy();
        this.enemies.splice(index, 1);
    }

    hitBoss() {
        const dmg = this.isPoweredUp ? 5 : 1;
        this.bossHp -= dmg;
        this.hitEmitter.explode(12, this.boss.x, this.boss.y);
        this.boss.setData('hitFlash', 120);
        this.boss.setData('isAttacking', false);
        this.screenShake(5, 150);

        const kb = this.boss.x > this.dwarf.x ? 6 : -6;
        this.boss.setVelocityX(kb);
        this.boss.setVelocityY(-2);

        // Visual knockback tween
        this.tweens.killTweensOf(this.boss);
        this.tweens.chain({
            targets: this.boss,
            tweens: [
                { scaleX: 1.25, scaleY: 0.75, duration: 80, ease: 'Quad.easeOut' },
                { scaleX: 0.85, scaleY: 1.15, duration: 120, ease: 'Quad.easeIn' },
                { scaleX: 1, scaleY: 1, duration: 150, ease: 'Back.easeOut' },
            ]
        });

        if (this.bossHp <= 0) {
            this.killBoss();
        }
    }

    killBoss() {
        // Epic death
        this.screenShake(15, 1000);
        this.deathEmitter.explode(40, this.boss.x, this.boss.y);
        this.hitEmitter.explode(30, this.boss.x, this.boss.y);

        // Score
        this.score += 5000;
        this.addCombo();

        const victoryText = this.add.text(this.boss.x, this.boss.y - 40, '+5000', {
            fontSize: '28px', fontFamily: 'Georgia, serif',
            color: '#FF4444', stroke: '#000', strokeThickness: 5
        }).setOrigin(0.5).setDepth(150);

        this.tweens.add({
            targets: victoryText,
            y: this.boss.y - 100, alpha: 0, scaleX: 1.5, scaleY: 1.5,
            duration: 1200,
            onComplete: () => victoryText.destroy()
        });

        // Drop lots of coins
        for (let i = 0; i < 12; i++) {
            this.time.delayedCall(i * 50, () => {
                this.spawnItem('coin', this.boss.x + Phaser.Math.Between(-40, 40), this.boss.y);
            });
        }
        // Drop health
        this.spawnItem('health-potion', this.boss.x, this.boss.y - 20);
        this.spawnItem('power-star', this.boss.x + 20, this.boss.y - 20);

        this.tweens.killTweensOf(this.boss);
        this.boss.destroy();
        this.bossActive = false;

        // Next wave
        this.waveActive = false;
        this.waveIndex++;
        this.time.delayedCall(3000, () => this.startNextWave());
    }

    // ─── Damage ──────────────────────────────────────────────────────────────

    takeDamage(amount, knockDir) {
        if (this.invulnTimer > 0 || this.gameOver) return;

        this.hp -= amount;
        this.invulnTimer = PLAYER.INVULN_MS;
        this.combo = 0;
        this.comboText.setAlpha(0);

        // Effects
        this.hitEmitter.explode(10, this.dwarf.x, this.dwarf.y);
        this.screenShake(8, 200);

        // Knockback
        this.dwarf.setVelocityX(knockDir * 8);
        this.dwarf.setVelocityY(-5);

        // Flash red
        this.cameras.main.flash(200, 255, 0, 0, true);

        if (this.hp <= 0) {
            this.hp = 0;
            this.die();
        }
    }

    die() {
        this.gameOver = true;

        // Dramatic death
        this.deathEmitter.explode(20, this.dwarf.x, this.dwarf.y);
        this.screenShake(12, 500);

        this.dwarf.setVelocityY(-8);
        this.tweens.add({
            targets: [this.dwarf, this.axe],
            alpha: 0, angle: 360,
            duration: 1000,
            onComplete: () => {
                this.time.delayedCall(1000, () => {
                    this.scene.start('GameOverScene', {
                        score: this.score,
                        kills: this.kills,
                        maxCombo: this.maxCombo,
                        coins: this.coins,
                        wave: this.waveIndex + 1
                    });
                });
            }
        });
    }

    // ─── Items ───────────────────────────────────────────────────────────────

    dropItems(x, y, def) {
        // Coins
        for (let i = 0; i < def.coinDrop; i++) {
            this.time.delayedCall(i * 80, () => {
                this.spawnItem('coin', x + Phaser.Math.Between(-15, 15), y);
            });
        }

        // Rare health potion
        if (Phaser.Math.Between(1, 8) === 1) {
            this.spawnItem('health-potion', x, y - 10);
        }

        // Very rare power star
        if (Phaser.Math.Between(1, 20) === 1) {
            this.spawnItem('power-star', x, y - 10);
        }
    }

    spawnItem(type, x, y) {
        const item = this.add.image(x, y, type).setDepth(7);
        item.setData('type', type);
        item.setData('vy', -4);
        item.setData('grounded', false);

        // Pop-up effect
        this.tweens.add({
            targets: item,
            y: y - 20,
            duration: 300,
            ease: 'Quad.easeOut',
            yoyo: true
        });

        // Bob animation
        this.tweens.add({
            targets: item,
            y: '+=3',
            duration: 600,
            yoyo: true,
            repeat: -1,
            delay: 600
        });

        this.items.push(item);
    }

    updateItems() {
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            if (!item.active) {
                this.items.splice(i, 1);
                continue;
            }

            // Pickup check
            const dx = Math.abs(this.dwarf.x - item.x);
            const dy = Math.abs(this.dwarf.y - item.y);
            if (dx < 24 && dy < 24) {
                this.collectItem(item, i);
            }
        }
    }

    collectItem(item, index) {
        const type = item.getData('type');

        if (type === 'coin') {
            this.coins++;
            this.score += 10;
            this.coinEmitter.explode(5, item.x, item.y);
        } else if (type === 'health-potion') {
            if (this.hp < PLAYER.MAX_HP) {
                this.hp++;
                this.hitEmitter.setParticleTint(0xFF0000);
                this.hitEmitter.explode(8, item.x, item.y);
            }
            // Floating text
            const txt = this.add.text(item.x, item.y - 10, '+HP', {
                fontSize: '14px', fontFamily: 'monospace', color: '#FF4444',
                stroke: '#000', strokeThickness: 3
            }).setOrigin(0.5).setDepth(150);
            this.tweens.add({ targets: txt, y: item.y - 40, alpha: 0, duration: 600, onComplete: () => txt.destroy() });
        } else if (type === 'power-star') {
            this.isPoweredUp = true;
            this.powerUpTimer = 8000; // 8 seconds
            this.coinEmitter.explode(15, item.x, item.y);
            // Floating text
            const txt = this.add.text(item.x, item.y - 10, 'POWER UP!', {
                fontSize: '16px', fontFamily: 'monospace', color: '#FFFF00',
                stroke: '#000', strokeThickness: 3
            }).setOrigin(0.5).setDepth(150);
            this.tweens.add({ targets: txt, y: item.y - 50, alpha: 0, scaleX: 1.3, scaleY: 1.3, duration: 800, onComplete: () => txt.destroy() });
        }

        item.destroy();
        this.items.splice(index, 1);
    }

    // ─── Effects ─────────────────────────────────────────────────────────────

    screenShake(intensity, duration) {
        this.cameras.main.shake(duration, intensity / 800);
    }

    // ─── Update ──────────────────────────────────────────────────────────────

    update(time, delta) {
        if (this.gameOver || !this.dwarf || !this.dwarf.body) return;

        const vel = this.dwarf.body.velocity;

        // ── Timers ──────────────────────────────────────────────────────
        if (this.invulnTimer > 0) {
            this.invulnTimer -= delta;
            // Blink effect
            this.dwarf.setAlpha(Math.sin(time * 0.02) > 0 ? 1 : 0.3);
        } else {
            this.dwarf.setAlpha(1);
        }

        if (this.dashCooldownTimer > 0) this.dashCooldownTimer -= delta;

        if (this.comboTimer > 0) {
            this.comboTimer -= delta;
            if (this.comboTimer <= 0) {
                this.combo = 0;
                this.tweens.add({ targets: this.comboText, alpha: 0, duration: 300 });
            }
        }

        if (this.isPoweredUp) {
            this.powerUpTimer -= delta;
            // Glow effect
            this.dwarf.setTint(Math.sin(time * 0.01) > 0 ? 0xFFFF88 : 0xFFFFFF);
            if (this.powerUpTimer <= 0) {
                this.isPoweredUp = false;
                this.dwarf.clearTint();
            }
        }

        // ── Movement ────────────────────────────────────────────────────
        if (!this.isDashing) {
            if (this.keys.A.isDown) {
                this.dwarf.setVelocityX(-PLAYER.SPEED);
                this.facingRight = false;
                if (!this.isJumping && !this.isSwinging) {
                    this.dwarf.play('dwarf-walk', true);
                }
            } else if (this.keys.D.isDown) {
                this.dwarf.setVelocityX(PLAYER.SPEED);
                this.facingRight = true;
                if (!this.isJumping && !this.isSwinging) {
                    this.dwarf.play('dwarf-walk', true);
                }
            } else {
                this.dwarf.setVelocityX(0);
                if (!this.isJumping && !this.isSwinging) {
                    this.dwarf.stop();
                    this.dwarf.setTexture('dwarf-stand');
                }
            }

            this.dwarf.setVelocityY(vel.y); // preserve gravity
            this.dwarf.setFlipX(!this.facingRight);
        }

        // ── Jump ────────────────────────────────────────────────────────
        if (Phaser.Input.Keyboard.JustDown(this.keys.W) && !this.isJumping) {
            this.dwarf.setVelocityY(PLAYER.JUMP);
            this.isJumping = true;
            this.dwarf.setTexture('dwarf-jump');
            this.dustEmitter.explode(4, this.dwarf.x, this.dwarf.y + 28);
        }

        // ── Dash ────────────────────────────────────────────────────────
        if (Phaser.Input.Keyboard.JustDown(this.keys.SHIFT) && this.dashCooldownTimer <= 0 && !this.isDashing) {
            this.isDashing = true;
            this.dashCooldownTimer = PLAYER.DASH_COOLDOWN;
            const dashDir = this.facingRight ? 1 : -1;
            this.dwarf.setVelocityX(dashDir * PLAYER.DASH_SPEED);
            this.dwarf.setVelocityY(0);

            // Dash trail effect
            for (let t = 0; t < 4; t++) {
                this.time.delayedCall(t * 30, () => {
                    if (!this.dwarf.active) return;
                    const ghost = this.add.image(this.dwarf.x, this.dwarf.y, 'dwarf-stand')
                        .setFlipX(!this.facingRight).setAlpha(0.5).setTint(0x4488FF).setDepth(9);
                    this.tweens.add({ targets: ghost, alpha: 0, duration: 200, onComplete: () => ghost.destroy() });
                });
            }

            this.time.delayedCall(PLAYER.DASH_DURATION, () => {
                this.isDashing = false;
            });
        }

        // ── Attack (keyboard) ───────────────────────────────────────────
        if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
            this.swingAxe();
        }

        // ── Throw cooldown ──────────────────────────────────────────────
        if (this.throwCooldownTimer > 0) this.throwCooldownTimer -= delta;

        // ── Update thrown axes ──────────────────────────────────────────
        this.updateThrownAxes(delta);

        // ── Axe follow ──────────────────────────────────────────────────
        // Position axe at hand level (hands are at pixel-unit y=23, world offset +14)
        const axeOffX = this.facingRight ? 18 : -18;
        const axeOffY = 14;
        this.axe.x = this.dwarf.x + axeOffX;
        this.axe.y = this.dwarf.y + axeOffY;
        this.axe.setFlipX(!this.facingRight);
        if (!this.isSwinging) {
            this.axe.setOrigin(this.facingRight ? 0.1 : 0.9, 0.5);
        }

        // ── Enemies ─────────────────────────────────────────────────────
        this.updateEnemies(delta);

        // ── Items ───────────────────────────────────────────────────────
        this.updateItems();

        // ── HUD ─────────────────────────────────────────────────────────
        this.updateHUD();

        // ── Debug ───────────────────────────────────────────────────────
        if (this.debugText) {
            this.debugText.setText(
                `enemies: ${this.enemies.length} | wave: ${this.waveIndex + 1} | queue: ${this.waveEnemiesLeft.length} | active: ${this.waveActive}`
            );
        }
    }
}
