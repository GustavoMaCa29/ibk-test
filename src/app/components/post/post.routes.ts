import { Routes } from '@angular/router';
import { PostListComponent } from './post-list/post-list.component';

export const postRoutes: Routes = [
  { path: ':userId', component: PostListComponent }
];