# Feature checklist

| Area | Current status | Evidence |
| --- | --- | --- |
| Campus events, unique attendance, and FIFO waitlists | Implemented | `events` and `event_rsvps` in both schemas; event APIs and event page in `server.js` and `app.js` |
| Co-working sessions | Implemented | Study together page with topic, place, start time, capacity, attendees, and queue |
| Account capacity settings for all users | Implemented | Persistent `app_settings` value; existing accounts are promoted during schema initialization, and new accounts are admins by default |
| Accessibility settings and mobile navigation | Implemented | Larger text, contrast, reduced motion, skip link, keyboard focus, responsive navigation |
| Translate posts into the selected UI language | Implemented | Authenticated translation route proxies to MyMemory and discloses the provider before sending text |
| Focus and break timer | Implemented | Browser-saved 25-minute and 5-minute timer controls on the Study together page |
| Existing posts, saves, session duration, and localization | Retained | Existing features remain; `SESSION_DAYS` and `MAX_USERS` seed initial policy values |
| Existing registration, posts, comments, likes, search, follows, and post ownership | Existing features retained | Existing API, schemas, and interface flows |
| ERD and architecture diagram | Updated | `docs/erd.mmd` and `docs/architecture.mmd` |
| Classroom demo and six speaking parts | Prepared | `docs/demo-guide.md`, `docs/team-speaking-script.md`, and team handoff DOCX |
| Before/current comparison | Prepared | `docs/website-before-after.md` |
| Existing automated checks | Existing results retained | `docs/acceptance-test-results.md` predates the new event, admin, translation, and timer work. |
| Language and responsive visual review | Partially verified | The desktop sign-in screen loaded and displayed the 30-day policy. Kazakh/Russian copy and phone-width layout still need a manual walkthrough. |
