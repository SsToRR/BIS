# Vercel readiness

This repository is ready for local demonstration and automated tests. It is not ready for durable Vercel hosting in its current form.

The app starts one local HTTP server from `server.js` and stores application data in a SQLite file. It has no `api/` function entry point, Vercel configuration, build script or external database connection. Vercel Functions use request-based function entry points, and Vercel's guidance says a SQLite file cannot provide shared persistent application storage in serverless functions. A local SQLite file may appear to work for a request, but writes are not durable or shared across function instances.

Before deployment, the team needs to:

1. Select and provision a hosted relational database, then migrate the schema and queries from SQLite.
2. Adapt the Node server routes to Vercel function handlers or choose a Vercel hosting mode that fits a continuously running Node server.
3. Configure database credentials as Vercel environment variables and keep them out of Git.
4. Run the complete acceptance suite against the new database adapter and verify the deployed app with two accounts.

References: [Vercel Functions](https://vercel.com/docs/functions), [Vercel's SQLite guidance](https://vercel.com/kb/guide/is-sqlite-supported-in-vercel), and [Vercel storage options](https://vercel.com/docs/storage).
