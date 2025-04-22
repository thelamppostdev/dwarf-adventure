import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.dwarf = null;
        this.ground = null;
        this.cursors = null;
        this.canJump = false;
        this.isJumping = false;
        this.worldWidth = 3200; // Larger world
        this.worldHeight = 600;
        this.enemies = []; // Array to store all enemies
        this.lastEnemySpawn = 0; // Track last enemy spawn time
        this.enemySpawnInterval = 1000; // Spawn new enemies every second
        this.isSwinging = false; // Track if axe is swinging
        this.maxEnemies = 30; // Increased maximum number of enemies
    }

    create() {
        console.log('Create started');
        
        // Create parallax layers
        this.createParallaxBackground();
        console.log('Background created');

        // Create ground with grass
        this.createGround();
        console.log('Ground created');

        // Create dwarf character
        const dwarfGraphics = this.add.graphics();
        
        // Create standing frame
        // Body (orange/brown tunic)
        dwarfGraphics.fillStyle(0xD2691E);
        dwarfGraphics.fillRect(8, 24, 16, 24);
        
        // Head
        dwarfGraphics.fillStyle(0xFDB797);
        dwarfGraphics.fillRect(8, 12, 16, 12);
        
        // Eyes (black)
        dwarfGraphics.fillStyle(0x000000);
        dwarfGraphics.fillRect(11, 16, 2, 2);  // Left eye
        dwarfGraphics.fillRect(19, 16, 2, 2);  // Right eye
        
        // Helmet (bronze/gold)
        dwarfGraphics.fillStyle(0xCD853F);
        dwarfGraphics.fillRect(6, 8, 20, 8);
        
        // Helmet horns (lighter gold)
        dwarfGraphics.fillStyle(0xDAA520);
        dwarfGraphics.fillRect(4, 4, 4, 8);
        dwarfGraphics.fillRect(24, 4, 4, 8);
        
        // Beard (darker brown)
        dwarfGraphics.fillStyle(0x8B4513);
        dwarfGraphics.fillRect(6, 20, 20, 8);
        
        // Belt
        dwarfGraphics.fillStyle(0x8B4513);
        dwarfGraphics.fillRect(8, 36, 16, 2);

        // Legs (orange/brown to match tunic)
        dwarfGraphics.fillStyle(0xD2691E);
        dwarfGraphics.fillRect(12, 48, 8, 8);  // Legs together

        dwarfGraphics.generateTexture('dwarf-stand', 44, 56);
        dwarfGraphics.clear();

        // Create walking frame 1 (similar upper body, different leg positions)
        // Body (orange/brown tunic)
        dwarfGraphics.fillStyle(0xD2691E);
        dwarfGraphics.fillRect(8, 24, 16, 24);
        
        // Head
        dwarfGraphics.fillStyle(0xFDB797);
        dwarfGraphics.fillRect(8, 12, 16, 12);
        
        // Eyes (black)
        dwarfGraphics.fillStyle(0x000000);
        dwarfGraphics.fillRect(11, 16, 2, 2);  // Left eye
        dwarfGraphics.fillRect(19, 16, 2, 2);  // Right eye
        
        // Helmet (bronze/gold)
        dwarfGraphics.fillStyle(0xCD853F);
        dwarfGraphics.fillRect(6, 8, 20, 8);
        
        // Helmet horns (lighter gold)
        dwarfGraphics.fillStyle(0xDAA520);
        dwarfGraphics.fillRect(4, 4, 4, 8);
        dwarfGraphics.fillRect(24, 4, 4, 8);
        
        // Beard (darker brown)
        dwarfGraphics.fillStyle(0x8B4513);
        dwarfGraphics.fillRect(6, 20, 20, 8);
        
        // Belt
        dwarfGraphics.fillStyle(0x8B4513);
        dwarfGraphics.fillRect(8, 36, 16, 2);

        // Legs apart (walking)
        dwarfGraphics.fillStyle(0xD2691E);
        dwarfGraphics.fillRect(8, 48, 8, 8);   // Left leg
        dwarfGraphics.fillRect(16, 48, 8, 8);  // Right leg

        dwarfGraphics.generateTexture('dwarf-walk1', 44, 56);
        dwarfGraphics.clear();

        // Create walking frame 2 (similar upper body, different leg positions)
        // Body (orange/brown tunic)
        dwarfGraphics.fillStyle(0xD2691E);
        dwarfGraphics.fillRect(8, 24, 16, 24);
        
        // Head
        dwarfGraphics.fillStyle(0xFDB797);
        dwarfGraphics.fillRect(8, 12, 16, 12);
        
        // Eyes (black)
        dwarfGraphics.fillStyle(0x000000);
        dwarfGraphics.fillRect(11, 16, 2, 2);  // Left eye
        dwarfGraphics.fillRect(19, 16, 2, 2);  // Right eye
        
        // Helmet (bronze/gold)
        dwarfGraphics.fillStyle(0xCD853F);
        dwarfGraphics.fillRect(6, 8, 20, 8);
        
        // Helmet horns (lighter gold)
        dwarfGraphics.fillStyle(0xDAA520);
        dwarfGraphics.fillRect(4, 4, 4, 8);
        dwarfGraphics.fillRect(24, 4, 4, 8);
        
        // Beard (darker brown)
        dwarfGraphics.fillStyle(0x8B4513);
        dwarfGraphics.fillRect(6, 20, 20, 8);
        
        // Belt
        dwarfGraphics.fillStyle(0x8B4513);
        dwarfGraphics.fillRect(8, 36, 16, 2);

        // Legs more apart (walking)
        dwarfGraphics.fillStyle(0xD2691E);
        dwarfGraphics.fillRect(4, 48, 8, 8);   // Left leg
        dwarfGraphics.fillRect(20, 48, 8, 8);  // Right leg

        dwarfGraphics.generateTexture('dwarf-walk2', 44, 56);
        dwarfGraphics.clear();

        // Create axe sprite
        // Axe handle (wooden with binding)
        dwarfGraphics.fillStyle(0x8B4513);  // Dark wood brown
        dwarfGraphics.fillRect(0, 0, 24, 3);
        
        // Handle bindings (yellow/gold)
        dwarfGraphics.fillStyle(0xFFD700);
        dwarfGraphics.fillRect(4, 0, 2, 3);
        dwarfGraphics.fillRect(12, 0, 2, 3);
        dwarfGraphics.fillRect(20, 0, 2, 3);
        
        // Axe head
        // Base metal (medium gray)
        dwarfGraphics.fillStyle(0x808080);
        // Main head shape
        dwarfGraphics.fillRect(16, -6, 4, 8);   // Base connection
        dwarfGraphics.fillRect(20, -8, 4, 10);  // Start widening
        dwarfGraphics.fillRect(24, -10, 4, 12); // Full width
        dwarfGraphics.fillRect(28, -10, 4, 12); // Full width
        dwarfGraphics.fillRect(32, -8, 4, 10);  // Start taper
        dwarfGraphics.fillRect(36, -6, 2, 8);   // Tip
        
        // Darker metal details
        dwarfGraphics.fillStyle(0x606060);
        dwarfGraphics.fillRect(20, -8, 16, 2);  // Top shadow
        dwarfGraphics.fillRect(20, 0, 16, 2);   // Bottom shadow
        
        // Lighter metal highlights
        dwarfGraphics.fillStyle(0xA0A0A0);
        dwarfGraphics.fillRect(24, -10, 8, 2);  // Top highlight
        dwarfGraphics.fillRect(32, -8, 4, 2);   // Upper middle
        dwarfGraphics.fillRect(36, -6, 2, 2);   // Tip highlight
        
        // Brightest edge highlights
        dwarfGraphics.fillStyle(0xC0C0C0);
        dwarfGraphics.fillRect(24, -6, 12, 2);  // Middle highlight
        
        // Edge highlight
        dwarfGraphics.fillStyle(0xFFFFFF);
        dwarfGraphics.fillRect(36, -4, 2, 2);   // Sharp edge highlight

        dwarfGraphics.generateTexture('axe', 40, 8);
        dwarfGraphics.clear();

        const dwarfSprite = this.add.sprite(400, 300, 'dwarf-stand');
        const axeSprite = this.add.sprite(400, 300, 'axe');
        
        // Create the walking animation
        this.anims.create({
            key: 'walk',
            frames: [
                { key: 'dwarf-walk1' },
                { key: 'dwarf-walk2' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // Create the axe-swinging animation
        this.anims.create({
            key: 'swing',
            frames: [
                { key: 'dwarf-stand' }
            ],
            frameRate: 12,
            repeat: 0
        });

        this.dwarf = this.matter.add.gameObject(dwarfSprite, {
            shape: 'rectangle',
            friction: 0.5,
            restitution: 0.2,
            density: 0.001,
            inertia: Infinity  // Prevents rotation
        });
        
        // Lock rotation of the dwarf
        this.dwarf.setFixedRotation();

        // Add collision callback
        this.matter.world.on('collisionstart', (event) => {
            event.pairs.forEach((pair) => {
                if (pair.bodyA === this.dwarf.body || pair.bodyB === this.dwarf.body) {
                    this.isJumping = false;
                }
            });
        });

        // Add a small delay before allowing jumping
        this.time.delayedCall(1000, () => {
            this.canJump = true;
        });

        console.log('Dwarf created');

        // Set up controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = {
            A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            SPACE: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        };
        console.log('Controls set up');

        // Store the axe sprite
        this.axe = axeSprite;
        this.axe.setOrigin(0.2, 0.5); // Set origin closer to the handle end for rotation
        this.axe.setDepth(1); // Make sure axe appears above the dwarf
        this.isSwinging = false;

        // Camera follow with bounds
        this.cameras.main.startFollow(this.dwarf, true, 0.1, 0.1);
        this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
        console.log('Camera set up');

        // Create enemy sprites
        const enemyGraphics = this.add.graphics();
        
        // Create orc sprite (green, slightly smaller than dwarf)
        // Body (green)
        enemyGraphics.fillStyle(0x228B22);
        enemyGraphics.fillRect(8, 24, 16, 20);
        
        // Head
        enemyGraphics.fillStyle(0x32CD32);
        enemyGraphics.fillRect(8, 12, 16, 12);
        
        // Eyes (red)
        enemyGraphics.fillStyle(0xFF0000);
        enemyGraphics.fillRect(11, 16, 2, 2);  // Left eye
        enemyGraphics.fillRect(19, 16, 2, 2);  // Right eye
        
        // Helmet (dark green)
        enemyGraphics.fillStyle(0x006400);
        enemyGraphics.fillRect(6, 8, 20, 8);
        
        // Legs (green)
        enemyGraphics.fillStyle(0x228B22);
        enemyGraphics.fillRect(12, 44, 8, 8);

        enemyGraphics.generateTexture('orc', 44, 52);
        enemyGraphics.clear();

        // Create particle emitter for enemy death
        this.deathParticles = this.add.particles(0, 0, 'orc', {
            speed: { min: 50, max: 100 },
            scale: { start: 0.3, end: 0 },
            lifespan: 1000,
            quantity: 15,
            gravityY: 200,
            alpha: { start: 0.8, end: 0 },
            tint: 0x000000,
            emitting: false
        });
    }

    createParallaxBackground() {
        // Sky
        this.add.rectangle(0, 0, this.worldWidth, this.worldHeight, 0x87CEEB)
            .setOrigin(0, 0)
            .setScrollFactor(0);

        // Cloud shapes with shading (0 = transparent, 1 = lightest, 2 = light, 3 = medium, 4 = darker)
        const cloudShapes = [
            [ // Large cloud
                [0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
                [0,0,0,0,0,1,1,2,2,2,2,2,1,1,0,0,0,0],
                [0,0,0,1,1,2,2,3,3,3,3,2,2,2,1,0,0,0],
                [0,0,1,2,2,3,3,4,4,4,3,3,2,2,2,1,0,0],
                [0,1,2,2,3,3,4,4,4,4,4,3,3,2,2,2,1,0],
                [1,2,2,3,3,4,4,4,4,4,4,4,3,3,2,2,1,1]
            ],
            [ // Medium cloud
                [0,0,0,1,1,1,1,0,0,0,0],
                [0,0,1,2,2,2,2,1,1,0,0],
                [0,1,2,3,3,3,2,2,2,1,0],
                [1,2,2,3,4,4,3,3,2,2,1],
                [1,2,3,3,4,4,4,3,3,2,1]
            ],
            [ // Small cloud
                [0,0,1,1,1,1,0,0],
                [0,1,2,2,2,2,1,0],
                [1,2,3,3,3,2,2,1],
                [1,2,3,4,3,3,2,1]
            ]
        ];

        // Cloud colors for shading
        const cloudColors = {
            1: 0xFFFFFF,     // Lightest
            2: 0xF0F0F0,     // Light
            3: 0xE0E0E0,     // Medium
            4: 0xD0D0D0      // Darker
        };

        // Create clouds
        for (let i = 0; i < 12; i++) {
            const x = Phaser.Math.Between(0, this.worldWidth);
            const y = Phaser.Math.Between(50, 150);
            const cloudType = Phaser.Math.Between(0, cloudShapes.length - 1);
            const shape = cloudShapes[cloudType];
            
            const cloud = this.add.graphics();
            
            // Draw cloud pixels with shading
            const pixelSize = 4;
            for (let row = 0; row < shape.length; row++) {
                for (let col = 0; col < shape[row].length; col++) {
                    if (shape[row][col] > 0) {
                        cloud.fillStyle(cloudColors[shape[row][col]], 1);
                        cloud.fillRect(
                            col * pixelSize, 
                            row * pixelSize, 
                            pixelSize, 
                            pixelSize
                        );
                    }
                }
            }
            
            const textureName = 'cloud' + i;
            cloud.generateTexture(textureName, 
                shape[0].length * pixelSize, 
                shape.length * pixelSize
            );
            
            this.add.image(x, y, textureName)
                .setScrollFactor(0.1);
        }

        // Mountain colors for different layers
        const mountainColors = {
            distant: [0x4A4A4A, 0x3A3A3A, 0x2A2A2A],  // Darker grays
            middle: [0x3A3A3A, 0x2A2A2A, 0x1A1A1A]   // Even darker grays
        };

        // Distant mountains (slow parallax)
        for (let i = 0; i < 8; i++) {
            const x = i * 600;
            const height = Phaser.Math.Between(100, 300);
            const width = Phaser.Math.Between(400, 800);
            const color = Phaser.Math.RND.pick(mountainColors.distant);
            
            // Create mountain with multiple peaks
            const mountain = this.add.graphics();
            mountain.fillStyle(color);
            
            // Base of mountain
            mountain.beginPath();
            mountain.moveTo(x, this.worldHeight);
            mountain.lineTo(x + width, this.worldHeight);
            
            // Create 2-4 peaks
            const numPeaks = Phaser.Math.Between(2, 4);
            const peakWidth = width / (numPeaks + 1);
            
            for (let p = 0; p < numPeaks; p++) {
                const peakX = x + (p + 1) * peakWidth;
                const peakHeight = height * Phaser.Math.FloatBetween(0.8, 1.2);
                mountain.lineTo(peakX, this.worldHeight - peakHeight);
            }
            
            mountain.closePath();
            mountain.fillPath();
            
            mountain.generateTexture('distantMountain' + i, width, height);
            this.add.image(x, this.worldHeight, 'distantMountain' + i)
                .setOrigin(0, 1)
                .setScrollFactor(0.2);
        }

        // Middle-ground mountains (medium parallax)
        for (let i = 0; i < 12; i++) {
            const x = i * 400;
            const height = Phaser.Math.Between(150, 350);
            const width = Phaser.Math.Between(300, 600);
            const color = Phaser.Math.RND.pick(mountainColors.middle);
            
            // Create mountain with more detailed shape
            const mountain = this.add.graphics();
            mountain.fillStyle(color);
            
            // Base of mountain
            mountain.beginPath();
            mountain.moveTo(x, this.worldHeight);
            mountain.lineTo(x + width, this.worldHeight);
            
            // Create 3-5 peaks with varying heights
            const numPeaks = Phaser.Math.Between(3, 5);
            const basePeakWidth = width / (numPeaks + 1);
            
            for (let p = 0; p < numPeaks; p++) {
                const peakX = x + (p + 1) * basePeakWidth;
                const peakHeight = height * Phaser.Math.FloatBetween(0.7, 1.3);
                const jaggedWidth = Phaser.Math.Between(50, 100);
                
                // Create jagged peak
                mountain.lineTo(peakX - jaggedWidth/2, this.worldHeight - peakHeight * 0.8);
                mountain.lineTo(peakX, this.worldHeight - peakHeight);
                mountain.lineTo(peakX + jaggedWidth/2, this.worldHeight - peakHeight * 0.8);
            }
            
            mountain.closePath();
            mountain.fillPath();
            
            mountain.generateTexture('middleMountain' + i, width, height);
            this.add.image(x, this.worldHeight, 'middleMountain' + i)
                .setOrigin(0, 1)
                .setScrollFactor(0.4);
        }
    }

    createGround() {
        // Create the collidable ground (invisible)
        this.ground = this.matter.add.rectangle(
            this.worldWidth / 2,
            this.worldHeight - 50,
            this.worldWidth,
            100,
            {
                isStatic: true,
                friction: 0.5,
                render: { visible: false } // Make it invisible
            }
        );

        // Create visual ground with grass
        const groundHeight = 100;
        const groundY = this.worldHeight - groundHeight;

        // Base grass color
        this.add.rectangle(0, groundY, this.worldWidth, groundHeight, 0x2E8B57)
            .setOrigin(0, 0)
            .setScrollFactor(1);

        // Add grass tufts
        for (let i = 0; i < 100; i++) {
            const x = Phaser.Math.Between(0, this.worldWidth);
            const y = groundY + Phaser.Math.Between(0, groundHeight);
            const height = Phaser.Math.Between(5, 15);
            const width = Phaser.Math.Between(2, 4);
            
            // Create grass tuft
            const grass = this.add.graphics();
            grass.fillStyle(0x228B22);
            grass.fillTriangle(0, 0, width, 0, width/2, -height);
            grass.generateTexture('grass' + i, width, height);
            
            this.add.image(x, y, 'grass' + i)
                .setOrigin(0.5, 1)
                .setScrollFactor(1);
        }

        // Add some decorative flowers
        for (let i = 0; i < 50; i++) {
            const x = Phaser.Math.Between(0, this.worldWidth);
            const y = groundY + Phaser.Math.Between(0, groundHeight);
            const size = Phaser.Math.Between(3, 6);
            const color = Phaser.Math.RND.pick([0xFF69B4, 0xFFD700, 0xFFFFFF]);
            
            this.add.circle(x, y, size, color)
                .setScrollFactor(1);
        }

        // Add some small rocks
        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(0, this.worldHeight);
            const y = groundY + Phaser.Math.Between(0, groundHeight);
            const size = Phaser.Math.Between(4, 8);
            
            this.add.circle(x, y, size, 0x808080)
                .setScrollFactor(1);
        }
    }

    createOrcTexture(sizeMultiplier = 1.0) {
        const baseWidth = 44;
        const baseHeight = 52;
        const width = baseWidth * sizeMultiplier;
        const height = baseHeight * sizeMultiplier;
        
        const graphics = this.add.graphics();
        
        // Randomize skin tone (different shades of green)
        const skinTones = [0x228B22, 0x32CD32, 0x006400, 0x556B2F];
        const skinColor = Phaser.Math.RND.pick(skinTones);
        
        // Randomize armor color
        const armorColors = [0x8B4513, 0x654321, 0x4B5320, 0x2F4F4F];
        const armorColor = Phaser.Math.RND.pick(armorColors);
        
        // Body (scaled green)
        graphics.fillStyle(skinColor);
        graphics.fillRect(8 * sizeMultiplier, 24 * sizeMultiplier, 16 * sizeMultiplier, 20 * sizeMultiplier);
        
        // Head
        graphics.fillStyle(skinColor);
        graphics.fillRect(8 * sizeMultiplier, 12 * sizeMultiplier, 16 * sizeMultiplier, 12 * sizeMultiplier);
        
        // Eyes (red)
        graphics.fillStyle(0xFF0000);
        graphics.fillRect(11 * sizeMultiplier, 16 * sizeMultiplier, 2 * sizeMultiplier, 2 * sizeMultiplier);
        graphics.fillRect(19 * sizeMultiplier, 16 * sizeMultiplier, 2 * sizeMultiplier, 2 * sizeMultiplier);
        
        // Random armor pieces
        if (Phaser.Math.Between(0, 1) === 1) {
            // Shoulder armor
            graphics.fillStyle(armorColor);
            graphics.fillRect(4 * sizeMultiplier, 20 * sizeMultiplier, 4 * sizeMultiplier, 8 * sizeMultiplier);
            graphics.fillRect(28 * sizeMultiplier, 20 * sizeMultiplier, 4 * sizeMultiplier, 8 * sizeMultiplier);
        }
        
        if (Phaser.Math.Between(0, 1) === 1) {
            // Chest armor
            graphics.fillStyle(armorColor);
            graphics.fillRect(8 * sizeMultiplier, 24 * sizeMultiplier, 16 * sizeMultiplier, 8 * sizeMultiplier);
        }
        
        // Random weapon
        const weaponType = Phaser.Math.Between(0, 2);
        if (weaponType === 0) {
            // Club
            graphics.fillStyle(0x8B4513);
            graphics.fillRect(24 * sizeMultiplier, 20 * sizeMultiplier, 8 * sizeMultiplier, 4 * sizeMultiplier);
            graphics.fillRect(28 * sizeMultiplier, 16 * sizeMultiplier, 4 * sizeMultiplier, 8 * sizeMultiplier);
        } else if (weaponType === 1) {
            // Axe
            graphics.fillStyle(0x808080);
            graphics.fillRect(24 * sizeMultiplier, 20 * sizeMultiplier, 8 * sizeMultiplier, 4 * sizeMultiplier);
            graphics.fillRect(28 * sizeMultiplier, 16 * sizeMultiplier, 4 * sizeMultiplier, 8 * sizeMultiplier);
        } else {
            // Sword
            graphics.fillStyle(0xC0C0C0);
            graphics.fillRect(24 * sizeMultiplier, 16 * sizeMultiplier, 4 * sizeMultiplier, 12 * sizeMultiplier);
        }
        
        // Legs
        graphics.fillStyle(skinColor);
        graphics.fillRect(12 * sizeMultiplier, 44 * sizeMultiplier, 8 * sizeMultiplier, 8 * sizeMultiplier);
        
        const textureKey = `orc-${Date.now()}-${Math.random()}`;
        graphics.generateTexture(textureKey, width, height);
        graphics.clear();
        
        return textureKey;
    }

    spawnEnemy() {
        // Don't spawn if we've reached the maximum number of enemies
        if (this.enemies.length >= this.maxEnemies) return;

        // Spawn 2-4 enemies at random positions
        const numToSpawn = Phaser.Math.Between(2, 4);
        
        for (let i = 0; i < numToSpawn; i++) {
            // Random size between 0.8 and 1.5
            const sizeMultiplier = Phaser.Math.FloatBetween(0.8, 1.5);
            
            // Get camera bounds
            const camera = this.cameras.main;
            const cameraLeft = camera.scrollX;
            const cameraRight = camera.scrollX + camera.width;
            
            // Randomly choose to spawn on left or right side of screen
            const spawnOnLeft = Phaser.Math.Between(0, 1) === 0;
            const x = spawnOnLeft 
                ? Phaser.Math.Between(50, cameraLeft - 50)  // Spawn left of camera
                : Phaser.Math.Between(cameraRight + 50, this.worldWidth - 50);  // Spawn right of camera
            
            const y = this.worldHeight - 100; // Ground level
            
            const textureKey = this.createOrcTexture(sizeMultiplier);
            const enemy = this.matter.add.sprite(x, y, textureKey, null, {
                shape: 'rectangle',
                friction: 0.5,
                restitution: 0.2,
                density: 0.001,
                inertia: Infinity
            });
            
            enemy.setFixedRotation();
            enemy.setData('health', 1);
            enemy.setData('sizeMultiplier', sizeMultiplier);
            this.enemies.push(enemy);
        }
    }

    updateEnemies() {
        const currentTime = this.time.now;
        
        // Spawn new enemies if enough time has passed
        if (currentTime - this.lastEnemySpawn > this.enemySpawnInterval) {
            this.spawnEnemy();
            this.lastEnemySpawn = currentTime;
        }

        // Update each enemy's behavior
        this.enemies.forEach((enemy, index) => {
            if (!enemy.active) return;

            // Calculate direction to dwarf
            const dx = this.dwarf.x - enemy.x;
            const dy = this.dwarf.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Move towards dwarf if within chase range
            if (distance < 400) {
                const baseSpeed = 2.5;
                const sizeMultiplier = enemy.getData('sizeMultiplier');
                // Larger orcs move slightly slower
                const speed = baseSpeed * (1 / sizeMultiplier);
                const angle = Math.atan2(dy, dx);
                enemy.setVelocityX(Math.cos(angle) * speed);
            }

            // Check for axe collision when swinging
            if (this.isSwinging) {
                const axeBounds = this.axe.getBounds();
                const enemyBounds = enemy.getBounds();
                
                if (Phaser.Geom.Rectangle.Overlaps(axeBounds, enemyBounds)) {
                    // Kill enemy
                    this.deathParticles.explode(10, enemy.x, enemy.y);
                    enemy.destroy();
                    this.enemies.splice(index, 1);
                }
            }
        });
    }

    update() {
        if (!this.dwarf || !this.dwarf.body) return;

        // Movement controls
        const speed = 5;
        const jumpForce = -10;

        // Get the current velocity
        const velocity = this.dwarf.body.velocity;

        // Update axe position to follow dwarf
        this.axe.x = this.dwarf.x + (this.dwarf.flipX ? -12 : 12);
        this.axe.y = this.dwarf.y - 4;
        
        // Update axe origin and flip based on direction
        if (!this.isSwinging) {
            this.axe.flipX = this.dwarf.flipX;
            // Set origin to the opposite end when flipped
            this.axe.setOrigin(this.dwarf.flipX ? 0.8 : 0.2, 0.5);
        }

        if (this.keys.A.isDown) {
            // Set exact X velocity for consistent movement
            this.dwarf.setVelocityX(-speed);
            this.dwarf.flipX = true;
            if (!this.isJumping && !this.isSwinging) {
                this.dwarf.play('walk', true);
            }
        } else if (this.keys.D.isDown) {
            // Set exact X velocity for consistent movement
            this.dwarf.setVelocityX(speed);
            this.dwarf.flipX = false;
            if (!this.isJumping && !this.isSwinging) {
                this.dwarf.play('walk', true);
            }
        } else {
            // Stop horizontal movement completely
            this.dwarf.setVelocityX(0);
            if (!this.isJumping && !this.isSwinging) {
                this.dwarf.stop();
                this.dwarf.setTexture('dwarf-stand');
            }
        }

        // Preserve vertical velocity for jumping/falling
        this.dwarf.setVelocityY(velocity.y);

        // Jump when W is pressed and not already jumping
        if (this.canJump && Phaser.Input.Keyboard.JustDown(this.keys.W) && !this.isJumping) {
            this.dwarf.setVelocityY(jumpForce);
            this.isJumping = true;
            this.dwarf.stop();
            this.dwarf.setTexture('dwarf-stand');
        }

        // Swing axe when spacebar is pressed and not already swinging
        if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE) && !this.isSwinging) {
            this.isSwinging = true;
            this.dwarf.play('swing');
            
            // Create a tween for the axe rotation
            const swingAngle = this.dwarf.flipX ? 120 : -120;
            this.tweens.add({
                targets: this.axe,
                angle: swingAngle,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.isSwinging = false;
                    this.axe.angle = 0;
                    this.axe.flipX = this.dwarf.flipX;
                    // Reset origin after swing
                    this.axe.setOrigin(this.dwarf.flipX ? 0.8 : 0.2, 0.5);
                }
            });
        }

        // Update enemies
        this.updateEnemies();
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 1 },
            debug: true,
            setBounds: {
                left: true,
                right: false,
                top: true,
                bottom: true
            }
        }
    },
    scene: MainScene,
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

console.log('Creating game...');
const game = new Phaser.Game(config);
console.log('Game created'); 