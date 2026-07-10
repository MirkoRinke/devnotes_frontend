export interface GlobalMessagesInterface {
  error: GlobalErrorMessagesInterface;
}

interface GlobalErrorMessagesInterface {
  UNKNOWN_ERROR: string;
  BACKEND_CONNECTION_ERROR: string;
}
