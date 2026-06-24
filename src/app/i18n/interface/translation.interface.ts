import { GlobalMessagesInterface } from './global.interface';
import { AuthMessagesInterface } from './auth.interface';
import { PostTypesMessagesInterface } from './post-types.interface';
import { PostMessagesInterface } from './post.interface';

export interface Content extends ContentUI, Notifications {}

export interface ContentUI {
  PostTypes: PostTypesMessagesInterface;
}

export interface Notifications {
  Global: GlobalMessagesInterface;
  Auth: AuthMessagesInterface;
  Post: PostMessagesInterface;
}
