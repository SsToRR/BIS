# Vercel deployment

The app is deployed from the `main` branch of `SsToRR/BIS` at [bis-ashy-phi.vercel.app](https://bis-ashy-phi.vercel.app/). It uses the Vercel Node Function adapter and Neon Postgres. Production is publicly accessible; Preview deployments remain protected by Vercel Authentication.

## Database

The Neon Marketplace resource is on the Free plan in Frankfurt. Its `DATABASE_URL` is connected to the Vercel project for Production and Preview. The function region is set to `fra1` in `vercel.json`. The first database-backed request creates tables and indexes from `database/schema.postgres.sql`. Production starts empty; the SQLite demo users and posts were not migrated.

## Deployment files

- `api/[...].js` and the API rewrite in `vercel.json` route nested `/api/*` requests to the existing API handler.
- `database/schema.postgres.sql` creates the hosted Postgres schema and indexes.
- `package.json` includes the Neon serverless driver.
- `vercel.json` includes the schema in the function bundle, sets the function region, and configures security headers.

## Live checks completed

- `GET /api/health` returns `200` with `{"ok":true}`.
- `GET /api/auth/me` returns JSON for a signed-out visitor.
- A login attempt for a nonexistent account returns the expected JSON `401` response.
- A protected likes request without a session returns the expected JSON `401` response.

The local acceptance suite also passes all 42 checks against SQLite. It does not replace a live registration/login walkthrough or the two-account post-edit check against Neon. Register an account through the production page before signing in; local demo credentials do not exist in the hosted database.
