import { Content } from './translation.interface';

export const CONTENT_DE: Content = {
  PostTypes: {
    all_types: {
      title: 'Alle Typen',
      description: 'Alle verfügbaren Beitragstypen auf einen Blick.',
    },
    feedback: {
      title: 'Feedback',
      description: 'Feedback geben & erhalten. Präsentiere deine Projekte und wachse durch wertvolle Rückmeldungen der Community.',
    },
    questions: {
      title: 'Fragen',
      description: 'Fragen & Antworten. Nutze das Wissen der Community für gezielte Fragen und teile deine Expertise.',
    },
    resources: {
      title: 'Ressourcen',
      description: 'Wissensbasis & Ressourcen. Entdecke und teile Materialien, die uns gemeinsam voranbringen.',
    },
    showcase: {
      title: 'Showcase',
      description: 'Projekte & Erfolge. Zeig, woran du arbeitest, und lass dich von den Erfolgen anderer inspirieren.',
    },
    snippets: {
      title: 'Snippets',
      description: 'Code Snippets. Teile hilfreiche Code-Bausteine und entdecke neue Lösungswege.',
    },
    tutorials: {
      title: 'Tutorials',
      description: 'Anleitungen & Tutorials. Finde oder erstelle leicht verständliche Anleitungen für neue Skills.',
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
        UNKNOWN_ERROR: 'Es ist ein Fehler aufgetreten. Bitte erneut versuchen.',
        CREDENTIALS_INCORRECT: 'E-Mail-Adresse / Benutzername oder Passwort ist falsch.',
        ACCOUNT_DELETION_FORBIDDEN: 'Das Löschen des Kontos ist nicht möglich.',
        ACCOUNT_SUSPENDED: 'Ihr Konto wurde für {days} Tage gesperrt.',
      },
      deleteAccount: {},
    },
    info: {
      login: {
        MUST_ACCEPT_CONDITIONS: 'Es gab neue Nutzungsbedingungen oder Datenschutzrichtlinien',
      },
    },
    success: {
      login: {
        SUCCESSFUL: 'Login erfolgreich. Weiterleitung...',
      },
      acceptedConditions: {
        ACCEPTED_CONDITIONS: 'Nutzungsbedingungen & Datenschutzrichtlinie akzeptiert.',
      },
    },
  },
};
