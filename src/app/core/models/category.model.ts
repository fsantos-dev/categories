export interface Category {
    id: string;
    code: string;
    name: string;
    description: string;
    status: CategoryStatus;
}

export type CategoryStatus =  'active' | 'inactive'; //crea un tipo de dato prsonalizado, en este caso solo puede tener 2 valores

export interface CategoryFormValue {
    code: string;
    name: string;
    description: string;
    status: CategoryStatus;
}