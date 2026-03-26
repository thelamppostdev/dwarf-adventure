// Procedural sprite generation — all entities drawn at 2x pixel scale for clarity
import Phaser from 'phaser';

const P = 2; // pixel size — every "pixel" is a 2x2 block for crispness

function px(g, x, y, w, h, color) {
    g.fillStyle(color);
    g.fillRect(x * P, y * P, w * P, h * P);
}

// ─── Dwarf Sprites ───────────────────────────────────────────────────────────

function drawDwarf(g, pose) {
    const W = 24, H = 32; // sprite in "pixel" units

    // === Boots ===
    if (pose === 'walk1') {
        px(g, 5, 28, 4, 4, 0x4A3728);
        px(g, 14, 28, 4, 4, 0x4A3728);
    } else if (pose === 'walk2') {
        px(g, 8, 28, 4, 4, 0x4A3728);
        px(g, 12, 28, 4, 4, 0x4A3728);
    } else {
        px(g, 7, 28, 4, 4, 0x4A3728);
        px(g, 13, 28, 4, 4, 0x4A3728);
    }

    // === Legs ===
    if (pose === 'walk1') {
        px(g, 6, 24, 3, 5, 0x6B4226);
        px(g, 15, 24, 3, 5, 0x6B4226);
    } else if (pose === 'walk2') {
        px(g, 8, 24, 3, 5, 0x6B4226);
        px(g, 13, 24, 3, 5, 0x6B4226);
    } else {
        px(g, 8, 24, 3, 5, 0x6B4226);
        px(g, 13, 24, 3, 5, 0x6B4226);
    }

    // === Body / Tunic ===
    px(g, 6, 14, 12, 11, 0xB8860B);
    // Chainmail dots
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
            if ((r + c) % 2 === 0) px(g, 7 + c * 3, 15 + r * 3, 1, 1, 0x9A7B0A);
        }
    }

    // === Belt ===
    px(g, 6, 23, 12, 2, 0x654321);
    px(g, 10, 23, 3, 2, 0xFFD700); // buckle

    // === Left Arm (drawn BEFORE body overlaps) ===
    // Shoulder/upper arm — darker than tunic to stand out
    px(g, 2, 15, 4, 5, 0x9A7209);   // dark sleeve
    px(g, 2, 20, 4, 3, 0xC49A2E);   // lower sleeve
    // Hand — skin tone, visible
    px(g, 2, 23, 4, 2, 0xFDB797);

    // === Right Arm ===
    px(g, 18, 15, 4, 5, 0x9A7209);
    px(g, 18, 20, 4, 3, 0xC49A2E);
    px(g, 18, 23, 4, 2, 0xFDB797);

    // === Head ===
    px(g, 7, 5, 10, 9, 0xFDB797);

    // === Beard ===
    px(g, 5, 10, 14, 5, 0xCD853F);
    px(g, 7, 15, 10, 2, 0xCD853F);
    // Braid tips
    px(g, 7, 17, 2, 2, 0xB8860B);
    px(g, 15, 17, 2, 2, 0xB8860B);

    // === Eyes ===
    px(g, 9, 7, 2, 2, 0x4169E1);
    px(g, 14, 7, 2, 2, 0x4169E1);
    px(g, 10, 8, 1, 1, 0x000000);
    px(g, 15, 8, 1, 1, 0x000000);

    // === Eyebrows ===
    px(g, 8, 6, 3, 1, 0xB8860B);
    px(g, 13, 6, 3, 1, 0xB8860B);

    // === Nose ===
    px(g, 11, 9, 2, 2, 0xF0B088);

    // === Helmet ===
    px(g, 5, 1, 14, 5, 0xC0C0C0);
    px(g, 4, 4, 16, 2, 0xA0A0A0); // rim
    px(g, 8, 2, 8, 1, 0xE8E8E8);  // highlight

    // === Horns ===
    px(g, 2, 0, 3, 5, 0xFFF8DC);
    px(g, 19, 0, 3, 5, 0xFFF8DC);
    px(g, 2, 0, 3, 2, 0xFFD700);
    px(g, 19, 0, 3, 2, 0xFFD700);
}

