const app = document.querySelector('#app');
const localeNames = { en: 'English', kk: 'Қазақша', ru: 'Русский' };
const messages = {
  en: {
    brandSub: 'student community', student: 'Student', language: 'Language', home: 'Home feed', discover: 'Find students', follow: 'Follow', savedNav: 'Saved posts', connections: 'Connections', profile: 'My profile', logout: 'Log out', campus: 'YOUR CAMPUS', account: 'ACCOUNT', authKicker: 'CAMPUS COMMUNITY',
    communityEyebrow: 'YOUR CAMPUS COMMUNITY', welcome: 'Hey, {name} 👋', welcomeBody: 'A little hello can turn into a new study buddy. See what your campus is sharing.', network: 'Your network', following: 'Following', followers: 'Followers', peopleKnow: 'People to know', about: 'About Campus', aboutBody: 'A friendly space to share ideas, ask questions, and connect with students across your university.',
    feedTitle: 'Home feed', feedSubtitle: 'Good things happen when students share.', composerPlaceholder: 'What’s happening on campus?', composerHint: 'Share a thought, question, or win ✨', share: 'Share post', like: 'Like', liked: 'Liked', comment: 'Comment', save: 'Save', saved: 'Saved', likes: 'likes', comments: 'comments', commentPlaceholder: 'Write a kind comment…', send: 'Send', edit: 'Edit post', remove: 'Delete post', cancel: 'Cancel', saveChanges: 'Save changes', edited: 'edited', deleteConfirm: 'Delete this post? Its comments and likes will also be removed.',
    discoverTitle: 'Find your people', discoverSubtitle: 'Meet students with the same interests.', searchPlaceholder: 'Search by name, major, or faculty…', search: 'Search', noStudents: 'No students found', noStudentsBody: 'Try another name or major.',
    profileTitle: 'Student profile', profileSubtitle: 'A little more about your campus community.', you: 'you', posts: 'Posts', noPosts: 'No posts yet', noPostsBody: 'Their shared posts will show up here.',
    connectionsTitle: 'Your connections', connectionsSubtitle: 'Keep up with the students you follow.', noFollowers: 'No followers yet', noFollowersBody: 'When students follow you, they will appear here.', noFollowing: 'You’re not following anyone yet', noFollowingBody: 'Visit Find students to meet your campus community.',
    savedTitle: 'Saved posts', savedSubtitle: 'A private collection of posts you want to find again.', noSaved: 'Nothing saved yet', noSavedBody: 'Use Save on a post to keep it here for later.',
    emptyFeedTitle: 'Your feed is ready for a first post', emptyFeedBody: 'Share something with your campus to get the conversation going.',
    loginTitle: 'Welcome back', joinTitle: 'Join your campus', loginSubtitle: 'Sign in to see what’s happening around you.', joinSubtitle: 'Create your student profile and say hello.', authHeadline: 'Your campus.\nYour people.', authBody: 'A welcoming place to share what’s on your mind, find your study crew, and feel a little more connected.', authFoot: 'Made for students, by students · Campus community',
    fullName: 'Full name', major: 'Major', faculty: 'Faculty', optional: 'optional', universityEmail: 'University email', password: 'Password', yourName: 'Your name', majorExample: 'e.g. Information Systems', facultyExample: 'e.g. Business School', emailExample: 'you@university.edu', passwordHint: 'At least 8 characters', signIn: 'Sign in', createAccount: 'Create account', newHere: 'New around here?', alreadyAccount: 'Already have an account?', joinLink: 'Create an account', loginLink: 'Sign in', sessionPolicy: 'Sign-in lasts up to {days} days.', accountPolicy: 'Campus capacity: {count} student accounts.',
    justNow: 'Just now', welcomeBack: 'Welcome back!', welcomeCampus: 'Welcome to Campus!', postShared: 'Your post is up!', postUpdated: 'Your post was updated.', postDeleted: 'Post deleted.', postSaved: 'Saved for later.', postUnsaved: 'Removed from saved posts.',
    errorGeneric: 'Something went wrong. Please try again.', errorLogin: 'Please log in to continue.', errorEmail: 'Enter a valid email address.', errorPassword: 'Use a password with at least 8 characters.', errorDuplicate: 'That email is already registered.', errorCredentials: 'Email or password is incorrect.', errorPost: 'Post must be between 1 and 2000 characters.', errorComment: 'Comment must be between 1 and 500 characters.', errorNotFound: 'Post not found.', errorOwnerEdit: 'You can only edit your own posts.', errorOwnerDelete: 'You can only delete your own posts.', errorCapacity: 'This campus has reached its {count}-student account limit.', errorAccount: 'Name, major, and required fields must be completed.',
  },
  kk: {
    brandSub: 'студенттер қауымдастығы', student: 'Студент', language: 'Тіл', home: 'Жаңалықтар', discover: 'Студенттерді табу', follow: 'Жазылу', savedNav: 'Сақталған жазбалар', connections: 'Байланыстар', profile: 'Профилім', logout: 'Шығу', campus: 'СІЗДІҢ КАМПУСЫҢЫЗ', account: 'АККАУНТ', authKicker: 'КАМПУС ҚАУЫМДАСТЫҒЫ',
    communityEyebrow: 'КАМПУС ҚАУЫМДАСТЫҒЫ', welcome: 'Сәлем, {name} 👋', welcomeBody: 'Бір сәлем жаңа оқу досын табуға себеп болуы мүмкін. Кампустағы жаңалықтарды көріңіз.', network: 'Сіздің желіңіз', following: 'Жазылғандар', followers: 'Жазылушылар', peopleKnow: 'Танысуға болатындар', about: 'Campus туралы', aboutBody: 'Идея бөлісуге, сұрақ қоюға және университет студенттерімен байланысуға арналған ашық орта.',
    feedTitle: 'Жаңалықтар таспасы', feedSubtitle: 'Студенттер бөліскенде жақсы нәрселер болады.', composerPlaceholder: 'Кампус жаңалықтары қандай?', composerHint: 'Ойыңызбен, сұрағыңызбен не жетістігіңізбен бөлісіңіз ✨', share: 'Жариялау', like: 'Ұнату', liked: 'Ұнатылды', comment: 'Пікір', save: 'Сақтау', saved: 'Сақталды', likes: 'ұнату', comments: 'пікір', commentPlaceholder: 'Жылы пікір қалдырыңыз…', send: 'Жіберу', edit: 'Жазбаны өңдеу', remove: 'Жазбаны жою', cancel: 'Болдырмау', saveChanges: 'Сақтау', edited: 'өңделді', deleteConfirm: 'Бұл жазба жойылсын ба? Оның пікірлері мен ұнатулары да жойылады.',
    discoverTitle: 'Өз адамдарыңызды табыңыз', discoverSubtitle: 'Қызығушылықтарыңыз ортақ студенттермен танысыңыз.', searchPlaceholder: 'Аты, мамандығы немесе факультеті бойынша іздеу…', search: 'Іздеу', noStudents: 'Студенттер табылмады', noStudentsBody: 'Басқа есім не мамандық бойынша іздеп көріңіз.',
    profileTitle: 'Студент профилі', profileSubtitle: 'Кампус қауымдастығы туралы көбірек біліңіз.', you: 'сіз', posts: 'Жазбалар', noPosts: 'Әзірге жазба жоқ', noPostsBody: 'Ортақ жазбалары осында көрсетіледі.',
    connectionsTitle: 'Байланыстарыңыз', connectionsSubtitle: 'Жазылған студенттеріңіздің жаңалықтарын көріңіз.', noFollowers: 'Әзірге жазылушы жоқ', noFollowersBody: 'Сізге жазылған студенттер осында көрінеді.', noFollowing: 'Әзірге ешкімге жазылмадыңыз', noFollowingBody: 'Кампус студенттерімен танысу үшін «Студенттерді табу» бөліміне өтіңіз.',
    savedTitle: 'Сақталған жазбалар', savedSubtitle: 'Қайта оқығыңыз келетін жазбалардың жеке жинағы.', noSaved: 'Әзірге сақталған жазба жоқ', noSavedBody: 'Жазбаны кейін табу үшін «Сақтау» түймесін басыңыз.',
    emptyFeedTitle: 'Таспадағы алғашқы жазбаңызды күтеміз', emptyFeedBody: 'Әңгіме бастау үшін кампусыңызбен бір нәрсе бөлісіңіз.',
    loginTitle: 'Қош келдіңіз', joinTitle: 'Кампусқа қосылыңыз', loginSubtitle: 'Айналаңызда не болып жатқанын көру үшін кіріңіз.', joinSubtitle: 'Студент профилін жасап, сәлем айтыңыз.', authHeadline: 'Сіздің кампусыңыз.\nСіздің ортаңыз.', authBody: 'Ой бөлісуге, бірге оқитын достар табуға және жақынырақ араласуға арналған жылы орта.', authFoot: 'Студенттер үшін, студенттер жасаған · Кампус қауымдастығы',
    fullName: 'Аты-жөні', major: 'Мамандығы', faculty: 'Факультеті', optional: 'міндетті емес', universityEmail: 'Университет поштасы', password: 'Құпиясөз', yourName: 'Атыңыз', majorExample: 'мысалы, Ақпараттық жүйелер', facultyExample: 'мысалы, Бизнес мектебі', emailExample: 'you@university.edu', passwordHint: 'Кемінде 8 таңба', signIn: 'Кіру', createAccount: 'Аккаунт ашу', newHere: 'Жаңадан келдіңіз бе?', alreadyAccount: 'Аккаунтыңыз бар ма?', joinLink: 'Аккаунт ашу', loginLink: 'Кіру', sessionPolicy: 'Жүйеге кіру уақыты: {days} күнге дейін.', accountPolicy: 'Кампус сыйымдылығы: {count} студент аккаунты.',
    justNow: 'Жаңа ғана', welcomeBack: 'Қайта қош келдіңіз!', welcomeCampus: 'Campus-қа қош келдіңіз!', postShared: 'Жазбаңыз жарияланды!', postUpdated: 'Жазбаңыз жаңартылды.', postDeleted: 'Жазба жойылды.', postSaved: 'Кейін оқу үшін сақталды.', postUnsaved: 'Сақталғандардан алынды.',
    errorGeneric: 'Қате пайда болды. Қайталап көріңіз.', errorLogin: 'Жалғастыру үшін жүйеге кіріңіз.', errorEmail: 'Жарамды электрондық пошта енгізіңіз.', errorPassword: 'Кемінде 8 таңбадан тұратын құпиясөз қолданыңыз.', errorDuplicate: 'Бұл пошта бұрын тіркелген.', errorCredentials: 'Пошта немесе құпиясөз қате.', errorPost: 'Жазба 1–2000 таңба аралығында болуы керек.', errorComment: 'Пікір 1–500 таңба аралығында болуы керек.', errorNotFound: 'Жазба табылмады.', errorOwnerEdit: 'Тек өз жазбаңызды өңдей аласыз.', errorOwnerDelete: 'Тек өз жазбаңызды жоя аласыз.', errorCapacity: 'Кампус {count} студенттік аккаунт шегіне жетті.', errorAccount: 'Аты-жөні, мамандығы және міндетті өрістерді толтырыңыз.',
  },
  ru: {
    brandSub: 'студенческое сообщество', student: 'Студент', language: 'Язык', home: 'Лента', discover: 'Найти студентов', follow: 'Подписаться', savedNav: 'Сохранённые посты', connections: 'Контакты', profile: 'Мой профиль', logout: 'Выйти', campus: 'ВАШ КАМПУС', account: 'АККАУНТ', authKicker: 'КАМПУСНОЕ СООБЩЕСТВО',
    communityEyebrow: 'КАМПУСНОЕ СООБЩЕСТВО', welcome: 'Привет, {name} 👋', welcomeBody: 'Обычное приветствие может привести к новой дружбе. Посмотрите, чем делятся студенты.', network: 'Ваша сеть', following: 'Вы подписаны', followers: 'Подписчики', peopleKnow: 'Познакомьтесь', about: 'О Campus', aboutBody: 'Пространство, где можно делиться идеями, задавать вопросы и общаться со студентами университета.',
    feedTitle: 'Лента', feedSubtitle: 'Когда студенты делятся, происходит хорошее.', composerPlaceholder: 'Что нового в кампусе?', composerHint: 'Поделитесь мыслью, вопросом или успехом ✨', share: 'Опубликовать', like: 'Нравится', liked: 'Понравилось', comment: 'Комментировать', save: 'Сохранить', saved: 'Сохранено', likes: 'нравится', comments: 'комментариев', commentPlaceholder: 'Оставьте добрый комментарий…', send: 'Отправить', edit: 'Изменить пост', remove: 'Удалить пост', cancel: 'Отмена', saveChanges: 'Сохранить', edited: 'изменено', deleteConfirm: 'Удалить этот пост? Комментарии и отметки «Нравится» тоже будут удалены.',
    discoverTitle: 'Найдите своих', discoverSubtitle: 'Знакомьтесь со студентами с похожими интересами.', searchPlaceholder: 'Поиск по имени, специальности или факультету…', search: 'Найти', noStudents: 'Студенты не найдены', noStudentsBody: 'Попробуйте другое имя или специальность.',
    profileTitle: 'Профиль студента', profileSubtitle: 'Узнайте больше о сообществе кампуса.', you: 'вы', posts: 'Посты', noPosts: 'Пока нет постов', noPostsBody: 'Здесь появятся опубликованные посты.',
    connectionsTitle: 'Ваши контакты', connectionsSubtitle: 'Следите за новостями студентов, на которых подписаны.', noFollowers: 'Пока нет подписчиков', noFollowersBody: 'Студенты, подписавшиеся на вас, появятся здесь.', noFollowing: 'Вы пока ни на кого не подписаны', noFollowingBody: 'Откройте раздел «Найти студентов», чтобы познакомиться с кампусом.',
    savedTitle: 'Сохранённые посты', savedSubtitle: 'Личная подборка постов, к которым вы хотите вернуться.', noSaved: 'Пока ничего не сохранено', noSavedBody: 'Нажмите «Сохранить» под постом, чтобы вернуться к нему позже.',
    emptyFeedTitle: 'Ваша лента ждёт первую публикацию', emptyFeedBody: 'Поделитесь чем-нибудь с кампусом и начните разговор.',
    loginTitle: 'С возвращением', joinTitle: 'Присоединяйтесь к кампусу', loginSubtitle: 'Войдите, чтобы узнать, что происходит вокруг.', joinSubtitle: 'Создайте профиль студента и поздоровайтесь.', authHeadline: 'Ваш кампус.\nВаши люди.', authBody: 'Дружелюбное место, чтобы делиться мыслями, находить компанию для учёбы и быть ближе друг к другу.', authFoot: 'Для студентов, от студентов · Кампусное сообщество',
    fullName: 'Имя и фамилия', major: 'Специальность', faculty: 'Факультет', optional: 'необязательно', universityEmail: 'Университетская почта', password: 'Пароль', yourName: 'Ваше имя', majorExample: 'например, Информационные системы', facultyExample: 'например, Бизнес-школа', emailExample: 'you@university.edu', passwordHint: 'Не менее 8 символов', signIn: 'Войти', createAccount: 'Создать аккаунт', newHere: 'Вы здесь впервые?', alreadyAccount: 'Уже есть аккаунт?', joinLink: 'Создать аккаунт', loginLink: 'Войти', sessionPolicy: 'Срок входа — до {days} дней.', accountPolicy: 'Вместимость кампуса: {count} аккаунтов студентов.',
    justNow: 'Только что', welcomeBack: 'С возвращением!', welcomeCampus: 'Добро пожаловать в Campus!', postShared: 'Пост опубликован!', postUpdated: 'Пост обновлён.', postDeleted: 'Пост удалён.', postSaved: 'Сохранено на потом.', postUnsaved: 'Удалено из сохранённых.',
    errorGeneric: 'Что-то пошло не так. Попробуйте ещё раз.', errorLogin: 'Войдите, чтобы продолжить.', errorEmail: 'Введите корректный адрес электронной почты.', errorPassword: 'Используйте пароль не короче 8 символов.', errorDuplicate: 'Этот адрес уже зарегистрирован.', errorCredentials: 'Неверная почта или пароль.', errorPost: 'Пост должен содержать от 1 до 2000 символов.', errorComment: 'Комментарий должен содержать от 1 до 500 символов.', errorNotFound: 'Пост не найден.', errorOwnerEdit: 'Вы можете изменять только свои посты.', errorOwnerDelete: 'Вы можете удалять только свои посты.', errorCapacity: 'Достигнут лимит кампуса: {count} аккаунтов студентов.', errorAccount: 'Заполните имя, специальность и обязательные поля.',
  },
};

