# Credi-Check — Architecture (architecture.md)

Companion to `spec.md`. This is the build blueprint — implementers should not
need to make architectural decisions on their own; they should follow this
file and log deviations in `status.md`.

**Stack: MERN + Tailwind CSS + shadcn/ui + lucide-react** (MongoDB, Express,
React, Node.js on the backend; Tailwind/shadcn/lucide for all frontend UI and
icons). This supersedes any prior Laravel/MySQL or plain-CSS version of this
document.

---

## 1. Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React + Vite | Functional components + hooks only |
| Styling | Tailwind CSS | Utility classes only, no plain `.css` files beyond the generated `globals.css` (Tailwind layers + shadcn CSS variables) |
| UI components | shadcn/ui | Copied into `client/src/components/ui/` via the shadcn CLI, not installed as an npm dependency |
| Icons | lucide-react | The only icon library used — no emoji-as-icon, no other icon packages |
| Backend | Node.js + Express | REST/JSON API only |
| Database | MongoDB (Mongoose ODM) | Two collections for MVP, see §4 |
| HTTP client (frontend) | axios | |
| Validation (backend) | express-validator | |
| Auth | None, or a single seeded demo user | Do not build real auth (see spec.md §5) |
| Dev tooling | nodemon (server), Vite dev server (client) | |
| Hosting for demo | Local (localhost) is fine; deploy only if time allows after MVP flow works | |

## 2. System Overview

```
 ┌───────────────┐        JSON/HTTP        ┌───────────────────┐        ┌──────────┐
 │  React + Vite │  ───────────────────▶   │  Node + Express     │  ───▶  │ MongoDB  │
 │  Tailwind +   │  ◀───────────────────   │  (Credi-Check API)  │  ◀───  │          │
 │  shadcn/ui +  │                          └───────────────────┘        └──────────┘
 │  lucide-react │                                    │
 └───────────────┘                                    │  runs
        │                                              ▼
        │  renders                        loanAssessmentService.js
        ▼                                  (pure functions, no ML)
  Results Dashboard
  Safety Report
```

All risk logic lives server-side in a single `loanAssessmentService.js`
module. The frontend never re-implements the math — it only displays what the
API returns, styled entirely with Tailwind utility classes and shadcn/ui
primitives.

## 3. Folder Structure

Monorepo, two top-level app folders plus docs. Do not deviate from this
layout — agents should create files in exactly these locations so tasks in
`task.md` can reference precise paths.

