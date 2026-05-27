import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { delay, map, take } from 'rxjs/operators';
import { Category, CategoryStatus } from "../models/category.model";

const DATA: Category[] = [
    { id: '1', code: 'CAT001', name: 'Ropa y Accesorios', description: 'Prendas de vestir y accesorios de moda', status: 'inactive' },
    { id: '2', code: 'CAT002', name: 'Alimentos', description: 'Productos alimenticios y bebidas', status: 'inactive' },
    { id: '3', code: 'CAT003', name: 'Deportes', description: 'Articulos y equipamiento deportivo', status: 'inactive' },
    { id: '4', code: 'CAT004', name: 'Hogar y Jardin', description: 'Productos alimenticios y bebidas', status: 'inactive' },
    { id: '5', code: 'CAT005', name: 'Eletrónica', description: 'Dispositivos y componentes electrónicos', status: 'inactive' },
];

@Injectable({ providedIn: 'root' })
export class CategoryService {
    private readonly store$ = new BehaviorSubject<Category[]>(DATA);


    getAll(): Observable<Category[]> {
        return this.store$.asObservable().pipe(take(1), delay(500));
    }

    getById(id: string): Observable<Category | undefined> {
        return this.store$.pipe(
            take(1),
            map(cats => cats.find((cat => cat.id === id))),
            delay(200)
        );
    }

    create(data: Omit<Category, 'id'>): Observable<Category> {
        const category: Category = { ...data, id: Date.now().toString() };
        this.store$.next([...this.store$.value, category]);
        return of(category).pipe(delay(400))
    }

    update(id: string, data: Omit<Category, 'id'>): Observable<Category> {
    const categories = this.store$.value.map(c => (c.id === id ? { ...c, ...data } : c));
    this.store$.next(categories);
    return of(categories.find(c => c.id === id)!).pipe(delay(400));
  }


    delete(id: string): Observable<void> {
        const categories = this.store$.value.filter(cat => cat.id !== id);
        this.store$.next(categories);
        return of(void 0).pipe(delay(300));
    }

    toggleStatus(id: string): Observable<Category> {
        const categories = this.store$.value.map(
            cat => cat.id === id
                ? { ...cat, status: (cat.status === 'active' ? 'inactive' : 'active') as CategoryStatus }
                : cat
        );
         this.store$.next(categories);
        return of(categories.find(cat => cat.id === id)!).pipe(delay(300));
    }
}
