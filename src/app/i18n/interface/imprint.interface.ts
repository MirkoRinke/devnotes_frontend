export interface ImprintMessagesInterface {
  header: {
    title: string;
    info: string;
  };
  address: {
    name: string;
    street: string;
    city: string;
  };
  representedBy: {
    label: string;
    name: string;
  };
  contact: {
    label: string;
    emailLabel: string;
    email: string;
  };
  disclaimer: {
    title: string;
    liabilityForContent: {
      title: string;
      text: string;
    };
    liabilityForLinks: {
      title: string;
      text: string;
    };
    copyright: {
      title: string;
      text: string;
    };
  };
}
