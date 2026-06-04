import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageNavigation } from '../page-navigation/page-navigation';

import { AuthService } from '../../services/auth.service';
import { LogoutService } from '../../services/logout.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, PageNavigation],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  constructor(
    public authService: AuthService,
    public logoutService: LogoutService,
  ) {}
}
