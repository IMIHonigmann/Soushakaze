# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Soushakaze is a conceptual airsoft e-commerce store where users equip BB-guns they plan to buy using a real-time 3D attachment customizer. The design goal is to blur the line between a web app and a game through aggressive animations and 3D visuals.

## Stack

- **Backend**: Laravel 12 (PHP 8.2+), SQLite in development
- **Frontend**: React 19 + TypeScript, rendered via Inertia.js (no separate API layer)
- **3D**: Three.js via `@react-three/fiber` and `@react-three/drei`
- **Styling**: Tailwind CSS v4
- **State**: Valtio (3D customizer global state), Zustand (cart/wishlist, localStorage-persisted)
- **Animations**: GSAP (incl. ScrambleTextPlugin)
- **Payments**: Laravel Cashier (Stripe)
- **UI primitives**: Radix UI + shadcn/ui (`components.json`)
- **Tests**: Pest PHP

## Commands

```bash
# Start dev (Laravel serve + queue listener + Vite, concurrently)
composer run dev

# Build frontend assets
npm run build

# Run all tests
composer test          # == php artisan test

# Run a single test file
php artisan test tests/Feature/DashboardTest.php

npm run types          # TypeScript check (tsc --noEmit)
npm run lint           # ESLint + auto-fix
npm run format         # Prettier
./vendor/bin/pint      # PHP code style

composer run dev:ssr   # dev with SSR enabled
```

## Architecture

### Request flow

Laravel routes call `Inertia::render('PageName', $props)`; the matching React page in `resources/js/pages/` receives `$props` as component props. Ziggy exposes Laravel's named routes to the frontend via a global `route()` helper.

### Frontend layout

- `resources/js/pages/` — Inertia page components; directory mirrors route structure
  - `Separate/Customizer/` — the customer-facing 3D weapon customizer
  - `Separate/Editor/` — internal dev tool for mapping 3D mesh nodes to attachments
  - `Profile/`, `auth/`, `settings/` — profile/order history, auth, and settings scaffolding
- `resources/js/stores/customizerProxy.tsx` — Valtio proxy; single source of truth for customizer state (selected attachments, camera positions, mesh selections, transform mode, `dbAttachmentsToMaterialsObject`)
- `resources/js/stores/bagStores.tsx` — Zustand `useCartStore` / `useWishlistStore`, both persisted to `localStorage`
- `resources/js/ModelDefinitions/` — gltfjsx-generated Three.js components (one per weapon model)
- `resources/js/types/types.ts` — shared `Weapon`, `Attachment`, `Area` types; the data contract for Inertia props coming from PHP

### 3D customizer: attachments ↔ mesh nodes

The customizer shows a live 3D model where selecting an attachment toggles visibility of specific mesh nodes:

1. The `weapon_attachment_model` table maps each attachment name → one or more 3D mesh node names for that weapon.
2. `WeaponModel.tsx` loads this mapping from the `attachmentModels` prop into `state.dbAttachmentsToMaterialsObject`.
3. Selecting an attachment hides the nodes of other attachments in that area and shows the selected attachment's nodes.

`CustomizerController::index` (`/customizer/{weaponId}`, customer view) and `::editor` (`/editor/{weaponId}`, dev tool) both render the same `Customizer` component and must supply the same display props: `attachments`, `areaDisplays`, `attachmentModels`, `restTransforms`. The difference is `renderEditor` (true in the editor) and the editor-only `'other'` placeholder attachment. A weapon that has never been opened in the editor has no `weapon_rest_transforms` row, so the frontend must tolerate a missing `restTransforms` (defaults to identity transform).

The **Editor** exposes three.js TransformControls and context-menu cut/paste to assign mesh nodes to attachments; **Apply** persists via `POST /overwriteAttachmentModelHierarchy`.

### 3D model assets

GLTF models live at `public/3DModels/{WeaponName}/Main/scene.gltf`. The weapon's `name` column **must** match the directory name — the path is built as `/3DModels/${weapon.name}/Main/scene.gltf`.

### Checkout flow

Cart items are encoded client-side as `{quantity}:{weaponId}:{urlEncodedJSON}` (see `helpers/makeSelectionKey.ts`). `/checkout`:
1. Decodes items and **re-prices server-side** by summing attachment `price_modifier` values (never trusts client price).
2. Writes a `pending_carts` row and redirects to Stripe Checkout with `cart_id` in metadata.
3. On success, `OrdersController::placeOrder` reads the Stripe session, looks up the pending cart, and creates `orders` / `orders_weapons` / `usercreated_weapons_attachments` records.

### Key tables

| Table | Purpose |
|---|---|
| `weapons` | Products with stats and image blob |
| `attachments` | Parts with stat modifiers, grouped by `area` |
| `weapons_attachments` | Attachments compatible with each weapon |
| `weapon_attachment_model` | Attachment name → 3D mesh node names, per weapon |
| `weapon_rest_transforms` | Saved model position/rotation/scale, per weapon |
| `weapon_area_display` | Saved camera target/position per area, per weapon |
| `custom_weapon_ids` | UUID per user-customized loadout |
| `usercreated_weapons_attachments` | Attachments belonging to a `custom_weapon_id` |
| `orders` + `orders_weapons` | Completed purchases |
| `pending_carts` | Transient cart data during a Stripe Checkout session |
