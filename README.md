# SADIE Dashboard — Frontend

React + TypeScript dashboard for the CARLA platform. Displays AI call activity captured by the SADIE Webhook Receiver backend.

---

## Tech Stack

| Technology | Version |
|-----------|---------|
| React | 18+ |
| TypeScript | 5+ |
| Vite | 8+ |
| React Router | 6+ |
| Axios | 1+ |

---

## Features

- **Call Log Page** — table of all calls with status badge, category, customer number, duration, and timestamp
- **Call Detail Page** — full session info, chat-style transcript, and collapsible tool call audit log

---

## Project Structure

```
src/
├── api/
│   └── callsApi.ts         # Axios calls to backend API
├── types/
│   └── index.ts            # TypeScript interfaces
├── components/
│   └── StatusBadge.tsx     # Colored IN_PROGRESS / COMPLETED badge
├── pages/
│   ├── CallLogPage.tsx     # Route: /
│   └── CallDetailPage.tsx  # Route: /calls/:callId
├── App.tsx                 # Router setup
└── main.tsx                # Entry point
```

---

## Setup & Running

### Prerequisites
- Node.js 20+
- Backend running on `http://localhost:8080`

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

The Vite dev server proxies all `/beta/api/**` requests to `http://localhost:8080` automatically.

---

## API Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/beta/api/calls` | List all call sessions |
| GET | `/beta/api/calls/{callId}` | Full session detail + messages + tool logs |

All requests include the header `x-sadie-core-secret: test-secret`.

---

## Related

- Backend: [sadie-webhook-backend](https://github.com/ChadiChoker/sadie-webhook-backend)
