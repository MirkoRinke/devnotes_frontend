import { ContentUI } from '../interface/translation.interface';

export const CONTENT_UI_DE: ContentUI = {
  HomeButton: {
    AppName: 'DevNotes',
    ariaLabel: {
      goToHome: 'Zur Startseite',
    },
  },
  SearchButton: {
    ariaLabel: {
      openSearch: 'Suchfeld öffnen',
      closeSearch: 'Suchfeld schließen',
      clearSearch: 'Suchfeld leeren',
    },
  },
  ControlUserBadge: {
    ariaLabel: {
      openMenu: 'Benutzermenü öffnen',
      closeMenu: 'Benutzermenü schließen',
    },
  },
  PageNavigation: {
    myArea: 'Mein Bereich',
    favorites: 'Favoriten',
    network: 'Netzwerk',
    community: 'Community',
    ariaLabel: {},
  },
  ControlUserMenu: {
    userProfile: 'Mein Profil',
    accountSettings: 'Konto',
    avatarSettings: 'Avatar',
    appSettings: 'Einstellungen',
    logout: 'Abmelden',
    login: 'Anmelden',
    register: 'Registrieren',
    legal: 'Rechtliches',
    ariaLabel: {},
  },
  Search: {
    search: 'Suche nach Text oder #Tags...',
    filter: 'Suche...',
    ariaLabel: {
      startSearch: 'Suche starten',
      closeSearch: 'Suche schließen',
    },
  },
  LegalMobile: {
    imprint: 'Impressum',
    privacy: 'Datenschutz',
    terms: 'Nutzungsbedingungen',
    ariaLabel: {
      legalNav: 'Navigation Rechtliches',
    },
  },
  CreatorLinks: {
    portfolio: 'Portfolio',
    github: 'GitHub',
    contact: 'Kontakt',
    ariaLabel: {
      creatorNav: 'Navigation Ersteller',
    },
  },
  Copyright: {
    creator: 'Mirko Rinke',
    ariaLabel: {
      copyright: 'Copyright',
    },
  },
  LegalLinks: {
    terms: 'Nutzungsbedingungen',
    privacy: 'Datenschutz',
    imprint: 'Impressum',
    ariaLabel: {
      legalNav: 'Navigation Rechtliches',
    },
  },
  Loading: {
    loadingParams: '{element} werden geladen...',
    loading: 'Wird geladen...',
    ariaLabel: {},
  },
  NoResults: {
    noResultsParams: '{element} wurden nicht gefunden.',
    noResults: 'Keine Ergebnisse gefunden.',
    ariaLabel: {},
  },
  TechTile: {
    ariaLabel: {
      addToFavorites: 'Zu Favoriten hinzufügen',
      removeFromFavorites: 'Aus Favoriten entfernen',
    },
  },
  SectionStepper: {
    ariaLabel: {
      stepperForwardParams: 'Weitere {context} anzeigen',
      stepperForward: 'Weitere anzeigen',
      stepperBackwardParams: 'Vorherige {context} anzeigen',
      stepperBackward: 'Vorherige anzeigen',
    },
  },
  FavoritesRefreshButton: {
    ariaLabel: {
      refreshFavorites: 'Favoriten aktualisieren',
    },
  },
  PostTypes: {
    heading: 'Beitragstyp',
    loading: 'Beitragstypen',
    tile: {
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
    ariaLabel: {
      totalCounts: 'Beiträge verfügbar',
    },
  },
};
