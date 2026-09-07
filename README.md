# ULA Monitors — Web Dashboard

Reference solution for the Tecnologías Web y Móviles semester project web app:
the administrator dashboard for a fictional vendor operating dissolved-oxygen
sensors in salmon farms.

It consumes the ULA Monitors API at `http://localhost:8000`. Log in with
`dashboard` / `dashboard` (scopes `profile` and `read`): the app reads sites,
sensors, measurements and interventions, and can open a new intervention.
Everything else — creating sites, configuring sensors, closing interventions —
belongs to the technician's mobile app and is deliberately absent from this UI.

## Stack

Vite + React, react-router-dom, Tailwind CSS, Recharts. Plain `fetch` and React
state only: no external state or data-fetching libraries.

## Run

```sh
pnpm install
pnpm dev
```

The API must be running at `http://localhost:8000`.
