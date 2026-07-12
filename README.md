# Credi-Check

A borrower protection intelligence layer that helps people make informed decisions about loan offers.

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

### Setup

1. **Clone and install dependencies:**
   ```bash
   # Server
   cd server && npm install

   # Client
   cd client && npm install
   ```

2. **Configure environment:**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env and set MONGO_URI to your MongoDB connection string
   ```

3. **Seed demo data:**
   ```bash
   cd server
   npm run seed:demo     # creates demo user + 3 demo assessments
   npm run seed:lenders  # seeds 8 lender directory entries
   ```

4. **Start the servers:**
   ```bash
   # Terminal 1 - Server (port 5000)
   cd server && npm run dev

   # Terminal 2 - Client (port 5173)
   cd client && npm run dev
   ```

5. **Open:** http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/users/demo` | Get or create the demo user |
| POST | `/api/loans/analyze` | Analyze a loan offer |
| GET | `/api/loans/:id` | Get a stored assessment |
| GET | `/api/users/:id/history` | Get user's assessment history |
| GET | `/api/lenders` | Get all lender directory entries |

## Demo Scenarios

After seeding, you can test these scenarios through the UI:

| Scenario | Loan Amount | Fee | Interest | Period | Income | Existing Debt | Expected Risk |
|----------|------------|-----|----------|--------|--------|---------------|---------------|
| Safe | 200,000 | 10,000 | 5% | 60 days | 800,000 | 0 | Safe |
| Caution | 150,000 | 15,000 | 8% | 30 days | 500,000 | 50,000 | Caution |
| High Risk | 300,000 | 30,000 | 10% | 30 days | 600,000 | 100,000 | High Risk |

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS + shadcn/ui + lucide-react
- **Backend:** Node.js + Express + Mongoose
- **Database:** MongoDB
