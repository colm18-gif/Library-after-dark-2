# Library After Dark 2

A performance-first rebuild of the Gutenberg Athenaeum / Library After Dark.

## First playable slice

- One candlelit Grand Hall
- Warm leather-and-dark-wood reading chairs
- Batched, cover-facing books
- In-world book reader
- A hidden-room interaction
- F3 performance monitor

## Non-negotiable performance rules

1. Only the current room is active; the next room is prepared gradually before its door.
2. No asset decoding, model construction, or large texture work while the player is moving.
3. Repeated books, trim and furniture use shared geometry/materials or instancing.
4. Candles are emissive visuals, not a field of dynamic lights.
5. Each new room must meet the same frame-time budget before it is expanded.

The original project remains separate and untouched while this vertical slice proves the architecture.
