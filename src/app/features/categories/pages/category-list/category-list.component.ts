import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmationService, MessageService } from 'primeng/api';

import { CategoryService } from '../../../../core/services/category.service';
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    ToolbarModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    SkeletonModule,
    IconFieldModule,
    InputIconModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  categories = signal<Category[]>([]);
  searchTerm = signal('');
  loading = signal(true);
  hasError = signal(false);

  filteredCategories = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.categories();
    return this.categories().filter(
      c =>
        c.name.toLowerCase().includes(term) ||
        c.code.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.hasError.set(false);
    this.categoryService
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: cats => this.categories.set(cats),
        error: () => {
          this.hasError.set(true);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las categorías.',
          });
        },
      });
  }

  navigateToCreate(): void {
    this.router.navigate(['/categories/new']);
  }

  navigateToEdit(category: Category): void {
    this.router.navigate(['/categories', category.id, 'edit']);
  }

  confirmDelete(category: Category): void {
    this.confirmationService.confirm({
      message: `¿Deseas eliminar la categoría "<strong>${category.name}</strong>"? Esta acción no se puede deshacer.`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteCategory(category),
    });
  }

  private deleteCategory(category: Category): void {
    this.categoryService.delete(category.id).subscribe({
      next: () => {
        this.categories.update(cats => cats.filter(c => c.id !== category.id));
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminada',
          detail: `La categoría "${category.name}" fue eliminada.`,
        });
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la categoría.',
        }),
    });
  }

  confirmToggleStatus(category: Category): void {
    const action = category.status === 'active' ? 'desactivar' : 'activar';
    this.confirmationService.confirm({
      message: `¿Deseas ${action} la categoría "<strong>${category.name}</strong>"?`,
      header: 'Confirmar cambio de estado',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => this.toggleStatus(category),
    });
  }

  toggleStatus(category: Category): void {
    this.categoryService.toggleStatus(category.id).subscribe({
      next: updated => {
        this.categories.update(cats =>
          cats.map(c => (c.id === updated.id ? updated : c))
        );
        const label = updated.status === 'active' ? 'activada' : 'desactivada';
        this.messageService.add({
          severity: 'success',
          summary: 'Estado actualizado',
          detail: `La categoría fue ${label} correctamente.`,
        });
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cambiar el estado.',
        }),
    });
  }

  getSeverity(status: string): 'success' | 'danger' {
    return status === 'active' ? 'success' : 'danger';
  }

  getStatusLabel(status: string): string {
    return status === 'active' ? 'Activa' : 'Inactiva';
  }
}
