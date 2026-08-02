import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageNavigation } from '../page-navigation/page-navigation';
import { UserControlArea } from '../user-control-area/user-control-area';

@Component({
  selector: 'app-header',
  imports: [RouterModule, PageNavigation, UserControlArea],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
