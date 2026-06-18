export interface Auth {
  error: ErrorMessages;
  info: InfoMessages;
  success: SuccessMessages;
}

// #region Error Messages
interface ErrorMessages {
  identifier?: FormErrorsInterface & CustomErrorMessages;
  password?: FormErrorsInterface & CustomErrorMessages;
  acceptedConditions?: FormErrorsInterface & CustomErrorMessages;
  login?: FormErrorsInterface & CustomErrorMessages;
  deleteAccount?: FormErrorsInterface & CustomErrorMessages;
}

interface FormErrorsInterface {
  required?: string;
  minlength?: string;
  maxlength?: string;
  login_identifier_invalid?: string;
  delete_account_identifier_invalid?: string;
}

interface CustomErrorMessages {
  UNKNOWN_ERROR?: string;
  CREDENTIALS_INCORRECT?: string;
  MUST_ACCEPT_CONDITIONS?: string;
  ACCOUNT_DELETION_FORBIDDEN?: string;
  ACCOUNT_SUSPENDED?: string;
}
// #endregion

// #region Success Messages
interface SuccessMessages {
  login?: CustomSuccessInterface;
  acceptedConditions?: CustomSuccessInterface;
}

interface CustomSuccessInterface {
  SUCCESSFUL?: string;
  ACCEPTED_CONDITIONS?: string;
}
// #endregion

// #region Info Messages
interface InfoMessages {
  login?: CustomInfoInterface;
}

interface CustomInfoInterface {
  MUST_ACCEPT_CONDITIONS?: string;
}
// #endregion
