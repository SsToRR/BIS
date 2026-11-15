# Acceptance test results

**Last run:** 15 November 2026
**Result:** 46 passed, 0 failed
**Command:** `node --test tests/*.test.js` using Node.js 24.22.1

The suite retains the 30 original acceptance checks and focused post-edit/unit/UI checks. Four new API checks cover the 500-account registration cap, public limit metadata, private saved-post persistence/removal, and bookmark authentication and missing-post handling. The suite runs against a temporary SQLite database and cleans it up.

| Coverage | Result | Evidence |
| --- | --- | --- |
| Registration, login, and 30-day sessions | PASS | `tests/acceptance.test.js`, AC-01–AC-08 |
| 500-account registration capacity and limit metadata | PASS | Registration returns 409 at capacity; `/api/meta` returns session and account limits |
| Saved-post privacy and persistence | PASS | Saving is idempotent; each student sees only their own saved list; removal works |
| Profiles, feed, search, posts, comments, likes, follows | PASS | `tests/acceptance.test.js`, AC-09–AC-24 |
| Ownership, API safety, and asset headers | PASS | `tests/acceptance.test.js`, AC-25–AC-30 |
| Post-edit rules and author-only controls | PASS | `tests/post-edit.test.js`, `tests/post-rules.test.js`, and `tests/app-ui.test.js` |

The suite does not automate Kazakh/Russian copy review, responsive visual inspection, or a Postgres deployment run. The local sign-in page was opened in a browser and displayed the 30-day policy. The SQLite and Postgres schemas both include the bookmark relation.
