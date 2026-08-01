import { Component } from '@angular/core';
import { LoginForm } from '../../components/auth/login-form/login-form';

@Component({
  selector: 'app-login',
  imports: [LoginForm],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {}
