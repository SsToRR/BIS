# Campus Student Social Network!

A campus community app for student profiles, a post feed, comments, likes, student search, follows, and private saved posts. The interface supports English, Kazakh, and Russian. Local runs store records in a persistent SQLite database and include fictional demo accounts for a classroom walkthrough.

## Run locally

1. Use Node.js 24. This project uses Node's built-in HTTP, crypto, and SQLite modules for local runs; the hosted Postgres adapter uses `@neondatabase/serverless`.
2. From this folder, start the server:

   ```sh
   node server.js
   ```

3. Open `http://127.0.0.1:3000` in a browser. The database is created at `database/student-network.sqlite` the first time the server starts. Set `PORT` or `DB_FILE` to change those defaults. Account policy starts with `SESSION_DAYS` (default 30, range 1–365) and `MAX_USERS` (default 500, range 1–1,000,000). Every registered account can open Admin settings and change the account cap.
4. Every account has administrator access. Existing accounts are promoted when the server starts, and new accounts receive administrator access when they register. On Vercel, the role update runs when the database schema initializes.
5. To populate a fresh or existing database with fictional sample records, run:

   ```sh
   /Applications/ChatGPT.app/Contents/Resources/cua_node/bin/node database/seed.js
   ```

   With Node installed on your PATH, use `node database/seed.js`.

   The demo accounts are `casey@student.local`, `jordan@student.local`, `taylor@student.local`, `riley@student.local`, and `alex@student.local`. Their shared temporary local-demo password is `CampusDemo2026!`. These accounts and credentials are fictional and must never be reused for a real service.

Stop the server with Ctrl+C. The SQLite file stays on disk across restarts. To reset the local demo, stop the server, remove `database/student-network.sqlite` and its `-shm`/`-wal` files, then run the seed command again.

## What works

- Student registration and login with scrypt password hashes and a 30-day, HttpOnly session cookie by default.
- A configurable campus account cap (500 by default); registration receives a clear capacity error when full.
- Campus account capacity settings available to every signed-in user.
- Student-created campus events and co-working sessions with unique RSVPs, capacity counts, and a FIFO waitlist that promotes the next student when a place opens.
- A personal 25-minute focus timer and 5-minute break timer on the Study together page.
- Per-post translation into a chosen language (defaults to the interface language). Translation controls disclose that post text is sent to MyMemory when requested.
- Accessibility preferences for larger text, higher contrast, and reduced motion, saved in the browser.
- Student profiles, post creation, and owner-only post editing and deletion.
- Feed of the signed-in student's posts and posts from students they follow.
- Comments and likes; a database constraint prevents duplicate likes.
- Private saved posts with duplicate prevention, a dedicated Saved page, and cascading cleanup.
- Search by name, major, or faculty; student profiles and follow/unfollow.
- English, Kazakh, and Russian interface language selection with a remembered preference.
- Follower and following lists; database constraints reject duplicate follows and self-follows.
- SQLite foreign keys and cascading cleanup for deleted users or posts.
- Parameterized SQL, server-side input checks, same-origin API, generic server error responses, and a restrictive content security policy.
- A sample-data seed script, schema file, ERD, architecture diagram, API overview, and demo guide in `docs/`.
- The existing acceptance report records 46 passing baseline checks for authentication, posts, saves, session duration, and account capacity. That report predates the new event, admin, translation, and timer features; see `docs/acceptance-test-results.md` for its scope.

## Database and architecture

The schema lives in `database/schema.sql`. It contains users, posts, comments, likes, bookmarks, follows, events, event RSVPs, application settings, and sessions. `docs/erd.mmd` documents the relationships. Bookmarks and event RSVPs are unique per student and content item. SQLite is used for local demonstration; queries run on the server and SQLite foreign-key enforcement is enabled.

The planning files propose React → Express → PostgreSQL. This implementation uses a browser-native HTML/CSS/JavaScript frontend and a small Node.js HTTP API. Local runs use SQLite. Vercel runs use the Neon Postgres adapter selected by `DATABASE_URL`; `database/schema.postgres.sql` mirrors the local schema and is initialized on the first API request. Vercel serves the static frontend and routes `/api/*` to `api/[...path].js`.

The app has no notifications, messaging, admin moderation, profile editing, password reset, or account deletion UI. Every signed-in user can change the campus account cap in Admin settings. The demo data is optional. The session database stores hashed random tokens, not session tokens in plaintext. The app is deployed on Vercel with Neon Postgres; production starts with an empty database, so register a new account there. The local SQLite demo accounts are not copied to Neon. See `docs/vercel-readiness.md` for deployment details and remaining live checks.

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
- `docs/project-requirements.md` — requirements, API, design, responsive, and acceptance specifications.
- `docs/team-responsibilities.md` — six-person task ownership.
- `docs/team-changes-and-speaking-scripts.docx` — member-by-member changes and presentation scripts for all six students.
- `docs/team-speaking-script.md` — one presentation speech for each team member.
- `docs/website-before-after.md` — previous/current interface comparison and walkthrough.
- `docs/feature-checklist.md` — implementation and verification status.
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
