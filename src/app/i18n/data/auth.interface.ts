export interface AuthMessagesInterface {
  error: ErrorMessages;
  info: InfoMessages;
  success: SuccessMessages;
}

// #region Error Messages
interface ErrorMessages {
  identifier?: FormErrorsInterface;
  password?: FormErrorsInterface;
  acceptedConditions?: FormErrorsInterface;
  login?: CustomErrorMessages;
  deleteAccount?: CustomErrorMessages;
}

interface FormErrorsInterface {
  required?: string;
  minlength?: string;
  maxlength?: string;
  login_identifier_invalid?: string;
  delete_account_identifier_invalid?: string;
}

interface CustomErrorMessages {
  UNKNOWN_ERROR: string;
  CREDENTIALS_INCORRECT?: string;
  ACCOUNT_DELETION_INVALID_CREDENTIALS?: string;
  ACCOUNT_DELETION_FORBIDDEN?: string;
  ACCOUNT_SUSPENDED?: string;
}
// #endregion

// #region Info Messages
interface InfoMessages {
  login?: CustomInfoInterface;
  deleteAccount?: CustomInfoInterface;
}

interface CustomInfoInterface {
  MUST_ACCEPT_CONDITIONS?: string;
  DELETE_ACCOUNT_CONFIRMATION?: string;
}
// #endregion

// #region Success Messages
interface SuccessMessages {
  login?: CustomSuccessInterface;
  deleteAccount?: CustomSuccessInterface;
  acceptedConditions?: CustomSuccessInterface;
}

interface CustomSuccessInterface {
  LOGIN_SUCCESSFUL?: string;
  DELETE_ACCOUNT_SUCCESSFUL?: string;
  ACCEPTED_CONDITIONS?: string;
}
// #endregion
