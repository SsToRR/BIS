# Website comparison: before and current

The “before” column describes the interface in the project before this update. The current website can be shown at the same screen size and with the same demo account.

| Area | Previous website | Current website |
| --- | --- | --- |
| Visual design | Purple and navy palette, compact cards, plain three-column student dashboard. | Forest green, cream, and lime palette; clearer typography, more spacing, and more visible action states. |
| Navigation | Feed, student search, connections, and profile. | Adds Saved posts on desktop and as a first-class mobile destination. |
| Post actions | Like, comment, and edit/delete controls for the author. | Keeps existing actions and adds a private, persistent Save/Remove control. |
| Saved content | No bookmark storage or saved-post list. | Saved posts are stored per student and appear on a dedicated page. |
| Account policy | Seven-day session; no campus account cap. | Thirty-day session and a 500-account default cap, configurable by `SESSION_DAYS` and `MAX_USERS`. |
| Languages | English-only interface. | English, Kazakh, and Russian selector; the choice is remembered in the browser. |
| Mobile | Existing small-screen layout collapses to one column with four bottom destinations. | Reworked single-column mobile screens, fixed five-destination bottom navigation, safe-area spacing, and compact controls. |

## Quick visual walkthrough

1. Sign in on a wide browser and compare the navigation rail, feed cards, and right-hand campus panels.
2. Open the same account at a phone width. The current view becomes a single column and adds Saved to the bottom navigation.
3. Save a feed post, visit Saved posts, and remove it. The old website has no equivalent page or control.
4. Change the language to Kazakh and Russian on either the sign-in page or signed-in header.
5. Open Create account to show the 30-day session and 500-account policy.

## Technical delta

- `app.js` adds the saved page, bookmark actions, and three-language interface.
- `server.js` adds bookmark APIs, public limit metadata, the longer session, and the account-cap response.
- Both database schemas add the private, unique `bookmarks` relation.
- `styles.css` replaces the earlier visual system and defines desktop, tablet, and mobile layouts.
- `docs/project-requirements.md` records functional, backend, UX, and acceptance requirements.