export function createDwarfTextures(scene) {
    const g = scene.add.graphics();
    const W = 24 * P, H = 32 * P;

    drawDwarf(g, 'stand');
    g.generateTexture('dwarf-stand', W, H);
    g.clear();

    drawDwarf(g, 'walk1');
    g.generateTexture('dwarf-walk1', W, H);
    g.clear();

    drawDwarf(g, 'walk2');
    g.generateTexture('dwarf-walk2', W, H);
    g.clear();

    drawDwarf(g, 'stand');
    g.generateTexture('dwarf-jump', W, H);
    g.clear();

    g.fillStyle(0xFFFFFF);
    g.fillRect(0, 0, W, H);
    g.generateTexture('dwarf-hit', W, H);
    g.clear();

    g.destroy();

    scene.anims.create({
        key: 'dwarf-walk',
        frames: [{ key: 'dwarf-walk1' }, { key: 'dwarf-walk2' }],
        frameRate: 8,
        repeat: -1
    });

    scene.anims.create({
        key: 'dwarf-idle',
        frames: [{ key: 'dwarf-stand' }],
        frameRate: 1,
        repeat: -1
    });
}

// ─── Axe Sprite ──────────────────────────────────────────────────────────────

export function createAxeTexture(scene) {
    const g = scene.add.graphics();
    // Dwarven battle axe: 24x20 pixel units → 48x40 actual
    // Reference: ornate double-headed axe — wide crescent blades, gold trim, green gem

    // === Handle ===
    px(g, 0, 9, 11, 2, 0x5C3A1E);  // main shaft
    px(g, 1, 9, 9, 1, 0x7A4E2A);   // wood grain highlight
    // Leather wraps
    px(g, 2, 9, 1, 2, 0x3E2710);
    px(g, 4, 9, 1, 2, 0x3E2710);
    px(g, 6, 9, 1, 2, 0x3E2710);
    px(g, 8, 9, 1, 2, 0x3E2710);
    // Gold pommel
    px(g, 0, 8, 2, 4, 0xFFD700);
    px(g, 0, 9, 1, 2, 0xB8860B);

    // === Gold collar (where head meets handle) ===
    px(g, 10, 6, 1, 8, 0xFFD700);
    px(g, 11, 7, 1, 6, 0xDAA520);

    // === Head spine (connects both blades through center) ===
    px(g, 11, 6, 2, 8, 0x6E6E6E);

    // === Upper blade — wide crescent fanning upward ===
    // Narrow at collar, widening toward cutting edge, then curving to tip
    px(g, 12, 6, 2, 3, 0x757575);   // root near collar
    px(g, 14, 5, 2, 4, 0x7E7E7E);   // expanding
    px(g, 16, 4, 2, 5, 0x878787);   // wider
    px(g, 18, 2, 2, 7, 0x929292);   // wide body
    px(g, 20, 1, 2, 7, 0x9C9C9C);   // near cutting edge
    px(g, 22, 2, 1, 5, 0xA8A8A8);   // curving back
    px(g, 23, 3, 1, 3, 0xB0B0B0);   // tip
    // Cutting edge gleam
    px(g, 21, 1, 1, 2, 0xCCCCCC);
    px(g, 22, 2, 1, 1, 0xD8D8D8);
    px(g, 23, 3, 1, 1, 0xE8E8E8);
    // Top edge highlight
    px(g, 18, 2, 3, 1, 0xAAAAAA);

    // === Lower blade — mirror of upper ===
    px(g, 12, 11, 2, 3, 0x757575);
    px(g, 14, 11, 2, 4, 0x7E7E7E);
    px(g, 16, 11, 2, 5, 0x878787);
    px(g, 18, 11, 2, 7, 0x929292);
    px(g, 20, 12, 2, 7, 0x9C9C9C);
    px(g, 22, 13, 1, 5, 0xA8A8A8);
    px(g, 23, 14, 1, 3, 0xB0B0B0);
    // Lower cutting edge gleam
    px(g, 21, 17, 1, 2, 0xCCCCCC);
    px(g, 22, 17, 1, 1, 0xD8D8D8);
    px(g, 23, 16, 1, 1, 0xE8E8E8);
    // Bottom edge highlight
    px(g, 18, 17, 3, 1, 0x7A7A7A);

    // === Gold filigree on blades ===
    px(g, 13, 6, 1, 1, 0xFFD700);
    px(g, 15, 5, 1, 1, 0xFFD700);
    px(g, 17, 4, 1, 1, 0xDAA520);
    px(g, 19, 3, 1, 1, 0xDAA520);
    // Lower filigree
    px(g, 13, 13, 1, 1, 0xFFD700);
    px(g, 15, 14, 1, 1, 0xFFD700);
    px(g, 17, 15, 1, 1, 0xDAA520);
    px(g, 19, 16, 1, 1, 0xDAA520);

    // === Green gem at center ===
    px(g, 11, 9, 2, 2, 0x2ECC40);
    px(g, 11, 9, 1, 1, 0x7FDBCA);  // gem highlight

    // Rivets
    px(g, 12, 7, 1, 1, 0xCCCCCC);
    px(g, 12, 12, 1, 1, 0xCCCCCC);

    g.generateTexture('axe', 24 * P, 20 * P);
    g.clear();
    g.destroy();
}

