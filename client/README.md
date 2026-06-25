# PhonePay Client

React + Vite + Tailwind frontend for the PhonePay backend.

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` if your backend isn't running on `http://localhost:5000`.

## Run

```bash
npm run dev
```

Opens at `http://localhost:5173`. Make sure the backend server is running on port 5000 (or whatever you set in `.env`).

## Pages

- `/login`, `/register` — auth
- `/setup-mpin` — forced after registration, also reachable from Profile
- `/` — dashboard with balance, quick actions, recent activity
- `/send` — send money via phone/UPI ID + MPIN
- `/add-money` — top up wallet
- `/pay-bill` — pick a biller, pay + MPIN
- `/history` — full transaction list with filters
- `/profile` — account info, change MPIN, logout

## Build for production

```bash
npm run build
```

Output goes to `dist/` — deploy that folder to Vercel, Netlify, etc. Remember to set `VITE_API_URL` to your deployed backend URL as an environment variable on the hosting platform.
