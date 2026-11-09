# Campus Student Social Network

A local campus community app for student profiles, a post feed, comments, likes, student search, and student follows. It stores real records in a persistent SQLite database and includes fictional demo accounts for a classroom walkthrough.

## Run locally

1. Use Node.js 24. This project uses Node's built-in HTTP, crypto, and SQLite modules for local runs; the hosted Postgres adapter uses `@neondatabase/serverless`.
2. From this folder, start the server:

   ```sh
   node server.js
   ```

3. Open `http://127.0.0.1:3000` in a browser. The database is created at `database/student-network.sqlite` the first time the server starts. Set `PORT` or `DB_FILE` to change those defaults.
4. To populate a fresh or existing database with fictional sample records, run:

   ```sh
   /Applications/ChatGPT.app/Contents/Resources/cua_node/bin/node database/seed.js
   ```

   With Node installed on your PATH, use `node database/seed.js`.

   The demo accounts are `casey@student.local`, `jordan@student.local`, `taylor@student.local`, `riley@student.local`, and `alex@student.local`. Their shared temporary local-demo password is `CampusDemo2026!`. These accounts and credentials are fictional and must never be reused for a real service.

Stop the server with Ctrl+C. The SQLite file stays on disk across restarts. To reset the local demo, stop the server, remove `database/student-network.sqlite` and its `-shm`/`-wal` files, then run the seed command again.

## What works

- Student registration and login with scrypt password hashes and a seven-day, HttpOnly session cookie.
- Student profiles, post creation, and owner-only post editing and deletion.
- Feed of the signed-in student's posts and posts from students they follow.
- Comments and likes; a database constraint prevents duplicate likes.
- Search by name, major, or faculty; student profiles and follow/unfollow.
- Follower and following lists; database constraints reject duplicate follows and self-follows.
- SQLite foreign keys and cascading cleanup for deleted users or posts.
- Parameterized SQL, server-side input checks, same-origin API, generic server error responses, and a restrictive content security policy.
- A sample-data seed script, schema file, ERD, architecture diagram, API overview, and demo guide in `docs/`.
- Automated tests for all 30 Week 11 acceptance criteria, five post-rule unit tests, five post-edit API tests, and two UI renderer checks. The current total is 42 passing checks. Run with `node --test tests/*.test.js` on Node.js 22.13 or newer; see `docs/acceptance-test-results.md`.

## Database and architecture

The schema lives in `database/schema.sql`. It recreates `USERS`, `POSTS`, `COMMENTS`, `LIKES`, and `FOLLOWS` from scratch, plus a `SESSIONS` table for login sessions. `docs/erd.mmd` documents the same schema and keys. Post edits update the existing `posts.content` and `posts.updated_at` fields; no schema change is needed. SQLite is used for easy, persistent local demonstration; all queries run on the server and SQLite foreign-key enforcement is enabled.

The planning files propose React → Express → PostgreSQL. This implementation uses a browser-native HTML/CSS/JavaScript frontend and a small Node.js HTTP API. Local runs use SQLite. Vercel runs use the Neon Postgres adapter selected by `DATABASE_URL`; `database/schema.postgres.sql` mirrors the local schema and is initialized on the first API request. Vercel serves the static frontend and routes `/api/*` to `api/[...path].js`.

The app has no notifications or messaging. It has no admin moderation workflow, profile editing, password reset, or account deletion UI. The demo data is optional. The session database stores hashed random tokens, not session tokens in plaintext. The Vercel function adapter and Postgres schema are ready, but a Neon database still needs to be provisioned and attached to the Vercel project before deployment. See `docs/vercel-readiness.md` for the remaining setup.

## Project files

- `server.js` — API, authentication, validation, and static file serving.
- `post-rules.js` — shared owner and post-content rules used by the API.
- `index.html`, `styles.css`, `app.js` — responsive user interface.
- `database/schema.sql` — database schema and constraints.
- `database/schema.postgres.sql` — matching hosted Postgres schema.
- `database/seed.js` — fictional demo users and sample activity.
- `api/[...].js` — Vercel function entry point for `/api/*`.
- `vercel.json` — Vercel function file inclusion and security headers.
- `docs/erd.mmd` — Mermaid ERD source.
- `docs/architecture.mmd` — Mermaid system architecture source.
- `docs/demo-guide.md` — short classroom walkthrough.
- `docs/team-responsibilities.md` — proposed five-person ownership.
- `docs/feature-checklist.md` — implementation and verification status.
- `docs/week-11-speaking-script.md` — five short speaking parts and remaining Week 11 work.
- `docs/acceptance-test-results.md` — results for AC-01–AC-30 and the complete automated suite.
- `docs/vercel-readiness.md` — deployment constraints and required preparation.
- `outputs/week11-testing-20261108/Acceptance_Criteria_Traceability_UPDATED.xlsx` — updated copy of the acceptance workbook with automated results for AC-01–AC-30.
- `tests/acceptance.test.js` — end-to-end API and SQLite acceptance checks.
- `tests/app-ui.test.js` — checks author-only UI controls.
- `tests/post-edit.test.js` — focused automated API tests for post editing.
- `tests/post-rules.test.js` — five unit tests for edit ownership and content validation.

## Troubleshooting

- **`node: command not found`:** Install Node.js 22 or newer, open a new terminal, and check `node --version`.
- **`Cannot find module 'node:sqlite'`:** Use a recent Node release (22.13 or newer; Node 24 is recommended for this project).
- **Port 3000 is busy:** Run `PORT=3001 node server.js` and open `http://127.0.0.1:3001`.
- **A demo login fails:** Run `node database/seed.js` from this project folder, then sign in with one of the listed fictional accounts.
- **Changes do not appear:** Hard-refresh the browser; the frontend is served directly from this folder.
