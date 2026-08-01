import { Component } from '@angular/core';
import { AccountUpdateForm } from '../../components/auth/account-update-form/account-update-form';

@Component({
  selector: 'app-account-settings',
  imports: [AccountUpdateForm],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.scss',
})
export class AccountSettings {}
