# Contribution Tracking System

A simple and beautiful web application to track money contributions with progress charts. The system tracks contributions toward a goal of 1 million Rwandan francs (RWF).

## Features

- ✅ Add contributors with their names and contribution amounts
- ✅ Track whether contributions are cleared (paid) or pending
- ✅ Visual progress chart showing goal progress
- ✅ Summary statistics dashboard
- ✅ Calculate remaining amount needed to reach the goal
- ✅ Neon/Postgres-backed API persistence
- ✅ Responsive design for mobile and desktop
- ✅ Per-person remaining amount toward 12,000 RWF target

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- A Postgres database URL (Neon compatible)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (see `.env.example`) and set `DATABASE_URL` to your Postgres connection string. Optionally set `PORT` (defaults to `4000`).

3. Start the API server (creates the `contributions` table if it does not exist):
```bash
npm run server
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## Usage

1. **Add Contributors**: Use the form on the right side to add contributors with their names, contribution amounts, and whether the payment has been cleared.

2. **View Progress**: The left panel shows:
   - Summary statistics (total contributed, pending, remaining, and progress percentage)
   - A visual pie chart showing progress toward the goal
   - A progress bar with percentage completion

3. **Manage Contributors**: 
   - Toggle the cleared/pending status by clicking "Mark Cleared" or "Mark Pending"
   - Delete contributors using the "Delete" button
   - Only cleared contributions count toward the goal
   - Each contributor row shows how much is still due toward the 12,000 RWF per-person target

4. **Track Goal**: The system automatically calculates how much money is still needed to reach 1 million RWF.

## Technology Stack

- React 18
- Vite (build tool)
- Recharts (for charts)
- Express + pg for Postgres persistence (Neon compatible)

## Goal Amount

The default goal is set to **1,000,000 RWF** (1 million Rwandan francs). You can modify this in `src/App.jsx` by changing the `GOAL_AMOUNT` constant. The per-person target is set to **12,000 RWF** via `PER_PERSON_TARGET` in the same file.

## Data Persistence

All contributor data is saved in Postgres via the API (`npm run server`). Configure your connection string in `.env`. A Vite proxy is configured so the frontend can call `/api/*` during development.
