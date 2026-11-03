# 3D World Architecture

The 3D world is a React Three Fiber app lazy-loaded by `src/App.tsx` (`import('./world3d/App3D')` under Suspense) and mounted at `/` — it is the default landing. Source lives in `src/world3d/`.

## Layout

```
src/world3d/
  App3D.tsx                # <Canvas> + <Hud> shell (the lazy entry component)
  constants.ts             # geometry, colors, speeds, storage keys
  exitContext.ts           # context so HUD children reach onExitTo2D
  global.d.ts              # window.__worldStore + bridges typing
  world3d.css              # HUD styles
  data/rooms.ts            # ROOMS table (id, label, center, colors)
  store/worldStore.ts      # Zustand store (single source of truth)
  scene/                   # All Three.js / R3F components
    World.tsx              # Composes ground, rooms, character, controllers
    CameraController.tsx   # Tweens camera between overview and FP
    PlayerController.tsx   # WASD movement (overview only)
    InteractionManager.tsx # Keyboard handler + proximity detection
    InteractionRaycaster.tsx # Hover/E targeting (userData + raycast)
    Door.tsx, Room.tsx, Hallway.tsx, Character.tsx, Skybox.tsx, ...
    parts/, rooms/         # Reusable scene parts and per-room interactables
  hud/                     # DOM overlay (back button, modals, hints)
  hooks/                   # useKeyboard, usePointerLock
  util/                    # rand.ts — deterministic PRNG for scatter data
```

## State machine

Two coordinated fields in `worldStore`:

- `viewMode: 'overview' | RoomId` — which scene we're in.
- `viewTransition: 'idle' | 'entering' | 'exiting'` — camera tween phase.
- `fpActive: boolean` — set to `true` when the entering tween completes (CameraController calls `completeRoomTransition`). PlayerController reads this to disable WASD inside rooms.

The transition state exists to avoid `useFrame` ordering races between CameraController (writes `fpActive` at tween end) and PlayerController (reads `fpActive` to gate movement).

Transitions are driven by `beginRoomTransition`, `completeRoomTransition`, `beginExitTransition`, plus the simpler `setViewMode` for direct jumps (used by test bridges).

## Adding a new room

1. Add a row to `ROOMS` in `src/world3d/data/rooms.ts` (id, label, center, colors). The grid auto-extends.
2. Drop a per-room scene file under `src/world3d/scene/rooms/` and render it from `World.tsx` (or wherever rooms are composed).
3. Add a label `<div id="label-<id>">` to `hud/Hud.tsx` if you want a 2D label.
4. Add an overlay `<div id="overlay-<id>">` if the room has a DOM overlay.
5. Add a number-key entry to `ROOM_NUMBER_KEYS` in `InteractionManager.tsx` if it should be hot-keyable.

## Adding a new interactable

1. In the room scene file, add a mesh and tag it with userData for the raycaster (see `InteractionRaycaster.tsx`).
2. On hover the raycaster calls `setFocusedInteractable({ title, body, link? })`.
3. Pressing E in FP mode calls `openModal` (handled in `InteractionManager.tsx`).
4. The modal renders via `hud/InteractModal.tsx` and reads `modalInteractable` from the store.

## Store shape

See `WorldState` in `store/worldStore.ts`. Key slices:
- View: `viewMode`, `viewTransition`
- Player: `charPos`, `charFacing`
- FP camera: `fpActive`, `fpYaw`, `fpPitch`
- Doors: `unlockedDoors: Set<RoomId>` (persisted to `localStorage` key `suri-3d-doors-unlocked-v2`)
- Theme: `theme: 'dark' | 'light'` (persisted)
- Interaction: `nearbyRoom`, `focusedInteractable`, `modalInteractable`

The store is exposed on `window.__worldStore` for tests/devtools (typed in `global.d.ts`).

## Tests

Playwright tests live in `tests/3d-world.test.cjs`. Two flavors:
- **Bridge-based** (most tests): use `window.navigateToRoom(id)` from `main.tsx` to jump directly into a room. Fast and stable for asserting overlay/HUD content.
- **Real-flow** (`keyboard flow: teleport → unlock → enter → exit`): teleports the character to a doorway, then exercises the actual U/E/Escape key handlers in `InteractionManager`. Validates the unlock + nav + exit code paths.

Run: `npm run test:e2e` — serves the production build via `vite preview`
and runs headless Chromium (see `playwright.config.ts`). Workers are pinned
to 1 because every test cold-starts WebGL.

## 2D → 3D hand-off

The 3D world is the default landing at `/`; the 2D editorial page lives at `/2d`, and `/3d` redirects to `/`. `src/components/shared/ViewSwitcher.tsx` is a react-router `<Link to="/">` on the 2D page, and `App.tsx` lazy-loads both worlds under Suspense — three.js only evaluates when a visitor actually enters the world, so the 2D page stays lightweight.
