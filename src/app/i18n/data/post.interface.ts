export interface PostMessagesInterface {
  error: ErrorMessages;
  info: InfoMessages;
  success: SuccessMessages;
}

// #region Error Messages
interface ErrorMessages {
  delete?: CustomErrorMessages;

  post_type?: CustomErrorMessages;
  category?: CustomErrorMessages;
  syntax_highlighting?: CustomErrorMessages;
  status?: CustomErrorMessages;
  title?: CustomErrorMessages;
  description?: CustomErrorMessages;
  code?: CustomErrorMessages;
  language_or_tech_required?: CustomErrorMessages;
}

interface CustomErrorMessages {
  UNKNOWN_ERROR: string;
  NO_PERMISSION?: string;
  CONFIRMATION_TEXT_MISMATCH?: string;
  E?: string;
  syntax_highlighting_required?: string;
}
// #endregion

// #region Info Messages
interface InfoMessages {
  delete?: CustomInfoInterface;
  syntax_highlighting?: CustomInfoInterface;
}

interface CustomInfoInterface {
  CONFIRMATION_TEXT_REQUIRED?: string;
  syntax_highlighting_required?: string;
}
// #endregion

// #region Success Messages
interface SuccessMessages {
  delete?: CustomSuccessInterface;
  errorCode?: CustomSuccessInterface;
}

interface CustomSuccessInterface {
  DELETE_SUCCESS?: string;
}
// #endregion
