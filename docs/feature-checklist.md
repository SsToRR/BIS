# Feature checklist

| Area | Current status | Evidence |
| --- | --- | --- |
| Product, frontend, backend, and UX requirements | Implemented | `docs/project-requirements.md` |
| Saved posts and personal Saved page | Implemented | `app.js`, bookmark API in `server.js`, SQLite/Postgres bookmark schemas |
| Session duration and account capacity | Implemented | 30-day default and 500-account default; configurable with `SESSION_DAYS` and `MAX_USERS` |
| Visual redesign and responsive layout | Implemented | `styles.css`; desktop, tablet, and mobile layouts |
| English, Kazakh, and Russian | Implemented | Language picker and message dictionaries in `app.js` |
| Existing registration, posts, comments, likes, search, follows, and post ownership | Existing features retained | Existing API, schemas, and interface flows |
| ERD and architecture diagram | Updated | `docs/erd.mmd` and `docs/architecture.mmd` |
| Classroom demo and five speaking parts | Prepared | `docs/demo-guide.md` and `docs/team-speaking-script.md` |
| Before/current comparison | Prepared | `docs/website-before-after.md` |
| Automated checks | Passed | 46 tests passed, 0 failed on 15 November 2026. New checks cover saved posts, account capacity, and public limit metadata. See `docs/acceptance-test-results.md`. |
| Language and responsive visual review | Partially verified | The desktop sign-in screen loaded and displayed the 30-day policy. Kazakh/Russian copy and phone-width layout still need a manual walkthrough. |
