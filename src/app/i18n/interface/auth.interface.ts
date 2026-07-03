export interface AuthMessagesInterface {
  error: AuthErrorMessages;
  info: AuthInfoMessages;
  success: AuthSuccessMessages;
}

// #region Error Messages
interface AuthErrorMessages {
  name: Pick<AuthFormFieldErrors, 'required' | 'minlength' | 'maxlength' | 'pattern'>;
  display_name: Pick<AuthFormFieldErrors, 'required' | 'minlength' | 'maxlength' | 'pattern'>;
  email: Pick<AuthFormFieldErrors, 'required' | 'email' | 'maxlength'>;
  identifier: Pick<AuthFormFieldErrors, 'required' | 'login_identifier_invalid' | 'maxlength'>;
  password: Pick<AuthFormFieldErrors, 'required' | 'minlength' | 'maxlength' | 'weakPassword'>;
  password_confirmation: Pick<AuthFormFieldErrors, 'required' | 'minlength' | 'maxlength'>;
  passwordMismatch: Pick<AuthFormFieldErrors, 'passwordMismatch'>;
  acceptedConditions: Pick<AuthFormFieldErrors, 'required'>;
  login: LoginActionErrors;
  deleteAccount: DeleteAccountErrors;
  register: RegisterActionErrors;
}
interface AuthFormFieldErrors {
  required: string;
  minlength: string;
  maxlength: string;
  pattern: string;
  email: string;
  passwordMismatch: string;
  login_identifier_invalid: string;
  delete_account_identifier_invalid: string;
  weakPassword: string;
}

interface BaseError {
  UNKNOWN_ERROR: string;
}
interface LoginActionErrors extends BaseError {
  CREDENTIALS_INCORRECT: string;
  ACCOUNT_SUSPENDED: string;
}

interface RegisterActionErrors extends BaseError {
  VALIDATION_FAILED: string;
  NAME_ALREADY_IN_USE: string;
  DISPLAY_NAME_ALREADY_IN_USE: string;
  FORBIDDEN_NAME: string;
  FORBIDDEN_DISPLAY_NAME: string;
  EMAIL_ALREADY_IN_USE: string;
  PASSWORD_MUST_BE_UNCOMPROMISED: string;
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
  register: RegisterActionSuccess;
}

interface LoginActionSuccess {
  LOGIN_SUCCESSFUL: string;
}

interface RegisterActionSuccess {
  REGISTER_SUCCESSFUL: string;
}

interface DeleteAccountActionSuccess {
  DELETE_ACCOUNT_SUCCESSFUL: string;
}

interface ConditionsActionSuccess {
  ACCEPTED_CONDITIONS: string;
}
// #endregion
