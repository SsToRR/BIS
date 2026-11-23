const app = document.querySelector('#app');
const localeNames = { en: 'English', kk: 'Қазақша', ru: 'Русский' };
const supportedLanguages = ['en', 'kk', 'ru'];
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
    eventsNav: 'Events', eventsTitle: 'Campus events', eventsSubtitle: 'Find a campus activity and save your place.', studyNav: 'Study together', studyTitle: 'Study together', studySubtitle: 'Set up a quiet co-working session and invite classmates.', adminNav: 'Admin settings',
    createEvent: 'Create an event', createStudy: 'Create a study session', titleLabel: 'Title', descriptionLabel: 'Details', locationLabel: 'Place', dateTimeLabel: 'Date and time', capacityLabel: 'Seats', publishEvent: 'Publish event', publishStudy: 'Publish session',
    attendees: 'attending', waitingList: 'waiting', host: 'Hosted by', joinEvent: 'Join event', joinStudy: 'Join session', joinWaitlist: 'Join waitlist', leaveEvent: 'Cancel RSVP', onWaitlist: 'Waitlist position {position}', noEvents: 'No upcoming sessions', noEventsBody: 'Create the first one for your campus.', eventCreated: 'Your event is on the calendar.', studyCreated: 'Your study session is ready.',
    translate: 'Translate', translationTitle: 'Translate this post', translationInstructions: 'Choose the post language and the language you want to translate it into. The target starts with your app language.', translationLabel: 'Translation: {source} → {target}', translateFrom: 'Post language', translateTo: 'Translate into', translateSourcePlaceholder: 'Choose a language', translateDisclosure: 'When you translate, MyMemory receives the post text and selected languages. It is an external service, so avoid translating private or sensitive details.', translationQualityNote: 'Automatic translations may miss context. The service has a daily usage limit. Check important details.', translateAction: 'Translate → {language}', translateAgain: 'Try again', translating: 'Translating…', translationProgress: 'Translation is in progress. Longer posts may take a little while.', translationChooseSource: 'Choose the language of the post to continue.', translationFailed: 'Could not translate this post right now. Your original post is unchanged. Please try again.', translationLimit: 'The translation service has reached its usage limit. Please try again later.', translationSameLanguage: 'Source and target are both {language}. Choose a different target language.', translationSameLanguageError: 'Choose different source and target languages.', sourceEnglish: 'English', sourceKazakh: 'Kazakh', sourceRussian: 'Russian',
    accessibility: 'Accessibility', textSize: 'Larger text', highContrast: 'High contrast', reduceMotion: 'Reduce motion',
    focusTitle: 'Focus timer', focusSubtitle: 'A quiet sprint for your next study session.', focusSprint: '25 minute focus', shortBreak: '5 minute break', startTimer: 'Start', pauseTimer: 'Pause', resetTimer: 'Reset', focusFinished: 'Focus sprint complete. Take a short break.', breakFinished: 'Break finished. Ready for another focus sprint?',
    adminTitle: 'Campus capacity', adminSubtitle: 'Set the maximum number of student accounts allowed to register.', bootstrapTitle: 'Set up the first administrator', bootstrapDescription: 'Enter the one-time setup key from the project owner.', setupKey: 'Administrator setup key', claimAdmin: 'Enable administrator access', accountCapacity: 'Maximum student accounts', currentStudents: '{count} student accounts are registered.', saveCapacity: 'Save capacity', capacitySaved: 'Campus capacity updated.',
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
Object.assign(messages.kk, {
  eventsNav: 'Іс-шаралар', eventsTitle: 'Кампус іс-шаралары', eventsSubtitle: 'Іс-шара тауып, қатысу орныңызды сақтаңыз.', studyNav: 'Бірге оқу', studyTitle: 'Бірге оқу', studySubtitle: 'Тыныш оқу кездесуін ұйымдастырып, курстастарыңызды шақырыңыз.', adminNav: 'Әкімші параметрлері',
  createEvent: 'Іс-шара қосу', createStudy: 'Оқу кездесуін қосу', titleLabel: 'Атауы', descriptionLabel: 'Сипаттамасы', locationLabel: 'Өтетін орны', dateTimeLabel: 'Күні мен уақыты', capacityLabel: 'Орын саны', publishEvent: 'Жариялау', publishStudy: 'Кездесуді жариялау', attendees: 'қатысушы', waitingList: 'күту тізімі', host: 'Ұйымдастырушы', joinEvent: 'Қатысу', joinStudy: 'Кездесуге қосылу', joinWaitlist: 'Күту тізіміне қосылу', leaveEvent: 'Қатысудан бас тарту', onWaitlist: 'Күту тізіміндегі орны: {position}', noEvents: 'Алдағы кездесулер жоқ', noEventsBody: 'Кампусыңызда алғашқы кездесуді ұйымдастырыңыз.', eventCreated: 'Іс-шара күнтізбеге қосылды.', studyCreated: 'Оқу кездесуі жарияланды.',
  translate: 'Аудару', translationTitle: 'Жазбаны аудару', translationInstructions: 'Жазба тілін және қай тілге аудару керегін таңдаңыз. Бастапқыда аудару тілі қолданба тілімен бірдей болады.', translationLabel: 'Аударма: {source} → {target}', translateFrom: 'Жазба тілі', translateTo: 'Қай тілге аудару?', translateSourcePlaceholder: 'Тілді таңдаңыз', translateDisclosure: 'Аударуды таңдағанда, жазба мәтіні мен тілдер MyMemory қызметіне жіберіледі. Бұл — сыртқы қызмет. Жеке немесе құпия ақпаратты аудармаңыз.', translationQualityNote: 'Автоматты аудармада контекст жоғалуы мүмкін. Қызметтің күндік шегі бар. Маңызды ақпаратты тексеріңіз.', translateAction: 'Аудару → {language}', translateAgain: 'Қайталау', translating: 'Аударылуда…', translationProgress: 'Аударма жүріп жатыр. Ұзақ жазбаны аударуға біраз уақыт кетуі мүмкін.', translationChooseSource: 'Жалғастыру үшін жазба тілін таңдаңыз.', translationFailed: 'Қазір аудару мүмкін болмады. Бастапқы жазба өзгерген жоқ. Қайталап көріңіз.', translationLimit: 'Аударма қызметінің қолданыс шегіне жетті. Кейінірек қайталап көріңіз.', translationSameLanguage: 'Бастапқы және аудару тілдері бірдей: {language}. Басқа аудару тілін таңдаңыз.', translationSameLanguageError: 'Бастапқы және аудару тілдері әртүрлі болуы керек.', sourceEnglish: 'Ағылшын тілі', sourceKazakh: 'Қазақ тілі', sourceRussian: 'Орыс тілі',
  accessibility: 'Қолжетімділік', textSize: 'Үлкен қаріп', highContrast: 'Жоғары контраст', reduceMotion: 'Қозғалысты азайту', focusTitle: 'Зейін таймері', focusSubtitle: 'Келесі оқу сессиясына тыныш таймер.', focusSprint: '25 минут оқу', shortBreak: '5 минут үзіліс', startTimer: 'Бастау', pauseTimer: 'Үзіліс', resetTimer: 'Қайта бастау', focusFinished: 'Оқу уақыты аяқталды. Қысқа үзіліс жасаңыз.', breakFinished: 'Үзіліс аяқталды. Қайта оқуға дайынсыз ба?',
  adminTitle: 'Кампус сыйымдылығы', adminSubtitle: 'Тіркеле алатын студент аккаунттарының ең көп санын белгілеңіз.', bootstrapTitle: 'Алғашқы әкімшіні орнату', bootstrapDescription: 'Жоба иесінен алынған бір реттік кілтті енгізіңіз.', setupKey: 'Әкімші кілті', claimAdmin: 'Әкімші рөлін қосу', accountCapacity: 'Студент аккаунттарының шегі', currentStudents: 'Тіркелген студент аккаунттары: {count}.', saveCapacity: 'Шекті сақтау', capacitySaved: 'Кампус шегі жаңартылды.',
});
Object.assign(messages.ru, {
  eventsNav: 'События', eventsTitle: 'События кампуса', eventsSubtitle: 'Найдите событие и забронируйте место.', studyNav: 'Учиться вместе', studyTitle: 'Учиться вместе', studySubtitle: 'Создайте совместную учебную встречу и пригласите однокурсников.', adminNav: 'Настройки администратора',
  createEvent: 'Создать событие', createStudy: 'Создать учебную встречу', titleLabel: 'Название', descriptionLabel: 'Описание', locationLabel: 'Место', dateTimeLabel: 'Дата и время', capacityLabel: 'Места', publishEvent: 'Опубликовать событие', publishStudy: 'Опубликовать встречу', attendees: 'участников', waitingList: 'в листе ожидания', host: 'Организатор', joinEvent: 'Записаться', joinStudy: 'Присоединиться', joinWaitlist: 'Встать в лист ожидания', leaveEvent: 'Отменить запись', onWaitlist: 'Место в листе ожидания: {position}', noEvents: 'Предстоящих встреч пока нет', noEventsBody: 'Создайте первую встречу для кампуса.', eventCreated: 'Событие добавлено в календарь.', studyCreated: 'Учебная встреча опубликована.',
  translate: 'Перевести', translationTitle: 'Перевести этот пост', translationInstructions: 'Выберите язык поста и язык перевода. Изначально выбран язык приложения.', translationLabel: 'Перевод: {source} → {target}', translateFrom: 'Язык поста', translateTo: 'Перевести на', translateSourcePlaceholder: 'Выберите язык', translateDisclosure: 'При переводе текст поста и выбранные языки отправляются в MyMemory — внешний сервис. Не переводите личную или конфиденциальную информацию.', translationQualityNote: 'Автоматический перевод может упустить контекст. У сервиса есть дневной лимит. Проверьте важные детали.', translateAction: 'Перевести → {language}', translateAgain: 'Попробовать ещё раз', translating: 'Переводим…', translationProgress: 'Идёт перевод. Длинный пост может переводиться чуть дольше.', translationChooseSource: 'Чтобы продолжить, выберите язык поста.', translationFailed: 'Сейчас не удалось перевести пост. Оригинал не изменился. Попробуйте ещё раз.', translationLimit: 'Сервис перевода достиг лимита использования. Попробуйте позже.', translationSameLanguage: 'Языки источника и перевода совпадают: {language}. Выберите другой язык перевода.', translationSameLanguageError: 'Выберите разные языки источника и перевода.', sourceEnglish: 'Английский', sourceKazakh: 'Казахский', sourceRussian: 'Русский',
  accessibility: 'Доступность', textSize: 'Крупный текст', highContrast: 'Высокая контрастность', reduceMotion: 'Меньше анимации', focusTitle: 'Таймер фокуса', focusSubtitle: 'Тихий таймер для следующей учебной сессии.', focusSprint: '25 минут учёбы', shortBreak: 'Перерыв 5 минут', startTimer: 'Начать', pauseTimer: 'Пауза', resetTimer: 'Сбросить', focusFinished: 'Учебный спринт завершён. Сделайте короткий перерыв.', breakFinished: 'Перерыв окончен. Готовы продолжить?',
  adminTitle: 'Вместимость кампуса', adminSubtitle: 'Установите максимальное число аккаунтов студентов.', bootstrapTitle: 'Настройка первого администратора', bootstrapDescription: 'Введите одноразовый ключ от владельца проекта.', setupKey: 'Ключ администратора', claimAdmin: 'Включить роль администратора', accountCapacity: 'Максимум аккаунтов студентов', currentStudents: 'Зарегистрировано аккаунтов: {count}.', saveCapacity: 'Сохранить лимит', capacitySaved: 'Лимит кампуса обновлён.',
});

