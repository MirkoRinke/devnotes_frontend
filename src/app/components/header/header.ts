import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageNavigation } from '../page-navigation/page-navigation';

@Component({
  selector: 'app-header',
  imports: [RouterModule, PageNavigation],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
