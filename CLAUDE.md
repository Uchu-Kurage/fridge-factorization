# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

冷蔵庫☆因数分解 ("Fridge Factorization") — a Japanese-language PWA that suggests recipes based on what's in your fridge. Manages ingredients, recipe suggestions, a shopping list, and a recipe library across four tabs.

**Zero-dependency vanilla stack**: no package.json, no build step, no framework, no tests, no linter. The entire app is four hand-written files: `index.html` (static shell), `app.js` (all logic, ~2800 lines), `style.css`, and `sw.js` (service worker).

## Development Commands

```bash
# Run locally — any static server works; a server (not file://) is needed for the service worker
python3 -m http.server 8000

# Regenerate PWA icons (pure Node, no npm deps needed)
node scripts/generate-icons.js
```

There is no build, lint, or test command. Verify changes by loading the app in a browser.

## Conventions

- **Language**: UI text, code comments, and commit messages are all in Japanese. Keep it that way.
- Feature branches follow the pattern `claude/<description>-<id>` and merge to `main` via PR.
- When changing any file listed in `APP_SHELL` in `sw.js`, bump `CACHE_VERSION` in `sw.js` so installed PWAs pick up the update.
- During development, the service worker's stale-while-revalidate caching can serve old assets — hard-refresh or unregister the SW in devtools when testing.

## Architecture (`app.js`)

The file is organized top-to-bottom in commented sections (`// === SECTION ===` / `// ==================== SECTION ====================`); keep new code in the matching section.

### State & persistence

- A single global `state` object holds everything: `ingredients`, `shoppingList`, `customRecipes`, `recipeOverrides`, `regularSettings`, plus transient UI state (active tab, search/filter values).
- Persistence is `localStorage` only, under the `fridge_*` keys in `STORAGE_KEYS`. `saveState()` writes all keys and also refreshes nav badges; `loadState()` reads them and then calls `migrateState()`.
- `migrateState()` upgrades old on-disk data shapes (e.g. numeric `quantity`/`unit` → the 3-level stock model). If you change a stored data shape, add a migration there rather than breaking existing users' data.

### Core data model

- **Stock levels, not quantities**: ingredients have `stock` ∈ `plenty | low | none` (see `STOCK_LEVELS` / `STOCK_META` / `STOCK_LOWER` / `STOCK_RANK`). `availableIngredients()` = anything not `none`. Cooking a recipe lowers stock one level via `STOCK_LOWER`.
- **Recipes**: `BUILT_IN_RECIPES` (ids `r001`…) is a hardcoded array. User-created recipes live in `state.customRecipes` (ids from `generateId()`, `isCustom: true`). Edits to built-in recipes are NOT applied in place — they're stored in `state.recipeOverrides` keyed by recipe id, and `getAllRecipes()` merges overrides over built-ins. `resetRecipeToDefault()` just deletes the override.
- **Recipe matching** (`getRecipeMatchInfo`): fridge and recipe ingredients are matched by fuzzy name comparison — case-insensitive exact or bidirectional substring match (`matchIngredientName`). Recipes are classified as "can make" (all non-optional ingredients available) vs "almost" (missing some).
- **Regular ingredients** (`regularSettings`): staples the user always wants stocked; alerts fire when their stock falls at/below the configured `alertAt` level or the item is missing entirely.
- Categories are fixed lists: `INGREDIENT_CATEGORIES` (6 fridge categories) and `RECIPE_CATEGORIES` (5 genres). Emoji lookups go `FOOD_EMOJIS` exact match → substring match → `CATEGORY_EMOJIS` fallback (`getFoodEmoji`).

### Rendering pattern

- Each tab has a `render<Tab>Tab()` function that rebuilds its container with an `innerHTML` template string. The standard mutation flow is: **mutate `state` → `saveState()` → re-render the affected tab(s)**. There is no diffing or reactivity.
- Event wiring is split: static controls (nav, search boxes, toolbar buttons) get `addEventListener` in `init()`; dynamically rendered HTML uses inline `onclick="fn(...)"` strings — which means any function referenced from a template **must be a global function**.
- Always pass user-provided strings through `escapeHtml()` when interpolating into templates. Note that ids interpolated into inline `onclick` attributes are placed inside single quotes.
- Modals: a single `#modal-overlay` / `#modal-box` pair. `openModal(html)` injects the markup, `closeModal()` clears it. Modal content follows the same innerHTML + global-function pattern. Recipe form state uses module-level temps (`tmpRecipeIngs`, `tmpRecipeSteps`, `editingRecipeId`).
- Toasts via `showToast(message, type)` with types `info | success | warn`.
- The fridge tab renders as a "fridge illustration" — ingredients grouped by category into shelves (`.fridge-shelf`, with drawer/door modifiers for 野菜/調味料), each ingredient a `.food-tile` with an inline stock-level segment control. Tapping a tile opens an action sheet (`openIngredientActionSheet`).

### CSS (`style.css`)

Design tokens (colors, radii, shadows, transitions) are CSS custom properties on `:root` — use them instead of hardcoding values. The layout is mobile-first, capped at `max-width: 600px`, with a fixed header and bottom tab nav. Font is "M PLUS Rounded 1c" (kawaii/rounded aesthetic throughout).

### Service worker (`sw.js`)

Caches the app shell for offline use (all data is in localStorage, so offline is fully functional). Strategies: network-first for navigations, stale-while-revalidate for same-origin assets, cache-first with background refresh for cross-origin (Google Fonts).
