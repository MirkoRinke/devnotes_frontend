import { Notifications } from '../interface/translation.interface';

export const NOTIFICATIONS_DE: Notifications = {
  Global: {
    error: {
      UNKNOWN_ERROR: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später noch einmal.',
      BACKEND_CONNECTION_ERROR: 'Verbindung zum Server konnte nicht hergestellt werden. Bitte versuche es später noch einmal.',
    },
  },
  Auth: {
    error: {
      name: {
        required: 'Name eingeben.',
        minlength: 'Der Name muss mindestens 2 Zeichen lang sein.',
        maxlength: 'Der Name darf maximal 40 Zeichen lang sein.',
        pattern: 'Der Benutzername darf nur aus Buchstaben (A-Z), Zahlen, Punkten, Unterstrichen, Bindestrichen und einfachen Leerzeichen bestehen.',
      },
      display_name: {
        required: 'Anzeigenamen eingeben.',
        minlength: 'Der Anzeigename muss mindestens 2 Zeichen lang sein.',
        maxlength: 'Der Anzeigename darf maximal 40 Zeichen lang sein.',
        pattern: 'Der Anzeigename darf nur aus Buchstaben (A-Z), Zahlen, Punkten, Unterstrichen, Bindestrichen und einfachen Leerzeichen bestehen.',
      },
      email: {
        required: 'E-Mail-Adresse eingeben.',
        email: 'Die E-Mail-Adresse ist ungültig.',
        maxlength: 'Die E-Mail-Adresse darf maximal 255 Zeichen lang sein.',
      },
      identifier: {
        required: 'E-Mail-Adresse / Benutzernamen eingeben.',
        login_identifier_invalid: 'Die E-Mail-Adresse oder der Benutzername ist ungültig.',
        maxlength: 'Die E-Mail-Adresse oder der Benutzername ist ungültig.',
      },
      password: {
        required: 'Passwort eingeben.',
        minlength: 'Das Passwort muss mindestens 8 Zeichen lang sein.',
        maxlength: 'Das Passwort darf maximal 255 Zeichen lang sein.',
        weakPassword: 'Das Passwort ist zu schwach.',
      },
      password_confirmation: {
        required: 'Passwort bestätigen.',
        minlength: 'Das Passwort muss mindestens 8 Zeichen lang sein.',
        maxlength: 'Das Passwort darf maximal 255 Zeichen lang sein.',
      },
      passwordMismatch: {
        passwordMismatch: 'Die Passwörter stimmen nicht überein.',
      },
      acceptedConditions: {
        required: 'Bitte Nutzungsbedingungen & Datenschutzrichtlinie akzeptieren.',
      },
      login: {
        UNKNOWN_ERROR: 'Fehler beim Login. Bitte erneut versuchen.',
        CREDENTIALS_INCORRECT: 'E-Mail-Adresse / Benutzername oder Passwort ist falsch.',
        ACCOUNT_SUSPENDED: 'Ihr Konto wurde für {days} Tage gesperrt.',
      },
      register: {
        UNKNOWN_ERROR: 'Fehler bei der Registrierung. Bitte erneut versuchen.',
        VALIDATION_FAILED: 'Verifizierung fehlgeschlagen. Bitte überprüfe deine Eingaben.',
        NAME_ALREADY_IN_USE: 'Der Name ist bereits vergeben.',
        DISPLAY_NAME_ALREADY_IN_USE: 'Der Anzeigename ist bereits vergeben.',
        FORBIDDEN_NAME: 'Der Name ist nicht erlaubt.',
        FORBIDDEN_DISPLAY_NAME: 'Der Anzeigename ist nicht erlaubt.',
        EMAIL_ALREADY_IN_USE: 'Die E-Mail-Adresse ist bereits vergeben.',
        PASSWORD_MUST_BE_UNCOMPROMISED:
          'Dein Passwort wurde in einem Datenleck gefunden. Bitte wähle ein anderes Passwort. Weitere Informationen findest du unter [href]="https://haveibeenpwned.com/Passwords|Have I Been Pwned"',
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
      register: {
        REGISTER_SUCCESSFUL: 'Registrierung erfolgreich. Weiterleitung...',
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
        MISSING_TLD: 'Top-Level-Domain erforderlich.(z.B. .de)',
      },
      tags: {
        TAG_TOO_LONG: 'Tags dürfen nicht länger als 50 Zeichen sein.',
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
      tags: {
        TAG_ADDED: 'Tag "{tagName}" hinzugefügt.',
        TAG_ALREADY_SELECTED: 'Tag "{tagName}" ist bereits ausgewählt.',
      },
    },
    success: {
      delete: { DELETE_SUCCESS: 'Beitrag erfolgreich gelöscht.' },
    },
  },
};
