# Vercel readiness

The repository now includes a Vercel Node Function entry point, a hosted Postgres adapter, a matching Postgres schema, and Vercel configuration. Local runs continue to use SQLite. Set `DATABASE_URL` to select Postgres; the app initializes the schema on the first `/api/health` or other database-backed request. A Vercel deployment fails at startup if `DATABASE_URL` is missing, rather than silently using an ephemeral SQLite file.

## One-time setup still required

The connected Vercel team has the Neon Marketplace integration installed on its free plan, but no Neon database resource or BIS Vercel project exists yet. The available Vercel connection can inspect projects and plans but cannot provision the Neon resource. In the Vercel dashboard:

1. Create a project for `SsToRR/BIS` (root directory `/`).
2. Add the Neon integration's free Postgres resource to the project in Frankfurt (`fra1`), matching the function region configured in `vercel.json`.
3. Confirm the integration adds `DATABASE_URL` to Production and Preview. Keep the connection string in Vercel only; do not commit it.
4. Deploy the project. The first database-backed request creates the tables and indexes in `database/schema.postgres.sql`.

After provisioning, the deployed app should be checked through `/api/health`, registration/login, creating a post, and editing a post as its owner while a second account is rejected. Local acceptance tests still exercise SQLite; they do not claim to verify a live Neon database.

## Repository deployment files

- `api/[...].js` and the rewrite in `vercel.json` route every `/api/*` path into the existing API handler.
- `database/schema.postgres.sql` creates the hosted schema, constraints, and indexes.
- `vercel.json` includes the schema in the function bundle and configures security headers.
- `package.json` declares the Node 24 runtime and Neon serverless driver.

Vercel Functions are request handlers, so the app's local HTTP listener is used only for development. The local SQLite file is never used on Vercel. See [Vercel Functions](https://vercel.com/docs/functions), [Vercel function configuration](https://vercel.com/docs/project-configuration/vercel-json), and [Neon's serverless driver](https://neon.com/blog/serverless-driver-ga).
