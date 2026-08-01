import { Component } from '@angular/core';
import { LoginForm } from '../../components/auth/login-form/login-form';

@Component({
  selector: 'app-agreement',
  imports: [LoginForm],
  templateUrl: './agreement.html',
  styleUrl: './agreement.scss',
})
export class Agreement {}
