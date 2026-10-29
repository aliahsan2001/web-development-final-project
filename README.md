# Internet in India — Timeline Explorer

A coursework web application that presents milestones in India's internet history. It connects an HTML/CSS/JavaScript frontend to an Express endpoint, validates file-backed timeline data with JSON Schema, and renders that data through a small browser-side template engine.

**Stack:** JavaScript · Node.js · Express · Ajv · HTML · CSS · JSON

## What to review

- [`server.js`](./server.js): static file serving, the `GET /timeline` endpoint, Ajv schema validation, and error responses.
- [`script.js`](./script.js): data fetching and a simple template engine supporting variables and `{{#each}}` loops.
- [`data.json`](./data.json): the timeline's source data.
- [`timeline-template.html`](./timeline-template.html): the template used to render each entry.

## Run locally

Install Node.js and npm. From the repository root:

```bash
npm ci
npm start
```

Open **http://localhost:3000**. Keep the server running while browsing the pages.

Use the server rather than opening HTML files directly: the frontend requests `/timeline`, which requires Express.

## Data flow

```text
data.json → Express → Ajv validation → GET /timeline
                                          ↓
                         Browser fetch → template → page
```

The endpoint returns an object with a `timeline` array. Every entry must include a four-digit `year`, `description`, `p1`, `p2`, and `p3`. Unexpected fields fail validation. If loading or validation fails, the server returns HTTP 500 with a JSON error.

Try the endpoint:

```bash
curl http://localhost:3000/timeline
```

## What this demonstrates

- Connecting browser-side JavaScript to a Node.js endpoint.
- Validating structured data before returning it.
- Rendering repeated content with a small template abstraction.
- Organising a multi-page coursework website.

## Scope and limitations

This is a learning project with file-backed content, not a production content-management system. There is no database, authentication, admin editor, or automated test suite. Start the server from the repository root because the data path is relative to the working directory. The template engine inserts HTML directly, so its input must remain trusted project content. Static serving currently exposes the repository directory; a production version should serve a dedicated public directory.
