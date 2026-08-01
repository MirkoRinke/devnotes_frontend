import { Component } from '@angular/core';
import { UserAccountSettings } from '../../components/auth/user-account-settings/user-account-settings';

@Component({
  selector: 'app-account-settings',
  imports: [UserAccountSettings],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.scss',
})
export class AccountSettings {}
