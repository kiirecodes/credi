# Credi-Check — Task Plan (task.md)

This file is the working queue for tonight's build. It is written for both
human teammates and AI coding agents. Read `spec.md` and `architecture.md`
first — this file assumes both are already understood.

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
7. **Follow `architecture.md` exactly** for schema, endpoints, and
   calculation logic. If you believe it's wrong, don't silently deviate —
   note the proposed change in `status.md` under "Decisions/Deviations" and
   proceed with the documented architecture unless a human overrides it.
8. **No scope creep on polish.** Functional and legible beats beautiful.
   Visual polish tasks are explicitly separated out and come last (Phase 5)
   — do not front-load styling work.
9. **Manual test before marking a task Done.** There is no automated test
   suite tonight (deferred, see spec.md §5). Each task includes a "Verify"
   line — actually do that check before marking it complete.

## 1. Skills / Stack Reference for Agents

Use these tools/skills for this build. If a tool below isn't available in the
current environment, note it in `status.md` and use the closest equivalent.

| Area | Skill/tool | Notes |
|---|---|---|
| Backend | Laravel (PHP 8+, Composer) | API-only, no Blade views |
| Database | MySQL + Laravel migrations/Eloquent | Do not hand-write raw SQL migrations unless Eloquent can't express it |
| Frontend | React + Vite | Functional components + hooks only, no class components |
| Styling | Plain CSS or a minimal utility approach | No heavy design system install tonight |
| API testing | curl or Postman/Insomnia (whichever is already installed) | Used to verify each endpoint before wiring the frontend to it |
| Version control | git | Conventional, small commits — see §2 |
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
- <files/modules touched>

Impact:
- <what this enables or unblocks next, or what behavior changes for a user/dev>
```

`<type>` = one of `feat`, `fix`, `chore`, `docs`, `refactor`.
`<scope>` = e.g. `backend`, `frontend`, `db`, `docs`.

Example:
```
feat(backend): implement LoanAssessmentService calculation logic

What changed:
- Added LoanAssessmentService with total_repayment, cost_of_borrowing_pct,
  debt_burden_ratio, and risk_level calculations per architecture.md §4

Why:
- Required for Task B2 (POST /api/analyze-loan) to have real numbers instead
  of placeholders

Affects:
- app/Services/LoanAssessmentService.php (new)

Impact:
- Unblocks Task B2 and B3; frontend can now receive real calculated values
  once the endpoint is wired
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

- **T0.1** Initialize Laravel project, confirm it boots (`php artisan serve`).
  Verify: hitting the default route in a browser/curl returns 200.
- **T0.2** `[P]` Initialize React + Vite project, confirm it boots (`npm run
  dev`). Verify: default Vite page loads in browser.
- **T0.3** Configure MySQL connection in Laravel `.env`, confirm
  `php artisan migrate` runs against an empty schema without error.

### Phase 1 — Backend Core (target: 8 PM–11 PM per spec.md timeline)

- **T1.1** Create `users` migration + `User` model per architecture.md §3.
  Verify: `php artisan migrate` succeeds, table exists.
- **T1.2** Create `assessments` migration + `Assessment` model per
  architecture.md §3, including the `risk_level` enum. Verify: migration
  runs; columns match the schema exactly.
- **T1.3** Seed one demo `User` row via a seeder. Verify: `php artisan
  db:seed` produces exactly one user, note its id in `status.md` (needed by
  the frontend later).
- **T1.4** Implement `LoanAssessmentService` with the calculation logic from
  architecture.md §4 (total_repayment, cost_of_borrowing_pct,
  debt_burden_ratio, risk_level, recommendation_text). Pure PHP class, unit
  of logic only, not wired to a route yet. Verify: manually call it from
  `php artisan tinker` with the example numbers from architecture.md §5 and
  confirm output matches (total_repayment 550000, debt_burden_ratio 75,
  risk_level high_risk).
- **T1.5** Depends on T1.4. Implement `POST /api/analyze-loan`: validates
  input, calls `LoanAssessmentService`, persists an `Assessment` row, returns
  the JSON shape from architecture.md §5. Verify: curl the endpoint with the
  example payload from architecture.md §5, confirm the response shape and
  values match, confirm a row was written to `assessments`.
- **T1.6** Depends on T1.5. Add the borrowing-pattern check (last-90-days
  count ≥ 3) into the `analyze-loan` response as `pattern_warning`. Verify:
  seed 3 assessments for the demo user with `created_at` within 90 days,
  confirm the warning appears on the 3rd/4th call; confirm it's absent when
  fewer than 3 exist.
