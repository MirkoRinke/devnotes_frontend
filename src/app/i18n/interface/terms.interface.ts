export interface TermsMessagesInterface {
  header: {
    title: string;
    lastUpdated: string;
  };
  sections: {
    about: {
      title: string;
      text: string;
    };
    registration: {
      title: string;
      text: string;
    };
    copyright: {
      title: string;
      text: string;
    };
    fairplay: {
      title: string;
      text: string;
    };
    amendments: {
      title: string;
      text: string;
    };
  };
}
