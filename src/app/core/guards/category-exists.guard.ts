
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { CategoryService } from '../services/category.service';

export const categoryExistsGuard: CanActivateFn = (route) => {
  const service = inject(CategoryService);
  const router = inject(Router);
  const id = route.paramMap.get('id')!;

  return service.getById(id).pipe(
    map(category => (category ? true : router.createUrlTree(['/categories']))) //si encuentra el id redirccionelo a el
    //de lo contrario todo lo que no corresponda a un id valido lo redireccionamos a la ruta principal de la lista de categorias
  );
};



// CanActivateFn	Entrar a una ruta
// CanActivateChildFn	Entrar a rutas hijas
// CanDeactivateFn	Salir de una ruta
// CanMatchFn	Decidir si una ruta hace match