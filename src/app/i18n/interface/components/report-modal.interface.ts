export interface ReportModalMessagesInterface {
  heading: string;
  alreadyReported: string;
  thankYouMessage: string;
  responseMessage: string;
  close: string;
  reasonPlaceholder: string;
  report: string;
  errorMessage: string;
  retryMessage: string;
  invalidDataError: string;
  context: {
    post: string;
    comment: string;
    userProfile: string;
    user: string;
  };
  ariaLabel: {
    reason: string;
    close: string;
  };
}
