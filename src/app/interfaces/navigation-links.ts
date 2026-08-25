import { PageContextEnums } from '../enums/context';

export interface NavigationLinksInterface {
  label: string;
  path: string;
  icon?: string;
  context?: PageContextEnums;
}
