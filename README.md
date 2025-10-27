# Ship Tracker Frontend

A Vite + React (TypeScript) dashboard for tracking live ship positions and reviewing vessel activity logs in real time.

## Features

- 🔐 **Authentication** – Username/password login that stores the issued JWT locally.
- 🗺️ **Interactive map** – Leaflet-powered map that highlights current ship positions with popups for quick inspection.
- 📜 **Activity logs** – Paginated, chronological activity feeds per ship.
- 🔄 **Live updates** – WebSocket integration that merges incoming ship updates into the fleet view.
- 📱 **Responsive UI** – TailwindCSS styling optimized for desktop and tablet layouts.

## Getting Started

```bash
npm install
npm run dev
```

The app expects two environment variables during development:

- `VITE_API_BASE_URL` – Base REST API endpoint (default: `http://localhost:4000`).
- `VITE_WS_BASE_URL` – WebSocket endpoint without the `/ws` suffix (default: `ws://localhost:4000`).

## Building for Production

```bash
npm run build
npm run preview
```

## Data Contracts

Ship list and activity responses, login payloads, and WebSocket messages strictly follow the formats outlined in the product requirements. Validation messages surface in the UI if malformed payloads arrive.
