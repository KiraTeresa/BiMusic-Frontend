const APP_PATHS = {
    HOME: '/',
    // User paths:
    PROFILE: '/user/:username',
    PROFILE_EDIT: '/editprofile',
    ACCOUNT_EDIT: '/user/:username/account-settings',
    // Project paths:
    PROJECTS: '/projects',
    PROJECT_DETAIL: '/projects/:id',
    PROJECT_CREATE: '/projects/create',
    USER_PROJECTS: '/Projects/:username',
    // Sample paths:
    SAMPLES: '/samples',
    SAMPLES_DETAIL: '/samples/:id',
    SAMPLES_CREATE: '/samples/create',
    USER_SAMPLES: '/samples/:username',
    // Chat paths:
    CHAT: "/chats",
    CHAT_ROOM: "/chats/:chatId"
}

export default APP_PATHS;