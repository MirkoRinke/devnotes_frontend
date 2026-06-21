import { AuthMessagesInterface } from './auth.interface';
import { PostTypesMessagesInterface } from './post-types.interface';
import { PostMessagesInterface } from './post.interface';

export interface Content {
  Auth: AuthMessagesInterface;
  PostTypes: PostTypesMessagesInterface;
  Post: PostMessagesInterface;
}
