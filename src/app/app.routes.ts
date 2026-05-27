import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'categories', pathMatch: 'full' }, //la rut debe coincidir en su totalidad

    //carga perezoza permite solo cargar la ruta cuando se necesita
    {
        path: 'categories',
        loadChildren: () =>
            import('./features/categories/categories.routes').then(m => m.CATEGORIES_ROUTES),
    },

    //cualquier cosa que escriba y no encuentre me redirecciona a la pagina principl de la lista de catgorias
    { path: '**', redirectTo: 'categories' },
];
