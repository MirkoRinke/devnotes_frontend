import { Component } from '@angular/core';
import { UserAvatarCustomizer } from '../../components/user-avatar-customizer/user-avatar-customizer';
import { UserAccountSettings } from '../../components/user-account-settings/user-account-settings';

@Component({
  selector: 'app-user-settings',
  imports: [UserAvatarCustomizer, UserAccountSettings],
  templateUrl: './user-settings.html',
  styleUrl: './user-settings.scss',
})
export class UserSettings {}