```
credicheck/
├── docs/
│   ├── spec.md
│   ├── architecture.md
│   ├── task.md
│   └── status.md
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Mongo connection setup
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Assessment.js
│   │   ├── services/
│   │   │   └── loanAssessmentService.js   # all calculation logic, pure functions
│   │   ├── controllers/
│   │   │   ├── loanController.js
│   │   │   └── userController.js
│   │   ├── routes/
│   │   │   ├── loanRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── middleware/
│   │   │   ├── validateLoanInput.js
│   │   │   └── errorHandler.js
│   │   ├── seeders/
│   │   │   └── seedDemoData.js       # creates demo user + demo assessments
│   │   └── app.js                    # express app, middleware, route mounting
│   ├── server.js                     # entry point, starts app.js + connects DB
│   ├── .env                          # PORT, MONGO_URI
│   ├── .env.example
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui primitives, generated via CLI — do not hand-edit style logic here
│   │   │   │   ├── button.jsx
│   │   │   │   ├── input.jsx
│   │   │   │   ├── checkbox.jsx
│   │   │   │   ├── card.jsx
│   │   │   │   ├── badge.jsx
│   │   │   │   ├── label.jsx
│   │   │   │   └── alert.jsx
│   │   │   ├── LoanForm.jsx
│   │   │   ├── ConsentStep.jsx
│   │   │   ├── ResultsDashboard.jsx
│   │   │   ├── RiskBadge.jsx
│   │   │   ├── ReasoningList.jsx
│   │   │   ├── PatternWarningBanner.jsx
│   │   │   └── RoadmapSlide.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   └── AssessmentFlowPage.jsx   # owns the step state machine
│   │   ├── services/
│   │   │   └── api.js                # axios instance + analyzeLoan(), getLoanReport()
│   │   ├── lib/
│   │   │   └── utils.js              # shadcn's cn() helper (clsx + tailwind-merge)
│   │   ├── styles/
│   │   │   └── globals.css           # @tailwind directives + shadcn CSS variables, see §7
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── jsconfig.json                 # path alias `@/*` → `src/*`, required by shadcn CLI
│   ├── components.json               # shadcn CLI config
│   └── package.json
│
└── README.md                          # run instructions for both server and client
```

## 4. Database Schema (Mongoose)

### `User` model (`server/src/models/User.js`)
| Field | Type | Notes |
|---|---|---|
| `name` | String, required | |
| `email` | String, required, unique | |
| `createdAt` / `updatedAt` | Date | via `{ timestamps: true }` |

For the hackathon, a single seeded demo user is enough. Do not build
registration/login flows.

### `Assessment` model (`server/src/models/Assessment.js`)
| Field | Type | Notes |
|---|---|---|
| `user` | ObjectId, ref `User`, required | |
| `loanAmount` | Number, required | |
| `feeAmount` | Number, required | |
| `interestRate` | Number, required | percentage |
| `repaymentPeriodDays` | Number, required | |
| `monthlyIncome` | Number, required | |
| `existingDebtRepayment` | Number, default 0 | |
| `totalRepayment` | Number | computed, stored |
| `costOfBorrowingPct` | Number | computed, stored |
| `debtBurdenRatio` | Number | computed, stored |
| `riskLevel` | String, enum `['safe','caution','high_risk']` | computed, stored |
| `recommendationText` | String | computed, stored |
| `createdAt` / `updatedAt` | Date | via `{ timestamps: true }`, used for the 90-day pattern query |

No other collections are needed for the MVP. Do not add lender,
notification, or audit-log collections tonight — see spec.md §5.

## 5. Calculation Logic (single source of truth)

Implement as pure, independently-callable functions in
`server/src/services/loanAssessmentService.js`. No class needed — export
named functions so each can be tested individually from a Node REPL or a
throwaway script.

```js
// server/src/services/loanAssessmentService.js

function calculateTotalRepayment({ loanAmount, feeAmount, interestRate }) {
  return loanAmount + feeAmount + (loanAmount * interestRate / 100);
}

function calculateCostOfBorrowingPct({ loanAmount, totalRepayment }) {
  return ((totalRepayment - loanAmount) / loanAmount) * 100;
}

function calculateDebtBurdenRatio({
  totalRepayment, repaymentPeriodDays, existingDebtRepayment, monthlyIncome
}) {
  const newLoanMonthlyCost = totalRepayment / (repaymentPeriodDays / 30);
  return ((existingDebtRepayment + newLoanMonthlyCost) / monthlyIncome) * 100;
}

function classifyRisk(debtBurdenRatio) {
  if (debtBurdenRatio <= 40) return 'safe';
  if (debtBurdenRatio <= 60) return 'caution';
  return 'high_risk';
}

function buildRecommendation(riskLevel, { monthlyIncome, existingDebtRepayment }) {
  const safeMonthlyCapacity = monthlyIncome * 0.4 - existingDebtRepayment;
  switch (riskLevel) {
    case 'safe':
      return 'This loan appears manageable based on your current income and obligations.';
    case 'caution':
      return 'This loan may create financial pressure. Consider a smaller amount or longer term.';
    case 'high_risk':
    default:
      return `This loan is likely to cause repayment stress. A safer monthly repayment capacity is approximately UGX ${Math.max(safeMonthlyCapacity, 0).toFixed(0)}.`;
  }
}

function buildReasoning({ debtBurdenRatio, costOfBorrowingPct, existingDebtRepayment }) {
  const reasons = [];
  reasons.push(`Your repayment takes ${debtBurdenRatio.toFixed(0)}% of your income`);
  if (costOfBorrowingPct > 10) reasons.push('Loan cost is above the recommended level');
  if (existingDebtRepayment > 0) reasons.push('You already have an existing active loan');
  return reasons;
}

module.exports = {
  calculateTotalRepayment,
  calculateCostOfBorrowingPct,
  calculateDebtBurdenRatio,
  classifyRisk,
  buildRecommendation,
  buildReasoning,
};
```

Thresholds (40% / 60%, 10% cost flag) are placeholders — reasonable,
defensible numbers for a pitch, not a regulatory standard. State this
plainly if a judge asks.

### Borrowing-pattern warning (PS4)
In `loanController.js`, after saving a new `Assessment`, query:
```js
const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
const recentCount = await Assessment.countDocuments({
  user: userId,
  createdAt: { $gte: ninetyDaysAgo },
});
const patternWarning = recentCount >= 3
  ? `You have made ${recentCount} loan checks in the last 90 days. Your borrowing frequency is increasing.`
  : null;
```

## 6. API Endpoints

Base path: `/api`. All request/response bodies are JSON.

### `POST /api/loans/analyze`
- **Route file:** `server/src/routes/loanRoutes.js`
- **Controller:** `loanController.analyzeLoan`
- **Middleware:** `validateLoanInput` (express-validator chain) runs first
- **Purpose:** run the full assessment and persist it (task list §T1.6/T1.8)

Request body:
```json
{
  "userId": "664f1c2e2a1b2c3d4e5f6789",
  "loanAmount": 500000,
  "feeAmount": 50000,
  "interestRate": 10,
  "repaymentPeriodDays": 30,
  "monthlyIncome": 1000000,
  "existingDebtRepayment": 200000
}
```

Response body (`201 Created`):
```json
{
  "assessmentId": "664f1c9e2a1b2c3d4e5f679a",
  "totalRepayment": 550000,
  "costOfBorrowingPct": 10,
  "debtBurdenRatio": 75,
  "riskLevel": "high_risk",
  "plainLanguageSummary": "You are borrowing UGX 500,000 but will repay UGX 550,000 within 30 days.",
  "reasoning": [
    "Your repayment takes 75% of your income",
    "You already have an existing active loan"
  ],
  "recommendationText": "This loan is likely to cause repayment stress. A safer monthly repayment capacity is approximately UGX 200000.",
  "patternWarning": "You have made 3 loan checks in the last 90 days. Your borrowing frequency is increasing."
}
```

Validation errors (`422 Unprocessable Entity`):
```json
{
  "errors": [
    { "field": "loanAmount", "message": "loanAmount is required and must be a positive number" }
  ]
}
```

### `GET /api/loans/:id`
- **Route file:** `server/src/routes/loanRoutes.js`
- **Controller:** `loanController.getLoanReport`
- **Purpose:** re-hydrate a stored assessment into the same response shape as
  `analyze`, so the Safety Report screen can reload/share without
  recomputation.
- Response: same shape as `POST /api/loans/analyze`, `200 OK`, or `404 Not
  Found` with `{ "message": "Assessment not found" }`.

### `GET /api/users/:id/history`
- **Route file:** `server/src/routes/userRoutes.js`
- **Controller:** `userController.getHistory`
- **Purpose:** return the demo user's past assessments for the pattern
  panel. **Only build this if Phase 3 (task.md) is reached with time to
  spare** — the `patternWarning` field already returned by `analyze` is
  sufficient for the MVP demo on its own.
- Response (`200 OK`):
```json
{
  "count": 3,
  "assessments": [
    { "id": "...", "loanAmount": 200000, "riskLevel": "safe", "createdAt": "2026-04-11T10:00:00Z" },
    { "id": "...", "loanAmount": 300000, "riskLevel": "caution", "createdAt": "2026-05-20T10:00:00Z" },
    { "id": "...", "loanAmount": 500000, "riskLevel": "high_risk", "createdAt": "2026-07-01T10:00:00Z" }
  ]
}
```

### `GET /api/health` (build first, in Phase 0)
- **Route file:** `server/src/app.js` (inline, no separate controller needed)
- **Purpose:** trivial liveness check so Phase 0 setup has something concrete
  to verify against.
- Response (`200 OK`): `{ "status": "ok" }`

## 7. Design System — Tailwind CSS + shadcn/ui + lucide-react

Theme: trust + protection (financial safety), not a generic fintech growth
palette. All styling goes through Tailwind utility classes and shadcn/ui
components — **no plain custom CSS files, no CSS-in-JS, no inline `style={}`
color values.**

### 7.1 Setup (Phase 0, see task.md)

1. Install Tailwind: `npm install -D tailwindcss postcss autoprefixer` and
   `npx tailwindcss init -p` inside `client/`.
2. Configure the `@/*` path alias in `vite.config.js` and `jsconfig.json`
   (required by the shadcn CLI).
3. Initialize shadcn/ui: `npx shadcn@latest init`. When prompted, choose the
   **Slate** base color (closest neutral to our navy/slate palette) and
   confirm the CSS file path as `src/styles/globals.css`.
4. Add only the primitives this MVP needs:
   `npx shadcn@latest add button input checkbox card badge label alert`.
5. Install icons: `npm install lucide-react`.

### 7.2 Color Tokens

shadcn/ui generates a base set of CSS variables (HSL) in `globals.css` for
`background`, `foreground`, `card`, `border`, `input`, `ring`, `muted`,
`accent`, `destructive`, `primary`, etc. Two changes on top of the default
init:

**A. Re-point the generated `--primary` token to our brand teal**, in
`client/src/styles/globals.css` under `:root`:
```css
--primary: 175 77% 26%;             /* teal-700 #0F766E — primary actions, links */
--primary-foreground: 0 0% 100%;    /* white text on primary */
```
(shadcn's `Button` with `variant="default"`, focus rings, etc. automatically
pick this up — no per-component overrides needed.)

**B. Add our own semantic tokens** that shadcn doesn't provide out of the
box (risk states + navy), as flat hex values in `tailwind.config.js`:
```js
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // shadcn base tokens (added automatically by `shadcn init`, shown here for reference)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Credi-Check custom semantic colors — flat hex, not tied to shadcn's HSL system
        navy: "#1E293B",
        "navy-foreground": "#F8FAFC",
        safe: "#16A34A",
        "safe-bg": "#DCFCE7",
        caution: "#D97706",
        "caution-bg": "#FEF3C7",
        "high-risk": "#DC2626",
        "high-risk-bg": "#FEE2E2",
      },
    },
  },
};
```

Rule for agents: **never** write a raw hex value inside a `className` string
(e.g. `className="bg-[#DC2626]"` is forbidden) and never use inline
`style={{ color: '...' }}`. Always use the named Tailwind classes below
(`bg-safe`, `text-high-risk`, `bg-navy`, etc.) or shadcn component variants.
This keeps the palette a single source of truth in `tailwind.config.js`.

### 7.3 Component → Tailwind Class / shadcn Component / Icon Mapping

| Component | File | shadcn primitive | Tailwind classes | lucide-react icon |
|---|---|---|---|---|
| App header/nav bar | `App.jsx` | — (plain `<header>`) | `bg-navy text-navy-foreground` | `ShieldCheck` (logo mark, left-aligned) |
| Home hero | `HomePage.jsx` | `Button` | page `bg-background`, heading `text-foreground` | `ShieldCheck` (large, hero icon) |
| Roadmap slide / footer | `RoadmapSlide.jsx` | `Card` (per roadmap stage) | `bg-navy text-navy-foreground` | `Rocket` (final stage), `ArrowRight` (connectors between stages) |
| Form/card containers | `LoanForm.jsx`, `ConsentStep.jsx`, `ResultsDashboard.jsx` | `Card`, `CardHeader`, `CardContent` | shadcn `Card` defaults (`bg-card`, `border-border`) — do not override | — |
| Text inputs | `LoanForm.jsx` | `Input`, `Label` | shadcn `Input` defaults; error state adds `border-high-risk focus-visible:ring-high-risk` | — |
| Field error text | `LoanForm.jsx` | — | `text-high-risk text-sm` | `AlertCircle` (small, inline before error text) |
| Primary submit button ("Check My Loan") | `LoanForm.jsx` | `Button` (`variant="default"`) | uses `bg-primary` automatically via shadcn token | `ArrowRight` (trailing icon) |
| Consent checkboxes | `ConsentStep.jsx` | `Checkbox`, `Label` | shadcn `Checkbox` defaults (checked fill uses `bg-primary` automatically) | `Info` (leading icon per consent line item) |
| Consent "Continue" button | `ConsentStep.jsx` | `Button` | disabled state uses shadcn's built-in `disabled:opacity-50` | `CheckCircle2` (trailing icon) |
| Risk badge — Safe | `RiskBadge.jsx` | `Badge` (custom class override) | `bg-safe-bg text-safe` | `CheckCircle2` |
| Risk badge — Caution | `RiskBadge.jsx` | `Badge` (custom class override) | `bg-caution-bg text-caution` | `AlertTriangle` |
| Risk badge — High Risk | `RiskBadge.jsx` | `Badge` (custom class override) | `bg-high-risk-bg text-high-risk` | `XCircle` |
| Reasoning bullet list | `ReasoningList.jsx` | — | list text `text-foreground`, icon `text-muted-foreground` | `ChevronRight` (one per list item, leading) |
| Recommendation box | `ResultsDashboard.jsx` (recommendation section) | `Alert` | `bg-primary/10 border-primary text-foreground` | `Lightbulb` |
| Pattern warning banner | `PatternWarningBanner.jsx` | `Alert` (`variant` left default, colors overridden) | `bg-caution-bg border-caution text-foreground` | `TrendingUp` |
| Body copy (default) | global | — | `text-foreground` on `bg-card`/`bg-background` | — |
| Secondary/helper copy (e.g. field hints, timestamps) | global | — | `text-muted-foreground` | — |

Every visual element in the app must map to a row in this table before it's
built. If a new UI element is needed mid-build that isn't listed here, add a
row to this table first (and note the addition in `status.md`) rather than
improvising a one-off color or icon choice.

## 8. Non-Functional Notes

- No performance targets beyond "works live on stage without lag."
- No security hardening beyond `validateLoanInput` — this is a prototype,
  say so if asked, don't overclaim production-readiness.
- Keep environment setup (`server/.env.example`, `MONGO_URI`, `PORT`)
  documented in the repo `README.md` so any teammate can run it without
  asking.
- CORS: enable it broadly (`cors()` with default options) in `app.js` for
  the hackathon — do not spend time scoping allowed origins tonight.
