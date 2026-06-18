import type { ErrorTypeInterface } from './validation-messages';

export interface ValidationErrorsInterface {
  [key: string]: string[];
}

export interface BackendErrorResponseInterface {
  status: 'error';
  message: string;
  code: number;
  errors: string | string[] | ValidationErrorsInterface;
  meta?: {
    total_queries: number;
    queries?: any[];
  };
}

export interface ParamsInterface {
  [key: string]: number | string;
}

export interface ErrorMessageInterface {
  message: string;
  validatorKey: string;
  params?: ParamsInterface;
  messageType: keyof ErrorTypeInterface;
}

export interface LoginFormErrorsInterface {
  mustAcceptConditions?: boolean;
}

export interface BusinessActionInterface extends LoginFormErrorsInterface {
  messages: ErrorMessageInterface;
}
