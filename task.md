# Credi-Check — Task Plan (task.md)

This file is the working queue for tonight's build. It is written for both
human teammates and AI coding agents. Read `spec.md` and `architecture.md`
**in full** before starting — this file assumes both are understood,
including the folder structure (architecture.md §3), schema (§4), calculation
logic (§5), endpoints (§6), and design system (§7). Task descriptions below
reference those sections by number instead of repeating them.

**Stack: MERN + Tailwind CSS + shadcn/ui + lucide-react.** Every task below
assumes this stack — do not substitute Laravel/PHP/MySQL, plain CSS, another
component library, or another icon set.

---

## 0. Instructions for Agents (read before doing anything)

1. **Scope discipline.** Only build what is listed as in-scope in `spec.md`
   §4. If a task tempts you toward something in `spec.md` §5 (deferred/
   overkill), stop and flag it in `status.md` instead of building it.
2. **One task at a time.** Work top-to-bottom within a phase unless a task is
   explicitly marked `[parallelizable]`. Do not start a task whose
   dependencies aren't marked `Done` in `status.md`.
3. **Small, committable units.** Each task below is sized to be one commit.
   If a task turns out to be bigger than expected, split it and note the
   split in `status.md` rather than bundling unrelated changes into one
   commit.
4. **Commit after every completed task — no exceptions.** See §2 for the
   required commit format. Do not batch multiple tasks into one commit, and
   do not leave a completed task uncommitted at a handover point.
5. **Update `status.md` after every task**, whether it succeeded, partially
   succeeded, or is blocked. See §3 for the required format.
6. **When blocked**, do not silently skip the task. Log the blocker in
   `status.md` with enough detail that another agent or a human can pick it
   up cold, then move to the next non-dependent task if one exists.
7. **Follow `architecture.md` exactly** — folder paths, file names, schema
   field names, endpoint paths, and the design-system mapping table (§7.3)
   must match it precisely so parallel tasks don't collide. If you believe
   it's wrong, don't silently deviate — note the proposed change in
   `status.md` under "Decisions/Deviations" and proceed with the documented
   architecture unless a human overrides it.
8. **Styling discipline — Tailwind + shadcn/ui + lucide-react only.**
   - No plain custom `.css` files beyond the generated `globals.css`.
   - No inline `style={{ ... }}` for colors, no raw hex in `className`
     strings (e.g. `bg-[#DC2626]` is forbidden).
   - Use shadcn/ui primitives (`Button`, `Input`, `Checkbox`, `Card`,
     `Badge`, `Label`, `Alert`) instead of hand-rolled equivalents.
   - Use `lucide-react` for every icon — no emoji-as-icon, no SVGs pasted
     in by hand, no other icon package.
   - Every visual element must match a row in architecture.md §7.3 before
     it's built; add a row there first if something new is genuinely
     needed.
9. **No scope creep on polish.** Functional and legible beats beautiful.
   Visual polish tasks are explicitly separated out and come last (Phase 5)
   — do not front-load styling work beyond wiring the correct shadcn
   component + Tailwind classes + icon per §7.3.
10. **Manual test before marking a task Done.** There is no automated test
    suite tonight (deferred, see spec.md §5). Each task includes a "Verify"
    line — actually run that check before marking it complete.

## 1. Skills / Stack Reference for Agents

| Area | Skill/tool | Notes |
|---|---|---|
| Backend runtime | Node.js (18+), npm | |
| Backend framework | Express | REST/JSON API only, no server-rendered views |
| Database | MongoDB + Mongoose ODM | Local MongoDB instance or a free Atlas cluster — whichever is already available |
| Validation | express-validator | Used in `middleware/validateLoanInput.js` |
| Frontend | React + Vite | Functional components + hooks only, no class components |
| HTTP client (frontend) | axios | Centralized in `client/src/services/api.js`, never call `fetch` ad hoc in components |
| Styling | Tailwind CSS | Utility classes only, config in `tailwind.config.js` per architecture.md §7.2 |
| Component library | shadcn/ui | CLI-generated components in `client/src/components/ui/`, see architecture.md §7.1 for install steps |
| Icons | lucide-react | One import style everywhere: `import { IconName } from 'lucide-react'` |
| API testing | curl or Postman/Insomnia (whichever is already installed) | Used to verify each endpoint before wiring the frontend to it |
| Version control | git | Small, conventional commits — see §2 |
| Docs skill | N/A — these are plain markdown files, no docx/pptx tooling needed | |

