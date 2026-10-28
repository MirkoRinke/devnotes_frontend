export interface AuthMessagesInterface {
  error: AuthErrorMessages;
  info: AuthInfoMessages;
  success: AuthSuccessMessages;
}

// #region Error Messages
interface AuthErrorMessages {
  name: Pick<AuthFormFieldErrors, 'required' | 'minlength' | 'maxlength' | 'pattern' | 'tooMuchWhitespace' | 'userNameUnavailable'>;
  display_name: Pick<AuthFormFieldErrors, 'required' | 'minlength' | 'maxlength' | 'pattern' | 'tooMuchWhitespace' | 'userNameUnavailable'>;
  email: Pick<AuthFormFieldErrors, 'required' | 'email' | 'maxlength'>;
  email_confirmation: Pick<AuthFormFieldErrors, 'required' | 'email' | 'maxlength'>;
  identifier: Pick<AuthFormFieldErrors, 'required' | 'auth_identifier_invalid' | 'maxlength'>;
  password: Pick<AuthFormFieldErrors, 'required' | 'minlength' | 'maxlength' | 'weakPassword'>;
  password_confirmation: Pick<AuthFormFieldErrors, 'required' | 'minlength' | 'maxlength'>;
  current_password: Pick<AuthFormFieldErrors, 'required' | 'minlength' | 'maxlength'>;
  passwordMismatch: Pick<AuthFormFieldErrors, 'passwordMismatch'>;
  emailMismatch: Pick<AuthFormFieldErrors, 'emailMismatch'>;
  acceptedConditions: Pick<AuthFormFieldErrors, 'required'>;
  login: LoginActionErrors;
  deleteAccount: DeleteAccountErrors;
  register: RegisterActionErrors;
  accountSettings: AccountSettingsErrors;
}
interface AuthFormFieldErrors {
  required: string;
  minlength: string;
  maxlength: string;
  pattern: string;
  email: string;
  passwordMismatch: string;
  emailMismatch: string;
  auth_identifier_invalid: string;
  weakPassword: string;
  tooMuchWhitespace: string;
  userNameUnavailable: string;
}

interface BaseError {
  UNKNOWN_ERROR: string;
}
interface LoginActionErrors extends BaseError {
  CREDENTIALS_INCORRECT: string;
  ACCOUNT_SUSPENDED: string;
}

interface RegisterActionErrors extends BaseError {
  FORBIDDEN_NAME: string;
  FORBIDDEN_DISPLAY_NAME: string;
  EMAIL_ALREADY_IN_USE: string;
  PASSWORD_MUST_BE_UNCOMPROMISED: string;

  NAME_ALREADY_IN_USE: string;
  DISPLAY_NAME_ALREADY_IN_USE: string;
}

interface DeleteAccountErrors extends BaseError {
  ACCOUNT_DELETION_INVALID_CREDENTIALS: string;
  ACCOUNT_DELETION_FORBIDDEN: string;
}

interface AccountSettingsErrors extends BaseError {
  PASSWORD_MUST_BE_UNCOMPROMISED: string;
  FORBIDDEN_NAME: string;

  NAME_ALREADY_IN_USE: string;
  EMAIL_ALREADY_IN_USE: string;

  INCORRECT_PASSWORD: string;
  EMAIL_CHANGE_RATE_LIMIT_EXCEEDED: string;
}

// #endregion

// #region Info Messages
interface AuthInfoMessages {
  login: LoginActionInfo;
  deleteAccount: DeleteAccountActionInfo;
  register: RegisterActionInfo;
  accountSettings: AccountSettingsInfo;
}

interface LoginActionInfo {
  MUST_ACCEPT_CONDITIONS: string;
  EMAIL_NOT_VERIFIED: string;
}

interface RegisterActionInfo {
  tooMuchWhitespace: string;

  NAME_ALREADY_IN_USE: string;
  DISPLAY_NAME_ALREADY_IN_USE: string;
}

interface DeleteAccountActionInfo {
  DELETE_ACCOUNT_CONFIRMATION: string;
}

interface AccountSettingsInfo {
  tooMuchWhitespace: string;
  NAME_ALREADY_IN_USE: string;
  NO_CHANGES: string;
}

// #endregion

// #region Success Messages
interface AuthSuccessMessages {
  login: LoginActionSuccess;
  deleteAccount: DeleteAccountActionSuccess;
  acceptedConditions: ConditionsActionSuccess;
  register: RegisterActionSuccess;
  accountSettings: AccountSettingsSuccess;
}

interface LoginActionSuccess {
  LOGIN_SUCCESSFUL: string;
}

interface RegisterActionSuccess {
  REGISTER_SUCCESSFUL: string;
  NAME_AVAILABLE: string;
  DISPLAY_NAME_AVAILABLE: string;
}

interface DeleteAccountActionSuccess {
  DELETE_ACCOUNT_SUCCESSFUL: string;
}

interface AccountSettingsSuccess {
  ACCOUNT_SETTINGS_UPDATED: string;
  ACCOUNT_SETTINGS_UPDATED_EMAIL: string;
  NAME_AVAILABLE: string;
}

interface ConditionsActionSuccess {
  ACCEPTED_CONDITIONS: string;
}
// #endregion
