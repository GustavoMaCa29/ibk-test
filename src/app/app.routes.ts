import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  {
    path: 'users',
    loadChildren: () =>
      import('./components/user/user.routes').then((m) => m.userRoutes),
  },
  {
    path: 'posts',
    loadChildren: () =>
      import('./components/post/post.routes').then((m) => m.postRoutes),
  },
];
