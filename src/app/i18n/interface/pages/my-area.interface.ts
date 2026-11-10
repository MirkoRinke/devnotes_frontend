export interface MyAreaMessagesInterface {
  searchResults: string;
  favorites: string;
  languagesAndTechnologies: string;
  tools: string;
  actionPlaceholder: {
    loggedIn: {
      heading: string;
      message: string;
      buttonText: string;
      ariaLabel: {};
    };
    notLoggedIn: {
      heading: string;
      message: string;
      buttonText: string;
      ariaLabel: {};
    };
  };
  ariaLabel: {};
}
