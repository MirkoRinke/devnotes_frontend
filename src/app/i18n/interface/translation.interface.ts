import { GlobalMessagesInterface } from './global.interface';
import { AuthMessagesInterface } from './auth.interface';
import { PostTypesMessagesInterface } from './post-types.interface';
import { PostMessagesInterface } from './post.interface';
import { ImprintMessagesInterface } from './imprint.interface';
import { PrivacyMessagesInterface } from './privacy.interface';
import { TermsMessagesInterface } from './terms.interface';

export interface Content extends ContentUI, LegalContent, Notifications {}

export interface ContentUI {
  PostTypes: PostTypesMessagesInterface;
}

export interface LegalContent {
  Imprint: ImprintMessagesInterface;
  Privacy: PrivacyMessagesInterface;
  Terms: TermsMessagesInterface;
}

export interface Notifications {
  Global: GlobalMessagesInterface;
  Auth: AuthMessagesInterface;
  Post: PostMessagesInterface;
}
