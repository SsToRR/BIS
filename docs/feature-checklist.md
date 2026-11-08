# Feature checklist

| Area | Status | Evidence or remaining work |
| --- | --- | --- |
| Five core relational tables | Implemented | `database/schema.sql`; plus the login `sessions` table. |
| ERD and architecture diagram | Implemented as editable Mermaid source | `docs/erd.mmd` and `docs/architecture.mmd`. |
| Registration, login, logout | Implemented and tested | Session, password hashing, validation and logout checks are included in `tests/acceptance.test.js`. |
| Profiles and student search | Implemented and tested | Profile counts/order and search filtering, sorting and limits are covered in `tests/acceptance.test.js`. |
| Posts, comments, likes | Implemented and tested | Create, edit-own, delete-own, comments and likes are covered by acceptance and post-edit tests. |
| Follow/unfollow and connections | Implemented and tested | Follow rules, feed changes and duplicate prevention are covered in `tests/acceptance.test.js`. |
| SQLite persistence and cascades | Implemented and tested | Restart persistence and post deletion cascades are covered in `tests/acceptance.test.js`. |
| Seeded fictional demonstration | Implemented | `database/seed.js`; temporary credentials are in README. |
| React + Express + PostgreSQL architecture | Not used in this build | The current app is browser JavaScript + Node HTTP + SQLite. Update the team's slides/scripts to match or migrate the implementation. |
| Automated checks | Passed | 42 checks pass: AC-01–AC-30, ten focused post-edit/unit checks and two UI-card rendering checks. See `docs/acceptance-test-results.md`. |
| Manual browser walkthrough | Still to do | Walk through edit/save/cancel with the author's account and confirm a second account cannot edit another user's post. |
| Acceptance workbook traceability | Updated copy complete | `outputs/week11-testing-20261108/Acceptance_Criteria_Traceability_UPDATED.xlsx` records AC-01–AC-30 as automated passes with date and evidence. The supplied original remains unchanged; manual browser verification is pending. |
| Subscription feature | Clarify scope | The app implements follows. A separate subscription feature is not present. Confirm whether “subscription” means following. |
| Vercel deployment readiness | Code ready; account provisioning pending | Vercel function entry point, Postgres schema, Neon driver and deployment configuration are present. Attach a Neon resource with `DATABASE_URL`, then deploy and run live checks; see `docs/vercel-readiness.md`. |
| Five-person speaking script | Prepared | `docs/week-11-speaking-script.md`; edit each first-person statement if the actual work split differs. |
