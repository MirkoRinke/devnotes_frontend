import { Notifications } from './translation.interface';

export const NOTIFICATIONS_EN: Notifications = {
  Global: {
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again later.',
  },
  Auth: {
    error: {
      identifier: {
        required: 'Enter email address / username.',
        login_identifier_invalid: 'The email address or username is invalid.',
        maxlength: 'The email address or username is invalid.',
      },
      password: {
        required: 'Enter password.',
        minlength: 'The password must be at least 8 characters long.',
        maxlength: 'The password must be at most 255 characters long.',
      },
      acceptedConditions: {
        required: 'Please accept the terms of use & privacy policy.',
      },
      login: {
        UNKNOWN_ERROR: 'An error occurred during login. Please try again.',
        CREDENTIALS_INCORRECT: 'Email address / username or password is incorrect.',
        ACCOUNT_SUSPENDED: 'Your account has been suspended for {days} days.',
      },
      deleteAccount: {
        UNKNOWN_ERROR: 'Error deleting the account. Please try again.',
        ACCOUNT_DELETION_INVALID_CREDENTIALS: 'Email address / username or password is incorrect.',
        ACCOUNT_DELETION_FORBIDDEN: 'Account deletion is not possible.',
      },
    },
    info: {
      login: {
        MUST_ACCEPT_CONDITIONS: 'There are new terms of use or privacy policies.',
      },
      deleteAccount: {
        DELETE_ACCOUNT_CONFIRMATION: 'Really delete account?',
      },
    },
    success: {
      login: {
        LOGIN_SUCCESSFUL: 'Login successful. Redirecting...',
      },
      deleteAccount: {
        DELETE_ACCOUNT_SUCCESSFUL: 'Account successfully deleted. Redirecting...',
      },
      acceptedConditions: {
        ACCEPTED_CONDITIONS: 'Terms of use & privacy policy accepted.',
      },
    },
  },
  Post: {
    error: {
      delete: {
        UNKNOWN_ERROR: 'Error deleting the post. Please try again.',
        NO_PERMISSION: 'No permission to delete the post.',
        CONFIRMATION_TEXT_MISMATCH: 'Confirmation text does not match.',
      },
      post_type: {
        E: 'E{index}',
      },
      category: {
        E: 'E{index}',
      },
      syntax_highlighting: {
        E: 'E{index}',
      },
      status: {
        E: 'E{index}',
      },
      title: {
        E: 'E{index}',
      },
      description: {
        E: 'E{index}',
      },
      code: {
        E: 'E{index}',
      },
      language_or_tech_required: {
        E: 'E{index}',
      },
      mediaLinks: {
        INVALID_URL: 'Invalid URL. Please check your input.',
        URL_TOO_LONG: 'Maximum URL length exceeded.',
        MISSING_TLD: 'Top-level domain required (e.g. .com, .de).',
      },
    },
    info: {
      delete: {
        CONFIRMATION_TEXT_REQUIRED: 'Please enter the confirmation text.',
      },
      syntax_highlighting: {
        syntax_highlighting_required: 'Info',
      },
      mediaLinks: {
        DUPLICATE_URL: 'This URL is already in the list.',
      },
    },
    success: {
      delete: { DELETE_SUCCESS: 'Post successfully deleted.' },
    },
  },
};
