# Campus Student Community — Requirements and UX Specification

## Purpose

Campus is a small student community where people can share campus updates, meet classmates, and keep useful posts for later. This specification records the current classroom build and gives the team criteria they can explain and demonstrate.

## Team ownership

| Owner | Scope | Review evidence |
| --- | --- | --- |
| Salamat Nurila | Campus events and seat registration | Event API, unique RSVP relation, queue status, and capacity-aware interface |
| Ibrayev Miras | Co-working study sessions | Study together page and shared session RSVP flow |
| Aidaruly Ali | Administrator-managed account capacity | Protected admin settings API and persistent capacity value |
| Khurshitova Nazgul | Accessibility settings and phone layout | Text size, contrast, reduced motion, keyboard, and responsive navigation |
| Saken Aikhanym | Post translation and language support | Translation controls and English, Kazakh, and Russian target languages |
| Almat | Focus timer | Persistent 25-minute focus and 5-minute break controls |

## Product requirements

### Functional requirements

| ID | Requirement | Acceptance evidence |
| --- | --- | --- |
| FR-01 | A visitor can register with a name, major, university email, and password, or sign in to an existing account. | The form posts to `/api/auth/register` or `/api/auth/login`; the server validates input and returns a session cookie. |
| FR-02 | A signed-in student can publish, edit, and delete their own posts, and can like or comment on posts. | The feed shows owner controls only to the author; server ownership checks remain authoritative. |
| FR-03 | A student can search for other students, open a profile, follow/unfollow, and view their connections. | Search, profile, follow, and connections routes use the current authenticated API. |
| FR-04 | A student can save or unsave any visible post and revisit saved posts in a private list. Saved state is unique per student/post and persists between sessions. | `POST`/`DELETE /api/posts/:id/bookmark`; `GET /api/bookmarks`; unique database constraint and user-scoped query. |
| FR-05 | A successful sign-in remains valid for 30 days by default. | Session row expiry and HttpOnly cookie use the same duration; `SESSION_DAYS` can change it from 1 to 365. |
| FR-06 | Registration stops at a campus account limit of 500 by default and returns a clear conflict response when full. An administrator can change the persistent limit. | `MAX_USERS` seeds the initial setting; `PUT /api/admin/settings` changes it after the first administrator is configured. |
| FR-07 | Core interface content is available in English, Kazakh, and Russian. Students can translate a post into the selected interface language. | Translation requires an explicit source language, shows the target language and external-service disclosure, keeps the original visible, provides inline progress/errors, and caches the result for the current tab. |
| FR-08 | Students can create campus events with a future start time, place, and seat capacity. Each student can RSVP once. | `POST /api/events`, `POST`/`DELETE /api/events/:id/rsvp`, unique `(event_id, user_id)` in `event_rsvps`, and the Events page. |
| FR-09 | A full event accepts additional sign-ups in a FIFO waitlist and moves the next student into an open seat when an RSVP is cancelled. | RSVP order is stored by `rsvp_id`; displayed attendance and waitlist positions derive from that order and capacity. |
| FR-10 | Students can create and join co-working sessions with a topic, location, start time, and seat limit. | Study sessions use the same event and waitlist system under the `study` kind. |
| FR-11 | Students can choose larger text, higher contrast, and reduced motion. The settings persist in their browser. | Accessibility menu applies saved preferences on sign-in and signed-in screens. |
| FR-12 | Students can use a 25-minute focus sprint and a 5-minute break timer. | The Study together page stores timer mode and progress locally. |

### Frontend specification

- Use a clear page structure: top bar, primary navigation, main task area, and optional supporting sidebar.
- Keep the primary student actions visible: write, search, follow, like, comment, and save.
- Give saved posts their own route and label the save control with its current state.
- Show registration and session limits on the account form so the policies are visible before sign-up.
- Provide a persistent language selector on both the signed-out and signed-in screens.
- Support keyboard focus, labelled form controls, visible action states, and status/alert announcements for feedback.
- Keep student-written content escaped as text; never render post or profile content as HTML.
- Keep new campus navigation available at phone widths and provide a skip link, visible focus, and keyboard-operable controls.
- Keep event attendance and waitlist position derived from one unique RSVP row per user and event.

### Backend and data specification

- Preserve the current same-origin JSON API and authenticated session model.
- Hash passwords with scrypt; store only a SHA-256 hash of the random session token.
- Use parameterized SQL and enforce post ownership on the server.
- Store saved posts in `bookmarks(user_id, post_id, created_at)`. Add a unique `(user_id, post_id)` constraint and foreign keys with cascade deletion.
- Store events and study sessions in `events`; store sign-ups in `event_rsvps` with a unique event/user pair and queue order. Use the same schema in SQLite and Postgres.
- Store the adjustable campus account limit in `app_settings`; only accounts with the persisted `admin` role can change it.
- Require a one-time `ADMIN_BOOTSTRAP_TOKEN` (at least 32 characters) to configure the first administrator. Remove it after bootstrap.
- Send post text and language pair to MyMemory through the authenticated server route only after the student chooses a source language and presses Translate. Disclose the external service, keep each request below the documented segment limit, and send one paragraph at a time.
- Return only the signed-in student's saved posts from `/api/bookmarks`; never return another student's bookmark list.
- Return public configuration through `/api/meta`: `session_days` and `max_users`.
- Keep SQLite and Postgres schemas aligned.

## Design and responsive behavior

- Visual tone: welcoming campus community; forest green, warm off-white surfaces, fresh green accents, and readable text.
- Desktop (over 1120px): three-column layout for navigation, feed, and community context.
- Tablet (761–1120px): navigation rail plus main content; hide the nonessential context column.
- Mobile (760px and below): single-column content, compact top bar, and fixed five-destination bottom navigation with safe-area padding.
- At 390px and below: reduce horizontal padding and keep language/profile controls and actions usable without horizontal scrolling.
- Respect reduced-motion preferences. Use system font fallbacks and avoid third-party runtime dependencies.

## Limits and configuration

| Setting | Default | Valid range | Purpose |
| --- | ---: | ---: | --- |
| `SESSION_DAYS` | 30 days | 1–365 | Session cookie and server-side session expiry |
| `MAX_USERS` | 500 accounts | 1–1,000,000 | Initial campus registration limit; administrators can change the stored setting |
| `ADMIN_BOOTSTRAP_TOKEN` | unset | at least 32 characters | One-time credential to configure the first administrator |

Invalid environment values fall back to the defaults. For a local demonstration, the current seeded sample database has five fictional users and is below the default account cap.

## Demonstration path

1. Open the site on desktop and point out the new visual hierarchy and language control.
2. Switch to Kazakh, then Russian; show that headings, navigation, forms, and feedback change.
3. Sign in and save a post from the feed.
4. Open Saved posts, refresh, then remove the post from the saved collection.
5. Resize to a phone layout and use the fixed bottom navigation.
6. Show the registration form's 30-day session and 500-account policy.
7. Create an event with one seat, register a second account, and show the waiting-list position and automatic promotion after an RSVP is cancelled.
8. Open Study together, create a co-working session, start the focus timer, and change the accessibility preferences.
9. Open Admin settings to show the persistent account limit. Explain the one-time setup key and remove it after the first administrator is set up.
10. Translate a post and point out the source-language control and provider disclosure.
