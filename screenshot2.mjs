import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome-stable',
    args: ['--no-sandbox', '--disable-gpu']
});

const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// Title screen
await page.screenshot({ path: 'screenshots/title-screen.png' });
console.log('Captured title screen');

// Click to start game
await page.click('canvas');
await page.waitForTimeout(2500);

// Gameplay
await page.screenshot({ path: 'screenshots/gameplay.png' });
console.log('Captured gameplay');

// Extract individual textures using the exposed game instance
const textures = ['axe', 'thrown-axe', 'dwarf-stand', 'goblin', 'orc', 'troll', 'boss', 'coin', 'heart', 'platform'];
for (const name of textures) {
    const scale = name === 'boss' ? 4 : name === 'troll' ? 5 : name === 'platform' ? 3 : 8;
    const dataUrl = await page.evaluate(({ name, scale }) => {
        try {
            const game = window.__PHASER_GAME__;
            if (!game) return 'no-game';
            const tex = game.textures.get(name);
            if (!tex || !tex.source || !tex.source[0]) return 'no-tex:' + name;
            const sourceEl = tex.source[0].image;
            if (!sourceEl) return 'no-image:' + name;
            const c = document.createElement('canvas');
            c.width = sourceEl.width * scale;
            c.height = sourceEl.height * scale;
            const ctx = c.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(sourceEl, 0, 0, c.width, c.height);
            return c.toDataURL('image/png');
        } catch (e) {
            return 'error:' + e.message;
        }
    }, { name, scale });

    if (dataUrl && dataUrl.startsWith('data:')) {
        const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
        writeFileSync(`screenshots/${name}-${scale}x.png`, Buffer.from(base64, 'base64'));
        console.log(`Captured ${name} (${scale}x)`);
    } else {
        console.log(`Failed ${name}: ${dataUrl}`);
    }
}

await browser.close();
console.log('Done!');