- **T1.7** Implement `GET /api/loan-report/{id}` re-hydrating a stored
  assessment into the same response shape. Verify: curl it against the id
  created in T1.5, confirm matching values.
- **T1.8** Add basic input validation (required, numeric, positive) to
  `analyze-loan` with a 422 + field errors response on failure. Verify: curl
  with a missing field and with a negative number, confirm 422 and readable
  error messages in both cases.

### Phase 2 — Frontend Core (target: 11 PM–1 AM per spec.md timeline)

- **T2.1** `[P]` Build the Loan Assessment Form screen (6 fields from
  architecture.md §6) with client-side validation (required, positive
  numbers). Verify: submitting empty/invalid input shows inline errors and
  does not call the API.
- **T2.2** Depends on T1.5, T2.1. Wire the form submit to `POST
  /api/analyze-loan`, store the response in component state. Verify: a real
  submission from the UI produces a network request and a populated
  response visible in devtools.
- **T2.3** Build the Consent Step screen: renders the four confirmations
  (amount / total repayment / deadline / fees) using values from the API
  response, submit disabled until all four are checked. Verify: cannot
  proceed to results with fewer than 4 boxes checked.
- **T2.4** Depends on T2.2. Build the Results Dashboard screen: risk badge,
  plain-language summary, key numbers, reasoning bullets, recommendation
  line, pattern warning if present. Verify: full flow (form → consent →
  results) works end-to-end with the demo numbers from architecture.md §5
  and produces a 🔴 high_risk badge.
- **T2.5** Wire the 4-screen flow together as a single step-based state
  machine (Home → Form → Consent → Results) in one parent component. Verify:
  a full manual run-through from Home to Results with no console errors.

### Phase 3 — Wow-Factor Features (target: still within 11 PM–1 AM if Phase 2 finishes early)

- **T3.1** Depends on Phase 1 and Phase 2 complete. Confirm reasoning bullets
  (architecture.md §4/§5) render distinctly (not just raw numbers) on the
  Results Dashboard — e.g. "Your repayment takes 75% of your income" phrased
  in plain language, not just "debt_burden_ratio: 75". Verify: read the
  screen out loud as if pitching — does it sound like a person explaining a
  risk, not a JSON dump?
- **T3.2** Depends on T1.6, T2.4. Add the "Your Borrowing Pattern" panel to
  the Results Dashboard showing `pattern_warning` when present. Verify:
  visible with the seeded 3-assessment demo data from T1.6.

### Phase 4 — Demo Data & Hardening (target: 1 AM–2 AM)

- **T4.1** Prepare 2–3 realistic demo scenarios (one 🟢, one 🟡, one 🔴) with
  clean round numbers, documented in `status.md` or a `demo-data.md` so the
  presenter can type them quickly live. Verify: each scenario produces the
  intended risk badge when run through the real form.
- **T4.2** Walk the full demo script from spec.md §6 end-to-end at least
  twice without any manual data faking. Verify: no crashes, no blank states,
  no console errors, timing feels natural (under ~90 seconds).
- **T4.3** Handle obvious edge cases: zero/negative income, loan amount
  larger than any reasonable income, missing existing debt (should default
  to 0, not error). Verify: each case degrades gracefully (a message or a
  sane default), never a blank screen or 500 error.

### Phase 5 — Polish (target: 2 AM–3 AM, only if earlier phases are Done)

- **T5.1** `[P]` Apply a consistent, minimal color scheme to the risk badges
  (🟢/🟡/🔴) and overall layout. No new dependencies, no animation libraries.
- **T5.2** `[P]` Tighten copy/wording across all screens for the pitch tone
  ("protects" not "calculates").
- **T5.3** `[P]` Prepare the roadmap slide content from spec.md §7 as a
  simple static screen or slide, not wired to any logic.
- **T5.4** Final full run-through of the demo script with the polished UI.
  Verify: same as T4.2, plus confirm nothing broke during polish.

### Explicitly Out of Scope Tonight

Do not create tasks for anything listed in `spec.md` §5. If asked to add one
mid-build, point back to that section rather than improvising a new task.

---

## 5. Handover Note

At the end of the night (or at any handover point), the last update in
`status.md` must state: what's Done, what's In Progress, what's Blocked, and
which Phase/Task to resume at. Do not leave a handover without this summary.
