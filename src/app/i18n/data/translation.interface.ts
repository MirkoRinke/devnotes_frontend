import { Auth } from './auth.interface';
import { PostTypes } from './post-types.interface';

export interface Content {
  PostTypes: PostTypes;
  Auth: Auth;
}
