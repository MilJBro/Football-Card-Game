# Gaffer — Premier League Card Game

A browser-based football card collecting game. Collect Premier League greats
across three career eras, build a squad, and simulate a full season to chase
glory. No backend — everything runs client-side and saves to your browser.

## The Loop

**Earn coins → Buy packs → Open cards → Build a squad → Simulate a season →
See your finish & trophies → Earn coins** (and build a stronger squad to chase
the harder challenges).

## Cards

- **30 players × 3 tiers = 90 cards.** Each card is one player at one career era:
  - **Rising** — breakthrough/debut era (lower rated)
  - **Star** — establishing greatness
  - **Legend** — peak years (sometimes unlocks a second position)
- **One single rating** per card (1–99). No sub-stats.
- **Positions evolve with the career.** Rooney gains CM at Legend; Salah gains
  ST; Henry starts as a winger before becoming a striker.
- **Foils** — owning a duplicate unlocks a cosmetic animated foil skin.
- **Upgrading** — spend coins to convert a card to the next tier of the same
  player (Rising→Star for 🪙1,200, Star→Legend for 🪙3,000). Consumes one copy
  of the lower-tier card.

## Positions & Packs

| Pack | Card positions |
| ---- | -------------- |
| GK   | GK |
| DEF  | RB, CB, LB |
| MID  | CM |
| ATT  | RW, LW, ST |

Central midfielders are all **CM** (a formation may show a CDM/CAM slot, but it
just accepts a CM). Full-backs stay RB/LB even in a back five.

## Out-of-Position Penalty

There's no chemistry system. Instead, playing a card out of position downgrades
its effective rating, dragging the squad rating down:

| Situation | Penalty |
| --------- | ------- |
| Natural position | none |
| Same category, wrong slot | −4 |
| Adjacent category | −8 |
| Far out of position | −15 |
| Anyone in goal / GK outfield | −25 |

Dual-position cards play at full rating in either of their natural slots.

## Challenges (6)

Each is a **separate** challenge — build a fresh squad, simulate a season, and
meet the win condition. Squads don't carry over; only your collection and coins
persist.

| Challenge | Win condition | Difficulty |
| --------- | ------------- | ---------- |
| Domestic Double | Win FA Cup + League Cup | ★★ |
| Centurions | 100+ points and win the PL | ★★★ |
| European Glory | Win the Champions League | ★★★ |
| Invincibles | Go unbeaten and win the PL | ★★★★ |
| Iron Defence | Concede <15 and win the PL | ★★★★★ |
| The Quadruple | Win PL + FA Cup + League Cup + UCL | ★★★★★ |

## Earning Coins

- **Season finish** — scaled by league position and trophies won (paid every run)
- **Challenge bonus** — for meeting a challenge's win condition (first-clear bonus)
- **Selling cards** — discard unwanted/duplicate cards for coins

## Spending Coins

- **Packs** — Rising 🪙500, Star 🪙1,200, Legend 🪙2,500
- **Upgrades** — Rising→Star 🪙1,200, Star→Legend 🪙3,000

## Tech

- **Next.js 14** (App Router, static export)
- **TypeScript**, **Tailwind CSS**
- **Framer Motion** (card flips, animations)
- **Zustand** + `persist` middleware (state saved to `localStorage`)

No server, database, or auth. Deployable as a static site to Netlify, Vercel, or
any static host.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
```

Deploy the generated `out/` directory to any static host.

## Project Structure

```
src/
  app/            # routes (home, shop, collection, modes, pack opening)
  components/     # cards, squad builder, pack opening, modes, ui
  data/           # players, packs, game modes, formations (static content)
  lib/            # match engine, pack draws, squad utils, coin rewards
  store/          # Zustand store + shared types
  hooks/          # hydration guard
```
