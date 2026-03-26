// High-resolution procedural sprite generation
// Generates detailed sprites using canvas drawing with gradients, shading, and fine detail
// Each sprite is drawn at high resolution (64x64 to 128x128+) for a polished pixel-art look

function hexToRgb(hex) {
    return { r: (hex >> 16) & 0xFF, g: (hex >> 8) & 0xFF, b: hex & 0xFF };
}
function rgbToHex(r, g, b) { return (r << 16) | (g << 8) | b; }
function lighten(hex, amt) {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(Math.min(255, r + amt), Math.min(255, g + amt), Math.min(255, b + amt));
}
function darken(hex, amt) {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(Math.max(0, r - amt), Math.max(0, g - amt), Math.max(0, b - amt));
}
function cs(hex) { return '#' + hex.toString(16).padStart(6, '0'); }

function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function makeTex(scene, key, w, h, drawFn) {
    const canvas = scene.textures.createCanvas(key, w, h);
    const ctx = canvas.getContext();
    drawFn(ctx, w, h);
    canvas.refresh();
}

function drawBox(ctx, x, y, w, h, fill, stroke, r, lw) {
    r = r || 2; lw = lw === undefined ? 1 : lw;
    roundRect(ctx, x, y, w, h, r);
    if (fill) { ctx.fillStyle = cs(fill); ctx.fill(); }
    if (stroke) { ctx.strokeStyle = cs(stroke); ctx.lineWidth = lw; ctx.stroke(); }
}

// ──────────────────────────────────────────────────────────────────────────────
// Dwarf Sprites (64x64)
// ──────────────────────────────────────────────────────────────────────────────

const DW = 64, DH = 64;

function drawDwarfBase(ctx, W, H, opts) {
    const { legOffset, armAngle, jumping } = Object.assign(
        { legOffset: 0, armAngle: 0, jumping: false }, opts
    );
    const cx = W / 2;

    // === BOOTS ===
    const bootY = 52 + (jumping ? -2 : 0);
    const ls = 4 + legOffset;
    drawBox(ctx, cx - 14 - ls, bootY, 11, 8, 0x5C3A1E, darken(0x5C3A1E, 20), 2, 1);
    ctx.fillStyle = cs(0x7A4E2A); ctx.fillRect(cx - 13 - ls, bootY + 1, 4, 2);
    drawBox(ctx, cx + 3 + ls, bootY, 11, 8, 0x5C3A1E, darken(0x5C3A1E, 20), 2, 1);
    ctx.fillStyle = cs(0x7A4E2A); ctx.fillRect(cx + 4 + ls, bootY + 1, 4, 2);
    ctx.fillStyle = cs(darken(0x5C3A1E, 30));
    ctx.fillRect(cx - 14 - ls, bootY + 6, 11, 2);
    ctx.fillRect(cx + 3 + ls, bootY + 6, 11, 2);

    // === LEGS ===
    drawBox(ctx, cx - 11 - ls, 42, 8, 12, 0x6B4226, darken(0x6B4226, 20), 1, 1);
    drawBox(ctx, cx + 3 + ls, 42, 8, 12, 0x6B4226, darken(0x6B4226, 20), 1, 1);
    ctx.fillStyle = cs(lighten(0x6B4226, 20));
    ctx.fillRect(cx - 9 - ls, 44, 3, 2);
    ctx.fillRect(cx + 5 + ls, 44, 3, 2);

    // === BODY / CHAINMAIL TUNIC ===
    const tc = 0xC49A2E;
    drawBox(ctx, cx - 16, 22, 32, 22, tc, darken(tc, 30), 3, 1);
    // Chainmail ring pattern
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 8; col++) {
            const mx = cx - 14 + col * 4, my = 24 + row * 3;
            const rc = (row + col) % 2 === 0 ? darken(tc, 15) : lighten(tc, 10);
            ctx.fillStyle = cs(rc);
            ctx.beginPath(); ctx.arc(mx, my, 1.2, 0, Math.PI * 2); ctx.fill();
        }
    }
    // Body shading gradient
    const bg = ctx.createLinearGradient(cx - 16, 22, cx + 16, 22);
    bg.addColorStop(0, 'rgba(0,0,0,0.15)');
    bg.addColorStop(0.3, 'rgba(0,0,0,0)');
    bg.addColorStop(0.7, 'rgba(0,0,0,0)');
    bg.addColorStop(1, 'rgba(0,0,0,0.1)');
    ctx.fillStyle = bg; ctx.fillRect(cx - 16, 22, 32, 22);

    // === BELT ===
    drawBox(ctx, cx - 16, 40, 32, 4, 0x654321, darken(0x654321, 20), 1, 1);
    drawBox(ctx, cx - 4, 39, 8, 5, 0xFFD700, 0xB8860B, 1, 1);
    ctx.fillStyle = cs(0xFFF0AA); ctx.fillRect(cx - 2, 40, 2, 3);
    ctx.fillStyle = cs(darken(0xFFD700, 20)); ctx.fillRect(cx + 1, 40, 2, 3);

    // === ARMS ===
    const sc = 0x9A7209;
    // Left arm
    ctx.save(); ctx.translate(cx - 16, 27); ctx.rotate((armAngle * Math.PI) / 180);
    drawBox(ctx, -8, -3, 9, 14, sc, darken(sc, 20), 2, 1);
    ctx.fillStyle = cs(lighten(sc, 15)); ctx.fillRect(-6, -1, 3, 2);
    drawBox(ctx, -7, 10, 7, 5, 0xFDB797, darken(0xFDB797, 20), 2, 1);
    ctx.restore();
    // Right arm
    ctx.save(); ctx.translate(cx + 16, 27); ctx.rotate((-armAngle * Math.PI) / 180);
    drawBox(ctx, -1, -3, 9, 14, sc, darken(sc, 20), 2, 1);
    ctx.fillStyle = cs(lighten(sc, 15)); ctx.fillRect(1, -1, 3, 2);
    drawBox(ctx, 0, 10, 7, 5, 0xFDB797, darken(0xFDB797, 20), 2, 1);
    ctx.restore();

    // === HEAD ===
    const sk = 0xFDB797;
    drawBox(ctx, cx - 11, 6, 22, 18, sk, darken(sk, 25), 4, 1);
    const fg = ctx.createRadialGradient(cx - 2, 12, 2, cx, 15, 14);
    fg.addColorStop(0, 'rgba(255,220,180,0.2)');
    fg.addColorStop(1, 'rgba(0,0,0,0.08)');
    ctx.fillStyle = fg; ctx.fillRect(cx - 11, 6, 22, 18);

    // === BEARD ===
    const bc = 0xCD853F;
    drawBox(ctx, cx - 14, 16, 28, 10, bc, darken(bc, 20), 4, 1);
    drawBox(ctx, cx - 10, 24, 20, 6, bc, darken(bc, 20), 3, 1);
    drawBox(ctx, cx - 8, 28, 5, 5, lighten(bc, 20), darken(bc, 20), 2, 1);
    drawBox(ctx, cx + 3, 28, 5, 5, lighten(bc, 20), darken(bc, 20), 2, 1);
    ctx.fillStyle = cs(0xB8860B);
    ctx.fillRect(cx - 7, 30, 4, 2); ctx.fillRect(cx + 4, 30, 4, 2);
    // Beard texture strands
    ctx.strokeStyle = cs(darken(bc, 20)); ctx.lineWidth = 0.5;
    for (let i = 0; i < 6; i++) {
        ctx.beginPath(); ctx.moveTo(cx - 10 + i * 4, 18);
        ctx.quadraticCurveTo(cx - 9 + i * 4, 25, cx - 8 + i * 4, 29); ctx.stroke();
    }

    // === EYES ===
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(cx - 8, 11, 5, 4); ctx.fillRect(cx + 3, 11, 5, 4);
    ctx.fillStyle = cs(0x4169E1);
    ctx.fillRect(cx - 6, 12, 3, 3); ctx.fillRect(cx + 4, 12, 3, 3);
    ctx.fillStyle = '#000000';
    ctx.fillRect(cx - 5, 12, 2, 2); ctx.fillRect(cx + 5, 12, 2, 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(cx - 6, 11, 1, 1); ctx.fillRect(cx + 4, 11, 1, 1);

    // === EYEBROWS ===
    ctx.fillStyle = cs(0xB8860B);
    ctx.fillRect(cx - 9, 9, 6, 2); ctx.fillRect(cx + 3, 9, 6, 2);

    // === NOSE ===
    drawBox(ctx, cx - 2, 14, 4, 3, lighten(sk, 5), darken(sk, 25), 2, 0.5);

    // === HELMET ===
    const hc = 0xB0B0B0;
    drawBox(ctx, cx - 14, 1, 28, 10, hc, darken(hc, 30), 5, 1);
    drawBox(ctx, cx - 17, 8, 34, 4, darken(hc, 10), darken(hc, 30), 2, 1);
    ctx.fillStyle = cs(lighten(hc, 40)); ctx.fillRect(cx - 8, 3, 16, 2);
    // Helmet rivets
    ctx.fillStyle = cs(lighten(hc, 30));
    for (let i = 0; i < 5; i++) {
        ctx.beginPath(); ctx.arc(cx - 12 + i * 6, 10, 1, 0, Math.PI * 2); ctx.fill();
    }

    // === HORNS ===
    function drawHorn(flip) {
        ctx.save();
        ctx.translate(flip ? cx + 14 : cx - 14, 6);
        ctx.rotate(flip ? 0.2 : -0.2);
        const dir = flip ? 1 : -1;
        const hg = ctx.createLinearGradient(0, 0, 0, -14);
        hg.addColorStop(0, cs(0xFFF8DC));
        hg.addColorStop(0.6, cs(0xFFD700));
        hg.addColorStop(1, cs(lighten(0xFFD700, 30)));
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.moveTo(-2 * dir, 2);
        ctx.quadraticCurveTo(-6 * dir, -6, -3 * dir, -14);
        ctx.quadraticCurveTo(-1 * dir, -6, 3 * dir, 2);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = cs(darken(0xFFF8DC, 30)); ctx.lineWidth = 0.5; ctx.stroke();
        // Horn growth rings
        ctx.strokeStyle = cs(darken(0xFFF8DC, 15)); ctx.lineWidth = 0.5;
        for (let r = 0; r < 4; r++) {
            ctx.beginPath();
            ctx.moveTo(-4 * dir + r * 0.3 * dir, -2 - r * 3);
            ctx.lineTo(1 * dir - r * 0.1 * dir, -2 - r * 3);
            ctx.stroke();
        }
        ctx.restore();
    }
    drawHorn(false);
    drawHorn(true);
}