// ─── Thrown Axe (smaller, for projectile) ────────────────────────────────────

export function createThrownAxeTexture(scene) {
    const g = scene.add.graphics();
    // Mini dwarven axe: 14x12 pixel units → 28x24 actual

    // Handle
    px(g, 0, 5, 6, 2, 0x5C3A1E);
    px(g, 1, 5, 1, 2, 0x3E2710);
    px(g, 3, 5, 1, 2, 0x3E2710);
    // Gold pommel
    px(g, 0, 5, 1, 2, 0xFFD700);
    // Gold collar
    px(g, 6, 4, 1, 4, 0xDAA520);

    // Spine
    px(g, 6, 3, 2, 6, 0x707070);

    // Upper blade crescent
    px(g, 7, 3, 2, 2, 0x808080);
    px(g, 9, 2, 2, 3, 0x909090);
    px(g, 11, 1, 2, 3, 0xA0A0A0);
    px(g, 13, 2, 1, 2, 0xBBBBBB);

    // Lower blade crescent
    px(g, 7, 7, 2, 2, 0x808080);
    px(g, 9, 7, 2, 3, 0x909090);
    px(g, 11, 8, 2, 3, 0xA0A0A0);
    px(g, 13, 8, 1, 2, 0xBBBBBB);

    // Gem
    px(g, 7, 5, 1, 2, 0x2ECC40);

    g.generateTexture('thrown-axe', 14 * P, 12 * P);
    g.clear();
    g.destroy();
}

// ─── Enemy Sprites ───────────────────────────────────────────────────────────

export function createGoblinTexture(scene) {
    const g = scene.add.graphics();
    // Goblin: 16x22 pixel units → 32x44 actual

    // Feet
    px(g, 4, 19, 3, 3, 0x355E3B);
    px(g, 9, 19, 3, 3, 0x355E3B);

    // Legs
    px(g, 5, 16, 2, 4, 0x228B22);
    px(g, 9, 16, 2, 4, 0x228B22);

    // Body  
    px(g, 4, 9, 8, 7, 0x32CD32);

    // Loincloth
    px(g, 4, 14, 8, 3, 0x8B4513);

    // Head — oversized for goblin
    px(g, 3, 1, 10, 8, 0x32CD32);

    // Big pointy ears
    px(g, 0, 2, 3, 5, 0x2EB82E);
    px(g, 13, 2, 3, 5, 0x2EB82E);

    // Eyes — big yellow
    px(g, 5, 3, 2, 2, 0xFFFF00);
    px(g, 9, 3, 2, 2, 0xFFFF00);
    px(g, 6, 4, 1, 1, 0x000000);
    px(g, 10, 4, 1, 1, 0x000000);

    // Mouth — toothy grin
    px(g, 5, 7, 6, 1, 0x000000);
    px(g, 6, 7, 1, 1, 0xFFFFFF);
    px(g, 9, 7, 1, 1, 0xFFFFFF);

    // Dagger in hand
    px(g, 13, 10, 1, 6, 0xC0C0C0);
    px(g, 12, 14, 3, 2, 0x8B4513);

    g.generateTexture('goblin', 16 * P, 22 * P);
    g.clear();
    g.destroy();
}

