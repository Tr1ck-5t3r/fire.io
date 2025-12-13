
# FPS Game Client

## Description
This is the client-side codebase for a multiplayer first-person shooter (FPS) game built with React and Babylon.js. It features a modular architecture for game logic, networking, and UI, supporting real-time multiplayer gameplay using Colyseus.

## How to Set Up
1. **Install dependencies:**
   ```sh
   yarn
   ```
2. **Start the development server:**
   ```sh
   yarn run dev
   ```
3. **Open the game:**
   Visit `http://localhost:5173` in your browser.

> **Note:** Make sure the server is running and accessible at the configured WebSocket address (default: `ws://localhost:2567`).


## Folder Structure

client/
├─ index.html
├─ package.json
├─ tsconfig.json
├─ yarn.lock
├─ public/
│  └─ vite.svg
├─ src/
│  ├─ main.tsx                # React entry point
│  ├─ App.tsx                 # Root React component
│  ├─ style.css
│  │
│  ├─ game/                   # Babylon.js game logic (non-React)
│  │  ├─ engine/              # Engine & scene creation
│  │  │  └─ createScene.ts
│  │  │
│  │  ├─ entities/            # Game entities
│  │  │  └─ Snowman.ts
│  │  │
│  │  ├─ controllers/         # Entity behavior & movement
│  │  │  └─ SnowmanController.ts
│  │  │
│  │  ├─ projectiles/         # Projectile logic
│  │  │  └─ Snowball.ts
│  │  │
│  │  ├─ world/               # World and environment objects
│  │  │  └─ Ground.ts
│  │  │
│  │  ├─ utils/               # Utility helpers
│  │  │  └─ Random.ts
│  │  │
│  │  └─ network/             # Multiplayer & networking (future)
│  │     └─ NetworkClient.ts
│  │
│  ├─ state/                  # Global UI/game state
│  │  └─ gameStore.ts
│  │
│  └─ ui/                     # React UI components
│     ├─ HUD.tsx
│     └─ PauseMenu.tsx
│
└─ README.md
