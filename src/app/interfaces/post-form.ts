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

  language_or_tech_required?: boolean;
  syntax_highlighting?: boolean;
}

export interface TerminalLineInterface {
  text: string;
  level: 'info' | 'error' | 'success' | 'system';
}