const storedLocale = (() => { try { return localStorage.getItem('campus-locale'); } catch { return null; } })();
const state = {
  user: null, route: 'feed', profileId: null, search: '', students: [], posts: [], profile: null,
  connections: null, authMode: 'login', loading: false, editingPostId: null, locale: messages[storedLocale] ? storedLocale : 'en',
  connectionTab: 'following', meta: { session_days: 30, max_users: 500 },
};
state.i18n = messages[state.locale];
const tr = (key, variables = {}) => String(state.i18n[key] ?? messages.en[key] ?? key).replace(/\{(\w+)\}/g, (_, name) => String(variables[name] ?? ''));
const esc = (value = '') => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const initials = name => String(name || '?').trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toLocaleUpperCase(state.locale);
const date = value => {
  const parsed = new Date(value);
  const minutes = Math.max(0, Math.floor((Date.now() - parsed) / 60000));
  if (minutes < 1) return tr('justNow');
  const relative = new Intl.RelativeTimeFormat(state.locale === 'kk' ? 'kk-KZ' : state.locale === 'ru' ? 'ru-RU' : 'en', { numeric: 'auto', style: 'short' });
  if (minutes < 60) return relative.format(-minutes, 'minute');
  if (minutes < 1440) return relative.format(-Math.floor(minutes / 60), 'hour');
  if (minutes < 43200) return relative.format(-Math.floor(minutes / 1440), 'day');
  return new Intl.DateTimeFormat(state.locale === 'kk' ? 'kk-KZ' : state.locale === 'ru' ? 'ru-RU' : 'en', { month: 'short', day: 'numeric' }).format(parsed);
};
function localizeServerError(message) {
  const exact = {
    'Please log in to continue.': 'errorLogin', 'Enter a valid email address.': 'errorEmail',
    'Use a password with at least 8 characters.': 'errorPassword', 'That email is already registered.': 'errorDuplicate',
    'Email or password is incorrect.': 'errorCredentials', 'Post must be between 1 and 2000 characters.': 'errorPost',
    'Comment must be between 1 and 500 characters.': 'errorComment', 'Post not found.': 'errorNotFound',
    'You can only edit your own posts.': 'errorOwnerEdit', 'You can only delete your own posts.': 'errorOwnerDelete',
    'Something went wrong. Please try again.': 'errorGeneric',
  };
  if (exact[message]) return tr(exact[message]);
  const capacity = message.match(/reached its (\d+)-student account limit/i);
  if (capacity) return tr('errorCapacity', { count: capacity[1] });
  return message || tr('errorGeneric');
}
async function api(url, options = {}) {
  const response = await fetch('/api/' + url, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, credentials: 'same-origin' });
  const data = await response.json().catch(() => ({ error: tr('errorGeneric') }));
  if (!response.ok) throw new Error(localizeServerError(data.error));
  return data;
}
function toast(message, error = false) {
  document.querySelector('.toast')?.remove();
  const element = document.createElement('div');
  element.className = `toast${error ? ' error' : ''}`;
  element.setAttribute('role', error ? 'alert' : 'status');
  element.textContent = message;
  document.body.append(element);
  setTimeout(() => element.remove(), 2800);
}
function go(route, id = null) {
  state.route = route;
  state.profileId = id;
  history.pushState({ route, id }, '', route === 'profile' ? `#profile/${id}` : `#${route}`);
  loadPage();
}
window.addEventListener('popstate', () => {
  const [route, id] = location.hash.slice(1).split('/');
  state.route = route || 'feed';
  state.profileId = id || null;
  loadPage();
});

