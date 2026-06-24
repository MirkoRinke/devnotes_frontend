export interface AuthMessagesInterface {
  error: AuthErrorMessages;
  info: AuthInfoMessages;
  success: AuthSuccessMessages;
}

// #region Error Messages
interface AuthErrorMessages {
  identifier: Pick<AuthFormFieldErrors, 'required' | 'login_identifier_invalid' | 'maxlength'>;
  password: Pick<AuthFormFieldErrors, 'required' | 'minlength' | 'maxlength'>;
  acceptedConditions: Pick<AuthFormFieldErrors, 'required'>;
  login: LoginActionErrors;
  deleteAccount: DeleteAccountErrors;
}
interface AuthFormFieldErrors {
  required: string;
  minlength: string;
  maxlength: string;
  login_identifier_invalid: string;
  delete_account_identifier_invalid: string;
}

interface BaseError {
  UNKNOWN_ERROR: string;
}
interface LoginActionErrors extends BaseError {
  CREDENTIALS_INCORRECT: string;
  ACCOUNT_SUSPENDED: string;
}
interface DeleteAccountErrors extends BaseError {
  ACCOUNT_DELETION_INVALID_CREDENTIALS: string;
  ACCOUNT_DELETION_FORBIDDEN: string;
}

// #endregion

// #region Info Messages
interface AuthInfoMessages {
  login: LoginActionInfo;
  deleteAccount: DeleteAccountActionInfo;
}

interface LoginActionInfo {
  MUST_ACCEPT_CONDITIONS: string;
}
interface DeleteAccountActionInfo {
  DELETE_ACCOUNT_CONFIRMATION: string;
}
// #endregion

// #region Success Messages
interface AuthSuccessMessages {
  login: LoginActionSuccess;
  deleteAccount: DeleteAccountActionSuccess;
  acceptedConditions: ConditionsActionSuccess;
}

interface LoginActionSuccess {
  LOGIN_SUCCESSFUL: string;
}

interface DeleteAccountActionSuccess {
  DELETE_ACCOUNT_SUCCESSFUL: string;
}

interface ConditionsActionSuccess {
  ACCEPTED_CONDITIONS: string;
}
// #endregion
