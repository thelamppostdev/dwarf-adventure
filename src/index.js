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
        // Axe handle (dark brown with pattern)
        dwarfGraphics.fillStyle(0x654321);
        dwarfGraphics.fillRect(0, 0, 32, 4);
        // Handle pattern
        dwarfGraphics.fillStyle(0x8B4513);
        dwarfGraphics.fillRect(2, 0, 2, 4);
        dwarfGraphics.fillRect(6, 0, 2, 4);
        dwarfGraphics.fillRect(10, 0, 2, 4);
        dwarfGraphics.fillRect(14, 0, 2, 4);
        dwarfGraphics.fillRect(18, 0, 2, 4);
        dwarfGraphics.fillRect(22, 0, 2, 4);
        dwarfGraphics.fillRect(26, 0, 2, 4);
        
        // Axe head (double-sided with patterns)
        dwarfGraphics.fillStyle(0xA0A0A0);
        dwarfGraphics.fillRect(20, -16, 24, 24);
        
        // Triangular cutouts (black)
        dwarfGraphics.fillStyle(0x000000);
        // Left side cutouts
        dwarfGraphics.fillRect(24, -12, 2, 2);
        dwarfGraphics.fillRect(24, 0, 2, 2);
        // Right side cutouts
        dwarfGraphics.fillRect(36, -12, 2, 2);
        dwarfGraphics.fillRect(36, 0, 2, 2);
        
        // Edge details and highlights
        dwarfGraphics.fillStyle(0x808080);
        // Left blade
        dwarfGraphics.fillRect(20, -16, 4, 24);
        // Right blade
        dwarfGraphics.fillRect(40, -16, 4, 24);
        
        // Sharp edge highlights
        dwarfGraphics.fillStyle(0xFFFFFF);
        // Left edge
        dwarfGraphics.fillRect(20, -15, 1, 22);
        // Right edge
        dwarfGraphics.fillRect(43, -15, 1, 22);
        
        // Center geometric pattern
        dwarfGraphics.fillStyle(0x909090);
        dwarfGraphics.fillRect(28, -8, 8, 16);

        dwarfGraphics.generateTexture('axe', 44, 8);
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

        // Distant mountains (slow parallax)
        for (let i = 0; i < 5; i++) {
            const x = i * 800;
            const height = Phaser.Math.Between(100, 200);
            this.add.triangle(x, this.worldHeight - height/2, 0, height, 400, 0, 800, height, 0x4A4A4A)
                .setScrollFactor(0.2);
        }

        // Middle-ground mountains (medium parallax)
        for (let i = 0; i < 8; i++) {
            const x = i * 600;
            const height = Phaser.Math.Between(150, 250);
            this.add.triangle(x, this.worldHeight - height/2, 0, height, 300, 0, 600, height, 0x3A3A3A)
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