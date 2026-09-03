import { ContentUI } from '../interface/translation.interface';

export const CONTENT_UI_EN: ContentUI = {
  HomeButton: {
    AppName: 'DevNotes',
    ariaLabel: {
      goToHome: 'Go to Home',
    },
  },
  SearchButton: {
    ariaLabel: {
      openSearch: 'Open search input',
      closeSearch: 'Close search input',
      clearSearch: 'Clear search input',
    },
  },
  ControlUserBadge: {
    ariaLabel: {
      openMenu: 'Open user menu',
      closeMenu: 'Close user menu',
    },
  },
  PageNavigation: {
    myArea: 'My Area',
    favorites: 'Favorites',
    network: 'Network',
    community: 'Community',
    ariaLabel: {},
  },
  ControlUserMenu: {
    userProfile: 'My Profile',
    accountSettings: 'Account',
    avatarSettings: 'Avatar',
    appSettings: 'Settings',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    legal: 'Legal',
    ariaLabel: {},
  },
  Search: {
    search: 'Search by text or #tags...',
    filter: 'Search...',
    ariaLabel: {
      startSearch: 'Start search',
      closeSearch: 'Close search',
    },
  },
  LegalMobile: {
    imprint: 'Imprint',
    privacy: 'Privacy',
    terms: 'Terms of Use',
    ariaLabel: {
      legalNav: 'Navigation Legal',
    },
  },
  CreatorLinks: {
    portfolio: 'Portfolio',
    github: 'GitHub',
    contact: 'Contact',
    ariaLabel: {
      creatorNav: 'Navigation Creator',
    },
  },
  Copyright: {
    creator: 'Mirko Rinke',
    ariaLabel: {
      copyright: 'Copyright',
    },
  },
  LegalLinks: {
    terms: 'Terms of Use',
    privacy: 'Privacy',
    imprint: 'Imprint',
    ariaLabel: {
      legalNav: 'Navigation Legal',
    },
  },
  Loading: {
    loadingParams: '{element} are loading...',
    loading: 'Loading...',
    ariaLabel: {},
  },
  NoResults: {
    noResultsParams: 'No {element} found.',
    noResults: 'No results found.',
    ariaLabel: {},
  },
  TechTile: {
    ariaLabel: {
      addToFavorites: 'Add to Favorites',
      removeFromFavorites: 'Remove from Favorites',
    },
  },
  SectionStepper: {
    ariaLabel: {
      stepperForwardParams: 'Show more {context}',
      stepperForward: 'Show more',
      stepperBackwardParams: 'Show previous {context}',
      stepperBackward: 'Show previous',
    },
  },
  FavoritesRefreshButton: {
    ariaLabel: {
      refreshFavorites: 'Refresh Favorites',
    },
  },
  PostTypes: {
    heading: 'Post Type',
    loading: 'Post Types',
    tile: {
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
    ariaLabel: {
      totalCounts: 'Available posts',
    },
  },
  PostList: {
    posts: 'Posts',
    ariaLabel: {},
  },
  PostListElement: {
    ariaLabel: {
      count: {
        comment: '{count} Comments',
        like: '{count} Likes',
      },
      status: {
        draft: 'Post Status: Draft',
        published: 'Post Status: Published',
        private: 'Post Status: Private',
        archived: 'Post Status: Archived',
      },
    },
  },
  SectionPagination: {
    ariaLabel: {
      firstPage: 'To the first page',
      previousPage: 'To the previous page',
      nextPage: 'To the next page',
      lastPage: 'To the last page',
      page: 'Page {page}',
    },
  },
};
