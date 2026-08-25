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
import { ControlUserMenuMessagesInterface } from './components/control-user-menu.interface';
import { LegalMobileMessagesInterface } from './components/legal-mobile.interface';
import { SearchMessagesInterface } from './components/search.interface';
import { CreatorLinksMessagesInterface } from './components/creator-links.interface';
import { CopyrightMessagesInterface } from './components/copyright.interface';
import { LegalLinksMessagesInterface } from './components/legal-links.interface';

export interface Content extends ContentUI, LegalContent, Notifications {}

export interface ContentUI {
  HomeButton: HomeButtonMessagesInterface;
  PostTypes: PostTypesMessagesInterface;
  SearchButton: SearchButtonMessagesInterface;
  ControlUserBadge: ControlUserBadgeMessagesInterface;
  PageNavigation: PageNavigationMessagesInterface;
  ControlUserMenu: ControlUserMenuMessagesInterface;
  Search: SearchMessagesInterface;
  LegalMobile: LegalMobileMessagesInterface;
  CreatorLinks: CreatorLinksMessagesInterface;
  Copyright: CopyrightMessagesInterface;
  LegalLinks: LegalLinksMessagesInterface;
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