export function createOrcTexture(scene) {
    const g = scene.add.graphics();
    // Orc: 22x28 pixel units → 44x56 actual

    // Boots
    px(g, 5, 25, 4, 3, 0x4A3728);
    px(g, 13, 25, 4, 3, 0x4A3728);

    // Legs
    px(g, 6, 21, 3, 5, 0x006400);
    px(g, 13, 21, 3, 5, 0x006400);

    // Body — hulking
    px(g, 4, 10, 14, 12, 0x228B22);

    // Armor chestplate
    px(g, 5, 11, 12, 6, 0x555555);
    px(g, 6, 12, 10, 4, 0x666666);

    // Head
    px(g, 5, 2, 12, 8, 0x228B22);

    // Jaw / underbite
    px(g, 6, 8, 10, 3, 0x1E7B1E);

    // Tusks
    px(g, 6, 7, 2, 3, 0xFFF8DC);
    px(g, 14, 7, 2, 3, 0xFFF8DC);

    // Red angry eyes
    px(g, 7, 4, 3, 2, 0xFF0000);
    px(g, 12, 4, 3, 2, 0xFF0000);
    px(g, 8, 5, 1, 1, 0x000000);
    px(g, 13, 5, 1, 1, 0x000000);

    // Helmet
    px(g, 4, 1, 14, 3, 0x555555);
    px(g, 4, 3, 14, 1, 0x444444);

    // === Orcish crude axe in hand ===
    // Reference: crude single-headed axe, wide jagged blade, leather-wrapped handle
    // Handle — rough leather wrapping
    px(g, 18, 13, 2, 8, 0x5C3A1E);
    px(g, 18, 14, 2, 1, 0x3E2710);  // leather wrap
    px(g, 18, 17, 2, 1, 0x3E2710);
    px(g, 18, 19, 2, 1, 0x3E2710);
    // Crude wide axe head — single-headed, rough iron
    px(g, 16, 7, 6, 2, 0x6B6B6B);   // head top
    px(g, 15, 9, 7, 2, 0x7A7A7A);   // head body wide
    px(g, 14, 11, 8, 2, 0x888888);  // widest part
    px(g, 15, 13, 6, 1, 0x7A7A7A);  // narrows to handle
    // Jagged edges — rough uneven cuts
    px(g, 14, 8, 1, 2, 0x808080);   // jagged left
    px(g, 22, 10, 1, 2, 0x5A5A5A);  // jagged right
    px(g, 15, 7, 1, 1, 0x8A8A8A);   // top nick
    px(g, 21, 12, 1, 1, 0x5A5A5A);  // bottom chip
    // Cutting edge highlight (bottom of blade)
    px(g, 14, 12, 8, 1, 0x999999);
    // Crude lashing/binding
    px(g, 17, 12, 1, 2, 0x8B7355);
    px(g, 20, 12, 1, 2, 0x8B7355);

    g.generateTexture('orc', 22 * P, 28 * P);
    g.clear();
    g.destroy();
}

export function createTrollTexture(scene) {
    const g = scene.add.graphics();
    // Troll: 28x38 pixel units → 56x76 actual

    // Feet
    px(g, 4, 35, 6, 3, 0x556B2F);
    px(g, 18, 35, 6, 3, 0x556B2F);

    // Legs — thick
    px(g, 5, 28, 5, 8, 0x6B8E23);
    px(g, 18, 28, 5, 8, 0x6B8E23);

    // Body — massive
    px(g, 3, 12, 22, 17, 0x6B8E23);

    // Belly
    px(g, 8, 18, 12, 8, 0x7CA82E);

    // Head — small
    px(g, 8, 3, 12, 9, 0x6B8E23);

    // Dumb little eyes
    px(g, 10, 6, 2, 2, 0xFFFF00);
    px(g, 16, 6, 2, 2, 0xFFFF00);
    px(g, 11, 7, 1, 1, 0x000000);
    px(g, 17, 7, 1, 1, 0x000000);

    // Mouth
    px(g, 11, 9, 6, 2, 0x000000);

    // Long hanging arms
    px(g, 0, 14, 3, 16, 0x6B8E23);
    px(g, 25, 14, 3, 16, 0x6B8E23);

    // Fists
    px(g, 0, 29, 4, 4, 0x5A7A1E);
    px(g, 24, 29, 4, 4, 0x5A7A1E);

    // Club
    px(g, 25, 12, 3, 14, 0x654321);
    px(g, 24, 6, 5, 6, 0x8B4513);
    px(g, 25, 7, 2, 2, 0xC0C0C0); // nail

    g.generateTexture('troll', 28 * P, 38 * P);
    g.clear();
    g.destroy();
}