const avatar = (name, large = false) => `<div class="avatar${large ? ' large' : ''}" aria-hidden="true">${esc(initials(name))}</div>`;
function brand() {
  return `<a class="brand" href="#feed" data-route="feed" aria-label="Campus home"><span class="brand-mark">c</span><span>campus<small>${esc(tr('brandSub'))}</small></span></a>`;
}
function languagePicker(extraClass = '') {
  return `<label class="language-picker ${extraClass}"><span class="sr-only">${esc(tr('language'))}</span><select data-language aria-label="${esc(tr('language'))}">${Object.entries(localeNames).map(([code, label]) => `<option value="${code}"${state.locale === code ? ' selected' : ''}>${label}</option>`).join('')}</select></label>`;
}
function navLink(route, icon, label) {
  return `<button class="side-link${state.route === route ? ' active' : ''}" data-route="${route}"${state.route === route ? ' aria-current="page"' : ''}><span class="ico" aria-hidden="true">${icon}</span>${esc(label)}</button>`;
}
function shell(content) {
  const label = state.user.full_name.split(' ')[0];
  const profileId = state.user.user_id;
  return `<div class="shell">
    <header class="topbar"><div class="topbar-inner">${brand()}<div class="top-actions">${languagePicker()}<button class="button ghost small top-profile" data-route="profile" data-id="${profileId}">${esc(tr('profile'))}</button><div class="user-mini">${avatar(state.user.full_name)}<span class="name">${esc(state.user.full_name)}</span></div><button class="icon-button" data-action="logout" title="${esc(tr('logout'))}" aria-label="${esc(tr('logout'))}">↪</button></div></div></header>
    <div class="layout"><aside class="side-card"><div class="side-group">${navLink('feed', '⌂', tr('home'))}${navLink('discover', '⌕', tr('discover'))}${navLink('saved', '▣', tr('savedNav'))}${navLink('connections', '♡', tr('connections'))}</div><div class="sidebar-label">${esc(tr('campus'))}</div><button class="side-link${state.route === 'profile' && Number(state.profileId) === Number(profileId) ? ' active' : ''}" data-route="profile" data-id="${profileId}"><span class="ico" aria-hidden="true">◉</span>${esc(tr('profile'))}</button><div class="sidebar-label">${esc(tr('account'))}</div><button class="side-link" data-action="logout"><span class="ico" aria-hidden="true">↪</span>${esc(tr('logout'))}</button><div class="sidebar-note"><span class="online-dot"></span>${esc(tr('communityEyebrow'))}</div></aside>
      <main class="main">${content}</main>
      <aside class="right-column"><section class="welcome"><small>${esc(tr('communityEyebrow'))}</small><h2>${esc(tr('welcome', { name: label }))}</h2><p>${esc(tr('welcomeBody'))}</p></section><section class="panel"><h3>${esc(tr('network'))}</h3><div id="mini-stats"><div class="stat-row"><span>${esc(tr('following'))}</span><strong>—</strong></div><div class="stat-row"><span>${esc(tr('followers'))}</span><strong>—</strong></div></div></section><section class="panel"><h3>${esc(tr('peopleKnow'))}</h3><div id="suggestions"><span class="muted" style="font-size:12px">…</span></div></section><section class="campus-note"><span class="campus-note-mark">✳</span><div><b>${esc(tr('about'))}</b><p>${esc(tr('aboutBody'))}</p></div></section></aside>
    </div><nav class="mobile-nav" aria-label="${esc(tr('home'))}"><button data-route="feed"${state.route === 'feed' ? ' aria-current="page"' : ''}><span>⌂</span>${esc(tr('home'))}</button><button data-route="discover"${state.route === 'discover' ? ' aria-current="page"' : ''}><span>⌕</span>${esc(tr('discover'))}</button><button data-route="saved"${state.route === 'saved' ? ' aria-current="page"' : ''}><span>▣</span>${esc(tr('savedNav'))}</button><button data-route="connections"${state.route === 'connections' ? ' aria-current="page"' : ''}><span>♡</span>${esc(tr('connections'))}</button><button data-route="profile" data-id="${profileId}"${state.route === 'profile' ? ' aria-current="page"' : ''}><span>◉</span>${esc(tr('profile'))}</button></nav></div>`;
}

