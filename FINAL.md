# Homies Wear — Final Project Overview

> Wear less. Swap more. A local clothing-swap community app.

**Stack:** React 18 + Vite + Express + MongoDB + Mongoose + Socket.IO + JWT

## Contents

- [1. What This Is](#1-what-this-is)
- [2. Tech Stack](#2-tech-stack)
- [3. Project Structure](#3-project-structure)
- [4. Backend API](#4-backend-api)
- [5. Data Models](#5-data-models)
- [6. Socket Events](#6-socket-events)
- [7. Frontend](#7-frontend)
- [8. Key Business Logic](#8-key-business-logic)
- [9. Run / Scripts / Env](#9-run--scripts--env)
- [10. Tests](#10-tests)
- [11. Final Touch Applied (2026-09-13)](#11-final-touch-applied-2026-09-13)
- [12. Known Limitations / Next Cleanup](#12-known-limitations--next-cleanup)

---

## 1. What This Is

Homies Wear lets people list unused clothes, discover pieces nearby, propose
1-for-1 swaps, chat in real time, and rate each other.

Pages:

- Landing page (`/`)
- Explore
- Item detail
- Swap request
- List an item
- Messages
- Dashboard
- Auth
- How it works
- Nearby

Default location context: Jorhat, Assam, India.

---

## 2. Tech Stack

| Layer    | Details                                                                                          |
| -------- | ------------------------------------------------------------------------------------------------ |
| Frontend | React 18, Vite (`:5173`), no react-router (manual `history.pushState` router in `frontend/src/main.jsx`), |
|          | `socket.io-client@4.8.3`, vanilla CSS (no Tailwind)                                              |
| Backend  | Express, `http.createServer` + `socket.io@4.8.3`, `mongoose`, `jsonwebtoken`, `bcryptjs`,        |
|          | `cors`, `helmet`, `express-rate-limit`, `dotenv`                                                 |
| Database | MongoDB (`MONGODB_URI`, default `mongodb://127.0.0.1:27017/homies-wear`). Falls back to          |
|          | `mongodb-memory-server` persisted at `server/.data/db` (3s `serverSelectionTimeoutMS`).          |
|          | Auto-seeds if `ClothingItem` count is 0.                                                         |
| Auth     | JWT (`JWT_SECRET`, `JWT_EXPIRES_IN=7d`), `bcrypt.genSalt(12)`, Bearer token in `localStorage`    |
|          | (`homies_token` / `homies_user`)                                                                 |
| Realtime | Socket.IO, JWT via `handshake.auth.token`, rooms `user:{id}` and `conversation:{id}`             |
| Tooling  | ESM throughout, Prettier, Vite build to `frontend/dist/`                                        |

---

## 3. Project Structure

```text
package.json            # backend + orchestration (dev/build delegate to frontend/)
.env / .env.example
frontend/               # standalone Vite app (own package.json)
  package.json          # homies-wear-frontend: react, vite, socket.io-client
  vite.config.js        # react plugin, dev port 5173
  index.html
  public/               # homies-logo.svg, logologo.png,
                        # logologo-transparent.png, logomark-transparent.png
  src/:
    main.jsx            # ~2837 lines — all pages/components + router + ErrorBoundary
    api.js              # fetch wrapper + socket singleton
    styles.css          # core theme
    visual-refresh.css  # warm palette override, loaded last
    final-touch.css
    auth.css
    usability.css
    mobile-fix.css
  dist/                 # production build (gitignored)
server/:
  server.js             # 96 lines — express + http + socket bootstrap
  models.js             # re-export shim
  config/:              # env.js, db.js
  models/:              # User, ClothingItem, SwapRequest, Conversation,
                        # Message, Notification, Favorite, Rating, Report + index.js
  routes/:              # index.js + auth, item, swap, conversation,
                        # notification, favorite, rating, dashboard, user, report
  controllers/:         # auth, conversation, dashboard, favorite, item,
                        # notification, rating, report, swap, user
  services/:            # auth, item, swap, swapValue, dashboard, conversation,
                        # notification, rating, favorite, user
  middleware/:          # auth (requireAuth/optionalAuth/requireAdmin),
                        # validate, error, rateLimiter
  validators/:          # auth, item, swap, message, rating
  utils/:               # apiError, apiResponse, logger, distance (Haversine)
  sockets/socketHandler.js  # 146 lines
  seeds/seed.js             # 421 lines
  tests/:                   # test-runner.js, test-flow.js (22-step journey)
```

---

## 4. Backend API

Base: `http://localhost:4000/api` + `GET /health`.

| Prefix                  | Endpoints                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| `/auth`                 | `POST /register`, `POST /login`, `GET /me`, `POST /logout`                                         |
| `/items`                | `GET /` (filters: `q, category, brand, condition, size, minPrice, maxPrice, sort, page, limit,`,   |
|                         | `ownerId, status, userLat, userLng`), `GET /nearby?lat,lng,radius,limit`, `POST /calculate-value`, |
|                         | `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` (soft `REMOVED`)                                   |
| `/swaps` (auth)         | `POST /`, `GET /?type=all\|incoming\|sent&status`, `GET /:id`, `POST /:id/counter`,                |
|                         | `PUT /:id/accept`, `POST /:id/complete`, `PUT /:id/decline`                                        |
| `/conversations` (auth) | `GET /`, `GET /:id/messages?page`, `POST /:id/messages`                                            |
| `/notifications` (auth) | `GET /`, `PATCH /read-all`, `PATCH /:id/read`                                                      |
| `/favorites` (auth)     | `GET /`, `POST /:itemId`, `DELETE /:itemId`                                                        |
| `/ratings`              | `POST /` (auth), `GET /user/:userId` (open)                                                        |
| `/dashboard` (auth)     | `GET /stats`, `GET /overview`                                                                      |
| `/users`                | `GET /:id` (optionalAuth). Note: `PUT /profile` is shadowed by `/:id` route order.                 |
| `/reports`              | `POST /` (auth), `GET /admin` (auth + admin)                                                       |

Global middleware:

- `helmet`, `cors([CLIENT_ORIGIN, :5173])`, `express.json(2mb)`
- Rate limiters: global 500/15m, auth 30/15m, swap 50/10m
- JSON 404 + centralized error handler

---

## 5. Data Models

Key fields only — see `server/models/` for full schemas.

- **User:** `name`, `email` (unique / lowercase / indexed), `passwordHash`
  (`select: false`), `avatar`, `location` (default Jorhat), `locationGeo`
  `Point [94.2037, 26.7509]`, `bio`, `role`, `rating` (5.0), `ratingCount`,
  `responseRate` (95), `successfulSwaps`.
- **ClothingItem:** `ownerId`, `title`, `description`, `category`, `brand`,
  `size`, `condition` (`Brand new` / `Like new` / `Excellent` / `Good` / `Fair`),
  `color`, `images[]`, `estimatedValue`, `status`
  (`AVAILABLE` / `NEGOTIATING` / `RESERVED` / `SWAPPED` / `ARCHIVED` / `REMOVED`).
  Text index on title/brand/category/description, 2dsphere geo index.
- **SwapRequest:** `sender` / `receiver`, `senderItem` / `receiverItem`,
  `message`, `senderValue` / `receiverValue`, `status` (`PENDING` / `NEGOTIATING` /
  `COUNTERED` / `ACCEPTED` / `COMPLETED` / `DECLINED` / `CANCELLED` / `EXPIRED`),
  `history[]`, `confirmedBy[]`.
- **Conversation:** `participants[]`, `lastMessage`, `swapRequestId`.
- **Message:** `conversationId`, `sender` / `receiver`, `text` (2000 chars),
  `type` (`text` / `swap_proposal` / `system`), `swapRequestId`, `swapData`,
  `read` / `readAt`.
- **Notification:** `userId`, `type` (`SWAP_REQUEST` / `SWAP_COUNTER` /
  `SWAP_ACCEPTED` / `SWAP_COMPLETED` / `SWAP_DECLINED` / `NEW_MESSAGE` /
  `NEW_RATING`), `title` / `body`, `data` (`{ swapId, conversationId, itemId, senderId }`),
  `read`.
- **Favorite:** `userId` + `itemId` unique compound.
- **Rating:** `swapId` + `rater` + `rated` + `score` (1–5) + `review` (600 chars),
  unique on swap + rater.
- **Report:** `reporter` / `reportedUser` / `reportedItem` / `reason` /
  `description` / `status`.

---

## 6. Socket Events

| Direction | Event                                                   |
| --------- | ------------------------------------------------------- |
| Client →  | `join_conversation`, `leave_conversation`               |
| Client →  | `send_message { conversationId, text, type, swapData }` |
| Client →  | `typing_start` / `typing_stop`                          |
| Server →  | `new_message`                                           |
| Server →  | `user_typing { userId, conversationId, isTyping }`      |
| Server →  | `new_notification`                                      |

---

## 7. Frontend

All pages live in `frontend/src/main.jsx`. Top-level `App` state: `path`,
`currentUser`, `favorites[]`, `featuredItems`, `unreadCount`, `toast`.
No Redux.

Routes (manual `navigate()` via `pushState`):

`/`, `/explore`, `/item/:id`, `/swap/request/:id`, `/list`, `/messages`,
`/dashboard`, `/login`, `/register`, `/how-it-works`, `/nearby`, plus a
fallback `GenericPage`.

Components:

`Icon`, `Logo`, `Header`, `ProductCard`, `Hero`, `ValueStrip`,
`FeaturedSection`, `CategorySection`, `NearbySection`, `ImpactSection`,
`HowSection`, `FinalCta`, `Footer`, `Home`, `HowPage`, `NearbyPage`,
`Explore`, `ItemDetail`, `SwapRequest`, `ListPage`, `Messages`,
`Dashboard`, `AuthPage`, `GenericPage`, `MobileNav`, `App`, `ErrorBoundary`.

`frontend/src/api.js`:

- `getToken` / `setAuthSession` / `clearAuthSession` / `getStoredUser`
- `request()` injects Bearer token
- Namespaces: `api.auth` / `items` / `swaps` / `conversations` /
  `notifications` / `favorites` / `dashboard` / `ratings`
- `getSocket()` singleton
- Missing wrappers (backend exists): users/profile, reports, ratings-for-user

Realtime frontend:

- `App` listens for `new_notification` → `unread++` + toast
- `Messages` joins/leaves conversation, appends `new_message`, shows typing indicator

Styling — import order (last wins):

```js
styles → auth → final-touch → usability → mobile-fix → visual-refresh
```

- Fonts: `DM Serif Display` + `Manrope`
- Tokens (approx): `--bg #f7f5f0 / #fbf7ef`, ink `#18352f`, accent `#da725b`

Landing Hero (final state): eyebrow, headline, subtitle, Explore/List CTAs,
avatar footnote, image frame with note + location badge. The old
`01 / 04 — Curated from closets nearby` caption was removed.

---

## 8. Key Business Logic

- **Swap value:** brand tiers (luxury 1.8 / premium 1.3 / highstreet 1.0 /
  standard 0.75, substring match) × category weights (Outerwear 1.25, …) ×
  condition factors (Brand new 0.95 → Fair 0.4) × base prices (₹1800–3600),
  age decay `max(0.7, 1 - ageMonths / 48 * 0.3)`, rounded to ₹50, min ₹300.
  Display-only disclaimer — both parties decide fairness.
- **Distance:** Haversine (R=6371), `formatDistance`
  (`Nearby` / `<500m` / `x.x km`).
- **Swap state machine:**

  ```text
  PENDING → COUNTERED ↔ NEGOTIATING → ACCEPTED → COMPLETED
  (dual confirmedBy; decline/cancel reverts to AVAILABLE)

  Items: AVAILABLE → NEGOTIATING (create)
       → RESERVED (accept, atomic + rollback)
       → SWAPPED (both confirm)
  ```

  Accept auto-declines rival requests touching either item. Guards: no
  self-swap, ownership check, AVAILABLE-only, no duplicate active request,
  participant-only, COMPLETED immutable.

- **Dashboard `peopleReached`:**
  `max(distinct conversation partners, successfulSwaps)`.

---

## 9. Run / Scripts / Env

```bash
npm run dev     # → frontend vite dev server :5173
npm run server  # node server/server.js (:4000)
npm run build   # → frontend vite build → frontend/dist/
npm run preview # → frontend vite preview
npm run seed    # node server/seeds/seed.js
npm test        # node server/tests/test-runner.js
npm run format  # prettier over frontend/src + frontend root + server/
```

Install both sides after cloning:

```bash
npm install                 # backend + orchestration (root)
npm --prefix frontend install  # frontend app
```

`.env.example`:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/homies-wear
JWT_SECRET=your-secret-here
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

> Note: `API_BASE` / socket URL are hardcoded to `localhost:4000` in
> `frontend/src/api.js`.

---

## 10. Tests

`server/tests/test-flow.js` — 22-step assert journey:

1. health → register Alice/Bob → login → me
2. calculate-value → create 2 items → search → nearby distance → favorites
3. swap PENDING → notification → get → counter COUNTERED + history
4. accept RESERVED → Bob complete → Alice complete COMPLETED + SWAPPED
5. 5★ rating → profile → dashboard stats
6. failure cases (self-swap, swapped-item, self-rate blocked)

No unit tests for sockets, validator edge cases, reports, or user update.

---

## 11. Final Touch Applied (2026-09-13)

- Removed landing Hero `hero-caption`
  (`01 / 04 / Curated from closets nearby`) from `frontend/src/main.jsx` +
  deleted `.hero-caption` CSS (desktop + mobile).
- Ran Prettier format, `npm run build` ✓, `npm test` ✓ (all journey tests pass).
- Left How-It-Works `01 / 04` badge untouched (different page).

## 12. Monorepo Split

- Frontend moved to `frontend/` (own `package.json`, `vite.config.js`,
  `index.html`, `public/`, `src/`) via `git mv` — history preserved.
- Backend stays at root (`server/`) + root `package.json` (orchestration:
  `dev` / `build` / `preview` delegate with `npm --prefix frontend`).
- Backend serves API only (no `express.static`), so no server path changes
  were needed. Fresh builds output to `frontend/dist/`.

---

## 12. Known Limitations / Next Cleanup

1. `PUT /users/profile` never matches (shadowed by `GET /:id`) — reorder routes.
2. Hardcoded `localhost:4000` breaks production — move to `VITE_API_URL`.
3. `frontend/dist/` bundle ~533K JS — code-split / lazy-load pages.
4. Frontend missing `users` / `reports` / `ratings-user` API wrappers.
5. `optionalAuth` silently swallows errors; no socket/validator unit tests.