const storedLocale = (() => { try { return localStorage.getItem('campus-locale'); } catch { return null; } })();
function readLocalJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}
function readTranslationCache(userId) {
  try {
    const cache = JSON.parse(sessionStorage.getItem(`campus-translations-v1-${userId}`) || '{}');
    return Object.fromEntries(Object.entries(cache).filter(([, value]) =>
      value && supportedLanguages.includes(value.source) && supportedLanguages.includes(value.target)
      && typeof value.text === 'string' && typeof value.updatedAt === 'string'
    ));
  } catch { return {}; }
}
function saveTranslationCache() {
  const recent = Object.entries(state.translations)
    .sort(([, a], [, b]) => Number(a.translatedAt || 0) - Number(b.translatedAt || 0))
    .slice(-100);
  state.translations = Object.fromEntries(recent);
  try { sessionStorage.setItem(`campus-translations-v1-${state.user.user_id}`, JSON.stringify(state.translations)); } catch {}
}
const storedAccessibility = readLocalJson('campus-accessibility', {});
const storedFocus = readLocalJson('campus-focus-timer', {});
const state = {
  user: null, route: 'feed', profileId: null, search: '', students: [], posts: [], profile: null,
  connections: null, authMode: 'login', loading: false, editingPostId: null, locale: messages[storedLocale] ? storedLocale : 'en',
  connectionTab: 'following', meta: { session_days: 30, max_users: 500 }, events: [], adminSettings: null,
  adminSetupAvailable: false, translations: {}, accessibility: { largeText: Boolean(storedAccessibility.largeText), highContrast: Boolean(storedAccessibility.highContrast), reduceMotion: Boolean(storedAccessibility.reduceMotion) },
  focus: { mode: storedFocus.mode === 'break' ? 'break' : 'focus', secondsLeft: Number.isInteger(storedFocus.secondsLeft) ? storedFocus.secondsLeft : 1500, activeUntil: Number.isFinite(storedFocus.activeUntil) ? storedFocus.activeUntil : null },
};
if (state.focus.activeUntil) state.focus.secondsLeft = Math.max(0, Math.ceil((state.focus.activeUntil - Date.now()) / 1000));
state.i18n = messages[state.locale];
const tr = (key, variables = {}) => String(state.i18n[key] ?? messages.en[key] ?? key).replace(/\{(\w+)\}/g, (_, name) => String(variables[name] ?? ''));
function translationLanguageName(code) {
  const key = { en: 'sourceEnglish', kk: 'sourceKazakh', ru: 'sourceRussian' }[code];
  return key ? tr(key) : String(code || '');
}
function saveAccessibility() {
  try { localStorage.setItem('campus-accessibility', JSON.stringify(state.accessibility)); } catch {}
}
function applyAccessibility() {
  document.documentElement.classList.toggle('a11y-large-text', state.accessibility.largeText);
  document.documentElement.classList.toggle('a11y-high-contrast', state.accessibility.highContrast);
  document.documentElement.classList.toggle('a11y-reduced-motion', state.accessibility.reduceMotion);
}
function saveFocus() {
  try { localStorage.setItem('campus-focus-timer', JSON.stringify(state.focus)); } catch {}
}
function setFocusMode(mode) {
  clearInterval(focusInterval);
  focusInterval = null;
  state.focus.mode = mode;
  state.focus.secondsLeft = mode === 'break' ? 5 * 60 : 25 * 60;
  state.focus.activeUntil = null;
  saveFocus();
  render();
}
function updateFocusClock() {
  if (!state.focus.activeUntil) return;
  state.focus.secondsLeft = Math.max(0, Math.ceil((state.focus.activeUntil - Date.now()) / 1000));
  if (state.focus.secondsLeft <= 0) {
    state.focus.activeUntil = null;
    saveFocus();
    clearInterval(focusInterval);
    focusInterval = null;
    toast(state.focus.mode === 'focus' ? tr('focusFinished') : tr('breakFinished'));
  } else {
    saveFocus();
  }
  const clock = document.querySelector('[data-focus-clock]');
  if (clock) clock.textContent = `${String(Math.floor(state.focus.secondsLeft / 60)).padStart(2, '0')}:${String(state.focus.secondsLeft % 60).padStart(2, '0')}`;
  const toggle = document.querySelector('[data-action="focus-toggle"]');
  if (toggle) toggle.textContent = state.focus.activeUntil ? tr('pauseTimer') : tr('startTimer');
}
let focusInterval = null;
async function translatePost(button) {
  const id = Number(button.dataset.id);
  const post = button.closest('.post-card');
  const source = post?.querySelector('[data-translate-source]')?.value || '';
  const target = post?.querySelector('[data-translate-target]')?.value || state.locale;
  const feedback = post?.querySelector('[data-translation-feedback]');
  const showFeedback = (message, isError = false) => {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.classList.toggle('error', isError);
    feedback.setAttribute('role', isError ? 'alert' : 'status');
    feedback.setAttribute('aria-live', isError ? 'assertive' : 'polite');
  };
  if (!source) {
    showFeedback(tr('translationChooseSource'), true);
    return;
  }
  if (source === target) {
    showFeedback(tr('translationSameLanguage', { language: translationLanguageName(source) }), true);
    return;
  }
  button.disabled = true;
  button.textContent = tr('translating');
  button.setAttribute('aria-busy', 'true');
  showFeedback(tr('translationProgress'));
  try {
    const result = await api('translate', { method: 'POST', body: JSON.stringify({ post_id: id, source, target }) });
    state.translations[id] = {
      source, target, text: result.translation,
      updatedAt: post.dataset.updatedAt || '', translatedAt: Date.now(),
    };
    saveTranslationCache();
    render();
  } catch (error) {
    const localized = localizeServerError(error.message);
    const message = localized === error.message ? tr('translationFailed') : localized;
    if (feedback?.isConnected) {
      showFeedback(message, true);
      button.disabled = false;
      button.textContent = tr('translateAgain');
      button.removeAttribute('aria-busy');
    } else {
      toast(message, true);
    }
  }
}
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
    'The translation service is unavailable. Please try again later.': 'translationFailed',
    'The translation service has reached its usage limit. Please try again later.': 'translationLimit',
    'Choose a post language different from your interface language.': 'translationSameLanguageError',
    'You can only edit your own posts.': 'errorOwnerEdit', 'You can only delete your own posts.': 'errorOwnerDelete',
    'Something went wrong. Please try again.': 'errorGeneric',
  };
  if (exact[message]) {
    const key = exact[message];
    return tr(key);
  }
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
function accessibilityMenu() {
  return `<details class="accessibility-tools"><summary aria-label="${esc(tr('accessibility'))}" title="${esc(tr('accessibility'))}">Aa</summary><div class="accessibility-panel"><b>${esc(tr('accessibility'))}</b><label><input type="checkbox" data-a11y-pref="largeText"${state.accessibility.largeText ? ' checked' : ''}>${esc(tr('textSize'))}</label><label><input type="checkbox" data-a11y-pref="highContrast"${state.accessibility.highContrast ? ' checked' : ''}>${esc(tr('highContrast'))}</label><label><input type="checkbox" data-a11y-pref="reduceMotion"${state.accessibility.reduceMotion ? ' checked' : ''}>${esc(tr('reduceMotion'))}</label></div></details>`;
}
function navLink(route, icon, label) {
  return `<button class="side-link${state.route === route ? ' active' : ''}" data-route="${route}"${state.route === route ? ' aria-current="page"' : ''}><span class="ico" aria-hidden="true">${icon}</span>${esc(label)}</button>`;
}
function shell(content) {
  const label = state.user.full_name.split(' ')[0];
  const profileId = state.user.user_id;
  return `<div class="shell">
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <header class="topbar"><div class="topbar-inner">${brand()}<div class="top-actions">${languagePicker()}${accessibilityMenu()}<button class="button ghost small top-profile" data-route="profile" data-id="${profileId}">${esc(tr('profile'))}</button><div class="user-mini">${avatar(state.user.full_name)}<span class="name">${esc(state.user.full_name)}</span></div><button class="icon-button" data-action="logout" title="${esc(tr('logout'))}" aria-label="${esc(tr('logout'))}">↪</button></div></div></header>
    <div class="layout"><aside class="side-card"><div class="side-group">${navLink('feed', '⌂', tr('home'))}${navLink('discover', '⌕', tr('discover'))}${navLink('events', '◷', tr('eventsNav'))}${navLink('study', '▦', tr('studyNav'))}${navLink('saved', '▣', tr('savedNav'))}${navLink('connections', '♡', tr('connections'))}</div><div class="sidebar-label">${esc(tr('campus'))}</div><button class="side-link${state.route === 'profile' && Number(state.profileId) === Number(profileId) ? ' active' : ''}" data-route="profile" data-id="${profileId}"><span class="ico" aria-hidden="true">◉</span>${esc(tr('profile'))}</button>${state.user.role === 'admin' || state.adminSetupAvailable ? navLink('admin', '⚙', tr('adminNav')) : ''}<div class="sidebar-label">${esc(tr('account'))}</div><button class="side-link" data-action="logout"><span class="ico" aria-hidden="true">↪</span>${esc(tr('logout'))}</button><div class="sidebar-note"><span class="online-dot"></span>${esc(tr('communityEyebrow'))}</div></aside>
      <main class="main" id="main-content">${content}</main>
      <aside class="right-column"><section class="welcome"><small>${esc(tr('communityEyebrow'))}</small><h2>${esc(tr('welcome', { name: label }))}</h2><p>${esc(tr('welcomeBody'))}</p></section><section class="panel"><h3>${esc(tr('network'))}</h3><div id="mini-stats"><div class="stat-row"><span>${esc(tr('following'))}</span><strong>—</strong></div><div class="stat-row"><span>${esc(tr('followers'))}</span><strong>—</strong></div></div></section><section class="panel"><h3>${esc(tr('peopleKnow'))}</h3><div id="suggestions"><span class="muted" style="font-size:12px">…</span></div></section><section class="campus-note"><span class="campus-note-mark">✳</span><div><b>${esc(tr('about'))}</b><p>${esc(tr('aboutBody'))}</p></div></section></aside>
    </div><nav class="mobile-nav" aria-label="Campus navigation"><button data-route="feed"${state.route === 'feed' ? ' aria-current="page"' : ''}><span>⌂</span>${esc(tr('home'))}</button><button data-route="discover"${state.route === 'discover' ? ' aria-current="page"' : ''}><span>⌕</span>${esc(tr('discover'))}</button><button data-route="events"${state.route === 'events' ? ' aria-current="page"' : ''}><span>◷</span>${esc(tr('eventsNav'))}</button><button data-route="study"${state.route === 'study' ? ' aria-current="page"' : ''}><span>▦</span>${esc(tr('studyNav'))}</button><button data-route="saved"${state.route === 'saved' ? ' aria-current="page"' : ''}><span>▣</span>${esc(tr('savedNav'))}</button><button data-route="connections"${state.route === 'connections' ? ' aria-current="page"' : ''}><span>♡</span>${esc(tr('connections'))}</button><button data-route="profile" data-id="${profileId}"${state.route === 'profile' ? ' aria-current="page"' : ''}><span>◉</span>${esc(tr('profile'))}</button>${state.user.role === 'admin' || state.adminSetupAvailable ? `<button data-route="admin"${state.route === 'admin' ? ' aria-current="page"' : ''}><span>⚙</span>${esc(tr('adminNav'))}</button>` : ''}</nav></div>`;
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
  const cachedTranslation = state.translations?.[p.post_id];
  const translated = cachedTranslation && cachedTranslation.updatedAt === String(p.updated_at || '') ? cachedTranslation : null;
  const sourceLanguages = [['en', label('sourceEnglish')], ['kk', label('sourceKazakh')], ['ru', label('sourceRussian')]];
  return `<article class="post-card" data-post="${p.post_id}" data-updated-at="${esc(p.updated_at || '')}">
    <div class="post-head">${avatar(p.full_name)}<div class="post-author-block"><div class="post-author"><a href="#profile/${p.user_id}" data-route="profile" data-id="${p.user_id}">${esc(p.full_name)}</a></div><div class="post-meta">${esc(p.major || state.i18n?.student || 'Student')} · ${date(p.created_at)}${wasEdited ? ` · ${label('edited')}` : ''}</div></div>${owner ? `<div class="post-owner-actions"><button class="icon-button" data-action="edit-post" data-id="${p.post_id}" title="${label('edit')}" aria-label="${label('edit')}">✎</button><button class="icon-button" data-action="delete-post" data-id="${p.post_id}" title="${label('remove')}" aria-label="${label('remove')}">×</button></div>` : ''}</div>
    ${editing ? `<form class="edit-post-form" data-post="${p.post_id}"><textarea name="content" maxlength="2000" required aria-label="${label('edit')}">${esc(p.content)}</textarea><div class="edit-post-controls"><button class="button ghost small" type="button" data-action="cancel-edit-post">${label('cancel')}</button><button class="button small">${label('saveChanges')}</button></div></form>` : `<div class="post-content">${esc(p.content)}</div>`}
    ${translated ? `<section class="translated-post" lang="${esc(translated.target)}"><b>${esc(label('translationLabel').replace('{source}', translationLanguageName(translated.source)).replace('{target}', translationLanguageName(translated.target)))}</b><p>${esc(translated.text)}</p></section>` : ''}
    <div class="post-stats"><span>♡ ${likeCount} ${label('likes')}</span><span>◌ ${commentCount} ${label('comments')}</span></div>
    <div class="post-actions"><button class="action ${p.liked_by_me ? 'on' : ''}" data-action="like" data-id="${p.post_id}" aria-pressed="${Boolean(p.liked_by_me)}">${p.liked_by_me ? '♥' : '♡'} ${likedLabel}</button><button class="action" data-action="focus-comment" data-id="${p.post_id}">◌ ${label('comment')}</button><button class="action save-action ${p.saved_by_me ? 'on' : ''}" data-action="bookmark" data-id="${p.post_id}" aria-pressed="${Boolean(p.saved_by_me)}">${p.saved_by_me ? '▣' : '♧'} ${savedLabel}</button>
      <details class="translate-tools"><summary class="action">↗ ${esc(label('translate'))}</summary><div class="translation-panel">
        <h3>${esc(label('translationTitle'))}</h3>
        <p id="translation-instructions-${p.post_id}" class="translation-instructions">${esc(label('translationInstructions'))}</p>
        <label for="translation-source-${p.post_id}">${esc(label('translateFrom'))}<select id="translation-source-${p.post_id}" data-translate-source aria-label="${esc(label('translateFrom'))}"><option value="" selected disabled>${esc(label('translateSourcePlaceholder'))}</option>${sourceLanguages.map(([code, name]) => `<option value="${code}">${esc(name)}</option>`).join('')}</select></label>
        <label for="translation-target-${p.post_id}">${esc(label('translateTo'))}<select id="translation-target-${p.post_id}" data-translate-target aria-label="${esc(label('translateTo'))}">${sourceLanguages.map(([code, name]) => `<option value="${code}"${code === state.locale ? ' selected' : ''}>${esc(name)}</option>`).join('')}</select></label>
        <p class="translation-disclosure">${esc(label('translateDisclosure'))}</p>
        <p class="translation-quality-note">${esc(label('translationQualityNote'))}</p>
        <button class="button small" type="button" data-action="translate-post" data-id="${p.post_id}" aria-describedby="translation-instructions-${p.post_id} translation-note-${p.post_id}" disabled>${esc(label('translateAction').replace('{language}', translationLanguageName(state.locale)))}</button>
        <p id="translation-note-${p.post_id}" class="translation-feedback" data-translation-feedback aria-live="polite"></p>
      </div></details>
    </div>
    ${p.comments.length ? `<div class="comment-list">${p.comments.map(comment => `<div class="comment"><b>${esc(comment.full_name)}</b>${esc(comment.content)}</div>`).join('')}</div>` : ''}
    <form class="comment-form" data-post="${p.post_id}"><input name="content" maxlength="500" placeholder="${label('commentPlaceholder')}" aria-label="${label('commentPlaceholder')}"><button class="button secondary small">${label('send')}</button></form>
  </article>`;
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
function localDateTime(value = new Date()) {
  return new Date(value.getTime() - value.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
function eventForm(kind) {
  const study = kind === 'study';
  return `<form class="panel event-form" id="event-form"><h2>${esc(tr(study ? 'createStudy' : 'createEvent'))}</h2><input type="hidden" name="kind" value="${kind}"><div class="event-form-grid"><label>${esc(tr('titleLabel'))}<input name="title" maxlength="100" required></label><label>${esc(tr('locationLabel'))}<input name="location" maxlength="160" required placeholder="Library, room, or online"></label><label>${esc(tr('dateTimeLabel'))}<input type="datetime-local" name="starts_at" min="${localDateTime(new Date(Date.now() + 60000))}" value="${localDateTime(new Date(Date.now() + 3600000))}" required></label><label>${esc(tr('capacityLabel'))}<input type="number" name="capacity" min="1" max="500" value="${study ? 6 : 30}" required></label></div><label>${esc(tr('descriptionLabel'))}<textarea name="description" maxlength="500" rows="3" placeholder="${study ? 'What will you work on?' : 'What should students know?'}"></textarea></label><button class="button">${esc(tr(study ? 'publishStudy' : 'publishEvent'))}</button></form>`;
}
function eventCard(item) {
  const dateLocale = state.locale === 'kk' ? 'kk-KZ' : state.locale === 'ru' ? 'ru-RU' : 'en';
  const start = new Intl.DateTimeFormat(dateLocale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.starts_at));
  const joined = item.my_status;
  const buttonLabel = joined ? tr('leaveEvent') : Number(item.attendee_count) >= Number(item.capacity) ? tr('joinWaitlist') : tr(item.kind === 'study' ? 'joinStudy' : 'joinEvent');
  const participantNames = (item.attendees || []).map(user => esc(user.full_name)).join(', ');
  return `<article class="event-card panel"><div class="event-card-top"><span class="event-kind">${esc(tr(item.kind === 'study' ? 'studyNav' : 'eventsNav'))}</span><span class="event-capacity">${Number(item.attendee_count)}/${Number(item.capacity)} ${esc(tr('attendees'))}</span></div><h2>${esc(item.title)}</h2><p class="event-description">${esc(item.description || '')}</p><div class="event-details"><span>◷ ${esc(start)}</span><span>⌖ ${esc(item.location)}</span><span>${esc(tr('host'))}: ${esc(item.host_name)}</span>${Number(item.waitlist_count) ? `<span>◌ ${Number(item.waitlist_count)} ${esc(tr('waitingList'))}</span>` : ''}</div>${participantNames ? `<p class="event-participants"><b>${esc(tr('attendees'))}:</b> ${participantNames}${Number(item.attendee_count) > item.attendees.length ? ` +${Number(item.attendee_count) - item.attendees.length}` : ''}</p>` : ''}<div class="event-card-actions">${joined === 'waitlisted' ? `<span class="waitlist-position">${esc(tr('onWaitlist', { position: item.my_waitlist_position }))}</span>` : ''}<button class="button ${joined ? 'secondary' : ''} small" data-action="event-rsvp" data-id="${item.event_id}" data-joined="${joined || ''}">${esc(buttonLabel)}</button>${Number(item.user_id) === Number(state.user.user_id) ? `<button class="button ghost small" data-action="delete-event" data-id="${item.event_id}">Cancel event</button>` : ''}</div></article>`;
}
function eventList() {
  return state.events.length ? `<section class="event-list">${state.events.map(eventCard).join('')}</section>` : empty('◷', tr('noEvents'), tr('noEventsBody'));
}
function eventsPage() {
  return `${heading(tr('eventsTitle'), tr('eventsSubtitle'))}${eventForm('event')}${eventList()}`;
}
function focusTimer() {
  const seconds = Math.max(0, Number(state.focus.secondsLeft) || 0);
  const title = state.focus.mode === 'break' ? tr('shortBreak') : tr('focusSprint');
  return `<section class="focus-timer panel"><div class="focus-timer-heading"><div><span class="eyebrow">${esc(tr('focusTitle'))}</span><h2>${esc(title)}</h2></div><span class="focus-mark" aria-hidden="true">◷</span></div><div class="focus-clock" data-focus-clock aria-label="${Math.floor(seconds / 60)} minutes ${seconds % 60} seconds remaining">${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}</div><div class="focus-mode-controls"><button class="button ${state.focus.mode === 'focus' ? '' : 'secondary'} small" data-action="focus-mode" data-mode="focus">${esc(tr('focusSprint'))}</button><button class="button ${state.focus.mode === 'break' ? '' : 'secondary'} small" data-action="focus-mode" data-mode="break">${esc(tr('shortBreak'))}</button></div><div class="focus-actions"><button class="button" data-action="focus-toggle">${esc(state.focus.activeUntil ? tr('pauseTimer') : tr('startTimer'))}</button><button class="button ghost" data-action="focus-reset">${esc(tr('resetTimer'))}</button></div></section>`;
}
function studyPage() {
  return `${heading(tr('studyTitle'), tr('studySubtitle'))}${focusTimer()}${eventForm('study')}${eventList()}`;
}
function adminPage() {
  if (state.user.role !== 'admin') {
    if (!state.adminSetupAvailable) return `${heading(tr('adminTitle'), tr('adminSubtitle'))}${empty('⚙', 'Administrator setup is unavailable', 'Ask the project owner to enable the one-time administrator setup key.')}`;
    return `${heading(tr('adminTitle'), tr('adminSubtitle'))}<form class="panel admin-form" id="admin-bootstrap-form"><h2>${esc(tr('bootstrapTitle'))}</h2><p>${esc(tr('bootstrapDescription'))}</p><label>${esc(tr('setupKey'))}<input name="token" type="password" autocomplete="off" required minlength="32"></label><button class="button">${esc(tr('claimAdmin'))}</button></form>`;
  }
  if (!state.adminSettings) return `${heading(tr('adminTitle'), tr('adminSubtitle'))}<section class="panel">Loading…</section>`;
  return `${heading(tr('adminTitle'), tr('adminSubtitle'))}<form class="panel admin-form" id="admin-settings-form"><h2>${esc(tr('accountCapacity'))}</h2><p>${esc(tr('currentStudents', { count: state.adminSettings.registered_users }))}</p><label>${esc(tr('accountCapacity'))}<input type="number" name="max_users" min="${Math.max(1, state.adminSettings.registered_users)}" max="1000000" value="${state.adminSettings.max_users}" required></label><button class="button">${esc(tr('saveCapacity'))}</button></form>`;
}
function authPage() {
  const register = state.authMode === 'register';
  return `<div class="auth-screen"><section class="auth-aside"><div class="auth-top">${brand()}<div class="auth-tools">${languagePicker('auth-language')}${accessibilityMenu()}</div></div><div class="auth-message"><span class="auth-orbit orbit-one"></span><span class="auth-orbit orbit-two"></span><span class="auth-kicker">✳ &nbsp; ${esc(tr('authKicker'))}</span><h1>${esc(tr('authHeadline')).replace('\n', '<br>')}</h1><p>${esc(tr('authBody'))}</p><div class="auth-bubbles"><span>✳</span><span>↗</span><span>♡</span></div></div><div class="aside-bottom">${esc(tr('authFoot'))}</div></section><section class="auth-main"><form class="auth-card" id="auth-form"><div class="auth-mark">${register ? '✳' : '↗'}</div><h2>${esc(tr(register ? 'joinTitle' : 'loginTitle'))}</h2><p>${esc(tr(register ? 'joinSubtitle' : 'loginSubtitle'))}</p>${register ? `<div class="field"><label for="full_name">${esc(tr('fullName'))}</label><input id="full_name" name="full_name" maxlength="100" required autocomplete="name" placeholder="${esc(tr('yourName'))}"></div><div class="field"><label for="major">${esc(tr('major'))}</label><input id="major" name="major" maxlength="100" required placeholder="${esc(tr('majorExample'))}"></div><div class="field"><label for="faculty">${esc(tr('faculty'))} <span class="muted">(${esc(tr('optional'))})</span></label><input id="faculty" name="faculty" maxlength="100" placeholder="${esc(tr('facultyExample'))}"></div>` : ''}<div class="field"><label for="email">${esc(tr('universityEmail'))}</label><input id="email" name="email" type="email" maxlength="150" required autocomplete="email" placeholder="${esc(tr('emailExample'))}"></div><div class="field"><label for="password">${esc(tr('password'))}</label><input id="password" name="password" type="password" minlength="8" maxlength="200" required autocomplete="${register ? 'new-password' : 'current-password'}" placeholder="${esc(tr('passwordHint'))}"></div><button class="button auth-submit">${esc(tr(register ? 'createAccount' : 'signIn'))}<span aria-hidden="true"> ↗</span></button><div class="account-policy"><span>◷ ${esc(tr('sessionPolicy', { days: state.meta.session_days }))}</span>${register ? `<span>◎ ${esc(tr('accountPolicy', { count: state.meta.max_users }))}</span>` : ''}</div><div class="auth-switch">${esc(tr(register ? 'alreadyAccount' : 'newHere'))} <button class="link-button" type="button" data-action="auth-toggle">${esc(tr(register ? 'loginLink' : 'joinLink'))}</button></div></form></section></div>`;
}
function render() {
  document.documentElement.lang = state.locale;
  state.i18n = messages[state.locale];
  applyAccessibility();
  if (!state.user) { app.innerHTML = authPage(); return; }
  const content = state.route === 'discover' ? discoverPage() : state.route === 'profile' ? profilePage() : state.route === 'connections' ? connectionsPage() : state.route === 'saved' ? savedPage() : state.route === 'events' ? eventsPage() : state.route === 'study' ? studyPage() : state.route === 'admin' ? adminPage() : feedPage();
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
    else if (state.route === 'events') state.events = (await api('events?kind=event')).events;
    else if (state.route === 'study') state.events = (await api('events?kind=study')).events;
    else if (state.route === 'admin' && state.user.role === 'admin') state.adminSettings = await api('admin/settings');
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
  else if (state.route === 'events') state.events = (await api('events?kind=event')).events;
  else if (state.route === 'study') state.events = (await api('events?kind=study')).events;
  else if (state.route === 'admin' && state.user.role === 'admin') state.adminSettings = await api('admin/settings');
  else state.posts = (await api('feed')).posts;
  render();
}

function updateTranslationSelection(select) {
  const panel = select.closest('.translation-panel');
  const button = panel?.querySelector('[data-action="translate-post"]');
  const feedback = panel?.querySelector('[data-translation-feedback]');
  if (!button || !feedback) return;
  const source = panel.querySelector('[data-translate-source]')?.value || '';
  const target = panel.querySelector('[data-translate-target]')?.value || '';
  const sameLanguage = Boolean(source && target && source === target);
  button.disabled = !source || !target || sameLanguage;
  button.textContent = tr('translateAction', { language: translationLanguageName(target || state.locale) });
  feedback.textContent = sameLanguage
    ? tr('translationSameLanguage', { language: translationLanguageName(source) })
    : '';
  feedback.classList.toggle('error', sameLanguage);
  feedback.setAttribute('role', sameLanguage ? 'alert' : 'status');
  feedback.setAttribute('aria-live', sameLanguage ? 'assertive' : 'polite');
}

app.addEventListener('change', event => {
  if (event.target.matches('[data-a11y-pref]')) {
    state.accessibility[event.target.dataset.a11yPref] = event.target.checked;
    saveAccessibility();
    applyAccessibility();
    return;
  }
  if (event.target.matches('[data-translate-source], [data-translate-target]')) {
    updateTranslationSelection(event.target);
    return;
  }
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
    if (action === 'translate-post') await translatePost(button);
    if (action === 'event-rsvp') {
      const id = button.dataset.id;
      if (button.dataset.joined) await api(`events/${id}/rsvp`, { method: 'DELETE' });
      else await api(`events/${id}/rsvp`, { method: 'POST' });
      await refresh();
    }
    if (action === 'delete-event') {
      if (confirm('Cancel this event and remove all RSVPs?')) {
        await api(`events/${button.dataset.id}`, { method: 'DELETE' });
        await refresh();
      }
    }
    if (action === 'focus-mode') setFocusMode(button.dataset.mode);
    if (action === 'focus-toggle') {
      if (state.focus.activeUntil) {
        state.focus.secondsLeft = Math.max(0, Math.ceil((state.focus.activeUntil - Date.now()) / 1000));
        state.focus.activeUntil = null;
        clearInterval(focusInterval); focusInterval = null;
      } else {
        if (state.focus.secondsLeft <= 0) state.focus.secondsLeft = state.focus.mode === 'break' ? 300 : 1500;
        state.focus.activeUntil = Date.now() + state.focus.secondsLeft * 1000;
        clearInterval(focusInterval); focusInterval = setInterval(updateFocusClock, 1000);
      }
      saveFocus(); render();
    }
    if (action === 'focus-reset') {
      clearInterval(focusInterval); focusInterval = null;
      state.focus.secondsLeft = state.focus.mode === 'break' ? 300 : 1500;
      state.focus.activeUntil = null; saveFocus(); render();
    }
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
  if (!['post-form', 'search-form', 'auth-form', 'event-form', 'admin-bootstrap-form', 'admin-settings-form'].includes(form.id) && !form.matches('.comment-form, .edit-post-form')) return;
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
    } else if (form.id === 'event-form') {
      const startsAt = new Date(values.get('starts_at'));
      await api('events', { method: 'POST', body: JSON.stringify({
        kind: values.get('kind'), title: values.get('title'), description: values.get('description'),
        location: values.get('location'), starts_at: startsAt.toISOString(), capacity: Number(values.get('capacity')),
      }) });
      await refresh(); toast(tr(values.get('kind') === 'study' ? 'studyCreated' : 'eventCreated'));
    } else if (form.id === 'admin-bootstrap-form') {
      const result = await api('admin/bootstrap', { method: 'POST', body: JSON.stringify({ token: values.get('token') }) });
      state.user = result.user; state.adminSetupAvailable = false; state.adminSettings = null;
      await refresh();
    } else if (form.id === 'admin-settings-form') {
      state.adminSettings = await api('admin/settings', { method: 'PUT', body: JSON.stringify({ max_users: Number(values.get('max_users')) }) });
      state.meta = await api('meta');
      render(); toast(tr('capacitySaved'));
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
    const [session, meta, adminSetup] = await Promise.all([api('auth/me'), api('meta'), api('admin/setup')]);
    state.meta = meta;
    state.adminSetupAvailable = adminSetup.enabled;
    state.user = session.user;
    if (state.user) {
      state.translations = readTranslationCache(state.user.user_id);
      if (route) state.route = route;
      state.profileId = id || state.user.user_id;
      if (state.route === 'discover') state.search = new URLSearchParams(location.search).get('q') || '';
      await loadPage();
    } else render();
    if (state.focus.activeUntil) {
      if (state.focus.secondsLeft > 0) focusInterval = setInterval(updateFocusClock, 1000);
      else { state.focus.activeUntil = null; saveFocus(); }
    }
  } catch { render(); }
}
init();