function postCard(p){
  const fallback = { edit: 'Edit post', remove: 'Delete post', cancel: 'Cancel', saveChanges: 'Save changes', edited: 'edited', like: 'Like', liked: 'Liked', comment: 'Comment', save: 'Save', saved: 'Saved', likes: 'likes', comments: 'comments', commentPlaceholder: 'Write a kind comment…', send: 'Send' };
  const label = key => state.i18n?.[key] || fallback[key] || key;
  const owner = Number(p.user_id) === Number(state.user.user_id);
  const editing = owner && Number(state.editingPostId) === Number(p.post_id);
  const wasEdited = p.updated_at && p.updated_at !== p.created_at;
  const likeCount = Number(p.like_count) || 0;
  const commentCount = Number(p.comment_count) || 0;
  const likedLabel = p.liked_by_me ? label('liked') : label('like');
  const savedLabel = p.saved_by_me ? label('saved') : label('save');
  return `<article class="post-card" data-post="${p.post_id}"><div class="post-head">${avatar(p.full_name)}<div class="post-author-block"><div class="post-author"><a href="#profile/${p.user_id}" data-route="profile" data-id="${p.user_id}">${esc(p.full_name)}</a></div><div class="post-meta">${esc(p.major || state.i18n?.student || 'Student')} · ${date(p.created_at)}${wasEdited ? ` · ${label('edited')}` : ''}</div></div>${owner ? `<div class="post-owner-actions"><button class="icon-button" data-action="edit-post" data-id="${p.post_id}" title="${label('edit')}" aria-label="${label('edit')}">✎</button><button class="icon-button" data-action="delete-post" data-id="${p.post_id}" title="${label('remove')}" aria-label="${label('remove')}">×</button></div>` : ''}</div>${editing ? `<form class="edit-post-form" data-post="${p.post_id}"><textarea name="content" maxlength="2000" required aria-label="${label('edit')}">${esc(p.content)}</textarea><div class="edit-post-controls"><button class="button ghost small" type="button" data-action="cancel-edit-post">${label('cancel')}</button><button class="button small">${label('saveChanges')}</button></div></form>` : `<div class="post-content">${esc(p.content)}</div>`}<div class="post-stats"><span>♡ ${likeCount} ${label('likes')}</span><span>◌ ${commentCount} ${label('comments')}</span></div><div class="post-actions"><button class="action ${p.liked_by_me ? 'on' : ''}" data-action="like" data-id="${p.post_id}" aria-pressed="${Boolean(p.liked_by_me)}">${p.liked_by_me ? '♥' : '♡'} ${likedLabel}</button><button class="action" data-action="focus-comment" data-id="${p.post_id}">◌ ${label('comment')}</button><button class="action save-action ${p.saved_by_me ? 'on' : ''}" data-action="bookmark" data-id="${p.post_id}" aria-pressed="${Boolean(p.saved_by_me)}">${p.saved_by_me ? '▣' : '♧'} ${savedLabel}</button></div>${p.comments.length ? `<div class="comment-list">${p.comments.map(comment => `<div class="comment"><b>${esc(comment.full_name)}</b>${esc(comment.content)}</div>`).join('')}</div>` : ''}<form class="comment-form" data-post="${p.post_id}"><input name="content" maxlength="500" placeholder="${label('commentPlaceholder')}" aria-label="${label('commentPlaceholder')}"><button class="button secondary small">${label('send')}</button></form></article>`;
}
function empty(icon, title, message) {
  return `<div class="empty"><div class="empty-icon" aria-hidden="true">${icon}</div><b>${esc(title)}</b><p>${esc(message)}</p></div>`;
}
function heading(title, subtitle) {
  return `<div class="heading"><div><span class="eyebrow">${esc(tr('communityEyebrow'))}</span><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></div></div>`;
}
function feedPage() {
  return `${heading(tr('feedTitle'), tr('feedSubtitle'))}<form class="composer" id="post-form"><div class="compose-row">${avatar(state.user.full_name)}<textarea class="compose-input" name="content" maxlength="2000" placeholder="${esc(tr('composerPlaceholder'))}" aria-label="${esc(tr('composerPlaceholder'))}"></textarea></div><div class="compose-footer"><span class="hint">${esc(tr('composerHint'))}</span><button class="button small">${esc(tr('share'))}<span aria-hidden="true"> ↗</span></button></div></form><section class="feed">${state.posts.length ? state.posts.map(postCard).join('') : empty('✳', tr('emptyFeedTitle'), tr('emptyFeedBody'))}</section>`;
}
function studentCard(user) {
  const following = Boolean(user.followed_by_me);
  return `<div class="student-card">${avatar(user.full_name)}<div class="student-info"><b><a href="#profile/${user.user_id}" data-route="profile" data-id="${user.user_id}">${esc(user.full_name)}</a></b><small>${esc(user.major || user.faculty || tr('student'))} · ${Number(user.follower_count) || 0} ${esc(tr('followers').toLowerCase())}</small></div><button class="button ${following ? 'secondary small' : 'small'}" data-action="follow" data-id="${user.user_id}">${following ? esc(tr('following')) : esc(tr('follow'))}</button></div>`;
}
function discoverPage() {
  return `${heading(tr('discoverTitle'), tr('discoverSubtitle'))}<form id="search-form" class="search-row"><div class="search-input-wrap"><span aria-hidden="true">⌕</span><input class="searchbox" name="q" value="${esc(state.search)}" placeholder="${esc(tr('searchPlaceholder'))}" aria-label="${esc(tr('searchPlaceholder'))}"></div><button class="button">${esc(tr('search'))}</button></form><section class="directory">${state.students.length ? state.students.map(studentCard).join('') : empty('⌕', tr('noStudents'), tr('noStudentsBody'))}</section>`;
}
function profilePage() {
  const profile = state.profile;
  if (!profile) return `<div class="empty">${esc(tr('profileTitle'))}…</div>`;
  const user = profile.user;
  return `${heading(tr('profileTitle'), tr('profileSubtitle'))}<section class="profile-card">${avatar(user.full_name, true)}<div class="profile-copy"><h2>${esc(user.full_name)} ${profile.is_me ? `<span class="muted profile-you">(${esc(tr('you'))})</span>` : ''}</h2><p>${esc(user.major || tr('student'))}${user.faculty ? ` · ${esc(user.faculty)}` : ''}</p>${user.bio ? `<p class="profile-bio">${esc(user.bio)}</p>` : ''}</div><div class="profile-stats"><span><strong>${Number(profile.follower_count) || 0}</strong>${esc(tr('followers'))}</span><span><strong>${Number(profile.following_count) || 0}</strong>${esc(tr('following'))}</span></div>${!profile.is_me ? `<button class="button ${profile.followed_by_me ? 'secondary' : ''}" data-action="follow" data-id="${user.user_id}">${profile.followed_by_me ? esc(tr('following')) : esc(tr('follow'))}</button>` : ''}</section><div class="section-heading"><h2>${esc(tr('posts'))}</h2></div><section class="feed">${profile.posts.length ? profile.posts.map(postCard).join('') : empty('◌', tr('noPosts'), tr('noPostsBody'))}</section>`;
}
function connectionsPage() {
  const connections = state.connections;
  if (!connections) return `<div class="empty">${esc(tr('connectionsTitle'))}…</div>`;
  const current = state.connectionTab === 'followers' ? connections.followers : connections.following;
  return `${heading(tr('connectionsTitle'), tr('connectionsSubtitle'))}<div class="connections-tabs"><button class="button ${state.connectionTab === 'following' ? '' : 'secondary'} small" data-action="connection-tab" data-tab="following">${esc(tr('following'))} (${connections.following.length})</button><button class="button ${state.connectionTab === 'followers' ? '' : 'secondary'} small" data-action="connection-tab" data-tab="followers">${esc(tr('followers'))} (${connections.followers.length})</button></div><section class="directory">${current.length ? current.map(user => `<div class="student-card">${avatar(user.full_name)}<div class="student-info"><b><a href="#profile/${user.user_id}" data-route="profile" data-id="${user.user_id}">${esc(user.full_name)}</a></b><small>${esc(user.major || 'Student')}</small></div>${state.connectionTab === 'following' ? `<button class="button secondary small" data-action="unfollow" data-id="${user.user_id}">${esc(tr('following'))}</button>` : ''}</div>`).join('') : empty('♡', state.connectionTab === 'followers' ? tr('noFollowers') : tr('noFollowing'), state.connectionTab === 'followers' ? tr('noFollowersBody') : tr('noFollowingBody'))}</section>`;
}
function savedPage() {
  return `${heading(tr('savedTitle'), tr('savedSubtitle'))}<section class="feed">${state.posts.length ? state.posts.map(postCard).join('') : empty('▣', tr('noSaved'), tr('noSavedBody'))}</section>`;
}
function authPage() {
  const register = state.authMode === 'register';
  return `<div class="auth-screen"><section class="auth-aside"><div class="auth-top">${brand()}${languagePicker('auth-language')}</div><div class="auth-message"><span class="auth-orbit orbit-one"></span><span class="auth-orbit orbit-two"></span><span class="auth-kicker">✳ &nbsp; ${esc(tr('authKicker'))}</span><h1>${esc(tr('authHeadline')).replace('\n', '<br>')}</h1><p>${esc(tr('authBody'))}</p><div class="auth-bubbles"><span>✳</span><span>↗</span><span>♡</span></div></div><div class="aside-bottom">${esc(tr('authFoot'))}</div></section><section class="auth-main"><form class="auth-card" id="auth-form"><div class="auth-mark">${register ? '✳' : '↗'}</div><h2>${esc(tr(register ? 'joinTitle' : 'loginTitle'))}</h2><p>${esc(tr(register ? 'joinSubtitle' : 'loginSubtitle'))}</p>${register ? `<div class="field"><label for="full_name">${esc(tr('fullName'))}</label><input id="full_name" name="full_name" maxlength="100" required autocomplete="name" placeholder="${esc(tr('yourName'))}"></div><div class="field"><label for="major">${esc(tr('major'))}</label><input id="major" name="major" maxlength="100" required placeholder="${esc(tr('majorExample'))}"></div><div class="field"><label for="faculty">${esc(tr('faculty'))} <span class="muted">(${esc(tr('optional'))})</span></label><input id="faculty" name="faculty" maxlength="100" placeholder="${esc(tr('facultyExample'))}"></div>` : ''}<div class="field"><label for="email">${esc(tr('universityEmail'))}</label><input id="email" name="email" type="email" maxlength="150" required autocomplete="email" placeholder="${esc(tr('emailExample'))}"></div><div class="field"><label for="password">${esc(tr('password'))}</label><input id="password" name="password" type="password" minlength="8" maxlength="200" required autocomplete="${register ? 'new-password' : 'current-password'}" placeholder="${esc(tr('passwordHint'))}"></div><button class="button auth-submit">${esc(tr(register ? 'createAccount' : 'signIn'))}<span aria-hidden="true"> ↗</span></button><div class="account-policy"><span>◷ ${esc(tr('sessionPolicy', { days: state.meta.session_days }))}</span>${register ? `<span>◎ ${esc(tr('accountPolicy', { count: state.meta.max_users }))}</span>` : ''}</div><div class="auth-switch">${esc(tr(register ? 'alreadyAccount' : 'newHere'))} <button class="link-button" type="button" data-action="auth-toggle">${esc(tr(register ? 'loginLink' : 'joinLink'))}</button></div></form></section></div>`;
}
function render() {
  document.documentElement.lang = state.locale;
  state.i18n = messages[state.locale];
  if (!state.user) { app.innerHTML = authPage(); return; }
  const content = state.route === 'discover' ? discoverPage() : state.route === 'profile' ? profilePage() : state.route === 'connections' ? connectionsPage() : state.route === 'saved' ? savedPage() : feedPage();
  app.innerHTML = shell(content);
  loadSidebar();
}
async function loadSidebar() {
  try {
    const [connections, result] = await Promise.all([api('connections'), api('users')]);
    const stats = document.querySelector('#mini-stats');
    const suggestions = document.querySelector('#suggestions');
    if (stats) stats.innerHTML = `<div class="stat-row"><span>${esc(tr('following'))}</span><strong>${connections.following.length}</strong></div><div class="stat-row"><span>${esc(tr('followers'))}</span><strong>${connections.followers.length}</strong></div>`;
    if (suggestions) suggestions.innerHTML = result.users.slice(0, 3).map(user => `<div class="student-row">${avatar(user.full_name)}<div class="student-info"><b>${esc(user.full_name)}</b><small>${esc(user.major || 'Student')}</small></div><button class="icon-button" data-action="follow" data-id="${user.user_id}" title="${esc(tr('discover'))}" aria-label="${esc(tr('discover'))}">＋</button></div>`).join('') || `<span class="muted" style="font-size:12px">${esc(tr('peopleKnow'))} ✨</span>`;
  } catch {}
}
async function loadPage() {
  if (!state.user) { render(); return; }
  try {
    state.loading = true;
    if (state.route === 'feed') state.posts = (await api('feed')).posts;
    else if (state.route === 'discover') state.students = (await api('users?q=' + encodeURIComponent(state.search))).users;
    else if (state.route === 'profile') state.profile = await api('users/' + state.profileId);
    else if (state.route === 'connections') state.connections = await api('connections');
    else if (state.route === 'saved') state.posts = (await api('bookmarks')).posts;
    render();
  } catch (error) {
    toast(error.message, true);
    if (error.message === tr('errorLogin')) { state.user = null; render(); }
  } finally { state.loading = false; }
}
async function refresh() {
  if (state.route === 'profile') state.profile = await api('users/' + state.profileId);
  else if (state.route === 'discover') state.students = (await api('users?q=' + encodeURIComponent(state.search))).users;
  else if (state.route === 'connections') state.connections = await api('connections');
  else if (state.route === 'saved') state.posts = (await api('bookmarks')).posts;
  else state.posts = (await api('feed')).posts;
  render();
}

