export interface PasswordStrengthFeedbackInterface {
  hasUpperCase: string;
  hasLowerCase: string;
  hasNumber: string;
  hasSpecialChar: string;
  srOnly: {
    hasUpperCaseMet: string;
    hasUpperCaseNotMet: string;
    hasLowerCaseMet: string;
    hasLowerCaseNotMet: string;
    hasNumberMet: string;
    hasNumberNotMet: string;
    hasSpecialCharMet: string;
    hasSpecialCharNotMet: string;
  };
  ariaLabel: {};
}
