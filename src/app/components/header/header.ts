import { Component } from '@angular/core';

import { PageNavigation } from '../page-navigation/page-navigation';
import { UserControlArea } from '../user-control-area/user-control-area';
import { HomeButton } from '../home-button/home-button';

@Component({
  selector: 'app-header',
  imports: [PageNavigation, UserControlArea, HomeButton],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