app.addEventListener('change', event => {
  if (!event.target.matches('[data-language]')) return;
  state.locale = messages[event.target.value] ? event.target.value : 'en';
  state.i18n = messages[state.locale];
  try { localStorage.setItem('campus-locale', state.locale); } catch {}
  render();
});
app.addEventListener('click', async event => {
  const routeElement = event.target.closest('[data-route]');
  if (routeElement) {
    event.preventDefault();
    const route = routeElement.dataset.route;
    const id = routeElement.dataset.id || (route === 'profile' ? state.user.user_id : null);
    if (route === 'profile' && id === null) { state.user = null; render(); return; }
    go(route, id);
    return;
  }
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  try {
    if (action === 'auth-toggle') { state.authMode = state.authMode === 'login' ? 'register' : 'login'; render(); }
    if (action === 'edit-post') { state.editingPostId = Number(button.dataset.id); render(); document.querySelector(`.edit-post-form[data-post="${button.dataset.id}"] textarea`)?.focus(); }
    if (action === 'cancel-edit-post') { state.editingPostId = null; render(); }
    if (action === 'logout') { await api('auth/logout', { method: 'POST' }); state.user = null; state.route = 'feed'; state.authMode = 'login'; render(); }
    if (action === 'like') { const id = button.dataset.id; await api(`posts/${id}/likes`, { method: button.classList.contains('on') ? 'DELETE' : 'POST' }); await refresh(); }
    if (action === 'bookmark') {
      const id = button.dataset.id;
      const saving = !button.classList.contains('on');
      await api(`posts/${id}/bookmark`, { method: saving ? 'POST' : 'DELETE' });
      await refresh();
      toast(saving ? tr('postSaved') : tr('postUnsaved'));
    }
    if (action === 'follow' || action === 'unfollow') {
      const id = button.dataset.id;
      const isFollowing = button.textContent.trim() === tr('following') && action === 'follow';
      await api(`users/${id}/follow`, { method: isFollowing || action === 'unfollow' ? 'DELETE' : 'POST' });
      await refresh();
    }
    if (action === 'delete-post' && confirm(tr('deleteConfirm'))) { await api('posts/' + button.dataset.id, { method: 'DELETE' }); await refresh(); toast(tr('postDeleted')); }
    if (action === 'focus-comment') document.querySelector(`.comment-form[data-post="${button.dataset.id}"] input`)?.focus();
    if (action === 'connection-tab') { state.connectionTab = button.dataset.tab; render(); }
  } catch (error) { toast(error.message, true); }
});
app.addEventListener('submit', async event => {
  const form = event.target;
  if (!['post-form', 'search-form', 'auth-form'].includes(form.id) && !form.matches('.comment-form, .edit-post-form')) return;
  event.preventDefault();
  const values = new FormData(form);
  try {
    if (form.id === 'auth-form') {
      const mode = state.authMode === 'login' ? 'login' : 'register';
      const result = await api('auth/' + mode, { method: 'POST', body: JSON.stringify(Object.fromEntries(values.entries())) });
      state.user = result.user; state.route = 'feed'; state.search = ''; state.authMode = 'login';
      await loadPage(); toast(tr(mode === 'login' ? 'welcomeBack' : 'welcomeCampus'));
    } else if (form.id === 'post-form') {
      await api('posts', { method: 'POST', body: JSON.stringify({ content: values.get('content') }) });
      form.reset(); await refresh(); toast(tr('postShared'));
    } else if (form.id === 'search-form') {
      state.search = String(values.get('q') || '').trim(); await refresh();
    } else if (form.matches('.edit-post-form')) {
      const id = form.dataset.post;
      await api(`posts/${id}`, { method: 'PUT', body: JSON.stringify({ content: values.get('content') }) });
      state.editingPostId = null; await refresh(); toast(tr('postUpdated'));
    } else {
      const id = form.dataset.post;
      await api(`posts/${id}/comments`, { method: 'POST', body: JSON.stringify({ content: values.get('content') }) });
      await refresh();
    }
  } catch (error) { toast(error.message, true); }
});

async function init() {
  const [route, id] = location.hash.slice(1).split('/');
  try {
    const [session, meta] = await Promise.all([api('auth/me'), api('meta')]);
    state.meta = meta;
    state.user = session.user;
    if (state.user) {
      if (route) state.route = route;
      state.profileId = id || state.user.user_id;
      if (state.route === 'discover') state.search = new URLSearchParams(location.search).get('q') || '';
      await loadPage();
    } else render();
  } catch { render(); }
}
init();
