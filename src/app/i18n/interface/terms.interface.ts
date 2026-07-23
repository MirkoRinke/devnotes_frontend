export interface TermsMessagesInterface {
  header: {
    title: string;
    lastUpdated: string;
  };
  sections: {
    platform: {
      title: string;
      knowledgePlatform: { label: string; text: string };
      noGuarantee: { label: string; text: string };
    };
    registration: {
      title: string;
      credentials: { label: string; text: string };
    };
    userContent: {
      title: string;
      publicVisibility: { label: string; text: string };
      ownershipAndLicense: { label: string; text: string };
      communitySpirit: { label: string; text: string };
      responsibility: { label: string; text: string };
    };
    contentAfterDeletion: {
      title: string;
      transferToSystem: { label: string; text: string };
      nonPublicContent: { label: string; text: string };
      subsequentCorrections: { label: string; text: string };
    };
    moderation: {
      title: string;
      prohibitedContent: { label: string; text: string };
      moderationAndBlocking: { label: string; text: string };
    };
    externalContent: {
      title: string;
      manualActivation: { label: string; text: string };
    };
    disclaimer: {
      title: string;
      thirdPartyContent: { label: string; text: string };
      exclusion: { label: string; text: string };
      amendments: { label: string; text: string };
    };
  };
}
