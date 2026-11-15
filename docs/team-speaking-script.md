# Team presentation speeches

Use the parts in this order. Each speech is about 35–50 seconds at a normal speaking pace. Adjust first-person claims if the actual work split differs.

## Nurila — Requirements and user experience

“I worked on the requirements for our student community and connected them to the screens and API behavior. A student can register or sign in, create and manage their own posts, find classmates, follow them, and save useful posts to a private list. We also specified the account rules, supported languages, and responsive layouts so the team could build and demonstrate the same user journey. The requirements and acceptance evidence are in our project specification.”

## Miras — Saved posts feature

“I added saved posts as a new feature. A student can save a post from the feed, find it later on the Saved posts page, and remove it from that list. The server stores each save in its own database relation, prevents duplicate saves, and returns only the signed-in student’s saved posts. This means the list persists after refresh and stays private to its owner.”

## Ali — Session and account limits

“I added clear limits for account access and campus size. A student’s sign-in lasts up to 30 days, and the campus accepts up to 500 student accounts by default. The server checks the session expiry on each authenticated request and rejects registration when the account cap is reached. Both numbers can be changed through `SESSION_DAYS` and `MAX_USERS`, so the policy is explicit and adjustable.”

## Nazgul — Design and mobile experience

“I redesigned the site with a calmer campus look, clearer cards, stronger headings, and easier-to-find actions. On a wide screen, navigation, the feed, and campus context have separate spaces. On a phone, the content becomes one column and the main destinations move to a fixed bottom bar. The language picker, post actions, and forms also remain usable at smaller widths.”

## Aikhanym — Kazakh and Russian languages

“I added Kazakh and Russian alongside English. Students can choose a language before signing in or from the main screen, and the choice is remembered in their browser. Navigation, forms, buttons, empty states, confirmations, common error messages, and relative post times use the chosen language. This makes the app easier to use for more of our campus community.”

## Group closing

“Together, we updated the requirements, added a useful saved-post feature, made access limits clear, redesigned the mobile experience, and added Kazakh and Russian. We will now show the changes in the running app.”
