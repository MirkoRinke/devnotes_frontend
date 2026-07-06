import { Notifications } from '../interface/translation.interface';

export const NOTIFICATIONS_EN: Notifications = {
  Global: {
    error: {
      UNKNOWN_ERROR: 'An unexpected error occurred. Please try again later.',
    },
  },
  Auth: {
    error: {
      name: {
        required: 'Enter name.',
        minlength: 'The name must be at least 2 characters long.',
        maxlength: 'The name must be at most 255 characters long.',
        pattern: 'The name cannot contain @.',
      },
      display_name: {
        required: 'Enter display name.',
        minlength: 'The display name must be at least 2 characters long.',
        maxlength: 'The display name must be at most 255 characters long.',
        pattern: 'Only letters, numbers, underscores, and hyphens are allowed.',
      },
      email: {
        required: 'Enter email address.',
        email: 'The email address is invalid.',
        maxlength: 'The email address must be at most 255 characters long.',
      },
      identifier: {
        required: 'Enter email address / username.',
        login_identifier_invalid: 'The email address or username is invalid.',
        maxlength: 'The email address or username is invalid.',
      },
      password: {
        required: 'Enter password.',
        minlength: 'The password must be at least 8 characters long.',
        maxlength: 'The password must be at most 255 characters long.',
        weakPassword: 'The password is too weak.',
      },
      password_confirmation: {
        required: 'Confirm password.',
        minlength: 'The password must be at least 8 characters long.',
        maxlength: 'The password must be at most 255 characters long.',
      },
      passwordMismatch: {
        passwordMismatch: 'Passwords do not match.',
      },
      acceptedConditions: {
        required: 'Please accept the terms of use & privacy policy.',
      },
      login: {
        UNKNOWN_ERROR: 'An error occurred during login. Please try again.',
        CREDENTIALS_INCORRECT: 'Email address / username or password is incorrect.',
        ACCOUNT_SUSPENDED: 'Your account has been suspended for {days} days.',
      },
      register: {
        UNKNOWN_ERROR: 'An error occurred during registration. Please try again.',
        VALIDATION_FAILED: 'Validation failed. Please check your input.',
        NAME_ALREADY_IN_USE: 'The name is already in use.',
        DISPLAY_NAME_ALREADY_IN_USE: 'The display name is already in use.',
        FORBIDDEN_NAME: 'The name is not allowed.',
        FORBIDDEN_DISPLAY_NAME: 'The display name is not allowed.',
        EMAIL_ALREADY_IN_USE: 'The email address is already in use.',
        PASSWORD_MUST_BE_UNCOMPROMISED:
          'Your password has been found in a data breach. Please choose a different password. For more information, visit [href]="https://haveibeenpwned.com/Passwords|Have I Been Pwned"',
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
      register: {
        REGISTER_SUCCESSFUL: 'Registration successful. Redirecting...',
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
        MISSING_TLD: 'Top-Level-Domain required.(e.g. .de)',
      },
      tags: {
        TAG_TOO_LONG: 'Tags cannot be longer than 50 characters.',
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
      tags: {
        TAG_ADDED: 'Tag "{tagName}" added.',
        TAG_ALREADY_SELECTED: 'Tag "{tagName}" is already selected.',
      },
    },
    success: {
      delete: { DELETE_SUCCESS: 'Post successfully deleted.' },
    },
  },
};
