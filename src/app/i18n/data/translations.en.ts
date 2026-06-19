import { Content } from './translation.interface';

export const CONTENT_EN: Content = {
  PostTypes: {
    all_types: {
      title: 'All Types',
      description: 'All available post types at a glance.',
    },
    feedback: {
      title: 'Feedback',
      description: 'Give & receive feedback. Showcase your projects and grow through valuable community insights.',
    },
    questions: {
      title: 'Questions',
      description: 'Questions & Answers. Leverage community knowledge for specific queries and share your expertise.',
    },
    resources: {
      title: 'Resources',
      description: 'Knowledge Base & Resources. Discover and share materials that move us forward together.',
    },
    showcase: {
      title: 'Showcase',
      description: 'Projects & Successes. Show what you are working on and get inspired by others’ achievements.',
    },
    snippets: {
      title: 'Snippets',
      description: 'Code Snippets. Share helpful code blocks and discover new solutions.',
    },
    tutorials: {
      title: 'Tutorials',
      description: 'Guides & Tutorials. Find or create easy-to-understand instructions for new skills.',
    },
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
        UNKNOWN_ERROR: 'An error occurred. Please try again.',
        CREDENTIALS_INCORRECT: 'Email address / username or password is incorrect.',
        ACCOUNT_SUSPENDED: 'Your account has been suspended for {days} days.',
      },
      deleteAccount: {
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
};
