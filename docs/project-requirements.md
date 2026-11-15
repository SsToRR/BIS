# Campus Student Community — Requirements and UX Specification

## Purpose

Campus is a small student community where people can share campus updates, meet classmates, and keep useful posts for later. This specification records the current classroom build and gives the team criteria they can explain and demonstrate.

## Team ownership

| Owner | Scope | Review evidence |
| --- | --- | --- |
| Nurila | Product requirements, frontend/backend behavior, and design/UX specification | This document and the feature/API checklist below |
| Miras | Saved posts: persistent bookmarking and the private Saved page | Bookmark API, database relation, and saved-post interface |
| Ali | Session duration and account-capacity policy | 30-day session cookie; configurable 500-account registration cap |
| Nazgul | Visual redesign and mobile layout | Updated interface styles, tablet/mobile breakpoints, and five-item mobile navigation |
| Aikhanym | Kazakh and Russian localization | Language picker, translated interface, localized relative dates and errors |

## Product requirements

### Functional requirements

| ID | Requirement | Acceptance evidence |
| --- | --- | --- |
| FR-01 | A visitor can register with a name, major, university email, and password, or sign in to an existing account. | The form posts to `/api/auth/register` or `/api/auth/login`; the server validates input and returns a session cookie. |
| FR-02 | A signed-in student can publish, edit, and delete their own posts, and can like or comment on posts. | The feed shows owner controls only to the author; server ownership checks remain authoritative. |
| FR-03 | A student can search for other students, open a profile, follow/unfollow, and view their connections. | Search, profile, follow, and connections routes use the current authenticated API. |
| FR-04 | A student can save or unsave any visible post and revisit saved posts in a private list. Saved state is unique per student/post and persists between sessions. | `POST`/`DELETE /api/posts/:id/bookmark`; `GET /api/bookmarks`; unique database constraint and user-scoped query. |
| FR-05 | A successful sign-in remains valid for 30 days by default. | Session row expiry and HttpOnly cookie use the same duration; `SESSION_DAYS` can change it from 1 to 365. |
| FR-06 | Registration stops at a campus account limit of 500 by default and returns a clear conflict response when full. | `MAX_USERS` configures the limit (1–1,000,000); registration checks the current account count before creation. |
| FR-07 | Core interface content is available in English, Kazakh, and Russian. The selected language is saved in the browser. | The language picker is available on sign-in and the signed-in header; primary labels, feedback, and relative dates localize. |

### Frontend specification

- Use a clear page structure: top bar, primary navigation, main task area, and optional supporting sidebar.
- Keep the primary student actions visible: write, search, follow, like, comment, and save.
- Give saved posts their own route and label the save control with its current state.
- Show registration and session limits on the account form so the policies are visible before sign-up.
- Provide a persistent language selector on both the signed-out and signed-in screens.
- Support keyboard focus, labelled form controls, visible action states, and status/alert announcements for feedback.
- Keep student-written content escaped as text; never render post or profile content as HTML.

### Backend and data specification

- Preserve the current same-origin JSON API and authenticated session model.
- Hash passwords with scrypt; store only a SHA-256 hash of the random session token.
- Use parameterized SQL and enforce post ownership on the server.
- Store saved posts in `bookmarks(user_id, post_id, created_at)`. Add a unique `(user_id, post_id)` constraint and foreign keys with cascade deletion.
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
| `MAX_USERS` | 500 accounts | 1–1,000,000 | Maximum registered campus accounts |

Invalid environment values fall back to the defaults. For a local demonstration, the current seeded sample database has five fictional users and is below the default account cap.

## Demonstration path

1. Open the site on desktop and point out the new visual hierarchy and language control.
2. Switch to Kazakh, then Russian; show that headings, navigation, forms, and feedback change.
3. Sign in and save a post from the feed.
4. Open Saved posts, refresh, then remove the post from the saved collection.
5. Resize to a phone layout and use the fixed bottom navigation.
6. Show the registration form's 30-day session and 500-account policy.
7. Explain that server-side session expiry and the registration count enforce those limits.