export function createBossTexture(scene) {
    const g = scene.add.graphics();
    // Boss: 36x48 pixel units → 72x96 actual

    // Feet
    px(g, 6, 44, 7, 4, 0x333333);
    px(g, 23, 44, 7, 4, 0x333333);

    // Legs
    px(g, 7, 36, 6, 9, 0x444444);
    px(g, 23, 36, 6, 9, 0x444444);

    // Body — heavy armor
    px(g, 4, 16, 28, 21, 0x1A1A2E);

    // Armor plates
    px(g, 5, 17, 12, 10, 0x2A2A3E);
    px(g, 19, 17, 12, 10, 0x2A2A3E);

    // Skull on chest
    px(g, 13, 19, 10, 7, 0xFF4444);
    px(g, 14, 20, 3, 3, 0x1A1A2E);
    px(g, 19, 20, 3, 3, 0x1A1A2E);
    px(g, 15, 24, 6, 1, 0x1A1A2E);

    // Pauldrons
    px(g, 1, 14, 6, 6, 0x2A2A3E);
    px(g, 29, 14, 6, 6, 0x2A2A3E);
    // Spikes
    px(g, 2, 10, 2, 5, 0x444444);
    px(g, 32, 10, 2, 5, 0x444444);

    // Head
    px(g, 10, 4, 16, 12, 0x228B22);

    // Crown
    px(g, 8, 1, 20, 4, 0x333333);
    px(g, 11, 1, 3, 2, 0xFF4444);
    px(g, 18, 1, 3, 2, 0xFF4444);
    px(g, 25, 1, 3, 2, 0xFF4444);
    // Crown spikes
    px(g, 10, 0, 2, 2, 0x333333);
    px(g, 16, 0, 2, 3, 0x333333);
    px(g, 24, 0, 2, 2, 0x333333);

    // Glowing red eyes
    px(g, 12, 8, 4, 2, 0xFF0000);
    px(g, 20, 8, 4, 2, 0xFF0000);
    px(g, 13, 8, 2, 1, 0xFF6666);
    px(g, 21, 8, 2, 1, 0xFF6666);

    // Mouth + fangs
    px(g, 14, 12, 8, 2, 0x000000);
    px(g, 15, 12, 2, 2, 0xFFFFFF);
    px(g, 19, 12, 2, 2, 0xFFFFFF);

    // Great axe
    px(g, 32, 10, 2, 26, 0x654321);
    px(g, 30, 5, 6, 8, 0x555555);
    px(g, 28, 6, 2, 6, 0x666666);
    px(g, 32, 8, 2, 2, 0xFF4444);

    g.generateTexture('boss', 36 * P, 48 * P);
    g.clear();
    g.destroy();
}

// ─── Item Sprites ────────────────────────────────────────────────────────────

