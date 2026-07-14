export interface PrivacyMessagesInterface {
  title: string;
  lastUpdated: string;
  dataProtectionAtAGlance: {
    title: string;
    generalNotes: {
      title: string;
      text: string;
    };
    dataCollection: {
      title: string;
      responsible: {
        title: string;
        text: string;
      };
      howWeCollect: {
        title: string;
        text1: string;
        text2: string;
      };
      whatWeUseFor: {
        title: string;
        text: string;
      };
      yourRights: {
        title: string;
        text1: string;
        text2: string;
      };
    };
  };
  hosting: {
    title: string;
    text: string;
    ionos: {
      title: string;
      text1: string;
      url: string;
      text2: string;
    };
  };
  generalAndMandatory: {
    title: string;
    dataProtection: {
      title: string;
      text1: string;
      text2: string;
      text3: string;
    };
    responsibleParty: {
      title: string;
      text1: string;
      address: {
        name: string;
        street: string;
        city: string;
      };
      email: string;
      text2: string;
    };
    storageDuration: {
      title: string;
      text: string;
    };
    legalBasis: {
      title: string;
      text: string;
    };
    recipients: {
      title: string;
      text: string;
    };
    revocation: {
      title: string;
      text: string;
    };
    rightToObject: {
      title: string;
      text1: string;
      text2: string;
    };
    rightToComplain: {
      title: string;
      text: string;
    };
    dataPortability: {
      title: string;
      text: string;
    };
    accessCorrectionDeletion: {
      title: string;
      text: string;
    };
    restrictionOfProcessing: {
      title: string;
      text: string;
      list: string[];
      text2: string;
    };
    sslTlsEncryption: {
      title: string;
      text1: string;
      text2: string;
    };
    source: {
      prefix: string;
      url: string;
    };
  };
}
