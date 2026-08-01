import { Component } from '@angular/core';
import { DeleteAccount } from '../../components/auth/delete-account/delete-account';

@Component({
  selector: 'app-account-deletion',
  imports: [DeleteAccount],
  templateUrl: './account-deletion.html',
  styleUrl: './account-deletion.scss',
})
export class AccountDeletion {}
