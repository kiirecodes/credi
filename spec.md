# Credi-Check — Product Specification (spec.md)

## 0. Status
Draft v1.0 — hackathon MVP scope. Owner: kiirecodes. Deadline: tonight → 3:00 AM.

---

## 1. Problem

Digital lending apps let people accept high-cost loans in seconds. Most borrowers do
not clearly see the real cost of the loan, cannot tell whether they can actually
afford the repayment, and have no system that warns them before they slide into a
debt cycle across multiple lenders.

The theme gives four problem statements. We are not building four features bolted
together — we are building one product that sits at the intersection of all four:

| # | Problem Statement | How Credi-Check addresses it |
|---|---|---|
| 1 | Active opt-in + clear information before disbursement | Consent Engine: user must explicitly confirm they understand amount, fees, total repayment, deadline before the tool "signs off" |
| 2 | Real-time affordability/suitability scoring without compromising privacy | Suitability Engine: local calculation from user-entered income/expenses, no external data pulled, no data resale |
| 3 | Plain-language visibility of pricing, fees, and total repayment | Transparency Engine: converts raw loan terms into a plain-language cost breakdown |
| 4 | Early warning system for over-indebtedness | Pattern Engine: tracks a user's logged loans over time and flags rising borrowing frequency/debt burden |

## 2. Product Concept

**Credi-Check** is a borrower protection intelligence layer — not a lender, not a
loan marketplace. It sits between a borrower and a loan offer and answers one
question:

> "Is this loan safe, understandable, and suitable for this person right now?"

## 3. The One Magical Moment (MVP North Star)

> Enter a loan offer + basic finances → Credi-Check tells you whether you should
> accept it, and why.

Every MVP feature exists to make this one moment work end-to-end and look credible.
Nothing else gets built tonight unless this moment is solid first.

## 4. MVP Feature List (build tonight)

These are the ONLY features in scope for the 65%+ working demo. Each is rated by
how essential it is to the golden moment.

### 4.1 Loan Safety Analyzer — ⭐ Core (must-have)
Input: loan amount, fee, interest rate, repayment period, monthly income, existing
debt/repayments.
Output:
- Total repayment amount
- Cost of borrowing (as a % and as a plain UGX figure)
- Debt burden ratio = (existing repayments + new loan repayment) / income
- Risk classification: 🟢 Safe to Consider / 🟡 Borrow with Caution / 🔴 High
  Financial Risk

### 4.2 Plain-Language Breakdown — ⭐ Core (must-have)
Turns the raw numbers into one or two human sentences, e.g. "You are borrowing
UGX 500,000 but will repay UGX 550,000 within 30 days — that's an extra UGX
50,000."

### 4.3 Consent Confirmation Step — Must-have, cheap to build
A checklist UI ("I understand the amount / total repayment / deadline / fees")
that must be ticked before the result is revealed. This is what visibly ties the
demo to Problem Statement 1 — do not skip it, it costs almost nothing to build.

### 4.4 Safety Report / Reasoning Breakdown — ⭐ Wow factor
After the risk classification, show a short bullet list of *why*:
- "Your repayment takes 55% of your income"
- "Loan cost is above the recommended threshold"
- "You already have an existing active loan"
Rules-based, not ML. This is what makes judges feel the product is "intelligent."

### 4.5 Rule-Based Recommendation Line — Wow factor, cheap
One sentence of guidance generated from simple thresholds, e.g. "A safer
borrowing amount could be approximately UGX 400,000." No AI/ML model — if/else
logic on the numbers already calculated in 4.1.

### 4.6 Loan History Log (single user, in-session or DB-backed) — Demonstrates PS4
Store 2–3 previous assessments (can be pre-seeded demo data) so the system can
say: "You have made 3 loan checks in the last 90 days — your borrowing frequency
is increasing." This proves the over-indebtedness angle without needing real
multi-lender integration.

### 4.7 Minimal Results Dashboard UI — Must-have
One clean screen showing the risk badge, the numbers, the plain-language line,
and the reasoning bullets. This is the screen judges will remember — see
`architecture.md` for the exact layout.

## 5. Explicitly Deferred / Overkill for MVP

Do not attempt these tonight. Listed with the reason, so nobody re-litigates it
at 1 AM.

| Feature | Why it's deferred |
|---|---|
| Mobile money / lender API integration | No real lender will give hackathon access in time; fake data proves the concept fine |
| User authentication (full OAuth/JWT flows) | Adds hours of plumbing for zero demo value; a single demo user or simple session is enough |
| Real credit scoring / bureau integration | Out of scope, regulatory and data-access heavy |
| Machine learning risk model | A trained model adds risk (time, accuracy, explainability) for no visible demo benefit over clear rules; rules *look* intelligent and are explainable, which actually matters more to judges |
| SMS / push notification warnings | Nice for the roadmap slide, not needed to prove the concept live |
| Blockchain / smart contracts | No relevance to the problem statements; avoid at all costs |
| Multi-lender comparison engine | This is the "Next" step on the roadmap slide, not tonight's build |
| Admin/regulator dashboard | Roadmap item; only the borrower-facing flow matters for the pitch |
| Automated test suite / CI pipeline | Valuable long-term, but time is better spent on the demo path tonight; add a short manual test checklist instead (see task.md) |
| Polished design system, animations, dark mode | Basic clean styling only; do not spend time on visual polish beyond a coherent color scheme for the risk badges |

If there is spare time after the MVP flow works end-to-end, pull the *next*
highest-value item from this list rather than starting something new.

## 6. Demo Script (what judges will see)

1. Judge/borrower enters a loan offer + basic finances into the form.
2. Click "Check My Loan."
3. Consent checklist appears — user ticks that they understand the terms.
4. Results dashboard renders: risk badge, plain-language cost line, debt burden
   ratio, reasoning bullets, recommendation line.
5. (If time allows) a "Your Borrowing Pattern" panel shows the loan history
   warning using seeded demo data.
6. Presenter explains the roadmap slide (see spec.md §7) to show this is the
   first brick of a bigger product, not a finished app.

## 7. Roadmap (for the pitch, not for tonight)

Loan safety checker (tonight) → digital loan comparison engine → personal
financial health profile → lender/regulator integration → borrower protection
infrastructure across Africa.

## 8. Definition of "65%+ working MVP"

The demo is considered a success if, without any manual data faking during the
live demo:
- A user can submit a loan + finances through the real form (4.1–4.3 working end
  to end through the real API, not mocked in the frontend).
- The dashboard renders live-calculated numbers, not hardcoded values (4.1, 4.4,
  4.5).
- At least the loan-history warning (4.6) works off seeded/demo data, even if
  the seeding is manual.
- No crashes, blank states, or obvious broken UI during the scripted demo path.

Anything beyond this is a bonus, not a requirement.
