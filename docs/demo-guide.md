# Five-minute classroom demo

Start the local app with `node server.js`, open `http://127.0.0.1:3000`, and use a fictional demo account from the README. Use a second account for the waitlist walkthrough. Keep a second browser window at a narrow phone width for the mobile section.

1. **0:00–0:35 — Open the campus.** Show the feed and switch the interface to Қазақша, then Русский.
2. **0:35–1:10 — Campus events.** Create an event with one seat. Join it from a second account, then join from the first account to show the waitlist. Cancel the first RSVP and show the second student move into the seat.
3. **1:10–1:45 — Study together.** Create a co-working session and point out its topic, location, capacity, and attendee list. Start the 25-minute focus timer, switch to the five-minute break, and show its pause and reset controls.
4. **1:45–2:20 — Accessibility and phone.** Increase text size, enable contrast, and turn on reduced motion. Resize to a phone and use the navigation bar to open Events and Study together.
5. **2:20–2:55 — Translate a post.** Open Translate, choose the post's source and target languages, read the disclosure, then translate. The target starts with the current interface language.
6. **2:55–3:35 — Admin capacity.** Open Admin settings and change the registration limit to a value at or above the current account count. Explain that the setting is saved in the database.
7. **3:35–4:15 — Existing social features.** Save a post, open Saved posts, then find and follow a student.
8. **4:15–5:00 — Implementation.** Show `events` and `event_rsvps` in the schemas, settings and event APIs in `server.js`, and the six ownership sections in `docs/team-responsibilities.md`.

Every registered account has administrator access, so no setup token is needed for the walkthrough. The six speaking parts are in `docs/team-speaking-script.md`.
