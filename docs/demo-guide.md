# Five-minute classroom demo

Use the local app and fictional demo accounts only. Start with `node server.js`, run `node database/seed.js` if the database needs sample records, and open the local address from the README.

1. **0:00–0:40 — Sign in.** Log in as `casey@student.local` with `CampusDemo2026!`. Point out that this is an invented local-demo identity.
2. **0:40–1:25 — Profile and directory.** Open the profile, then search for “Computer Science” in Find students.
3. **1:25–2:10 — Follow.** Follow Jordan from the directory and open Connections to show the following list.
4. **2:10–3:00 — Create and interact with a post.** Return to the feed, write a short post, like another post, and add a comment.
5. **3:00–4:00 — Edit and ownership.** Edit the post you just created and save it. Point out that another student's card has no edit control; the API also rejects a cross-owner edit with 403, as covered by `tests/post-edit.test.js`.
6. **4:00–4:35 — Persistence.** Refresh the page and show that the post edit, like, comment, and follow still appear.
7. **4:35–5:30 — Explain the data.** Show `docs/erd.mmd` and `database/schema.sql`. Trace a post's `user_id`, its `updated_at`, a comment's `post_id`, and the unique like/follow constraints. Explain that the database lives in `database/student-network.sqlite`.

If the class requires each student to speak, use `docs/week-11-speaking-script.md` and keep the combined narration between five and seven minutes. Everyone should use their own words and name their actual contribution. The five post-edit API tests do not establish that all 30 acceptance criteria have passed.
