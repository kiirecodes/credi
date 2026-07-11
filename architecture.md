# Credi-Check — Architecture (architecture.md)

Companion to `spec.md`. This is the build blueprint — implementers should not
need to make architectural decisions on their own; they should follow this file
and log deviations in `status.md`.

---

## 1. Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React + Vite | Plain CSS or a minimal utility approach — no heavy design system tonight |
| Backend | Laravel (PHP) API | JSON API only, no server-rendered views |
| Database | MySQL | Two tables for MVP, see §3 |
| Auth | None, or a single hardcoded demo user | Do not build real auth (see spec.md §5) |
| Hosting for demo | Local (localhost) is fine; deploy only if time allows after MVP flow works | |

## 2. System Overview

```
 ┌───────────────┐        JSON/HTTP        ┌───────────────────┐        ┌──────────┐
 │  React + Vite │  ───────────────────▶   │   Laravel API      │  ───▶  │  MySQL   │
 │  (frontend)   │  ◀───────────────────   │  (Credi-Check core) │  ◀───  │          │
 └───────────────┘                          └───────────────────┘        └──────────┘
        │                                            │
        │  renders                                   │  runs
        ▼                                            ▼
  Results Dashboard                        Loan calculation + risk rules
  Safety Report                            (pure functions, no ML)
```

All risk logic lives server-side in Laravel (a single `LoanAssessmentService`
class). The frontend never re-implements the math — it only displays what the
API returns. This keeps the "intelligence" centralized and easy to demo/explain.

## 3. Database Schema

### `users`
| Column | Type | Notes |
|---|---|---|
| id | bigint, PK | |
| name | varchar | |
| email | varchar, unique | |
| created_at / updated_at | timestamp | |

For the hackathon, a single seeded demo user is enough. Do not build
registration/login flows.

### `assessments`
| Column | Type | Notes |
|---|---|---|
| id | bigint, PK | |
| user_id | bigint, FK → users.id | |
| loan_amount | decimal(12,2) | |
| fee_amount | decimal(12,2) | |
| interest_rate | decimal(5,2) | percentage |
| repayment_period_days | int | |
| monthly_income | decimal(12,2) | |
| existing_debt_repayment | decimal(12,2) | monthly repayment on existing loans |
| total_repayment | decimal(12,2) | computed, stored for history/report reuse |
| cost_of_borrowing_pct | decimal(5,2) | computed |
| debt_burden_ratio | decimal(5,2) | computed |
| risk_level | enum('safe','caution','high_risk') | computed |
| recommendation_text | text | computed, stored so the report can be re-fetched |
| created_at / updated_at | timestamp | used to detect borrowing frequency (PS4) |

No other tables are needed for the MVP. Do not add lender, notification, or
audit-log tables tonight — see spec.md §5.

## 4. Calculation Logic (single source of truth)

Implement as one service class, e.g. `App\Services\LoanAssessmentService`, so
the rules are in one place and easy to unit-test manually during the demo prep.

```
total_repayment        = loan_amount + fee_amount + (loan_amount * interest_rate / 100)
cost_of_borrowing_pct  = (total_repayment - loan_amount) / loan_amount * 100
new_loan_monthly_cost  = total_repayment / (repayment_period_days / 30)   // normalize to monthly
debt_burden_ratio      = (existing_debt_repayment + new_loan_monthly_cost) / monthly_income * 100

risk_level:
  debt_burden_ratio <= 40   → 'safe'
  40 < ratio <= 60          → 'caution'
  ratio > 60                → 'high_risk'

recommendation_text:
  'safe'      → "This loan appears manageable based on your current income and obligations."
  'caution'   → "This loan may create financial pressure. Consider a smaller amount or longer term."
  'high_risk' → "This loan is likely to cause repayment stress. A safer amount would be
                 approximately {income * 0.4 - existing_debt_repayment} UGX/month capacity."
```

These thresholds (40% / 60%) are placeholders — reasonable, defensible numbers
for a pitch, not a regulatory standard. State this plainly if a judge asks.

### Borrowing-pattern warning (PS4)
On each new assessment for a user, query their `assessments` from the last 90
days:
```
if count(assessments in last 90 days) >= 3:
    show: "You have made {count} loan checks in the last 90 days.
           Your borrowing frequency is increasing."
```

## 5. API Endpoints

### `POST /api/analyze-loan`
Request body:
```json
{
  "user_id": 1,
  "loan_amount": 500000,
  "fee_amount": 50000,
  "interest_rate": 10,
  "repayment_period_days": 30,
  "monthly_income": 1000000,
  "existing_debt_repayment": 200000
}
```
Response body:
```json
{
  "assessment_id": 12,
  "total_repayment": 550000,
  "cost_of_borrowing_pct": 10,
  "debt_burden_ratio": 75,
  "risk_level": "high_risk",
  "plain_language_summary": "You are borrowing UGX 500,000 but will repay UGX 550,000 within 30 days.",
  "reasoning": [
    "Your repayment takes 75% of your income",
    "Loan cost is above the recommended level"
  ],
  "recommendation_text": "...",
  "pattern_warning": "You have made 3 loan checks in the last 90 days. Your borrowing frequency is increasing."
}
```
Validation: all numeric fields required, must be positive numbers. Return 422
with field errors on failure — the frontend should render these inline, not as
a generic crash.

### `GET /api/loan-report/{id}`
Returns the same shape as above, re-hydrated from the stored `assessments` row.
Used so the Safety Report screen can be reloaded/shared without recomputation.

### `GET /api/users/{id}/history` (only if time allows)
Returns a list of past assessments for the pattern panel. If time is short,
seed this data directly in the database and skip building this endpoint —
render the pattern warning as part of the `analyze-loan` response instead
(already included above).

## 6. Frontend Screens

1. **Home** — one-line pitch + "Check a Loan" button. Minimal, no scroll needed.
2. **Loan Assessment Form** — the six input fields from §3, client-side
   validation (required, positive numbers only), single "Check My Loan" submit.
3. **Consent Step** — checklist (amount / total repayment / deadline / fees
   understood) rendered from the API response before revealing results. Submit
   disabled until all four are ticked.
4. **Results Dashboard** — risk badge (🟢/🟡/🔴) large and central, then: plain-
   language summary line, key numbers (total repayment, cost %, debt burden %),
   reasoning bullets, recommendation line, pattern warning (if present).
5. **Safety Report** (optional 4th screen if time allows) — same data as the
   dashboard in a "shareable report" layout; can be the same component reused
   with a print-style CSS class rather than a separate build.

Keep all four/five screens in a single-page flow (no router complexity needed)
unless React Router is already comfortable — a simple step-based state machine
in one component is faster to build and demo reliably.

## 7. Non-Functional Notes

- No performance targets beyond "works live on stage without lag."
- No security hardening beyond basic input validation — this is a prototype,
  say so if asked, don't overclaim production-readiness.
- Keep environment setup (`.env`, DB credentials) documented in the repo README
  so any teammate can run it without asking.
