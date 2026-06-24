import { Content } from '../interface/translation.interface';
import { CONTENT_UI_EN } from './content-ui.en';
import { NOTIFICATIONS_EN } from './notifications.en';

export const CONTENT_EN: Content = {
  ...CONTENT_UI_EN,
  ...NOTIFICATIONS_EN,
};
