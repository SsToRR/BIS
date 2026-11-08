# Week 11 acceptance test results

**Run date:** 8 November 2026  
**Automated result:** 42 passed, 0 failed  
**Command:** `node --test tests/*.test.js` (Node.js 24.22.1)

The acceptance suite contains one automated check for each criterion AC-01 through AC-30. Ten focused unit/API tests cover post editing, and two frontend renderer checks confirm edit/delete controls are shown only for the signed-in author's post. The suite uses a temporary SQLite database and cleans up its test files. It does not alter the local demonstration database or the supplied workbook.

| Criteria | Result | Test coverage |
| --- | --- | --- |
| AC-01–AC-04 | PASS | Registration, email/password validation and duplicate account handling. |
| AC-05–AC-08 | PASS | Session cookie, login errors, logout, password hashes and session token hashes. |
| AC-09–AC-10 | PASS | Profile counts/order and student search behavior. |
| AC-11–AC-14 | PASS | Post creation/limits, post ownership on delete, and feed filtering/order/limit. |
| AC-15–AC-18 | PASS | Comment validation, likes, duplicate like prevention and unlike. |
| AC-19–AC-22 | PASS | Follow, self-follow rejection, duplicate prevention and unfollow behavior. |
| AC-23–AC-24 | PASS | Persistence after server restart and post comment/like cascades. |
| AC-25–AC-29 | PASS | Authentication guards, SQL injection handling, safe errors, body-size limit and CSP headers. |
| AC-30 | PASS | Post owner can edit; another user receives 403 and the post stays unchanged. |

**Manual walkthrough still needed:** Use two browser accounts to demonstrate edit/save/cancel for the author, confirm the edited label, and attempt to edit another user's post. Automated UI checks evaluate the rendered post card; they are not a substitute for this browser walkthrough.

**Traceability workbook:** The attached workbook has AC-01–AC-29 and remains unchanged. Add AC-30 and enter the run date, status and evidence into the team's submission copy.
