/**
 * Honest first-time player run.
 * - Starts with 4,000 coins, zero cards (exactly how every player starts)
 * - Buys packs through the real shop UI: 1 GK + 2 DEF + 2 MID + 2 ATT Squad packs = 3,500 coins
 * - Keeps 500 for Cup Run entry fee
 * - Reads what was randomly drawn, picks best 4-3-3 squad from those cards
 * - Simulates Cup Run ONCE — no retries
 */

import { chromium } from 'playwright';
import { readFileSync } from 'fs';

const BASE = 'http://localhost:3000';

// ---------------------------------------------------------------------------
// Parse player Rising-tier data from source so we know each card's positions
// ---------------------------------------------------------------------------
function parsePlayerData() {
  const src = readFileSync('src/data/players.ts', 'utf8');
  const data = {};
  const blocks = src.split(/(?=\s*\{\s*\n?\s*playerId:)/);
  for (const block of blocks) {
    const idM    = block.match(/playerId:\s*'([^']+)'/);
    const nameM  = block.match(/playerName:\s*'([^']+)'/);
    const posM   = block.match(/Rising:\s*\{[^}]*positions:\s*\[([^\]]+)\]/);
    const ratM   = block.match(/Rising:\s*\{[^}]*rating:\s*(\d+)/);
    if (!idM || !nameM || !posM || !ratM) continue;
    const positions = posM[1].split(',').map(p => p.trim().replace(/'/g, ''));
    data[idM[1]] = { id: idM[1], name: nameM[1], positions, rating: parseInt(ratM[1]) };
  }
  return data;
}

// ---------------------------------------------------------------------------
// Pick best 4-3-3 squad from owned card ids
// ---------------------------------------------------------------------------
function buildSquad(ownedIds, playerData) {
  const SLOTS = ['GK','RB','CB','CB','LB','CM','CM','CM','LW','ST','RW'];
  const sorted = [...ownedIds]
    .filter(id => playerData[id])
    .sort((a, b) => playerData[b].rating - playerData[a].rating);

  const assigned = new Array(SLOTS.length).fill(null);
  const used = new Set();

  // Pass 1: natural position match
  for (let i = 0; i < SLOTS.length; i++) {
    for (const id of sorted) {
      if (used.has(id)) continue;
      if (playerData[id].positions.includes(SLOTS[i])) {
        assigned[i] = id; used.add(id); break;
      }
    }
  }
  // Pass 2: fill gaps with best remaining (OOP)
  for (let i = 0; i < SLOTS.length; i++) {
    if (assigned[i]) continue;
    for (const id of sorted) {
      if (!used.has(id)) { assigned[i] = id; used.add(id); break; }
    }
  }
  return SLOTS.map((pos, i) => ({ slotBtn: '+' + pos, id: assigned[i], info: playerData[assigned[i]] }));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const playerData = parsePlayerData();

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 390, height: 844 });

// ---- 1. Set genuinely fresh state ----
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.evaluate(() => {
  localStorage.setItem('football-card-game-v2', JSON.stringify({
    state: { coins: 4000, totalEarned: 4000, transactions: [], ownedCards: {}, completions: {}, history: [] },
    version: 2,
  }));
});
console.log('Starting fresh: 4,000 coins, 0 cards\n');

// ---- 2. Navigate to Cup Run ----
await page.goto(`${BASE}/modes/domestic-double/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

// ---- 3. Navigate to Packs tab (Simulate → Squad → Packs) ----
await page.click('button[aria-label="Next section"]'); await page.waitForTimeout(400);
await page.click('button[aria-label="Next section"]'); await page.waitForTimeout(600);

// ---- 4. Buy packs ----
const PACK_PLAN = [
  { label: 'Goalkeepers', times: 1 },
  { label: 'Defenders',   times: 2 },
  { label: 'Midfielders', times: 2 },
  { label: 'Attackers',   times: 2 },
];

async function buySquadPack(category, packIndex) {
  // Click category tab
  await page.locator(`button:has-text("${category}")`).click();
  await page.waitForTimeout(500);

  // Squad pack is the first in the carousel — click its Open button
  await page.locator('button:has-text("Open")').first().click();
  await page.waitForTimeout(600);

  // Sealed state: click "Open Pack"
  await page.locator('button:has-text("Open Pack")').click();
  await page.waitForTimeout(800);

  // Click through 3 "Next →" (cards 2, 3, 4 get revealed)
  for (let i = 0; i < 3; i++) {
    await page.locator('button:has-text("Next →")').click();
    await page.waitForTimeout(400);
  }

  // Go back to pack grid (not "View Cards →")
  await page.locator('button:has-text("Open Another")').click();
  await page.waitForTimeout(400);
  console.log(`  ✓ Opened ${category} Squad Pack #${packIndex}`);
}

