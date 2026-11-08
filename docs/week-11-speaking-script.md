# Week 11 team speaking script

This script summarizes the current student social network build, the Week 11 owner-only post edit requirement, and the evidence completed so far. Allow about one minute per speaker. Automated results are recorded in the updated traceability workbook; a manual two-account browser walkthrough remains before submission.

## Salamat Nurila — Systems Analysis and Requirements

"Hello. Our project is a student social network where students can create profiles, share posts, comment, like posts, search for other students and follow them. The original acceptance workbook lists 29 criteria. For Week 11, we added a thirtieth criterion: a signed-in student may edit their own post, but cannot edit another student's post. Automated checks for all 30 criteria pass, and the updated submission copy records AC-30, the test date and evidence. We still need a manual two-account browser walkthrough before final sign-off."

## Ibrayev Miras — Testing

"I am responsible for testing. The complete automated run has 42 passing checks. Thirty cover the acceptance criteria, including account registration, login, profiles, search, posts, comments, likes, follows, database persistence and owner-only post editing. Ten focused tests cover the post ownership rules and API behavior, and two check that edit controls appear only on the author's post. The automated results are recorded in the updated traceability workbook. The remaining test work is a manual browser walkthrough with two accounts."

## Aidaruly Ali — Architecture and Security

“The browser sends an authenticated PUT request when a student saves an edit. The server identifies the signed-in account from its session, reads the post owner from SQLite, and checks that the account IDs match before changing the post. A request for another student's post receives a 403 response, and a missing post receives a 404 response. The server also validates the text length. Hiding the edit button improves the interface, while the server-side ownership check enforces the rule.”

## Khurshitova Nazgul — Application and Development

“On a post written by the signed-in student, the interface shows an edit control. Selecting it opens the text editor with Save and Cancel actions. Saving sends the updated text to the server and marks the post as edited. Posts written by other students do not show an edit control, and the server also rejects an attempted edit from another account. We still need to demonstrate both accounts in a browser before the final presentation.”

## Saken Aikhanym — Data and Database

“Each post stores the ID of its author, its content and its timestamps. Editing updates the existing post and its updated-at timestamp, so there was no need to change the database schema. SQLite also stores users, comments, likes and follows with foreign keys and relationship constraints. The automated tests confirm that posts and related activity persist after a server restart. The app supports follows; it does not currently have a separate subscription feature, so we should confirm what the assignment means by subscription.”

## Week 11 status

**Completed:** Owner-only editing works through the interface and API; the server validates ownership and content. All 42 automated tests pass, including AC-01–AC-30.

**Remaining before submission:**

- Walk through edit, save and cancel in a browser with the author's account; try to edit a different student's post from a second account.
- Confirm whether the requested “subscription” feature means following; a separate subscription feature is not implemented.
- Update any presentation material that still describes React, Express or PostgreSQL. This build uses browser JavaScript, Node.js HTTP and SQLite.

**Before Vercel deployment:** The current project is a local Node server backed by a local SQLite file. It has no Vercel function adapter or hosted database configuration. Move to a supported hosted database and adapt the server entry point before relying on persistent data in Vercel; see `docs/vercel-readiness.md`.
