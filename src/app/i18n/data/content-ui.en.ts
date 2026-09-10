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
      postTypes: 'Post Types',
      all: 'All',
      all_types: 'All Types',
      feedback: 'Feedback',
      questions: 'Questions',
      resources: 'Resources',
      showcase: 'Showcase',
      snippets: 'Snippets',
      tutorials: 'Tutorials',
      ariaLabel: {},
    },
    category: {
      category: 'Category',
      all: 'All',
      ariaLabel: {},
    },
    status: {
      status: 'Status',
      all: 'All',
      ariaLabel: {},
    },
    dateFrom: 'Date From',
    dateTo: 'Date To',
    sort: {
      sort: 'Sort',
      '-updated_at': 'Newest',
      updated_at: 'Oldest',
      '-likes_count': 'Likes',
      ariaLabel: {},
    },
  },
  DropdownComponent: {
    ariaLabel: {
      results: 'Results',
    },
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
  UserAvatarCustomizer: {
    heading: 'Avatar Customization',
    subheading: 'Choose an avatar that fits you.',
    reset: 'Reset',
    save: 'Save',
    ariaLabel: {
      prev: 'Previous',
      next: 'Next',
      randomize: 'Random',
      reset: 'Reset',
      save: 'Save',
    },
  },
  UserAvatarAlt: {
    mvp_1: 'Yellow pixel art duck wearing headphones in front of a laptop, with a server room in the background.',
    mvp_2: 'Steampunk rubber ducky in pixel art style, wearing a large aviator goggles and tool belt with wrenches and vials.',
    mvp_3: 'Yellow pixel art duck wearing a black baseball cap, headphones, and thick black nerd glasses.',
    mvp_4: 'Elegant pixel art duck wearing a red hat, a large pearl necklace, and red lipstick, set against an office background.',
    mvp_5: 'Yellow pixel art duck with a grim expression, wearing a blue beanie, headphones, and a thick blue chain.',
    mvp_6: 'Colorful pixel art duck with a vibrant flower crown on its head, patterned colorful glasses, and matching earrings.',
    mvp_7: 'Dark purple pixel art duck in goth style, wearing a small top hat with a veil, a collar with a ring, and an earring against a dark graveyard silhouette.',
    mvp_8: 'Steampunk duck in pixel art style with a top hat, gear goggles, vest, and mechanical cogs against a smoky background.',
    mvp_9: 'Turquoise pixel art duck in wizard outfit, wearing a pointy purple star hat and matching cape, holding a wand with a glowing star.',
    mvp_10: 'Yellow pixel art duck in a patterned pink kimono, wearing a large flower crown in her hair and holding a matching fan, against a background of pink cherry blossoms.',
    mvp_11: 'Light pixel art duck as a sushi chef wearing a white headband, blue chefs jacket with a red trim, and holding a piece of sushi in its wing against a traditional wood background.',
    mvp_12: 'Yellow pixel art duck as a pirate wearing a skull tricorn hat, an eyepatch, an earring, and holding a dagger in its wing against a beach backdrop with palm trees.',
    mvp_13: 'Angry-looking yellow pixel art duck as a head chef wearing a tall chefs hat, red apron, and holding a wooden spoon in its wing inside a kitchen.',
    mvp_14: 'Yellow pixel art duck as a rock musician wearing a red bandana, sunglasses, and playing an electric guitar under stage spotlights.',
    mvp_15: 'White pixel art duck as a doctor wearing a medical cap with a red cross, glasses, and a stethoscope around her neck in a hospital corridor.',
    mvp_16: 'Pink pixel art duck as medical staff wearing a nurses cap with a red cross, glasses, holding a syringe and a first aid kit in a hospital room.',
    mvp_17: 'Sternly looking yellow pixel art duck wearing a dark cloak, holding a book against a nocturnal, reddish cloudy sky.',
    mvp_18: 'Determined yellow pixel art duck as a boxer wearing a red headband and red boxing gloves against a fiery, exploding background.',
    mvp_19: 'Cool yellow pixel art duck wearing a black cap, sunglasses, shirt collar, and tie against a greenish, blocky background.',
    mvp_20: 'Determined yellow pixel art duck as a samurai wearing traditional armor, a helmet, and holding a drawn katana in its wing against a bamboo forest background.',
    mvp_1000: 'Pixel art duck in a green cyberpunk style, wearing VR goggles and holding a single-board computer.',
    mvp_1001: 'Pixel art duck in dark pink and blue, wearing a baseball cap, glowing cyber glasses, and a neon collar.',
    mvp_1002: 'Pixel art duck in gold with glowing circuit board patterns, wearing futuristic VR goggles and holding a tablet in its wing.',
    mvp_guest: 'Pixel art duck with round glasses, cautiously peeking out from behind an open room door.',
  },
};