## 2. Commit Protocol (mandatory for every completed task)

After completing each task, commit with this structure:

```
<type>(<scope>): <short summary of what changed>

What changed:
- <bullet list of concrete changes>

Why:
- <the reason this was needed, tied back to a task ID below>

Affects:
- <files/modules touched, exact paths>

Impact:
- <what this enables or unblocks next, or what behavior changes for a user/dev>
```

`<type>` = one of `feat`, `fix`, `chore`, `docs`, `refactor`.
`<scope>` = one of `server`, `client`, `db`, `docs`.

Example:
```
feat(client): scaffold Tailwind + shadcn/ui + lucide-react

What changed:
- Installed tailwindcss, postcss, autoprefixer and ran `tailwindcss init -p`
- Ran `shadcn init` (Slate base) and `shadcn add button input checkbox
  card badge label alert`
- Installed lucide-react
- Re-pointed --primary/--primary-foreground to brand teal and added
  navy/safe/caution/high-risk tokens to tailwind.config.js per
  architecture.md §7.2

Why:
- Required before any component task (T2.x) can be started, per
  architecture.md §7.1 setup order

Affects:
- client/tailwind.config.js (new), client/postcss.config.js (new),
  client/components.json (new), client/src/styles/globals.css (new),
  client/src/components/ui/*.jsx (new), client/src/lib/utils.js (new),
  client/package.json

Impact:
- Unblocks all Phase 2 component tasks; every subsequent component can now
  import shadcn primitives and use the safe/caution/high-risk/navy classes
```

Every commit message must be able to answer, at a glance: what changed, why,
what it touches, and what it unblocks. Do not write commit messages like
"update stuff" or "wip".

## 3. `status.md` Update Protocol

After every task, append (do not overwrite) an entry to `status.md` using the
template defined in that file. Never delete prior entries — this is a running
log for the whole night.

---

## 4. Task Queue

Legend: `[P]` = parallelizable with sibling tasks in the same phase.

### Phase 0 — Setup (target: first 30 min)

- **T0.1** Create the monorepo root `credicheck/` with `server/`, `client/`,
  and `docs/` per architecture.md §3. Move `spec.md`, `architecture.md`,
  `task.md`, `status.md` into `docs/`. Verify: folder structure matches §3
  exactly (`ls -R` and eyeball it).
- **T0.2** Initialize the server: `cd server && npm init -y`, then install
  `express mongoose cors dotenv express-validator` and dev-dependency
  `nodemon`. Add an `npm run dev` script running `nodemon server.js`. Create
  `server/.env.example` with `PORT=5000` and `MONGO_URI=` (blank). Verify:
  `npm run dev` starts without error even before any routes exist (a bare
  Express app that just calls `app.listen`).
- **T0.3** `[P]` Initialize the client: `cd client && npm create vite@latest
  . -- --template react`, then `npm install axios`. Verify: `npm run dev`
  boots and the default Vite page loads in a browser.
- **T0.4** Depends on T0.3. Install and configure Tailwind CSS in `client/`:
  `npm install -D tailwindcss postcss autoprefixer` then `npx tailwindcss
  init -p`. Set `content: ["./index.html", "./src/**/*.{js,jsx}"]` in
  `tailwind.config.js`. Add the three `@tailwind` directives to
  `client/src/styles/globals.css` and import that file once in `main.jsx`.
  Verify: add a temporary `className="text-red-500"` to any element in
  `App.jsx`, confirm it renders red in the browser, then remove it.
- **T0.5** Depends on T0.4. Set up the `@/*` path alias (edit
  `vite.config.js` to add the `resolve.alias` entry and create/edit
  `jsconfig.json` per architecture.md §3), then run `npx shadcn@latest
  init` (Slate base color, CSS path `src/styles/globals.css`), then `npx
  shadcn@latest add button input checkbox card badge label alert`. Install
  icons with `npm install lucide-react`. Verify: `client/src/components/ui/`
  contains `button.jsx`, `input.jsx`, `checkbox.jsx`, `card.jsx`,
  `badge.jsx`, `label.jsx`, `alert.jsx`; a scratch import of `Button` from
  `@/components/ui/button` renders without error.
