export const APP_CONSTANTS = {
  APP_NAME: 'CodeSnippet Manager',
  VERSION: '1.0.0',
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  SNIPPET_TITLE_MAX_LENGTH: 100,
  SNIPPET_DESCRIPTION_MAX_LENGTH: 500,
  CATEGORY_NAME_MAX_LENGTH: 50,
  TAG_NAME_MAX_LENGTH: 30,
};

export const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'c',
  'cpp',
  'csharp',
  'php',
  'ruby',
  'go',
  'rust',
  'swift',
  'kotlin',
  'scala',
  'html',
  'css',
  'scss',
  'less',
  'json',
  'xml',
  'yaml',
  'markdown',
  'sql',
  'bash',
  'dockerfile',
  'nginx',
  'graphql',
];

export const ERROR_MESSAGES = {
  USER: {
    NOT_FOUND: 'User not found',
    ALREADY_EXISTS: 'User already exists',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_NOT_VERIFIED: 'Please verify your email before logging in',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
  },
  SNIPPET: {
    NOT_FOUND: 'Snippet not found',
    ACCESS_DENIED: 'Access denied to this snippet',
    INVALID_CATEGORY: 'Invalid category',
  },
  CATEGORY: {
    NOT_FOUND: 'Category not found',
    ALREADY_EXISTS: 'Category already exists',
    HAS_SNIPPETS: 'Cannot delete category that has snippets',
  },
  VALIDATION: {
    INVALID_EMAIL: 'Invalid email format',
    INVALID_USERNAME: 'Invalid username format',
    PASSWORD_TOO_WEAK: 'Password is too weak',
    REQUIRED_FIELD: 'This field is required',
  },
  SERVER: {
    INTERNAL_ERROR: 'Internal server error',
    DATABASE_ERROR: 'Database error occurred',
    EMAIL_ERROR: 'Failed to send email',
  },
};

export const SUCCESS_MESSAGES = {
  USER: {
    REGISTERED: 'User registered successfully',
    LOGGED_IN: 'Login successful',
    LOGGED_OUT: 'Logout successful',
    PROFILE_UPDATED: 'Profile updated successfully',
    ACCOUNT_DELETED: 'Account deleted successfully',
    EMAIL_VERIFIED: 'Email verified successfully',
    PASSWORD_RESET: 'Password reset successfully',
  },
  SNIPPET: {
    CREATED: 'Snippet created successfully',
    UPDATED: 'Snippet updated successfully',
    DELETED: 'Snippet deleted successfully',
    FAVORITED: 'Snippet added to favorites',
    UNFAVORITED: 'Snippet removed from favorites',
  },
  CATEGORY: {
    CREATED: 'Category created successfully',
    UPDATED: 'Category updated successfully',
    DELETED: 'Category deleted successfully',
  },
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};