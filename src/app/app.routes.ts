import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Community } from './pages/community/community';
import { Login } from './pages/login/login';
import { PostTypesSelection } from './pages/post-types-selection/post-types-selection';
import { PostsList } from './pages/posts-list/posts-list';
import { Post } from './pages/post/post';
import { Favorites } from './pages/favorites/favorites';
import { Network } from './pages/network/network';
import { MyArea } from './pages/my-area/my-area';
import { UserProfile } from './pages/user-profile/user-profile';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'my-area', component: MyArea },
  { path: 'favorites', component: Favorites },
  { path: 'network', component: Network },
  { path: 'community', component: Community },
  { path: 'login', component: Login },
  { path: 'post-types-selection', component: PostTypesSelection },
  { path: 'posts-list', component: PostsList },
  { path: 'post/:id', component: Post },
  { path: 'user-profile/:id', component: UserProfile },
];