export function createDwarfTextures(scene) {
    makeTex(scene, 'dwarf-stand', DW, DH, (ctx) => {
        drawDwarfBase(ctx, DW, DH, { legOffset: 0, armAngle: 0 });
    });
    makeTex(scene, 'dwarf-walk1', DW, DH, (ctx) => {
        drawDwarfBase(ctx, DW, DH, { legOffset: 3, armAngle: 15 });
    });
    makeTex(scene, 'dwarf-walk2', DW, DH, (ctx) => {
        drawDwarfBase(ctx, DW, DH, { legOffset: -3, armAngle: -15 });
    });
    makeTex(scene, 'dwarf-jump', DW, DH, (ctx) => {
        drawDwarfBase(ctx, DW, DH, { legOffset: 2, armAngle: -25, jumping: true });
    });
    makeTex(scene, 'dwarf-hit', DW, DH, (ctx) => {
        ctx.fillStyle = '#FFFFFF';
        roundRect(ctx, 8, 0, 48, 60, 6); ctx.fill();
    });

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

// ──────────────────────────────────────────────────────────────────────────────
// Dwarven War Axe (48x48) — single-bladed axe with thick wedge blade,
// flat poll on bottom, studded handle, gold inlay
// ──────────────────────────────────────────────────────────────────────────────

export function createAxeTexture(scene) {
    makeTex(scene, 'axe', 48, 48, (ctx) => {
        const cy = 24;

        // ── HANDLE ──────────────────────────────────────────────────────
        const hg = ctx.createLinearGradient(0, cy - 3, 0, cy + 3);
        hg.addColorStop(0, cs(0x9A6830));
        hg.addColorStop(0.3, cs(0x845828));
        hg.addColorStop(0.7, cs(0x6B4226));
        hg.addColorStop(1, cs(0x5C3A1E));
        ctx.fillStyle = hg;
        roundRect(ctx, 0, cy - 3, 22, 6, 2); ctx.fill();
        ctx.strokeStyle = cs(0x3E2710); ctx.lineWidth = 0.7;
        roundRect(ctx, 0, cy - 3, 22, 6, 2); ctx.stroke();
        // Wood grain
        ctx.strokeStyle = cs(0x5A3818); ctx.lineWidth = 0.3;
        ctx.beginPath(); ctx.moveTo(2, cy - 1); ctx.lineTo(20, cy - 1); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(3, cy + 1); ctx.lineTo(19, cy + 1); ctx.stroke();
        // Studs
        for (let i = 0; i < 4; i++) {
            const sx = 4 + i * 5;
            ctx.fillStyle = cs(0x8A7A60);
            ctx.beginPath(); ctx.arc(sx, cy, 1.8, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = cs(0xC0B080);
            ctx.beginPath(); ctx.arc(sx - 0.4, cy - 0.5, 0.7, 0, Math.PI * 2); ctx.fill();
        }

        // ── POMMEL ──────────────────────────────────────────────────────
        ctx.fillStyle = cs(0x707070);
        ctx.fillRect(0, cy - 4, 2, 8);
        ctx.fillStyle = cs(0x999999);
        ctx.fillRect(0, cy - 2, 1, 4);

        // ── COLLAR — thick metal socket ─────────────────────────────────
        const colg = ctx.createLinearGradient(20, cy - 8, 20, cy + 8);
        colg.addColorStop(0, cs(0x888888));
        colg.addColorStop(0.5, cs(0xA0A0A0));
        colg.addColorStop(1, cs(0x666666));
        ctx.fillStyle = colg;
        ctx.fillRect(20, cy - 7, 6, 14);
        ctx.strokeStyle = cs(0x505050); ctx.lineWidth = 0.7;
        ctx.strokeRect(20, cy - 7, 6, 14);
        ctx.strokeStyle = cs(0x777777); ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(23, cy - 7); ctx.lineTo(23, cy + 7); ctx.stroke();
        ctx.fillStyle = cs(0xC0C0C0);
        ctx.beginPath(); ctx.arc(23, cy - 5, 1.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(23, cy + 5, 1.2, 0, Math.PI * 2); ctx.fill();

        // ── BLADE — single thick wedge going UP from collar ─────────────
        // Wide, heavy, chunky — sweeps up from the collar to a broad
        // curved cutting edge, then back down to a beard/lower tip
        const bg = ctx.createLinearGradient(24, cy, 46, cy - 20);
        bg.addColorStop(0, cs(0x6A7080));
        bg.addColorStop(0.2, cs(0x7A8898));
        bg.addColorStop(0.5, cs(0x8A9AAD));
        bg.addColorStop(0.8, cs(0x9AAABB));
        bg.addColorStop(1, cs(0xBBCCDD));
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.moveTo(22, cy - 7);   // top of collar
        ctx.lineTo(26, cy - 10);  // blade rises from collar
        ctx.lineTo(30, cy - 16);  // blade widens
        ctx.lineTo(36, cy - 21);  // near top of blade
        ctx.lineTo(44, cy - 23);  // top tip of cutting edge
        ctx.lineTo(47, cy - 18);  // cutting edge curves down
        ctx.lineTo(47, cy - 10);  // cutting edge continues
        ctx.lineTo(45, cy - 2);   // cutting edge lower section
        ctx.lineTo(42, cy + 3);   // beard tip (lower point)
        ctx.lineTo(36, cy + 2);   // beard curves back
        ctx.lineTo(30, cy - 1);   // back of blade, near center
        ctx.lineTo(26, cy - 1);   // approaching collar
        ctx.lineTo(22, cy - 2);   // meets collar
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = cs(0x505560); ctx.lineWidth = 0.8; ctx.stroke();

        // ── Flat face highlight ─────────────────────────────────────────
        ctx.fillStyle = 'rgba(160,180,200,0.14)';
        ctx.beginPath();
        ctx.moveTo(28, cy - 8);
        ctx.lineTo(34, cy - 16);
        ctx.lineTo(42, cy - 20);
        ctx.lineTo(44, cy - 14);
        ctx.lineTo(42, cy - 6);
        ctx.lineTo(32, cy - 3);
        ctx.closePath(); ctx.fill();

        // ── CUTTING EDGE GLEAM ──────────────────────────────────────────
        ctx.strokeStyle = cs(0xD8E8F5); ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(44, cy - 23);
        ctx.lineTo(47, cy - 18);
        ctx.lineTo(47, cy - 10);
        ctx.lineTo(45, cy - 2);
        ctx.lineTo(42, cy + 3);
        ctx.stroke();

        // ── POLL (flat back, bottom side) ───────────────────────────────
        // Small flat rectangular metal block opposite the blade
        const pg = ctx.createLinearGradient(22, cy + 2, 22, cy + 7);
        pg.addColorStop(0, cs(0x606870));
        pg.addColorStop(0.5, cs(0x707880));
        pg.addColorStop(1, cs(0x555D65));
        ctx.fillStyle = pg;
        ctx.beginPath();
        ctx.moveTo(22, cy + 2);
        ctx.lineTo(30, cy + 2);
        ctx.lineTo(32, cy + 5);
        ctx.lineTo(30, cy + 8);
        ctx.lineTo(22, cy + 7);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = cs(0x505560); ctx.lineWidth = 0.7; ctx.stroke();

        // ── GOLD INLAY on blade face ────────────────────────────────────
        ctx.strokeStyle = cs(0xD4A520); ctx.lineWidth = 1.3;
        // Diamond
        ctx.beginPath();
        ctx.moveTo(34, cy - 14);
        ctx.lineTo(37, cy - 11);
        ctx.lineTo(40, cy - 14);
        ctx.lineTo(37, cy - 17);
        ctx.closePath(); ctx.stroke();
        // Cross through diamond
        ctx.beginPath(); ctx.moveTo(34, cy - 14); ctx.lineTo(40, cy - 14); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(37, cy - 17); ctx.lineTo(37, cy - 11); ctx.stroke();

        // ── Weathering ──────────────────────────────────────────────────
        ctx.fillStyle = 'rgba(50,55,60,0.2)';
        ctx.fillRect(46, cy - 16, 1, 2);
        ctx.fillRect(45, cy - 6, 1, 1.5);
        ctx.fillRect(43, cy + 1, 1, 1.5);
    });
}

// ──────────────────────────────────────────────────────────────────────────────
// Thrown Axe (32x32) — single-bladed, smaller version
// ──────────────────────────────────────────────────────────────────────────────

export function createThrownAxeTexture(scene) {
    makeTex(scene, 'thrown-axe', 32, 32, (ctx) => {
        const cy = 16;

        // Handle
        const hg = ctx.createLinearGradient(0, cy - 2, 0, cy + 2);
        hg.addColorStop(0, cs(0x9A6830));
        hg.addColorStop(0.5, cs(0x6B4226));
        hg.addColorStop(1, cs(0x5C3A1E));
        ctx.fillStyle = hg;
        roundRect(ctx, 0, cy - 2, 13, 4, 1); ctx.fill();
        ctx.strokeStyle = cs(0x3E2710); ctx.lineWidth = 0.4;
        roundRect(ctx, 0, cy - 2, 13, 4, 1); ctx.stroke();
        // Studs
        for (let i = 0; i < 2; i++) {
            ctx.fillStyle = cs(0x8A7A60);
            ctx.beginPath(); ctx.arc(4 + i * 5, cy, 1.3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = cs(0xC0B080);
            ctx.beginPath(); ctx.arc(3.7 + i * 5, cy - 0.3, 0.5, 0, Math.PI * 2); ctx.fill();
        }

        // Pommel
        ctx.fillStyle = cs(0x707070);
        ctx.fillRect(0, cy - 3, 2, 6);

        // Collar
        const colg = ctx.createLinearGradient(12, cy - 5, 12, cy + 5);
        colg.addColorStop(0, cs(0x888888));
        colg.addColorStop(0.5, cs(0xA0A0A0));
        colg.addColorStop(1, cs(0x666666));
        ctx.fillStyle = colg;
        ctx.fillRect(12, cy - 5, 4, 10);
        ctx.strokeStyle = cs(0x505050); ctx.lineWidth = 0.4;
        ctx.strokeRect(12, cy - 5, 4, 10);
        ctx.fillStyle = cs(0xBBBBBB);
        ctx.beginPath(); ctx.arc(14, cy - 3, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(14, cy + 3, 0.8, 0, Math.PI * 2); ctx.fill();

        // Blade — single wedge going UP
        const bg = ctx.createLinearGradient(15, cy, 31, cy - 14);
        bg.addColorStop(0, cs(0x6A7080));
        bg.addColorStop(0.5, cs(0x8A9AAD));
        bg.addColorStop(1, cs(0xBBCCDD));
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.moveTo(14, cy - 5);    // top of collar
        ctx.lineTo(17, cy - 7);    // blade rises
        ctx.lineTo(21, cy - 11);   // widens
        ctx.lineTo(26, cy - 14);   // near top
        ctx.lineTo(30, cy - 15);   // top tip
        ctx.lineTo(31, cy - 11);   // edge curves down
        ctx.lineTo(31, cy - 5);    // edge continues
        ctx.lineTo(30, cy);        // lower edge
        ctx.lineTo(28, cy + 2);    // beard tip
        ctx.lineTo(24, cy + 1);    // beard back
        ctx.lineTo(19, cy - 1);    // back toward center
        ctx.lineTo(14, cy - 1);    // meets collar
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = cs(0x505560); ctx.lineWidth = 0.5; ctx.stroke();

        // Poll (flat back bottom)
        ctx.fillStyle = cs(0x687078);
        ctx.beginPath();
        ctx.moveTo(14, cy + 1);
        ctx.lineTo(20, cy + 1);
        ctx.lineTo(21, cy + 4);
        ctx.lineTo(19, cy + 5);
        ctx.lineTo(14, cy + 5);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = cs(0x505560); ctx.lineWidth = 0.4; ctx.stroke();

        // Edge gleam
        ctx.strokeStyle = cs(0xD8E8F5); ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(30, cy - 15);
        ctx.lineTo(31, cy - 11);
        ctx.lineTo(31, cy - 5);
        ctx.lineTo(30, cy);
        ctx.lineTo(28, cy + 2);
        ctx.stroke();

        // Gold diamond inlay
        ctx.strokeStyle = cs(0xD4A520); ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(22, cy - 9); ctx.lineTo(24, cy - 7);
        ctx.lineTo(26, cy - 9); ctx.lineTo(24, cy - 11);
        ctx.closePath(); ctx.stroke();
    });
}

// ──────────────────────────────────────────────────────────────────────────────
// Goblin (48x56)
// ──────────────────────────────────────────────────────────────────────────────

export function createGoblinTexture(scene) {
    makeTex(scene, 'goblin', 48, 56, (ctx) => {
        const cx = 24;

        // Feet
        drawBox(ctx, cx - 12, 48, 8, 6, 0x355E3B, darken(0x355E3B, 20), 2, 1);
        drawBox(ctx, cx + 4, 48, 8, 6, 0x355E3B, darken(0x355E3B, 20), 2, 1);
        ctx.fillStyle = cs(0x2D5033);
        ctx.fillRect(cx - 13, 52, 2, 2); ctx.fillRect(cx + 11, 52, 2, 2);

        // Legs
        drawBox(ctx, cx - 9, 38, 6, 12, 0x228B22, darken(0x228B22, 15), 1, 1);
        drawBox(ctx, cx + 3, 38, 6, 12, 0x228B22, darken(0x228B22, 15), 1, 1);

        // Body with shading
        drawBox(ctx, cx - 12, 20, 24, 20, 0x32CD32, darken(0x32CD32, 20), 3, 1);
        const bbg = ctx.createLinearGradient(cx - 12, 20, cx + 12, 20);
        bbg.addColorStop(0, 'rgba(0,0,0,0.12)');
        bbg.addColorStop(0.5, 'rgba(0,0,0,0)');
        bbg.addColorStop(1, 'rgba(0,0,0,0.08)');
        ctx.fillStyle = bbg; ctx.fillRect(cx - 12, 20, 24, 20);

        // Loincloth with stitching
        drawBox(ctx, cx - 12, 34, 24, 6, 0x8B4513, darken(0x8B4513, 20), 1, 1);
        ctx.strokeStyle = cs(0x654321); ctx.lineWidth = 0.5;
        ctx.setLineDash([2, 2]);
        ctx.beginPath(); ctx.moveTo(cx - 10, 36); ctx.lineTo(cx + 10, 36); ctx.stroke();
        ctx.setLineDash([]);

        // Head - oversized goblin head
        drawBox(ctx, cx - 14, 2, 28, 20, 0x32CD32, darken(0x32CD32, 20), 6, 1);
        const ffg = ctx.createRadialGradient(cx, 10, 2, cx, 12, 15);
        ffg.addColorStop(0, 'rgba(80,255,80,0.1)');
        ffg.addColorStop(1, 'rgba(0,0,0,0.08)');
        ctx.fillStyle = ffg; ctx.fillRect(cx - 14, 2, 28, 20);

        // Pointy ears with inner coloring
        ctx.fillStyle = cs(0x2EB82E);
        ctx.beginPath(); ctx.moveTo(cx - 14, 6); ctx.lineTo(cx - 22, 3);
        ctx.lineTo(cx - 14, 14); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = cs(darken(0x2EB82E, 20)); ctx.lineWidth = 0.5; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + 14, 6); ctx.lineTo(cx + 22, 3);
        ctx.lineTo(cx + 14, 14); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Inner ear highlight
        ctx.fillStyle = cs(lighten(0x2EB82E, 30));
        ctx.beginPath(); ctx.moveTo(cx - 14, 8); ctx.lineTo(cx - 19, 5);
        ctx.lineTo(cx - 14, 12); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + 14, 8); ctx.lineTo(cx + 19, 5);
        ctx.lineTo(cx + 14, 12); ctx.closePath(); ctx.fill();

        // Big menacing yellow eyes
        ctx.fillStyle = cs(0xFFFF00);
        ctx.beginPath(); ctx.ellipse(cx - 6, 10, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + 6, 10, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
        // Slit pupils
        ctx.fillStyle = '#000000';
        ctx.fillRect(cx - 7, 9, 2, 4); ctx.fillRect(cx + 5, 9, 2, 4);
        // Eye outlines
        ctx.strokeStyle = cs(darken(0xFFFF00, 60)); ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.ellipse(cx - 6, 10, 4, 3, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(cx + 6, 10, 4, 3, 0, 0, Math.PI * 2); ctx.stroke();

        // Toothy grin
        ctx.fillStyle = '#000000';
        roundRect(ctx, cx - 8, 16, 16, 4, 2); ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 4; i++) ctx.fillRect(cx - 6 + i * 4, 16, 2, 2);

        // Nose bumps
        ctx.fillStyle = cs(lighten(0x32CD32, 10));
        ctx.beginPath(); ctx.arc(cx - 2, 13, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 2, 13, 1.5, 0, Math.PI * 2); ctx.fill();

        // Thin arms
        drawBox(ctx, cx - 18, 22, 6, 12, 0x32CD32, darken(0x32CD32, 15), 2, 1);
        drawBox(ctx, cx + 12, 22, 6, 12, 0x32CD32, darken(0x32CD32, 15), 2, 1);

        // Dagger in right hand
        ctx.fillStyle = cs(0xC0C0C0);
        ctx.beginPath(); ctx.moveTo(cx + 16, 22); ctx.lineTo(cx + 18, 14);
        ctx.lineTo(cx + 14, 22); ctx.closePath(); ctx.fill();
        drawBox(ctx, cx + 14, 32, 4, 5, 0x8B4513, 0x654321, 1, 0.5);
        ctx.fillStyle = cs(0xDAA520); ctx.fillRect(cx + 13, 31, 6, 2);
    });
}

// ──────────────────────────────────────────────────────────────────────────────
// Orc (56x68)
// ──────────────────────────────────────────────────────────────────────────────

export function createOrcTexture(scene) {
    makeTex(scene, 'orc', 56, 68, (ctx) => {
        const cx = 28;

        // Boots
        drawBox(ctx, cx - 14, 60, 10, 6, 0x4A3728, darken(0x4A3728, 15), 2, 1);
        drawBox(ctx, cx + 4, 60, 10, 6, 0x4A3728, darken(0x4A3728, 15), 2, 1);
        ctx.fillStyle = cs(0x3E2710);
        ctx.fillRect(cx - 12, 62, 8, 1); ctx.fillRect(cx + 6, 62, 8, 1);

        // Legs
        drawBox(ctx, cx - 10, 48, 8, 14, 0x006400, darken(0x006400, 15), 2, 1);
        drawBox(ctx, cx + 2, 48, 8, 14, 0x006400, darken(0x006400, 15), 2, 1);

        // Hulking body
        drawBox(ctx, cx - 16, 22, 32, 28, 0x228B22, darken(0x228B22, 20), 4, 1);

        // Armor chestplate with gradient
        const ag = ctx.createLinearGradient(cx - 14, 24, cx + 14, 24);
        ag.addColorStop(0, cs(0x555555)); ag.addColorStop(0.3, cs(0x777777));
        ag.addColorStop(0.7, cs(0x666666)); ag.addColorStop(1, cs(0x4A4A4A));
        ctx.fillStyle = ag;
        roundRect(ctx, cx - 14, 24, 28, 16, 3); ctx.fill();
        ctx.strokeStyle = cs(0x444444); ctx.lineWidth = 1;
        roundRect(ctx, cx - 14, 24, 28, 16, 3); ctx.stroke();
        // Center plate line
        ctx.strokeStyle = cs(0x555555); ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(cx, 24); ctx.lineTo(cx, 40); ctx.stroke();
        // Armor rivets
        ctx.fillStyle = cs(0x888888);
        for (let i = 0; i < 3; i++) {
            ctx.beginPath(); ctx.arc(cx - 10 + i * 10, 26, 1.5, 0, Math.PI * 2); ctx.fill();
        }

        // Belt
        drawBox(ctx, cx - 16, 46, 32, 4, 0x654321, darken(0x654321, 15), 1, 1);
        drawBox(ctx, cx - 3, 45, 6, 5, 0xC0C0C0, 0x888888, 1, 1);

        // Head
        drawBox(ctx, cx - 14, 4, 28, 20, 0x228B22, darken(0x228B22, 20), 5, 1);
        // Jaw / underbite
        drawBox(ctx, cx - 10, 18, 20, 6, 0x1E7B1E, darken(0x1E7B1E, 15), 3, 1);

        // Tusks curving upward
        ctx.fillStyle = cs(0xFFF8DC);
        ctx.beginPath(); ctx.moveTo(cx - 8, 18); ctx.lineTo(cx - 10, 12);
        ctx.lineTo(cx - 6, 18); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = cs(darken(0xFFF8DC, 30)); ctx.lineWidth = 0.5; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + 8, 18); ctx.lineTo(cx + 10, 12);
        ctx.lineTo(cx + 6, 18); ctx.closePath(); ctx.fill(); ctx.stroke();

        // Red angry eyes
        ctx.fillStyle = cs(0xFF0000);
        ctx.beginPath(); ctx.ellipse(cx - 6, 11, 4, 2.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + 6, 11, 4, 2.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.fillRect(cx - 7, 10, 2, 3); ctx.fillRect(cx + 5, 10, 2, 3);
        ctx.fillStyle = cs(0xFF6666);
        ctx.fillRect(cx - 5, 10, 1, 1); ctx.fillRect(cx + 6, 10, 1, 1);

        // Iron helmet
        const hhg = ctx.createLinearGradient(0, 0, 0, 8);
        hhg.addColorStop(0, cs(0x666666)); hhg.addColorStop(1, cs(0x444444));
        ctx.fillStyle = hhg;
        roundRect(ctx, cx - 16, 2, 32, 6, 2); ctx.fill();
        ctx.strokeStyle = cs(0x333333); ctx.lineWidth = 1;
        roundRect(ctx, cx - 16, 2, 32, 6, 2); ctx.stroke();
        // Nose guard
        ctx.fillStyle = cs(0x555555); ctx.fillRect(cx - 1, 6, 2, 6);

        // Arms with bracers
        drawBox(ctx, cx - 22, 24, 8, 18, 0x228B22, darken(0x228B22, 15), 2, 1);
        drawBox(ctx, cx + 14, 24, 8, 18, 0x228B22, darken(0x228B22, 15), 2, 1);
        drawBox(ctx, cx - 22, 36, 8, 4, 0x555555, 0x444444, 1, 1);
        drawBox(ctx, cx + 14, 36, 8, 4, 0x555555, 0x444444, 1, 1);

        // Orcish crude axe
        ctx.fillStyle = cs(0x5C3A1E);
        ctx.fillRect(cx + 20, 16, 3, 26);
        ctx.fillStyle = cs(0x3E2710);
        ctx.fillRect(cx + 20, 20, 3, 1);
        ctx.fillRect(cx + 20, 26, 3, 1);
        ctx.fillRect(cx + 20, 32, 3, 1);
        // Axe head
        const oag = ctx.createLinearGradient(cx + 16, 10, cx + 30, 10);
        oag.addColorStop(0, cs(0x6B6B6B));
        oag.addColorStop(0.5, cs(0x888888));
        oag.addColorStop(1, cs(0x7A7A7A));
        ctx.fillStyle = oag;
        ctx.beginPath();
        ctx.moveTo(cx + 20, 16); ctx.lineTo(cx + 16, 10); ctx.lineTo(cx + 28, 8);
        ctx.lineTo(cx + 30, 14); ctx.lineTo(cx + 28, 20); ctx.lineTo(cx + 16, 18);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = cs(0x555555); ctx.lineWidth = 0.5; ctx.stroke();
        // Edge nicks
        ctx.fillStyle = cs(0x5A5A5A);
        ctx.fillRect(cx + 28, 11, 2, 1);
        ctx.fillRect(cx + 27, 15, 1, 2);
    });
}

// ──────────────────────────────────────────────────────────────────────────────
// Troll (68x92)
// ──────────────────────────────────────────────────────────────────────────────

export function createTrollTexture(scene) {
    makeTex(scene, 'troll', 68, 92, (ctx) => {
        const cx = 34;

        // Massive feet
        drawBox(ctx, cx - 18, 82, 14, 8, 0x556B2F, darken(0x556B2F, 15), 3, 1);
        drawBox(ctx, cx + 4, 82, 14, 8, 0x556B2F, darken(0x556B2F, 15), 3, 1);

        // Thick tree-trunk legs
        drawBox(ctx, cx - 14, 62, 12, 22, 0x6B8E23, darken(0x6B8E23, 15), 3, 1);
        drawBox(ctx, cx + 2, 62, 12, 22, 0x6B8E23, darken(0x6B8E23, 15), 3, 1);

        // Massive barrel body
        drawBox(ctx, cx - 22, 26, 44, 38, 0x6B8E23, darken(0x6B8E23, 20), 6, 1);
        const tbg = ctx.createRadialGradient(cx, 45, 5, cx, 45, 25);
        tbg.addColorStop(0, 'rgba(120,180,50,0.15)');
        tbg.addColorStop(1, 'rgba(0,0,0,0.1)');
        ctx.fillStyle = tbg; ctx.fillRect(cx - 22, 26, 44, 38);

        // Lighter belly
        drawBox(ctx, cx - 14, 36, 28, 20, 0x7CA82E, darken(0x7CA82E, 10), 5, 0.5);
        ctx.fillStyle = cs(darken(0x7CA82E, 20));
        ctx.beginPath(); ctx.arc(cx, 48, 2, 0, Math.PI * 2); ctx.fill();

        // Small dumb head
        drawBox(ctx, cx - 14, 6, 28, 22, 0x6B8E23, darken(0x6B8E23, 20), 6, 1);
        // Head bumps
        ctx.fillStyle = cs(lighten(0x6B8E23, 10));
        ctx.beginPath(); ctx.arc(cx - 6, 6, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 4, 4, 3, 0, Math.PI * 2); ctx.fill();

        // Yellow dumb eyes
        ctx.fillStyle = cs(0xFFFF00);
        ctx.beginPath(); ctx.ellipse(cx - 6, 14, 5, 4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + 6, 14, 5, 4, 0, 0, Math.PI * 2); ctx.fill();
        // Tiny pupils
        ctx.fillStyle = '#000000';
        ctx.beginPath(); ctx.arc(cx - 5, 15, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 5, 15, 1.5, 0, Math.PI * 2); ctx.fill();

        // Underbite mouth with teeth
        ctx.fillStyle = '#000000';
        roundRect(ctx, cx - 8, 22, 16, 5, 2); ctx.fill();
        ctx.fillStyle = '#DDDDAA';
        ctx.fillRect(cx - 5, 22, 3, 3);
        ctx.fillRect(cx + 2, 22, 3, 3);

        // Long hanging arms
        drawBox(ctx, cx - 30, 28, 10, 38, 0x6B8E23, darken(0x6B8E23, 15), 3, 1);
        drawBox(ctx, cx + 20, 28, 10, 38, 0x6B8E23, darken(0x6B8E23, 15), 3, 1);

        // Big meaty fists
        drawBox(ctx, cx - 32, 64, 12, 10, 0x5A7A1E, darken(0x5A7A1E, 15), 4, 1);
        drawBox(ctx, cx + 20, 64, 12, 10, 0x5A7A1E, darken(0x5A7A1E, 15), 4, 1);
        // Knuckle detail
        ctx.fillStyle = cs(lighten(0x5A7A1E, 15));
        for (let i = 0; i < 3; i++) {
            ctx.beginPath(); ctx.arc(cx - 28 + i * 4, 66, 1.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(cx + 24 + i * 4, 66, 1.5, 0, Math.PI * 2); ctx.fill();
        }

        // Wooden club with nails
        const clg = ctx.createLinearGradient(cx + 26, 20, cx + 26, 62);
        clg.addColorStop(0, cs(0x8B4513));
        clg.addColorStop(0.3, cs(0x654321));
        clg.addColorStop(1, cs(0x5C3A1E));
        ctx.fillStyle = clg;
        roundRect(ctx, cx + 26, 20, 6, 44, 2); ctx.fill();
        // Club head
        drawBox(ctx, cx + 23, 12, 12, 14, 0x8B4513, 0x654321, 3, 1);
        // Metal nails/spikes
        ctx.fillStyle = cs(0xC0C0C0);
        ctx.beginPath(); ctx.arc(cx + 28, 16, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 31, 20, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 26, 22, 1.5, 0, Math.PI * 2); ctx.fill();
    });
}

// ──────────────────────────────────────────────────────────────────────────────
// Boss / War Chief (84x112)
// ──────────────────────────────────────────────────────────────────────────────

export function createBossTexture(scene) {
    makeTex(scene, 'boss', 84, 112, (ctx) => {
        const cx = 42;

        // Armored boots
        drawBox(ctx, cx - 18, 100, 14, 8, 0x333333, 0x222222, 3, 1);
        drawBox(ctx, cx + 4, 100, 14, 8, 0x333333, 0x222222, 3, 1);
        ctx.fillStyle = cs(0x444444);
        ctx.fillRect(cx - 16, 100, 10, 2); ctx.fillRect(cx + 6, 100, 10, 2);

        // Armored legs
        drawBox(ctx, cx - 14, 80, 10, 22, 0x444444, 0x333333, 2, 1);
        drawBox(ctx, cx + 4, 80, 10, 22, 0x444444, 0x333333, 2, 1);
        ctx.fillStyle = cs(0x555555);
        roundRect(ctx, cx - 13, 82, 8, 10, 2); ctx.fill();
        roundRect(ctx, cx + 5, 82, 8, 10, 2); ctx.fill();

        // Heavy dark armor body
        const bbg = ctx.createLinearGradient(cx - 22, 32, cx + 22, 32);
        bbg.addColorStop(0, cs(0x161630));
        bbg.addColorStop(0.3, cs(0x22223E));
        bbg.addColorStop(0.7, cs(0x1E1E38));
        bbg.addColorStop(1, cs(0x141428));
        ctx.fillStyle = bbg;
        roundRect(ctx, cx - 24, 32, 48, 50, 5); ctx.fill();
        ctx.strokeStyle = cs(0x333355); ctx.lineWidth = 1.5;
        roundRect(ctx, cx - 24, 32, 48, 50, 5); ctx.stroke();
        // Armor detail lines
        ctx.strokeStyle = cs(0x2A2A4E); ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(cx, 34); ctx.lineTo(cx, 78); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - 22, 50); ctx.lineTo(cx + 22, 50); ctx.stroke();

        // Skull emblem on chest
        drawBox(ctx, cx - 10, 42, 20, 16, 0xFF4444, darken(0xFF4444, 30), 4, 1);
        ctx.fillStyle = cs(0x1A1A2E);
        ctx.beginPath(); ctx.ellipse(cx - 4, 48, 3, 2.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + 4, 48, 3, 2.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx, 51); ctx.lineTo(cx - 2, 53);
        ctx.lineTo(cx + 2, 53); ctx.closePath(); ctx.fill();
        ctx.fillStyle = cs(0xFF4444);
        ctx.strokeStyle = cs(0x1A1A2E); ctx.lineWidth = 0.5;
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(cx - 6 + i * 3, 55, 2, 2);
            ctx.strokeRect(cx - 6 + i * 3, 55, 2, 2);
        }

        // Spiked pauldrons (shoulder armor)
        for (const side of [-1, 1]) {
            const px = cx + side * 28;
            const pg = ctx.createRadialGradient(px, 34, 2, px, 38, 12);
            pg.addColorStop(0, cs(0x3A3A5E)); pg.addColorStop(1, cs(0x1A1A2E));
            ctx.fillStyle = pg;
            ctx.beginPath(); ctx.arc(px, 38, 12, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = cs(0x333355); ctx.lineWidth = 1; ctx.stroke();
            // Spikes
            ctx.fillStyle = cs(0x555555);
            ctx.beginPath(); ctx.moveTo(px - 4 * side, 30);
            ctx.lineTo(px - 6 * side, 20); ctx.lineTo(px, 28); ctx.closePath(); ctx.fill();
            ctx.beginPath(); ctx.moveTo(px + 4 * side, 30);
            ctx.lineTo(px + 6 * side, 20); ctx.lineTo(px + 8 * side, 28); ctx.closePath(); ctx.fill();
        }

        // War chief head
        drawBox(ctx, cx - 16, 6, 32, 28, 0x228B22, darken(0x228B22, 25), 6, 1);

        // Crown / war helmet with spikes and gems
        const crg = ctx.createLinearGradient(0, 0, 0, 10);
        crg.addColorStop(0, cs(0x555555)); crg.addColorStop(1, cs(0x333333));
        ctx.fillStyle = crg;
        roundRect(ctx, cx - 20, 2, 40, 10, 3); ctx.fill();
        ctx.strokeStyle = cs(0x444444); ctx.lineWidth = 1;
        roundRect(ctx, cx - 20, 2, 40, 10, 3); ctx.stroke();
        // Crown spikes
        ctx.fillStyle = cs(0x444444);
        for (const sx of [-10, 0, 10]) {
            ctx.beginPath();
            ctx.moveTo(cx + sx - 2, 4);
            ctx.lineTo(cx + sx, sx === 0 ? -8 : -6);
            ctx.lineTo(cx + sx + 2, 4);
            ctx.closePath(); ctx.fill();
        }
        // Red gems on spikes
        ctx.fillStyle = cs(0xFF4444);
        ctx.beginPath(); ctx.arc(cx - 10, -2, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx, -4, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 10, -2, 2, 0, Math.PI * 2); ctx.fill();
        // Gem shine
        ctx.fillStyle = cs(0xFF8888);
        ctx.beginPath(); ctx.arc(cx - 11, -3, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx - 1, -5, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 9, -3, 0.8, 0, Math.PI * 2); ctx.fill();

        // Glowing red eyes
        ctx.fillStyle = cs(0xFF0000);
        ctx.beginPath(); ctx.ellipse(cx - 6, 18, 5, 3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + 6, 18, 5, 3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = cs(0xFF6666);
        ctx.beginPath(); ctx.ellipse(cx - 5, 17, 2, 1.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + 5, 17, 2, 1.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = cs(0x880000);
        ctx.fillRect(cx - 7, 17, 2, 3); ctx.fillRect(cx + 5, 17, 2, 3);

        // Mouth with fangs
        ctx.fillStyle = '#000000';
        roundRect(ctx, cx - 8, 26, 16, 5, 2); ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath(); ctx.moveTo(cx - 6, 26); ctx.lineTo(cx - 4, 30);
        ctx.lineTo(cx - 2, 26); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + 2, 26); ctx.lineTo(cx + 4, 30);
        ctx.lineTo(cx + 6, 26); ctx.closePath(); ctx.fill();

        // Dark armored arms
        drawBox(ctx, cx - 34, 36, 12, 30, 0x1A1A2E, 0x111122, 3, 1);
        drawBox(ctx, cx + 22, 36, 12, 30, 0x1A1A2E, 0x111122, 3, 1);
        drawBox(ctx, cx - 33, 50, 10, 6, 0x333355, 0x222244, 2, 1);
        drawBox(ctx, cx + 23, 50, 10, 6, 0x333355, 0x222244, 2, 1);

        // Great axe (held in right hand)
        ctx.fillStyle = cs(0x654321);
        ctx.fillRect(cx + 32, 18, 4, 52);
        ctx.fillStyle = cs(0x3E2710);
        for (let i = 0; i < 6; i++) ctx.fillRect(cx + 32, 28 + i * 8, 4, 2);
        // Massive axe head
        const gag = ctx.createLinearGradient(cx + 28, 10, cx + 48, 10);
        gag.addColorStop(0, cs(0x555555));
        gag.addColorStop(0.5, cs(0x777777));
        gag.addColorStop(1, cs(0x666666));
        ctx.fillStyle = gag;
        ctx.beginPath();
        ctx.moveTo(cx + 34, 20);
        ctx.quadraticCurveTo(cx + 40, 6, cx + 48, 8);
        ctx.quadraticCurveTo(cx + 50, 18, cx + 48, 28);
        ctx.quadraticCurveTo(cx + 40, 30, cx + 34, 20);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = cs(0x444444); ctx.lineWidth = 1; ctx.stroke();
        // Red gem on axe
        ctx.fillStyle = cs(0xFF4444);
        ctx.beginPath(); ctx.arc(cx + 38, 19, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = cs(0xFF8888);
        ctx.beginPath(); ctx.arc(cx + 37, 18, 1, 0, Math.PI * 2); ctx.fill();
    });
}

// ──────────────────────────────────────────────────────────────────────────────
// Item Sprites
// ──────────────────────────────────────────────────────────────────────────────

export function createItemTextures(scene) {
    // Coin (16x16)
    makeTex(scene, 'coin', 16, 16, (ctx) => {
        const g = ctx.createRadialGradient(8, 8, 2, 8, 8, 7);
        g.addColorStop(0, cs(0xFFE44D));
        g.addColorStop(0.6, cs(0xFFD700));
        g.addColorStop(1, cs(0xB8860B));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(8, 8, 7, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = cs(0x996600); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(8, 8, 7, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = cs(0xDAA520); ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.arc(8, 8, 5, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = cs(0xB8860B);
        ctx.font = 'bold 8px serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('D', 8, 9);
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath(); ctx.arc(6, 6, 2, 0, Math.PI * 2); ctx.fill();
    });

    // Health potion (16x16)
    makeTex(scene, 'health-potion', 16, 16, (ctx) => {
        const pg = ctx.createLinearGradient(4, 5, 12, 5);
        pg.addColorStop(0, cs(0xCC0000));
        pg.addColorStop(0.4, cs(0xFF2222));
        pg.addColorStop(1, cs(0xAA0000));
        ctx.fillStyle = pg;
        roundRect(ctx, 4, 5, 8, 10, 2); ctx.fill();
        ctx.strokeStyle = cs(0x880000); ctx.lineWidth = 0.5;
        roundRect(ctx, 4, 5, 8, 10, 2); ctx.stroke();
        ctx.fillStyle = cs(0xCC0000); ctx.fillRect(6, 3, 4, 3);
        drawBox(ctx, 5, 1, 6, 3, 0x8B4513, 0x654321, 1, 0.5);
        ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(5, 6, 2, 6);
        ctx.fillStyle = cs(0xFFD700); ctx.fillRect(5, 10, 6, 1);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(7, 7, 2, 4); ctx.fillRect(6, 8, 4, 2);
    });

    // Power star (16x16)
    makeTex(scene, 'power-star', 16, 16, (ctx) => {
        const gg = ctx.createRadialGradient(8, 8, 1, 8, 8, 8);
        gg.addColorStop(0, 'rgba(255,255,100,0.4)');
        gg.addColorStop(1, 'rgba(255,255,0,0)');
        ctx.fillStyle = gg; ctx.fillRect(0, 0, 16, 16);
        ctx.fillStyle = cs(0xFFFF00);
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const a = (i * Math.PI) / 4 - Math.PI / 2;
            const r = i % 2 === 0 ? 7 : 3;
            ctx.lineTo(8 + r * Math.cos(a), 8 + r * Math.sin(a));
        }
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = cs(0xDAA520); ctx.lineWidth = 0.5; ctx.stroke();
        ctx.fillStyle = cs(0xFFFFAA);
        ctx.beginPath(); ctx.arc(8, 8, 2, 0, Math.PI * 2); ctx.fill();
    });

    // Heart (16x16)
    makeTex(scene, 'heart', 16, 16, (ctx) => {
        const hg = ctx.createRadialGradient(8, 7, 1, 8, 8, 8);
        hg.addColorStop(0, cs(0xFF4444));
        hg.addColorStop(0.5, cs(0xFF0000));
        hg.addColorStop(1, cs(0xCC0000));
        ctx.fillStyle = hg;
        ctx.beginPath(); ctx.moveTo(8, 14);
        ctx.bezierCurveTo(1, 10, 0, 4, 4, 2);
        ctx.bezierCurveTo(6, 1, 8, 3, 8, 5);
        ctx.bezierCurveTo(8, 3, 10, 1, 12, 2);
        ctx.bezierCurveTo(16, 4, 15, 10, 8, 14);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = cs(0x880000); ctx.lineWidth = 0.5; ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.beginPath(); ctx.ellipse(5, 5, 2, 1.5, -0.5, 0, Math.PI * 2); ctx.fill();
    });

    // Empty heart (16x16)
    makeTex(scene, 'heart-empty', 16, 16, (ctx) => {
        ctx.fillStyle = cs(0x333333);
        ctx.beginPath(); ctx.moveTo(8, 14);
        ctx.bezierCurveTo(1, 10, 0, 4, 4, 2);
        ctx.bezierCurveTo(6, 1, 8, 3, 8, 5);
        ctx.bezierCurveTo(8, 3, 10, 1, 12, 2);
        ctx.bezierCurveTo(16, 4, 15, 10, 8, 14);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = cs(0x222222); ctx.lineWidth = 0.5; ctx.stroke();
    });
}

// ──────────────────────────────────────────────────────────────────────────────
// Environment Sprites
// ──────────────────────────────────────────────────────────────────────────────

export function createEnvironmentTextures(scene) {
    // Platform - stone (96x24)
    makeTex(scene, 'platform', 96, 24, (ctx) => {
        const sg = ctx.createLinearGradient(0, 0, 0, 24);
        sg.addColorStop(0, cs(0x808080));
        sg.addColorStop(0.1, cs(0x757575));
        sg.addColorStop(0.8, cs(0x606060));
        sg.addColorStop(1, cs(0x555555));
        ctx.fillStyle = sg;
        roundRect(ctx, 0, 0, 96, 24, 3); ctx.fill();
        ctx.strokeStyle = cs(0x4A4A4A); ctx.lineWidth = 1;
        roundRect(ctx, 0, 0, 96, 24, 3); ctx.stroke();
        // Stone block mortar lines
        ctx.strokeStyle = cs(0x555555); ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(4, 10); ctx.lineTo(92, 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(20, 0); ctx.lineTo(20, 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(50, 0); ctx.lineTo(50, 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(75, 0); ctx.lineTo(75, 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(35, 10); ctx.lineTo(35, 24); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(62, 10); ctx.lineTo(62, 24); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(85, 10); ctx.lineTo(85, 24); ctx.stroke();
        // Surface highlights
        ctx.fillStyle = cs(0x8A8A8A);
        ctx.fillRect(2, 1, 16, 2); ctx.fillRect(52, 1, 20, 2); ctx.fillRect(80, 1, 10, 2);
        // Moss patches
        ctx.fillStyle = cs(0x228B22);
        ctx.fillRect(0, 0, 6, 2); ctx.fillRect(40, 0, 8, 2); ctx.fillRect(82, 0, 10, 2);
        ctx.fillStyle = cs(0x2E8B57);
        ctx.fillRect(1, 0, 3, 3); ctx.fillRect(42, 0, 4, 3);
    });

    // Small platform (48x20)
    makeTex(scene, 'platform-small', 48, 20, (ctx) => {
        const sg = ctx.createLinearGradient(0, 0, 0, 20);
        sg.addColorStop(0, cs(0x808080));
        sg.addColorStop(0.8, cs(0x606060));
        sg.addColorStop(1, cs(0x555555));
        ctx.fillStyle = sg;
        roundRect(ctx, 0, 0, 48, 20, 3); ctx.fill();
        ctx.strokeStyle = cs(0x4A4A4A); ctx.lineWidth = 1;
        roundRect(ctx, 0, 0, 48, 20, 3); ctx.stroke();
        ctx.strokeStyle = cs(0x555555); ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(4, 9); ctx.lineTo(44, 9); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(16, 0); ctx.lineTo(16, 9); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(32, 0); ctx.lineTo(32, 9); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(24, 9); ctx.lineTo(24, 20); ctx.stroke();
        ctx.fillStyle = cs(0x228B22);
        ctx.fillRect(0, 0, 4, 2); ctx.fillRect(20, 0, 6, 2);
    });

    // Torch base (12x24)
    makeTex(scene, 'torch-base', 12, 24, (ctx) => {
        const pg = ctx.createLinearGradient(3, 6, 9, 6);
        pg.addColorStop(0, cs(0x654321));
        pg.addColorStop(0.5, cs(0x8B4513));
        pg.addColorStop(1, cs(0x5C3A1E));
        ctx.fillStyle = pg;
        roundRect(ctx, 3, 6, 6, 16, 1); ctx.fill();
        ctx.strokeStyle = cs(0x3E2710); ctx.lineWidth = 0.5;
        roundRect(ctx, 3, 6, 6, 16, 1); ctx.stroke();
        // Metal rings
        ctx.fillStyle = cs(0x888888);
        ctx.fillRect(3, 8, 6, 2); ctx.fillRect(3, 14, 6, 2);
        // Base
        drawBox(ctx, 1, 20, 10, 4, 0x654321, 0x3E2710, 2, 1);
        // Fire bowl
        ctx.fillStyle = cs(0x555555);
        ctx.beginPath();
        ctx.moveTo(1, 8); ctx.lineTo(2, 4); ctx.lineTo(10, 4); ctx.lineTo(11, 8);
        ctx.closePath(); ctx.fill();
    });

    // Banner (16x28)
    makeTex(scene, 'banner', 16, 28, (ctx) => {
        // Pole
        ctx.fillStyle = cs(0xB8860B); ctx.fillRect(7, 0, 2, 28);
        // Pole cap
        ctx.fillStyle = cs(0xFFD700);
        ctx.beginPath(); ctx.arc(8, 1, 2, 0, Math.PI * 2); ctx.fill();
        // Banner cloth with gradient
        const bg = ctx.createLinearGradient(1, 3, 1, 24);
        bg.addColorStop(0, cs(0xCC0000));
        bg.addColorStop(0.5, cs(0x8B0000));
        bg.addColorStop(1, cs(0x660000));
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.moveTo(2, 3); ctx.lineTo(14, 3); ctx.lineTo(14, 22);
        ctx.lineTo(8, 18); ctx.lineTo(2, 22);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = cs(0x660000); ctx.lineWidth = 0.5; ctx.stroke();
        // Gold trim
        ctx.fillStyle = cs(0xFFD700);
        ctx.fillRect(2, 3, 12, 2);
        // Rune symbol
        ctx.font = 'bold 8px serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('\u2692', 8, 12);
    });
}

// ──────────────────────────────────────────────────────────────────────────────
// Particle Textures
// ──────────────────────────────────────────────────────────────────────────────

export function createParticleTextures(scene) {
    const particles = [
        { key: 'particle-white', color: 0xFFFFFF, size: 6 },
        { key: 'particle-red', color: 0xFF0000, size: 6 },
        { key: 'particle-green', color: 0x00FF00, size: 6 },
        { key: 'particle-yellow', color: 0xFFD700, size: 6 },
        { key: 'particle-orange', color: 0xFF8C00, size: 6 },
        { key: 'particle-dark', color: 0x333333, size: 8 },
    ];
    for (const p of particles) {
        makeTex(scene, p.key, p.size, p.size, (ctx) => {
            const { r, g, b } = hexToRgb(p.color);
            const gr = ctx.createRadialGradient(
                p.size / 2, p.size / 2, 0,
                p.size / 2, p.size / 2, p.size / 2
            );
            gr.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',1)');
            gr.addColorStop(0.6, 'rgba(' + r + ',' + g + ',' + b + ',0.6)');
            gr.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
            ctx.fillStyle = gr;
            ctx.fillRect(0, 0, p.size, p.size);
        });
    }
}
