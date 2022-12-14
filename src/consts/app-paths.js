const APP_PATHS = {
    HOME: '/',
    // Auth paths:
    SIGNUP: '/signup',
    LOGIN: '/login',
    // User paths:
    PROFILE: '/profile/:username',
    PROFILE_EDIT: '/profile/edit',
    ACCOUNT_EDIT: '/account-settings',
    // Project paths:
    PROJECTS: '/projects',
    PROJECT_DETAIL: '/projects/:id',
    PROJECT_CREATE: '/projects/create',
    USER_PROJECTS: '/Projects/:username',
    // Sample paths:
    SAMPLES: '/samples',
    SAMPLES_DETAIL: '/samples/sample/:id',
    SAMPLES_CREATE: '/samples/create',
    USER_SAMPLES: '/samples/:username',
    // Chat paths:
    CHAT: "/chats",
    CHAT_ROOM: "/chats/:chatId",
    // Error:
    STATUS_400: "/page-not-found",
    STATUS_500: "/internal-server-error",
}

export default APP_PATHS;