- **T0.6** Depends on T0.5. Apply the two color-token edits from
  architecture.md §7.2: (A) update `--primary`/`--primary-foreground` in
  `globals.css` to the brand teal HSL values given there, and (B) add the
  `navy`, `navy-foreground`, `safe`, `safe-bg`, `caution`, `caution-bg`,
  `high-risk`, `high-risk-bg` entries to `tailwind.config.js`
  `theme.extend.colors`. Verify: render a temporary `<div
  className="bg-safe-bg text-safe p-2">test</div>` and a shadcn `<Button>`
  in `App.jsx`, confirm the custom color renders and the button renders in
  brand teal (not the shadcn default slate), then remove the temporary div.
- **T0.7** Implement `server/src/config/db.js` exporting a `connectDB()`
  function that connects Mongoose to `process.env.MONGO_URI`, logs success,
  and exits the process on failure. Wire it into `server.js`. Verify:
  running the server against a real/local `MONGO_URI` in `.env` logs a
  successful connection message; running it with a deliberately broken URI
  logs an error and exits (confirms the failure path isn't silent).
- **T0.8** Implement `server/src/app.js` (Express app setup: `express.json()`
  middleware, `cors()`, route mounting placeholder) and the `GET
  /api/health` endpoint inline per architecture.md §6. Verify: `curl
  http://localhost:5000/api/health` returns `{"status":"ok"}` with a 200.

### Phase 1 — Backend Core (target: 8 PM–11 PM per spec.md timeline)

- **T1.1** Create `server/src/models/User.js` — Mongoose schema with `name`
  (String, required), `email` (String, required, unique), `{ timestamps:
  true }`, per architecture.md §4. Verify: import the model in a throwaway
  Node script or via `node -e`, confirm no schema errors on load.
- **T1.2** Create `server/src/models/Assessment.js` — Mongoose schema with
  all fields listed in architecture.md §4 (`user` ref, `loanAmount`,
  `feeAmount`, `interestRate`, `repaymentPeriodDays`, `monthlyIncome`,
  `existingDebtRepayment` default 0, `totalRepayment`, `costOfBorrowingPct`,
  `debtBurdenRatio`, `riskLevel` enum `['safe','caution','high_risk']`,
  `recommendationText`, `{ timestamps: true }`). Verify: field names and
  types match architecture.md §4 exactly — cross-check line by line before
  marking Done.
- **T1.3** Create `server/src/seeders/seedDemoData.js` — a standalone script
  (run with `node src/seeders/seedDemoData.js`) that connects to the DB,
  clears existing `User`/`Assessment` documents, inserts one demo `User`,
  and logs the created user's `_id` to the console. Verify: run the script,
  confirm exactly one user exists in the `users` collection afterward, and
  copy the printed `_id` into `status.md` (needed by frontend testing
  later).
- **T1.4** Implement `server/src/services/loanAssessmentService.js` exactly
  as specified in architecture.md §5 — all six exported functions
  (`calculateTotalRepayment`, `calculateCostOfBorrowingPct`,
  `calculateDebtBurdenRatio`, `classifyRisk`, `buildRecommendation`,
  `buildReasoning`). Pure functions only — no database or Express imports in
  this file. Verify: from a throwaway script, call the functions in
  sequence with the example numbers from architecture.md §6 (loanAmount
  500000, feeAmount 50000, interestRate 10, repaymentPeriodDays 30,
  monthlyIncome 1000000, existingDebtRepayment 200000) and confirm
  `totalRepayment` = 550000, `debtBurdenRatio` = 75, `riskLevel` =
  `'high_risk'`.
- **T1.5** Create `server/src/middleware/validateLoanInput.js` using
  `express-validator`: an array of validation chains requiring `userId`
  (valid Mongo ObjectId string), `loanAmount`, `feeAmount`, `interestRate`,
  `repaymentPeriodDays`, `monthlyIncome` (all positive numbers), and
  `existingDebtRepayment` (optional, non-negative number, default 0), plus a
  final middleware function that checks `validationResult(req)` and returns
  `422` with the `{ errors: [...] }` shape from architecture.md §6 if any
  failed. Verify: unit-test manually via curl with a missing field and with
  a negative number (see T1.7 for the running server needed to test this).
- **T1.6** Depends on T1.1–T1.4. Implement `server/src/controllers/
  loanController.js` → `analyzeLoan(req, res)`: reads validated body, calls
  the `loanAssessmentService` functions in order (total repayment → cost of
  borrowing → debt burden ratio → risk level → recommendation → reasoning),
  saves a new `Assessment` document with all computed fields, then responds
  `201` with the exact JSON shape from architecture.md §6 (`assessmentId`,
  `totalRepayment`, `costOfBorrowingPct`, `debtBurdenRatio`, `riskLevel`,
  `plainLanguageSummary`, `reasoning`, `recommendationText`,
  `patternWarning`). Build `plainLanguageSummary` as a template string:
  `` `You are borrowing UGX ${loanAmount.toLocaleString()} but will repay UGX ${totalRepayment.toLocaleString()} within ${repaymentPeriodDays} days.` ``.
  Leave `patternWarning` as `null` for now — implemented next in T1.8.
  Verify: not yet callable until T1.7 wires the route — hold verification
  for T1.7.
- **T1.7** Create `server/src/routes/loanRoutes.js` mounting `POST
  /analyze` → `validateLoanInput` + `loanController.analyzeLoan`, and
  mount this router at `/api/loans` in `app.js`. Verify: `curl -X POST
  http://localhost:5000/api/loans/analyze -H "Content-Type: application/json"
  -d '{"userId":"<seeded id from T1.3>","loanAmount":500000,"feeAmount":50000,
  "interestRate":10,"repaymentPeriodDays":30,"monthlyIncome":1000000,
  "existingDebtRepayment":200000}'` returns `201` with `riskLevel:
  "high_risk"` and `debtBurdenRatio: 75`, and confirm a new document exists
  in the `assessments` collection.
- **T1.8** Depends on T1.6, T1.7. Add the borrowing-pattern check to
  `analyzeLoan` exactly as specified in architecture.md §5 (90-day
  `countDocuments` query, threshold ≥ 3), setting `patternWarning` on the
  response instead of `null`. Verify: using the seeded demo user, POST to
  `/api/loans/analyze` four times in a row (varying the loan numbers
  slightly is fine); confirm `patternWarning` is `null` on calls 1–2 and a
  non-null warning string on calls 3–4.
- **T1.9** Implement `loanController.getLoanReport(req, res)`: looks up an
  `Assessment` by `req.params.id`, returns `404` with `{ "message":
  "Assessment not found" }` if missing, otherwise re-derives the same
  response shape as `analyzeLoan` from the stored fields (recompute
  `plainLanguageSummary` and `reasoning` from stored values rather than
  re-running the calculation service, since the numbers are already
  persisted). Add `GET /:id` to `loanRoutes.js`. Verify: `curl
  http://localhost:5000/api/loans/<assessmentId from T1.7>` returns `200`
  with matching values; `curl .../api/loans/000000000000000000000000`
  returns `404`.

### Phase 2 — Frontend Core (target: 11 PM–1 AM per spec.md timeline)

Phase 0 (T0.4–T0.6) must be Done before any task in this phase starts —
Tailwind, shadcn/ui, and lucide-react must already be installed and
color-configured.

- **T2.1** Create `client/src/services/api.js`: an axios instance with
  `baseURL: 'http://localhost:5000/api'`, and two exported functions —
  `analyzeLoan(payload)` (POST `/loans/analyze`) and `getLoanReport(id)`
  (GET `/loans/:id`) — both returning `response.data` and letting errors
  propagate to the caller. Verify: call `analyzeLoan` with the T1.7 example
  payload from a temporary console log in `App.jsx`, confirm the response
  logs correctly, then remove the temporary log.
- **T2.2** `[P]` Build `client/src/components/LoanForm.jsx` using the
  shadcn `Card`/`CardHeader`/`CardContent` wrapper and shadcn `Input` +
  `Label` for each of the six fields (loan amount, fee amount, interest
  rate, repayment period days, monthly income, existing debt repayment),
  per architecture.md §7.3. Local component state, client-side validation
  (required, must be a positive number) shown as inline error text (`text-
  high-risk text-sm` with a leading `AlertCircle` icon from `lucide-react`)
  under each field. Submit button is a shadcn `Button` with a trailing
  `ArrowRight` icon. Form does not call the API itself — it calls an
  `onSubmit(values)` prop passed down from the parent. Verify: submitting
  with an empty or negative field shows the inline error with the icon and
  does **not** call `onSubmit`; submitting with valid values calls
  `onSubmit` with the correct object shape; confirm the submit button
  renders in brand teal, not shadcn's default color.
- **T2.3** Depends on T2.1, T2.2. Create `client/src/pages/
  AssessmentFlowPage.jsx` as the step-based state machine (`step` state:
  `'form' | 'consent' | 'results'`) that owns the API call: renders
  `LoanForm`, on submit calls `analyzeLoan()` from `api.js`, stores the
  response in state, and transitions to `'consent'` on success (show a
  shadcn `Alert` with `destructive` styling on failure, do not crash).
  Verify: submitting the T1.7 example values through the real UI produces a
  network request in devtools and transitions to the consent step with a
  populated response object in React state.
- **T2.4** `[P]` Build `client/src/components/ConsentStep.jsx` using shadcn
  `Card` + `Checkbox` + `Label`: renders four checkboxes labeled from the
  stored response (amount, total repayment, deadline, fees — pull the
  actual numbers into the label text, don't just say "I understand the
  fees"), each with a leading `Info` icon from `lucide-react` per
  architecture.md §7.3. "Continue" button is a shadcn `Button` with a
  trailing `CheckCircle2` icon, disabled (shadcn's built-in `disabled`
  state) until all four are checked. On confirm, calls an `onConfirm()`
  prop to advance the parent's `step` state to `'results'`. Verify: cannot
  click Continue with fewer than 4 boxes checked; checking all 4 enables it
  and clicking advances the flow; checked-state fill color matches brand
  teal (confirms T0.6 primary token override worked).
- **T2.5** `[P]` Build `client/src/components/RiskBadge.jsx`: a single
  component taking a `riskLevel` prop (`'safe' | 'caution' | 'high_risk'`)
  built on top of the shadcn `Badge` primitive with class overrides, and
  rendering the correct lucide icon + label + color pair exactly per
  architecture.md §7.3: `safe` → `CheckCircle2` icon, `bg-safe-bg text-
  safe`; `caution` → `AlertTriangle` icon, `bg-caution-bg text-caution`;
  `high_risk` → `XCircle` icon, `bg-high-risk-bg text-high-risk`. Verify:
  render it three times with each of the three `riskLevel` values in a
  scratch page, visually confirm all three icon/color pairs are correct
  against architecture.md §7.3.
- **T2.6** `[P]` Build `client/src/components/ReasoningList.jsx` (renders
  the `reasoning` array as a list, each item prefixed with a `ChevronRight`
  icon in `text-muted-foreground`, text in `text-foreground`, per
  architecture.md §7.3) and `client/src/components/
  PatternWarningBanner.jsx` (built on the shadcn `Alert` primitive with
  `bg-caution-bg border-caution text-foreground` and a leading `TrendingUp`
  icon, rendering `patternWarning` text if non-null; renders nothing if
  `patternWarning` is `null`). Verify: both components render correctly
  with sample props in isolation (a temporary line in `App.jsx` is fine for
  this check, then remove it).
- **T2.7** Depends on T2.3, T2.5, T2.6. Build `client/src/components/
  ResultsDashboard.jsx` on a shadcn `Card`, composing: `RiskBadge`, the
  plain-language summary line, the key numbers (total repayment, cost %,
  debt burden %), `ReasoningList`, the recommendation box (shadcn `Alert`
  with `bg-primary/10 border-primary text-foreground` and a leading
  `Lightbulb` icon per architecture.md §7.3), and `PatternWarningBanner`.
  Verify: full flow (form → consent → results) run manually with the T1.7
  example values produces a 🔴-equivalent high_risk badge (`XCircle` icon,
  red tones) with all fields populated and correctly colored/iconed per
  §7.3.
- **T2.8** Wire `HomePage.jsx` (large `ShieldCheck` icon, one-line pitch,
  shadcn `Button` "Check a Loan") and `App.jsx` (renders the `bg-navy text-
  navy-foreground` header with a small `ShieldCheck` logo mark per
  architecture.md §7.3, then either `HomePage` or `AssessmentFlowPage`
  based on a simple `hasStarted` boolean state). Verify: a full manual
  run-through from Home → Form → Consent → Results with no console errors
  and no broken styling at any step.

### Phase 3 — Wow-Factor Features (target: still within 11 PM–1 AM if Phase 2 finishes early)

- **T3.1** Depends on Phase 1 and Phase 2 complete. Read the Results
  Dashboard out loud as if pitching — confirm `reasoning` bullets read as
  plain sentences (already true if T1.6/architecture.md §5 was followed
  exactly), not raw field names. If any bullet reads like a variable name,
  fix the string template in `loanAssessmentService.js`'s `buildReasoning`
  function, not in the frontend. Verify: no bullet contains a raw field
  name like `debtBurdenRatio`.
- **T3.2** Depends on T1.8, T2.7. Confirm `PatternWarningBanner` is visibly
  wired into `ResultsDashboard` and appears with the seeded 3+ assessment
  demo data from T1.8's manual test. Verify: rerun the T1.8 curl sequence,
  then run the same 4 submissions through the real UI form and confirm the
  banner (with its `TrendingUp` icon and caution coloring) appears on
  submission 3 and 4.
- **T3.3** `[P]` Only if time allows: implement `GET /api/users/:id/history`
  (`userController.getHistory` + `userRoutes.js`) per architecture.md §6,
  and a small "Your Borrowing Pattern" history list in `ResultsDashboard.jsx`
  (each row reusing `RiskBadge`) showing the last few assessments. This is
  explicitly optional — `patternWarning` from T1.8 already satisfies the
  MVP demo requirement in spec.md §8. Do not start this before T4 tasks are
  planned if time is tight.

### Phase 4 — Demo Data & Hardening (target: 1 AM–2 AM)

- **T4.1** Extend `seedDemoData.js` (or add a sibling script) to insert 2–3
  realistic demo `Assessment` documents for the seeded user — one landing
  in `'safe'`, one in `'caution'`, one in `'high_risk'` — with clean round
  numbers. Document the exact input values used for each scenario directly
  in `status.md` under a "Demo Data" note so the presenter can type them
  quickly live. Verify: each scenario, when the same inputs are typed into
  the real form, produces the intended risk badge with the correct icon
  and color.
- **T4.2** Walk the full demo script from spec.md §6 end-to-end at least
  twice without any manual data faking (real form → real API → real DB).
  Verify: no crashes, no blank states, no console errors, timing feels
  natural (under ~90 seconds).
- **T4.3** Handle edge cases in both `validateLoanInput.js` and
  `LoanForm.jsx`: zero/negative income should be rejected client-side and
  server-side with a clear message and `AlertCircle` icon; loan amount
  larger than any reasonable income should still compute (not error) and
  simply show `high_risk`; missing `existingDebtRepayment` should default
  to `0` (already handled by the Mongoose schema default in T1.2 — confirm
  this, don't re-implement it). Verify: each case degrades gracefully (a
  message or a sane default), never a blank screen or 500 error.

### Phase 5 — Polish (target: 2 AM–3 AM, only if earlier phases are Done)

- **T5.1** `[P]` Final pass over every component to confirm zero raw hex
  values or arbitrary-value Tailwind classes remain outside
  `tailwind.config.js`/`globals.css` (grep for `#` and `bg-\[` / `text-\[`
  in `client/src/components/*.jsx`, `client/src/components/ui/*.jsx` edits,
  and `client/src/pages/*.jsx` — any hit that isn't a comment is a
  violation of Rule 8 in §0 and must be fixed to use a named Tailwind
  class instead).
- **T5.2** `[P]` Tighten copy/wording across all screens for the pitch tone
  ("protects" not "calculates").
- **T5.3** `[P]` Build `client/src/components/RoadmapSlide.jsx`
  (`bg-navy text-navy-foreground`, one shadcn `Card` per roadmap stage
  connected by `ArrowRight` icons, ending with a `Rocket` icon on the final
  stage per architecture.md §7.3) presenting the roadmap content from
  spec.md §7 as a static screen — not wired to any logic, shown only when
  the presenter navigates to it manually (e.g. a simple button on
  `HomePage`).
- **T5.4** Final full run-through of the demo script with the polished UI.
  Verify: same as T4.2, plus confirm nothing broke during polish and the
  T5.1 grep check is still clean.

### Explicitly Out of Scope Tonight

Do not create tasks for anything listed in `spec.md` §5. If asked to add one
mid-build, point back to that section rather than improvising a new task.

---

## 5. Handover Note

At the end of the night (or at any handover point), the last update in
`status.md` must state: what's Done, what's In Progress, what's Blocked, and
which Phase/Task to resume at. Do not leave a handover without this summary.
