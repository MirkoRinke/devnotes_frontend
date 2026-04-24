import type { PostInterface } from './post';

export interface TechStackSelectedValueInterface {
  name: string;
  entity: string;
}

export interface ResourceRefreshInterface {
  updatedPost: PostInterface;
  entity: string | null;
  entityValue: string | null;
}

export interface PostFormErrorsInterface {
  required?: boolean;
  maxlength?: { requiredLength: number; actualLength: number };
  minlength?: { requiredLength: number; actualLength: number };

  languageOrTechRequired?: boolean;
  syntaxHighlighting?: boolean;
}

export interface TerminalLineInterface {
  text: string;
  level: 'info' | 'error' | 'success' | 'system';
}