for (const { label, times } of PACK_PLAN) {
  for (let t = 1; t <= times; t++) {
    await buySquadPack(label, t);
  }
}

// ---- 5. Read what we drew ----
const gameState = await page.evaluate(() => {
  const raw = localStorage.getItem('football-card-game-v2');
  return JSON.parse(raw).state;
});
const coinsLeft = gameState.coins;
const ownedIds  = Object.keys(gameState.ownedCards);

console.log(`\n🪙 Coins left: ${coinsLeft}`);
console.log(`📦 Cards drawn (${ownedIds.length}):`);
for (const id of ownedIds) {
  const p = playerData[id];
  if (p) console.log(`   ${p.name.padEnd(26)} ${p.positions.join('/')} · ${p.rating}`);
}

// ---- 6. Build best squad ----
const squadSlots = buildSquad(ownedIds, playerData);
console.log('\n📋 Squad selected:');
for (const s of squadSlots) {
  if (s.info) console.log(`  ${s.slotBtn.padEnd(5)} → ${s.info.name} (${s.info.positions.join('/')} · ${s.info.rating})`);
  else         console.log(`  ${s.slotBtn} → EMPTY`);
}

// ---- 7. Navigate to Squad tab (one step back from Packs) ----
await page.click('button[aria-label="Previous section"]'); await page.waitForTimeout(600);

// ---- 8. Assign squad through the UI ----
for (const { slotBtn, info } of squadSlots) {
  if (!info) continue;
  await page.locator(`button:has-text("${slotBtn}")`).first().waitFor({ timeout: 5000 });
  await page.locator(`button:has-text("${slotBtn}")`).first().click();
  await page.waitForTimeout(500);

  const cards = page.locator('[class*="thin-scroll"] button[type="button"]');
  const count = await cards.count();
  const search = info.name.split(' ').pop().toLowerCase(); // match on surname
  let found = false;
  for (let i = 0; i < count; i++) {
    const txt = (await cards.nth(i).innerText().catch(() => '')).toLowerCase();
    if (txt.includes(search)) {
      await cards.nth(i).click();
      found = true;
      break;
    }
  }
  if (!found) {
    await page.locator('button:has-text("Close")').first().click().catch(() => {});
    console.log(`  ⚠ Could not assign: ${info.name}`);
  }
  await page.waitForTimeout(350);
}

// ---- 9. Screenshot starting squad ----
await page.screenshot({ path: 'honest-squad.png', fullPage: true });
console.log('\n✓ Starting squad screenshot saved');

// ---- 10. Go to Simulation tab (two steps back from Squad) ----
await page.click('button[aria-label="Previous section"]');
await page.waitForTimeout(400);
// Now on Simulation tab (Squad → Simulation)
await page.waitForTimeout(200);

// ---- 11. One simulation — no retries ----
console.log('\n=== ONE SIMULATION — CUP RUN ===');
const simBtn = page.locator('button:has-text("Simulate Season")').first();
const canAfford = await simBtn.isEnabled().catch(() => false);

if (!canAfford) {
  console.log(`⚠ Can't afford entry fee (${coinsLeft} coins left)`);
} else {
  await simBtn.click();
  await page.waitForSelector('h1:has-text("Challenge Complete"), h1:has-text("Keep Going")', { timeout: 15000 });
  await page.waitForTimeout(500);

  const h1 = await page.locator('h1').first().innerText().catch(() => '');
  const dds = page.locator('dd');
  const pos  = await dds.nth(0).innerText().catch(() => '?');
  const pts  = await dds.nth(1).innerText().catch(() => '?');
  const rec  = await dds.nth(2).innerText().catch(() => '?');
  const gols = await dds.nth(3).innerText().catch(() => '?');

  if (h1.includes('Challenge Complete')) {
    console.log(`✅ COMPLETED — ${pos} · ${pts}pts · ${rec} · goals: ${gols}`);
  } else {
    console.log(`❌ FAILED — ${pos} · ${pts}pts · ${rec} · goals: ${gols}`);
  }

  await page.screenshot({ path: 'honest-result.png' });
  console.log('✓ Result screenshot saved');
}

await browser.close();
