import { Component } from '@angular/core';
import { DeleteAccountForm } from '../../components/auth/delete-account-form/delete-account-form';

@Component({
  selector: 'app-account-deletion',
  imports: [DeleteAccountForm],
  templateUrl: './account-deletion.html',
  styleUrl: './account-deletion.scss',
})
export class AccountDeletion {}
