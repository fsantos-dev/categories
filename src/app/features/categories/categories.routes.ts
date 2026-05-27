import { Routes } from '@angular/router';
import { categoryExistsGuard } from '../../core/guards/category-exists.guard';

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/category-list/category-list.component').then(m => m.CategoryListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/category-form/category-form.component').then(m => m.CategoryFormComponent),
  },
  {
    path: ':id/edit',
    canActivate: [categoryExistsGuard],
    loadComponent: () =>
      import('./pages/category-form/category-form.component').then(m => m.CategoryFormComponent),
  },
];
