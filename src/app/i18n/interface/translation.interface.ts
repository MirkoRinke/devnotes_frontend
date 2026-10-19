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
import { LoadingMessagesInterface } from './components/loading.interface';
import { NoResultsMessagesInterface } from './components/no-results.interface';
import { TechTileMessagesInterface } from './components/tech-tile.interface';
import { SectionStepperMessagesInterface } from './components/section-stepper.interface';
import { FavoritesRefreshButtonMessagesInterface } from './components/favorites-refresh-button.interface';
import { PostListMessagesInterface } from './components/posts-list.interface';
import { PostListQueryBarMessagesInterface } from './components/post-list-query-bar.interface';
import { PostListElementMessagesInterface } from './components/post-list-element.interface';
import { SectionPaginationMessagesInterface } from './components/section-pagination.interface';
import { UserAvatarCustomizerMessagesInterface } from './components/user-avatar-customizer.interface';
import { UserAvatarAltMessagesInterface } from './components/user-avatar-alt.interface';
import { DropdownComponentMessagesInterface } from './components/dropdown-component.interface';
import { DatepickerMessagesInterface } from './components/datepicker.interface';
import { LoginMessagesInterface } from './components/login.interface';
import { AccountUpdateMessagesInterface } from './components/account-update.interface';
import { DeleteAccountMessagesInterface } from './components/delete-account.interface';
import { RegisterMessagesInterface } from './components/register.interface';
import { LegalAcceptanceMessagesInterface } from './components/legal-acceptance.interface';
import { PasswordStrengthFeedbackInterface } from './components/password-strength-feedback.interface';
import { PasswordToggleButtonInterface } from './components/password-toggle-button.interface';
import { ReportModalMessagesInterface } from './components/report-modal.interface';
import { ReportButtonMessagesInterface } from './components/report-button.interface';

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
  Loading: LoadingMessagesInterface;
  NoResults: NoResultsMessagesInterface;
  TechTile: TechTileMessagesInterface;
  SectionStepper: SectionStepperMessagesInterface;
  FavoritesRefreshButton: FavoritesRefreshButtonMessagesInterface;
  PostList: PostListMessagesInterface;
  PostListQueryBar: PostListQueryBarMessagesInterface;
  PostListElement: PostListElementMessagesInterface;
  SectionPagination: SectionPaginationMessagesInterface;
  UserAvatarCustomizer: UserAvatarCustomizerMessagesInterface;
  UserAvatarAlt: UserAvatarAltMessagesInterface;
  DropdownComponent: DropdownComponentMessagesInterface;
  Datepicker: DatepickerMessagesInterface;
  Login: LoginMessagesInterface;
  AccountUpdate: AccountUpdateMessagesInterface;
  DeleteAccount: DeleteAccountMessagesInterface;
  Register: RegisterMessagesInterface;
  LegalAcceptance: LegalAcceptanceMessagesInterface;
  PasswordStrengthFeedback: PasswordStrengthFeedbackInterface;
  PasswordToggleButton: PasswordToggleButtonInterface;
  ReportModal: ReportModalMessagesInterface;
  ReportButton: ReportButtonMessagesInterface;
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
