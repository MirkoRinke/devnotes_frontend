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
    noResultsParams: 'Keine {element} gefunden.',
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
  PostList: {
    posts: 'Beiträge',
    ariaLabel: {},
  },
  PostListQueryBar: {
    languages: {
      languages: 'Tech Stack',
      ariaLabel: {},
    },
    technologies: {
      technologies: 'Tools',
      ariaLabel: {},
    },
    postTypes: {
      postTypes: 'Beitragstypen',
      all_types: 'Alle Typen',
      feedback: 'Feedback',
      questions: 'Fragen',
      resources: 'Ressourcen',
      showcase: 'Showcase',
      snippets: 'Snippets',
      tutorials: 'Tutorials',
      ariaLabel: {},
    },
    category: {
      category: 'Kategorie',
      ariaLabel: {},
    },
    status: {
      status: 'Status',
      ariaLabel: {},
    },
    dateFrom: 'Datum von',
    dateTo: 'Datum bis',
    sort: {
      sort: 'Sortieren',
      '-updated_at': 'Neuste',
      updated_at: 'Älteste',
      '-likes_count': 'Likes',
      ariaLabel: {},
    },
  },
  DropdownComponent: {
    all: 'Alle',
    ariaLabel: {
      results: 'Ergebnisse',
    },
  },
  PostListElement: {
    ariaLabel: {
      count: {
        comment: '{count} Kommentare',
        like: '{count} Gefällt mir',
      },
      status: {
        draft: 'Beitragsstatus: Entwurf',
        published: 'Beitragsstatus: Veröffentlicht',
        private: 'Beitragsstatus: Privat',
        archived: 'Beitragsstatus: Archiviert',
      },
    },
  },
  SectionPagination: {
    ariaLabel: {
      firstPage: 'Zur ersten Seite',
      previousPage: 'Zur vorherigen Seite',
      nextPage: 'Zur nächsten Seite',
      lastPage: 'Zur letzten Seite',
      page: 'Seite {page}',
    },
  },
  UserAvatarCustomizer: {
    heading: 'Avatar Anpassung',
    subheading: 'Suche dir einen Avatar aus, der zu dir passt.',
    reset: 'Zurücksetzen',
    save: 'Speichern',
    ariaLabel: {
      prev: 'Vorheriger',
      next: 'Nächster',
      randomize: 'Zufällig',
      reset: 'Zurücksetzen',
      save: 'Speichern',
    },
  },
  UserAvatarAlt: {
    mvp_1: 'Gelbe Pixel-Art-Ente mit Kopfhörern vor einem Laptop, im Hintergrund ein Serverraum.',
    mvp_2: 'Steampunk-Quietscheentchen im Pixel-Art-Stil, trägt eine große Fliegerbrille und Werkzeuggürtel mit Schraubenschlüsseln und Fläschchen.',
    mvp_3: 'Gelbe Pixel-Art-Ente mit schwarzem Baseball-Cap, Kopfhörern und dicker schwarzer Nerd-Brille.',
    mvp_4: 'Elegante Pixel-Art-Ente mit rotem Hut, großer Perlenkette und rotem Lippenstift vor einem Büro-Hintergrund.',
    mvp_5: 'Gelbe Pixel-Art-Ente mit finsterem Blick, trägt eine blaue Beanie, Kopfhörer und eine dicke blaue Kette.',
    mvp_6: 'Bunte Pixel-Art-Ente mit farbenfrohem Blumenkranz auf dem Kopf, gemusterten bunten Brillen und passenden Ohrringen.',
    mvp_7: 'Dunkle, violette Pixel-Art-Ente im Goth-Stil, trägt einen kleinen Zylinder mit Schleier, einen Halsring mit Ring und Ohrring vor dunkler Friedhofs-Silhouette.',
    mvp_8: 'Steampunk-Ente im Pixel-Art-Stil mit Zylinder, Zahnrad-Brille, Weste und mechanischen Zahnrädern vor rauchigem Hintergrund.',
    mvp_9: 'Türkisfarbene Pixel-Art-Ente im Zauberer-Outfit, trägt einen spitzen lila Sternen-Hut und einen passenden Umhang, hält einen Zauberstab mit einem leuchtenden Stern.',
    mvp_10: 'Gelbe Pixel-Art-Ente im gemusterten rosa Kimono, trägt einen großen Blumenkranz im Haar und hält einen passenden Fächer, vor einem Hintergrund aus rosafarbenen Kirschblüten.',
    mvp_11: 'Helle Pixel-Art-Ente als Sushi-Koch mit weißem Stirnband, blauer Kochjacke mit rotem Saum und einem Stück Sushi in der Flosse vor traditionellem Holzhintergrund.',
    mvp_12: 'Gelbe Pixel-Art-Ente als Pirat mit Totenkopf-Dreispitz, Augenklappe, Ohrring und einem Dolch in der Flosse vor einer Strandkulisse mit Palmen.',
    mvp_13: 'Wütend dreinblickende gelbe Pixel-Art-Ente als Chefkoch mit hoher Kochmütze, roter Schürze und einem Kochlöffel in der Flosse in einer Küche.',
    mvp_14: 'Gelbe Pixel-Art-Ente als Rockmusiker mit rotem Bandana, Sonnenbrille und E-Gitarre unter Bühnenscheinwerfern.',
    mvp_15: 'Weiße Pixel-Art-Ente als Ärztin mit medizinischer Haube mit rotem Kreuz, Brille und einem Stethoskop um den Hals in einem Krankenhausflur.',
    mvp_16: 'Rosa Pixel-Art-Ente als medizinisches Personal mit Schwesternhaube mit rotem Kreuz, Brille, hält eine Spritze und einen Erste-Hilfe-Kasten in einem Krankenhauszimmer.',
    mvp_17: 'Düster dreinblickende gelbe Pixel-Art-Ente in einem dunklen Umhang, hält ein Buch vor einem nächtlichen, rötlich bewölkten Himmel.',
    mvp_18: 'Sternly looking yellow pixel art duck wearing a dark cloak, holding a book against a nocturnal, reddish cloudy sky.',
    mvp_19: 'Coole gelbe Pixel-Art-Ente mit einer schwarzen Kappe, Sonnenbrille, Hemdkragen und Krawatte vor einem grünlichen, blockigen Hintergrund.',
    mvp_20: 'Entschlossene gelbe Pixel-Art-Ente als Samurai mit traditioneller Rüstung, Helm und einem gezogenen Katana in der Flosse vor einem Bambuswald.',
    mvp_1000: 'Pixel-Art-Ente im grünen Cyberpunk-Stil, trägt VR-Brille und hält einen Einplatinencomputer.',
    mvp_1001: 'Pixel-Art-Ente in dunklem Pink und Blau, trägt eine Kappe, leuchtende Cyber-Brille und einen neofarbeden Kragen.',
    mvp_1002: 'Pixel-Art-Ente in Gold mit leuchtenden Leiterbahn-Mustern, trägt eine futuristische VR-Brille und hält ein Tablet in der Flosse.',
    mvp_guest: 'Pixel-Art-Ente mit runder Brille, die vorsichtig hinter einer geöffneten Zimmertür hervorschaut.',
  },
};
