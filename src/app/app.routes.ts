import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { CommunityHome } from './pages/community-home/community-home';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'community-home', component: CommunityHome },
  { path: 'login', component: Login },
];
