import { chromium } from 'playwright';

const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome-stable',
    args: ['--no-sandbox', '--disable-gpu']
});

const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

// Wait for Phaser to boot and render
await page.waitForTimeout(3000);

// Take a full game screenshot (should be on title screen)
await page.screenshot({ path: 'screenshots/title-screen.png' });
console.log('Captured title screen');

// Click to start the game
await page.click('canvas');
await page.waitForTimeout(2000);

// Take gameplay screenshot
await page.screenshot({ path: 'screenshots/gameplay.png' });
console.log('Captured gameplay');

// Now extract just the axe texture by rendering it larger on a temp canvas
// We'll evaluate inside the page context to grab the axe texture data
const axeDataUrl = await page.evaluate(() => {
    // Find the Phaser game instance - check various ways it might be exposed
    let game = null;
    if (typeof Phaser !== 'undefined' && Phaser.GAMES && Phaser.GAMES.length) {
        game = Phaser.GAMES[0];
    }
    if (!game) {
        // Try finding it on the canvas
        const canvas = document.querySelector('canvas');
        if (canvas && canvas.__phaser) game = canvas.__phaser;
    }
    if (!game) {
        // Search for it on window
        for (const key of Object.keys(window)) {
            const val = window[key];
            if (val && val.textures && val.scene && val.renderer) {
                game = val;
                break;
            }
        }
    }
    if (!game) {
        return 'no-game. Phaser exists: ' + (typeof Phaser) + 
               ', GAMES: ' + (typeof Phaser !== 'undefined' ? JSON.stringify(Phaser.GAMES) : 'n/a');
    }
    
    const tex = game.textures.get('axe');
    if (!tex) return 'no-tex';
    
    const src = tex.source[0];
    if (!src) return 'no-source';
    
    const sourceEl = src.image;
    if (!sourceEl) return 'no-image: keys=' + JSON.stringify(Object.keys(src));
    
    const canvas = document.createElement('canvas');
    const scale = 8;
    canvas.width = sourceEl.width * scale;
    canvas.height = sourceEl.height * scale;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sourceEl, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
});

if (axeDataUrl && axeDataUrl.startsWith('data:')) {
    const base64 = axeDataUrl.replace(/^data:image\/png;base64,/, '');
    const fs = await import('fs');
    fs.writeFileSync('screenshots/axe-texture-8x.png', Buffer.from(base64, 'base64'));
    console.log('Captured axe texture (8x zoom)');
} else {
    console.log('Could not extract axe texture:', axeDataUrl);
}

// Also grab the thrown-axe texture
const thrownAxeDataUrl = await page.evaluate(() => {
    const game = Phaser.GAMES[0];
    if (!game) return null;
    const tex = game.textures.get('thrown-axe');
    if (!tex || !tex.source || !tex.source[0]) return null;
    const sourceEl = tex.source[0].image;
    if (!sourceEl) return null;
    const canvas = document.createElement('canvas');
    const scale = 8;
    canvas.width = sourceEl.width * scale;
    canvas.height = sourceEl.height * scale;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sourceEl, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
});

if (thrownAxeDataUrl && thrownAxeDataUrl.startsWith('data:')) {
    const base64 = thrownAxeDataUrl.replace(/^data:image\/png;base64,/, '');
    const fs = await import('fs');
    fs.writeFileSync('screenshots/thrown-axe-texture-8x.png', Buffer.from(base64, 'base64'));
    console.log('Captured thrown-axe texture (8x zoom)');
} else {
    console.log('Could not extract thrown-axe texture');
}

// Also grab the dwarf texture for reference
const dwarfDataUrl = await page.evaluate(() => {
    const game = Phaser.GAMES[0];
    if (!game) return null;
    const tex = game.textures.get('dwarf-stand');
    if (!tex || !tex.source || !tex.source[0]) return null;
    const sourceEl = tex.source[0].image;
    if (!sourceEl) return null;
    const canvas = document.createElement('canvas');
    const scale = 6;
    canvas.width = sourceEl.width * scale;
    canvas.height = sourceEl.height * scale;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sourceEl, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
});

if (dwarfDataUrl && dwarfDataUrl.startsWith('data:')) {
    const base64 = dwarfDataUrl.replace(/^data:image\/png;base64,/, '');
    const fs = await import('fs');
    fs.writeFileSync('screenshots/dwarf-texture-6x.png', Buffer.from(base64, 'base64'));
    console.log('Captured dwarf texture (6x zoom)');
} else {
    console.log('Could not extract dwarf texture');
}

await browser.close();
console.log('Done!');
