import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';

import { CategoryService } from '../../../../core/services/category.service';
import { Category, CategoryStatus } from '../../../../core/models/category.model';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    CardModule,
    ToastModule,
    MessageModule,
    SkeletonModule,
  ],
  providers: [MessageService],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
})
export class CategoryFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);
  private readonly messageService = inject(MessageService);

  editingCategory = signal<Category | null>(null);
  isEditMode = signal(false);
  loading = signal(false);
  saving = signal(false);

  statusOptions: { label: string; value: CategoryStatus }[] = [
    { label: 'Activa', value: 'active' },
    { label: 'Inactiva', value: 'inactive' },
  ];

  form = this.fb.group({
    code: ['', [Validators.required, Validators.maxLength(20)]],
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(255)]],
    status: ['active' as CategoryStatus, [Validators.required]],
  });

  get code() { return this.form.get('code')!; }
  get name() { return this.form.get('name')!; }
  get description() { return this.form.get('description')!; }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.loadCategory(id);
    }
  }

  private loadCategory(id: string): void {
    this.loading.set(true);
    this.categoryService
      .getById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(category => {
        if (category) {
          this.editingCategory.set(category);
          this.form.patchValue(category);
        }
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const value = this.form.getRawValue() as Omit<Category, 'id'>;
    const editing = this.editingCategory();

    const operation$ = editing
      ? this.categoryService.update(editing.id, value)
      : this.categoryService.create(value);

    operation$.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: `Categoría ${editing ? 'actualizada' : 'creada'} correctamente.`,
          life: 1500,
        });
        setTimeout(() => this.router.navigate(['/categories']), 1500);
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar la categoría.',
        }),
    });
  }

  cancel(): void {
    this.router.navigate(['/categories']);
  }
}
