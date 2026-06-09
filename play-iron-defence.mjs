import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';

// Fresh backline: Čech, Walker, Vidić, Adams, Pearce
// Mid: Keane, Scholes, Vieira — all upgraded
// Attack: Giggs (LW), Shearer (ST), Beckham (RW) — all proper positions, all upgraded
const OWNED_CARDS = {
  'cech':        { cardId:'cech',        quantity:1, upgradeLevel:2, isFoilUnlocked:false, isFoilEquipped:false, acquiredAt:Date.now() },
  'walker':      { cardId:'walker',      quantity:1, upgradeLevel:2, isFoilUnlocked:false, isFoilEquipped:false, acquiredAt:Date.now() },
  'vidic':       { cardId:'vidic',       quantity:1, upgradeLevel:2, isFoilUnlocked:false, isFoilEquipped:false, acquiredAt:Date.now() },
  'tonyadams':   { cardId:'tonyadams',   quantity:1, upgradeLevel:2, isFoilUnlocked:false, isFoilEquipped:false, acquiredAt:Date.now() },
  'stuartpearce':{ cardId:'stuartpearce',quantity:1, upgradeLevel:2, isFoilUnlocked:false, isFoilEquipped:false, acquiredAt:Date.now() },
  'keane':       { cardId:'keane',       quantity:1, upgradeLevel:2, isFoilUnlocked:false, isFoilEquipped:false, acquiredAt:Date.now() },
  'scholes':     { cardId:'scholes',     quantity:1, upgradeLevel:2, isFoilUnlocked:false, isFoilEquipped:false, acquiredAt:Date.now() },
  'vieira':      { cardId:'vieira',      quantity:1, upgradeLevel:2, isFoilUnlocked:false, isFoilEquipped:false, acquiredAt:Date.now() },
  'giggs':       { cardId:'giggs',       quantity:1, upgradeLevel:2, isFoilUnlocked:false, isFoilEquipped:false, acquiredAt:Date.now() },
  'shearer':     { cardId:'shearer',     quantity:1, upgradeLevel:2, isFoilUnlocked:false, isFoilEquipped:false, acquiredAt:Date.now() },
  'beckham':     { cardId:'beckham',     quantity:1, upgradeLevel:2, isFoilUnlocked:false, isFoilEquipped:false, acquiredAt:Date.now() },
};

// 4-3-3: all players in their natural positions — no OOP
const ASSIGNMENTS = [
  { slot: '+GK', player: 'čech' },         // Petr Čech  → GK
  { slot: '+RB', player: 'walker' },        // Kyle Walker → RB
  { slot: '+CB', player: 'vidić' },         // Nemanja Vidić → CB
  { slot: '+CB', player: 'tony adams' },    // Tony Adams → CB
  { slot: '+LB', player: 'pearce' },        // Stuart Pearce → LB
  { slot: '+CM', player: 'roy keane' },     // Roy Keane → CM
  { slot: '+CM', player: 'scholes' },       // Paul Scholes → CM
  { slot: '+CM', player: 'vieira' },        // Patrick Vieira → CM
  { slot: '+LW', player: 'giggs' },         // Ryan Giggs → LW (natural)
  { slot: '+ST', player: 'shearer' },       // Alan Shearer → ST (natural)
  { slot: '+RW', player: 'beckham' },       // David Beckham → RW (natural)
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 390, height: 844 });

// Inject state
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.evaluate((cards) => {
  localStorage.setItem('football-card-game-v2', JSON.stringify({
    state: { coins:6000, totalEarned:30000, transactions:[], ownedCards:cards, completions:{}, history:[] },
    version: 2,
  }));
}, OWNED_CARDS);

await page.goto(`${BASE}/modes/iron-defence/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

// Go to squad tab
await page.click('button[aria-label="Next section"]');
await page.waitForTimeout(800);

// Assign each slot
for (const { slot, player } of ASSIGNMENTS) {
  await page.locator(`button:has-text("${slot}")`).first().waitFor({ timeout: 5000 });
  await page.locator(`button:has-text("${slot}")`).first().click();
  await page.waitForTimeout(500);

  const cards = page.locator('[class*="thin-scroll"] button[type="button"]');
  const count = await cards.count();
  let found = false;
  for (let i = 0; i < count; i++) {
    const txt = (await cards.nth(i).innerText().catch(() => '')).toLowerCase();
    if (txt.includes(player)) {
      await cards.nth(i).click();
      found = true;
      break;
    }
  }
  if (!found) {
    await page.locator('button:has-text("Close")').first().click().catch(() => {});
    console.log(`  ⚠ Not found: ${player}`);
  } else {
    console.log(`  ✓ ${slot.replace('+','')} → ${player}`);
  }
  await page.waitForTimeout(350);
}

// Squad screenshot
await page.screenshot({ path: 'iron-defence-squad.png', fullPage: true });
console.log('\n✓ Squad screenshot saved');

// Back to Simulation tab
await page.click('button[aria-label="Previous section"]');
await page.waitForTimeout(600);

console.log('\n=== SIMULATING IRON DEFENCE ===');
let attempts = 0;
let success = false;

while (!success && attempts < 30) {
  attempts++;

  const simBtn = page.locator('button:has-text("Simulate Season")').first();
  if (!await simBtn.isEnabled().catch(() => false)) {
    console.log('  ⚠ Cannot afford entry fee');
    break;
  }

  await simBtn.click();
  await page.waitForSelector('h1:has-text("Challenge Complete"), h1:has-text("Keep Going")', { timeout: 15000 });
  await page.waitForTimeout(500);

  const h1 = await page.locator('h1').first().innerText().catch(() => '');

  if (h1.includes('Challenge Complete')) {
    success = true;
    const dds = page.locator('dd');
    const pos  = await dds.nth(0).innerText().catch(() => '?');
    const pts  = await dds.nth(1).innerText().catch(() => '?');
    const rec  = await dds.nth(2).innerText().catch(() => '?');
    const gols = await dds.nth(3).innerText().catch(() => '?');
    const [gf, ga] = gols.split(' / ');
    console.log(`  Attempt ${attempts}: ✅ CLEARED — ${pos} · ${pts}pts · ${rec} · scored:${gf.trim()} conceded:${ga.trim()}`);
    await page.screenshot({ path: 'iron-defence-result.png' });
  } else {
    const dds = page.locator('dd');
    const pos  = await dds.nth(0).innerText().catch(() => '?');
    const pts  = await dds.nth(1).innerText().catch(() => '?');
    const gols = await dds.nth(3).innerText().catch(() => '?');
    const [, ga] = gols.split(' / ');
    const league = pos === '1st' ? `won league (${pts}pts)` : `${pos} ${pts}pts`;
    console.log(`  Attempt ${attempts}: ❌ ${league} | GA: ${ga?.trim()} (need <15)`);
    await page.locator('button:has-text("Try Again")').first().click();
    await page.waitForTimeout(500);
  }
}

console.log(`\nTotal: ${attempts} attempt${attempts !== 1 ? 's' : ''}`);
await browser.close();
