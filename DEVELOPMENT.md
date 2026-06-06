# Development

This document covers how to work on Crafty locally. End-user instructions live in [README.md](README.md).

## Quick start

Crafty is a static site (vanilla HTML/CSS/JS, no build step). A `Makefile`
wraps the common dev tasks:

```sh
make           # show available targets
make serve     # run dev server on http://127.0.0.1:8080 with live reload
make serve-py  # fallback: python static server, no live reload
make version   # bump the patch version
```

Override the port with `PORT=3000 make serve`.

## What `make serve` does

It runs `npx live-server --port=8080`, which:

- Serves the project root over HTTP.
- Reloads the browser whenever `index.html`, `script.js`, or `styles.css` change.
- Fetches [`live-server`](https://www.npmjs.com/package/live-server) on demand
  via `npx` — no project-level dependencies are added to the repo.

Requires [Node.js](https://nodejs.org/) (any recent LTS); `npx` ships with `npm`.

If you don't have Node installed, `make serve-py` uses Python's built-in
`http.server` instead (no live reload).

You can also just open `index.html` directly in a browser, but some features
(e.g. fetching cross-origin images) behave differently under the `file://`
scheme vs. `http://`.

## Bumping the version

`make version` runs `node update-version.js`, which increments the patch
version in `version.txt` and updates the cache-buster query strings and
footer in `index.html`.