export function createItemTextures(scene) {
    const g = scene.add.graphics();

    // Health potion
    px(g, 2, 3, 4, 5, 0xFF0000);
    px(g, 2, 3, 4, 2, 0xCC0000);
    px(g, 3, 1, 2, 2, 0x8B4513);
    px(g, 3, 2, 2, 1, 0xFFD700);
    px(g, 3, 4, 1, 2, 0xFF6666); // shine
    g.generateTexture('health-potion', 8 * P, 8 * P);
    g.clear();

    // Coin
    px(g, 1, 1, 6, 6, 0xFFD700);
    px(g, 1, 1, 6, 1, 0xDAA520);
    px(g, 1, 6, 6, 1, 0xDAA520);
    px(g, 1, 1, 1, 6, 0xDAA520);
    px(g, 6, 1, 1, 6, 0xDAA520);
    px(g, 2, 2, 2, 2, 0xFFE44D);
    g.generateTexture('coin', 8 * P, 8 * P);
    g.clear();

    // Power star
    px(g, 3, 0, 2, 2, 0xFFFF00);
    px(g, 1, 2, 6, 2, 0xFFFF00);
    px(g, 0, 4, 8, 2, 0xFFFF00);
    px(g, 1, 6, 2, 2, 0xFFFF00);
    px(g, 5, 6, 2, 2, 0xFFFF00);
    px(g, 3, 2, 2, 2, 0xFFFFAA);
    g.generateTexture('power-star', 8 * P, 8 * P);
    g.clear();

    // Heart (for HUD)
    px(g, 1, 1, 2, 2, 0xFF0000);
    px(g, 4, 1, 2, 2, 0xFF0000);
    px(g, 0, 2, 7, 2, 0xFF0000);
    px(g, 1, 4, 5, 2, 0xFF0000);
    px(g, 2, 6, 3, 1, 0xFF0000);
    px(g, 3, 7, 1, 1, 0xFF0000);
    px(g, 1, 1, 2, 1, 0xFF4444); // shine
    g.generateTexture('heart', 7 * P, 8 * P);
    g.clear();

    // Empty heart
    px(g, 1, 1, 2, 2, 0x444444);
    px(g, 4, 1, 2, 2, 0x444444);
    px(g, 0, 2, 7, 2, 0x444444);
    px(g, 1, 4, 5, 2, 0x444444);
    px(g, 2, 6, 3, 1, 0x444444);
    px(g, 3, 7, 1, 1, 0x444444);
    g.generateTexture('heart-empty', 7 * P, 8 * P);
    g.clear();

    g.destroy();
}

// ─── Environment Sprites ─────────────────────────────────────────────────────

export function createEnvironmentTextures(scene) {
    const g = scene.add.graphics();

    // Platform (stone)
    px(g, 0, 0, 48, 12, 0x696969);
    px(g, 0, 0, 48, 2, 0x808080);
    px(g, 0, 10, 48, 2, 0x585858);
    px(g, 10, 3, 1, 5, 0x555555);
    px(g, 25, 2, 1, 7, 0x555555);
    px(g, 38, 4, 1, 4, 0x555555);
    // Moss
    px(g, 0, 0, 3, 1, 0x228B22);
    px(g, 20, 0, 4, 1, 0x228B22);
    px(g, 40, 0, 5, 1, 0x228B22);
    g.generateTexture('platform', 48 * P, 12 * P);
    g.clear();

    // Small platform
    px(g, 0, 0, 24, 10, 0x696969);
    px(g, 0, 0, 24, 2, 0x808080);
    px(g, 0, 8, 24, 2, 0x585858);
    g.generateTexture('platform-small', 24 * P, 10 * P);
    g.clear();

    // Torch base
    px(g, 1, 4, 2, 7, 0x8B4513);
    px(g, 0, 9, 4, 2, 0x654321);
    g.generateTexture('torch-base', 4 * P, 11 * P);
    g.clear();

    // Decorative banner
    px(g, 0, 0, 6, 12, 0x8B0000);
    px(g, 1, 1, 4, 1, 0xFFD700);
    px(g, 2, 4, 2, 2, 0xFFD700);
    px(g, 1, 9, 2, 1, 0xFFD700);
    px(g, 3, 9, 2, 1, 0xFFD700);
    g.generateTexture('banner', 6 * P, 12 * P);
    g.clear();

    g.destroy();
}

// ─── Particle Textures ──────────────────────────────────────────────────────

export function createParticleTextures(scene) {
    const g = scene.add.graphics();
    const S = 4;

    g.fillStyle(0xFFFFFF); g.fillRect(0, 0, S, S);
    g.generateTexture('particle-white', S, S); g.clear();

    g.fillStyle(0xFF0000); g.fillRect(0, 0, S, S);
    g.generateTexture('particle-red', S, S); g.clear();

    g.fillStyle(0x00FF00); g.fillRect(0, 0, S, S);
    g.generateTexture('particle-green', S, S); g.clear();

    g.fillStyle(0xFFD700); g.fillRect(0, 0, S, S);
    g.generateTexture('particle-yellow', S, S); g.clear();

    g.fillStyle(0xFF8C00); g.fillRect(0, 0, S, S);
    g.generateTexture('particle-orange', S, S); g.clear();

    g.fillStyle(0x333333); g.fillRect(0, 0, 6, 6);
    g.generateTexture('particle-dark', 6, 6); g.clear();

    g.destroy();
}
