import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';

// Fresh squad — completely different from the last run
// GK: Schmeichel (92) | Back 4: TAA, Ferdinand, Van Dijk, Ashley Cole
// Mid: De Bruyne, Lampard, Rodri | Attack: Hazard (LW), Cantona (ST), Saka (RW)
const OWNED_CARDS = {
  'schmeichel':  { cardId:'schmeichel',  quantity:1, upgradeLevel:2, isFoilUnlocked:false, isFoilEquipped:false, acquiredAt:Date.now() },
  'taa':         { cardId:'taa',         quantity:1, upgradeLevel:2, isFoilUnlocked:false, isFoilEquipped:false, acquiredAt:Date.now() },
  'ferdinand':   { cardId:'ferdinand',   quantity:1, upgradeLevel:2, isFoilUnlocked:false, isFoilEquipped:false, acquiredAt:Date.now() },
  'vandijk':     { cardId:'vandijk',     quantity:1, upgradeLevel:2, isFoilUnlocked:false, isFoilEquipped:false, acquiredAt:Date.now() },
  'ashleycole':  { cardId:'ashleycole',  quantity:1, upgradeLevel:2, isFoilUnlocked:false, isFoilEquipped:false, acquiredAt:Date.now() },
  'debruyne':    { cardId:'debruyne',    quantity:1, upgradeLevel:2, isFoilUnlocked:false, isFoilEquipped:false, acquiredAt:Date.now() },
  'lampard':     { cardId:'lampard',     quantity:1, upgradeLevel:2, isFoilUnlocked:false, isFoilEquipped:false, acquiredAt:Date.now() },
  'rodri':       { cardId:'rodri',       quantity:1, upgradeLevel:2, isFoilUnlocked:false, isFoilEquipped:false, acquiredAt:Date.now() },
  'hazard':      { cardId:'hazard',      quantity:1, upgradeLevel:2, isFoilUnlocked:false, isFoilEquipped:false, acquiredAt:Date.now() },
  'cantona':     { cardId:'cantona',     quantity:1, upgradeLevel:2, isFoilUnlocked:false, isFoilEquipped:false, acquiredAt:Date.now() },
  'saka':        { cardId:'saka',        quantity:1, upgradeLevel:2, isFoilUnlocked:false, isFoilEquipped:false, acquiredAt:Date.now() },
};

// 4-3-3: all players in natural positions
const ASSIGNMENTS = [
  { slot: '+GK', player: 'schmeichel' },  // Peter Schmeichel → GK
  { slot: '+RB', player: 'trent' },        // TAA → RB
  { slot: '+CB', player: 'ferdinand' },    // Rio Ferdinand → CB
  { slot: '+CB', player: 'van dijk' },     // Virgil van Dijk → CB
  { slot: '+LB', player: 'ashley cole' },  // Ashley Cole → LB
  { slot: '+CM', player: 'de bruyne' },    // De Bruyne → CM
  { slot: '+CM', player: 'lampard' },      // Frank Lampard → CM
  { slot: '+CM', player: 'rodri' },        // Rodri → CM
  { slot: '+LW', player: 'hazard' },       // Eden Hazard → LW
  { slot: '+ST', player: 'cantona' },      // Eric Cantona → ST
  { slot: '+RW', player: 'saka' },         // Bukayo Saka → RW
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 390, height: 844 });

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

for (const { slot, player } of ASSIGNMENTS) {
  await page.locator(`button:has-text("${slot}")`).first().waitFor({ timeout: 5000 });
  await page.locator(`button:has-text("${slot}")`).first().click();
  await page.waitForTimeout(500);

  const cards = page.locator('[class*="thin-scroll"] button[type="button"]');
  const count = await cards.count();
  let found = false;
  for (let i = 0; i < count; i++) {
    const txt = (await cards.nth(i).innerText().catch(() => '')).toLowerCase();
    if (txt.includes(player.toLowerCase())) {
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

await page.screenshot({ path: 'iron-defence-2-squad.png', fullPage: true });
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
    console.log(`  Attempt ${attempts}: ✅ CLEARED — ${pos} · ${pts}pts · ${rec} · scored:${gf?.trim()} conceded:${ga?.trim()}`);
    await page.screenshot({ path: 'iron-defence-2-result.png' });
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
