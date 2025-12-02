import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Community } from './pages/community/community';
import { Login } from './pages/login/login';
import { PostTypesSelection } from './pages/post-types-selection/post-types-selection';
import { PostsList } from './pages/posts-list/posts-list';
import { Post } from './pages/post/post';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'community', component: Community },
  { path: 'login', component: Login },
  { path: 'post-types-selection', component: PostTypesSelection },
  { path: 'posts-list', component: PostsList },
  { path: 'post', component: Post },
];
