export interface PostMessagesInterface {
  error: ErrorMessages;
  info: InfoMessages;
  success: SuccessMessages;
}

// #region Error Messages
interface ErrorMessages {
  delete?: CustomErrorMessages;
}

interface CustomErrorMessages {
  UNKNOWN_ERROR: string;
  NO_PERMISSION?: string;
  CONFIRMATION_TEXT_MISMATCH?: string;
}
// #endregion

// #region Info Messages
interface InfoMessages {
  delete?: CustomInfoInterface;
}

interface CustomInfoInterface {
  CONFIRMATION_TEXT_REQUIRED?: string;
}
// #endregion

// #region Success Messages
interface SuccessMessages {
  delete?: CustomSuccessInterface;
}

interface CustomSuccessInterface {
  DELETE_SUCCESS?: string;
}
// #endregion
