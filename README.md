# Categories Manager — Prueba Técnica Frontend Angular

Aplicación Angular para la gestión de categorías internas. Permite listar, crear, editar y cambiar el estado de cada categoría.

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm v9 o superior (incluido con Node.js)
- Angular CLI v21

```bash
npm install -g @angular/cli
```

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd categories

# 2. Instalar dependencias
npm install
```

---

## Ejecución

```bash
# Levantar servidor de desarrollo (http://localhost:4200)
npm start
```

```bash
# Compilar para producción
npm run build
```

```bash
# Ejecutar pruebas unitarias
npm test
```

---

## Arquitectura — Feature-Based Architecture

El proyecto sigue una **arquitectura basada en funcionalidades (Feature-Based)**, donde cada módulo de negocio agrupa sus propias páginas, rutas y componentes. El núcleo de la aplicación (modelos, servicios y guards) se centraliza en `core/`, garantizando separación de responsabilidades y facilidad de escalado.

---

## Estructura del proyecto

```
src/
└── app/
    ├── core/                               # Núcleo transversal de la aplicación
    │   ├── guards/
    │   │   └── category-exists.guard.ts    # Guard que valida la existencia de una categoría antes de activar la ruta de edición
    │   ├── models/
    │   │   └── category.model.ts           # Interfaces y tipos TypeScript del dominio (Category, CategoryStatus, CategoryFormValue)
    │   └── services/
    │       └── category.service.ts         # Servicio con BehaviorSubject que simula el backend (CRUD + toggleStatus)
    │
    ├── features/                           # Módulos de negocio de la aplicación
    │   └── categories/                     # Feature de gestión de categorías
    │       ├── pages/
    │       │   ├── category-list/          # Página de listado: tabla con búsqueda, editar y cambiar estado
    │       │   └── category-form/          # Página de formulario: creación y edición con Reactive Forms y validaciones
    │       └── categories.routes.ts        # Rutas lazy-loaded propias del feature
    │
    ├── app.ts                              # Componente raíz
    ├── app.html                            # Template raíz
    ├── app.routes.ts                       # Rutas principales (redirige a /categories)
    ├── app.config.ts                       # Configuración de la aplicación (providers, router)
    └── app.scss                            # Estilos del componente raíz

src/
├── styles.scss                             # Estilos globales y tema de PrimeNG
├── main.ts                                 # Bootstrap de la aplicación
└── index.html                              # HTML base
```

---

## Decisiones técnicas destacadas

| Aspecto | Decisión | Justificación |
|---|---|---|
| **Estado** | `BehaviorSubject` en el servicio | Simula un store reactivo sin dependencias externas; los componentes reciben siempre el valor más reciente |
| **Formularios** | Reactive Forms | Control fino de validaciones y estado del formulario desde el componente |
| **UI** | PrimeNG + PrimeIcons | Componentes accesibles y consistentes sin necesidad de construirlos desde cero |
| **Guard** | `categoryExistsGuard` (functional) | Evita acceder a `/categories/:id/edit` con un id inexistente; redirige a la lista |
| **Lazy loading** | `categories.routes.ts` cargado con `loadChildren` | Carga diferida del feature; mejora el tiempo de inicio de la aplicación |
| **Datos** | Mock en memoria con `delay()` simulado | Permite probar flujos de carga y error sin necesidad de un backend real |
