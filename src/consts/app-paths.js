const APP_PATHS = {
    HOME: '/',
    // User paths:
    PROFILE: '/user/:username',
    PROFILE_EDIT: '/user/:username/edit',
    ACCOUNT_EDIT: '/user/:username/account-settings',
    // Project paths:
    PROJECTS: '/projects',
    PROJECT_DETAIL: '/projects/:projectId',
    PROJECT_CREATE: '/projects/create',
    USER_PROJECTS: '/Projects/:username',
    // Sample paths:
    SAMPLES: '/samples',
    SAMPLES_CREATE: '/samples/create',
    USER_SAMPLES: '/samples/:username',
}

export default APP_PATHS;