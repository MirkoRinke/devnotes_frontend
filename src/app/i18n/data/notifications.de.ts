import { Notifications } from '../interface/translation.interface';

export const NOTIFICATIONS_DE: Notifications = {
  Global: {
    error: {
      UNKNOWN_ERROR: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später noch einmal.',
    },
  },
  Auth: {
    error: {
      identifier: {
        required: 'E-Mail-Adresse / Benutzernamen eingeben.',
        login_identifier_invalid: 'Die E-Mail-Adresse oder der Benutzername ist ungültig.',
        maxlength: 'Die E-Mail-Adresse oder der Benutzername ist ungültig.',
      },
      password: {
        required: 'Passwort eingeben.',
        minlength: 'Das Passwort muss mindestens 8 Zeichen lang sein.',
        maxlength: 'Das Passwort darf maximal 255 Zeichen lang sein.',
      },
      acceptedConditions: {
        required: 'Bitte Nutzungsbedingungen & Datenschutzrichtlinie akzeptieren.',
      },
      login: {
        UNKNOWN_ERROR: 'Fehler beim Login. Bitte erneut versuchen.',
        CREDENTIALS_INCORRECT: 'E-Mail-Adresse / Benutzername oder Passwort ist falsch.',
        ACCOUNT_SUSPENDED: 'Ihr Konto wurde für {days} Tage gesperrt.',
      },
      deleteAccount: {
        UNKNOWN_ERROR: 'Fehler beim Löschen des Kontos. Bitte erneut versuchen.',
        ACCOUNT_DELETION_INVALID_CREDENTIALS: 'E-Mail-Adresse / Benutzername oder Passwort ist falsch.',
        ACCOUNT_DELETION_FORBIDDEN: 'Das Löschen des Kontos ist nicht möglich.',
      },
    },
    info: {
      login: {
        MUST_ACCEPT_CONDITIONS: 'Es gab neue Nutzungsbedingungen oder Datenschutzrichtlinien',
      },
      deleteAccount: {
        DELETE_ACCOUNT_CONFIRMATION: 'Konto wirklich löschen?',
      },
    },
    success: {
      login: {
        LOGIN_SUCCESSFUL: 'Login erfolgreich. Weiterleitung...',
      },
      deleteAccount: {
        DELETE_ACCOUNT_SUCCESSFUL: 'Konto erfolgreich gelöscht. Weiterleitung...',
      },
      acceptedConditions: {
        ACCEPTED_CONDITIONS: 'Nutzungsbedingungen & Datenschutzrichtlinie akzeptiert.',
      },
    },
  },
  Post: {
    error: {
      delete: {
        UNKNOWN_ERROR: 'Fehler beim Löschen des Beitrags. Bitte erneut versuchen.',
        NO_PERMISSION: 'Keine Berechtigung zum Löschen des Beitrags.',
        CONFIRMATION_TEXT_MISMATCH: 'Bestätigungstext stimmt nicht überein.',
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
        INVALID_URL: 'Ungültige URL. Bitte überprüfe deine Eingabe.',
        URL_TOO_LONG: 'Maximale URL-Länge überschritten.',
        MISSING_TLD: 'Top-Level-Domain erforderlich (z. B. .de, .com).',
      },
    },
    info: {
      delete: {
        CONFIRMATION_TEXT_REQUIRED: 'Bitte Bestätigungstext eingeben.',
      },
      syntax_highlighting: {
        syntax_highlighting_required: 'Info',
      },
      mediaLinks: {
        DUPLICATE_URL: 'Diese URL ist bereits in der Liste.',
      },
    },
    success: {
      delete: { DELETE_SUCCESS: 'Beitrag erfolgreich gelöscht.' },
    },
  },
};
