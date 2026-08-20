import { GlobalMessagesInterface } from './global.interface';
import { AuthMessagesInterface } from './auth.interface';
import { PostMessagesInterface } from './post.interface';
import { ImprintMessagesInterface } from './imprint.interface';
import { PrivacyMessagesInterface } from './privacy.interface';
import { TermsMessagesInterface } from './terms.interface';

import { HomeButtonMessagesInterface } from './components/home-buttom.interface';
import { PostTypesMessagesInterface } from './components/post-types.interface';
import { SearchButtonMessagesInterface } from './components/search-button.interface';
import { ControlUserBadgeMessagesInterface } from './components/control-user-badge.interface';
import { PageNavigationMessagesInterface } from './components/page-navigation.interface';

export interface Content extends ContentUI, LegalContent, Notifications {}

export interface ContentUI {
  HomeButton: HomeButtonMessagesInterface;
  PostTypes: PostTypesMessagesInterface;
  SearchButton: SearchButtonMessagesInterface;
  ControlUserBadge: ControlUserBadgeMessagesInterface;
  PageNavigation: PageNavigationMessagesInterface;
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
