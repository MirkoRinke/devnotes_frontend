import type { PostInterface } from './post';

export interface TechStackSelectedValueInterface {
  name: string;
  entity: string;
}

export interface resourceRefreshInterface {
  updatedPost: PostInterface;
  entity: string | null;
  entityValue: string | null;
}
