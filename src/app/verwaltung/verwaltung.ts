import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EquipmentService } from '../services/equipment';
import { Equipment } from '../interfaces/equipment.interface';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-verwaltung',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './verwaltung.html',
  styleUrl: './verwaltung.css',
})
export class Verwaltung implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly equipmentService = inject(EquipmentService);

  protected readonly title = signal('Equipment-Verwaltung');

  protected readonly equipmentListe = signal<Equipment[]>([]);
  protected readonly isLoading = signal<boolean>(true);

  protected readonly loadError = signal<string | null>(null);
  protected readonly actionError = signal<string | null>(null);

  protected readonly isSaving = signal<boolean>(false);

  protected readonly searchTerm = signal<string>('');
  protected readonly selectedCategory = signal<string>('all');

  // Zustand für die drei Modals (Erstellen, Bearbeiten, Löschen)
  protected readonly showCreateModal = signal<boolean>(false);
  protected readonly showEditModal = signal<boolean>(false);
  protected readonly selectedEquipment = signal<Equipment | null>(null);
  protected readonly showDeleteModal = signal<boolean>(false);

  protected readonly equipmentForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    category: ['', Validators.required],
    subCategory: ['', Validators.required],
    priceDay: [0, [Validators.required, Validators.min(0.01)]],
    quantity: [1, [Validators.required, Validators.min(0)]],
    description: [''],
  });

  protected readonly editEquipmentForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    category: ['', Validators.required],
    subCategory: ['', Validators.required],
    priceDay: [0, [Validators.required, Validators.min(0.01)]],
    quantity: [1, [Validators.required, Validators.min(0)]],
    description: [''],
  });

  /**
   * Ermittelt die vorhandenen Equipment-Kategorien dynamisch aus den geladenen Daten.
   * Nutzt computed(), damit die Liste nur bei tatsächlicher Änderung neu berechnet wird.
   */
  protected readonly dynamischeKategorien = computed<string[]>(() => {
    const alleKategorien = this.equipmentListe().map((item) => item.category || 'Allgemein');
    return [...new Set(alleKategorien)];
  });

  /**
   * Filtert die Equipment-Liste anhand von Suchbegriff und Kategorie.
   * Gibt bei leerem Suchbegriff und Kategorie "all" die ungefilterte Liste zurück.
   */
  protected readonly filteredEquipmentListe = computed<Equipment[]>(() => {
    const rawSearch = this.searchTerm().toLowerCase().trim();
    const selectedCategory = this.selectedCategory();
    const dataSet = this.equipmentListe();

    if (!rawSearch && selectedCategory === 'all') {
      return dataSet;
    }

    return dataSet.filter((equipment) => {
      const matchesSearch =
        !rawSearch ||
        equipment.name.toLowerCase().includes(rawSearch) ||
        (equipment.description || '').toLowerCase().includes(rawSearch);

      const matchesCategory =
        selectedCategory === 'all' || (equipment.category || 'Allgemein') === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  });

  public ngOnInit(): void {
    this.fetchEquipmentInventory();
  }

  /**
   * Lädt den aktuellen Equipment-Bestand vom Backend.
   * 
   */
  private fetchEquipmentInventory(): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.equipmentService.getEquipment().subscribe({
      next: (data: Equipment[]) => {
        this.equipmentListe.set(data);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        console.error('[Verwaltung] Fehler beim Laden des Inventars:', error);
        this.loadError.set('Verbindung zum Server fehlgeschlagen.');
        this.isLoading.set(false);
      },
    });
  }

  // --- Bearbeiten ---

  public openEditModal(equipment: Equipment): void {
    this.selectedEquipment.set(equipment);
    this.showDeleteModal.set(false);

    this.editEquipmentForm.patchValue({
      name: equipment.name,
      category: equipment.category,
      subCategory: equipment.subCategory,
      priceDay: equipment.priceDay,
      quantity: equipment.quantity,
      description: equipment.description,
    });
    this.showEditModal.set(true);
  }

  public onSubmitEdit(): void {
    const equipment = this.selectedEquipment();

    if (!equipment?._id || this.editEquipmentForm.invalid || this.isSaving()) {
      return;
    }

    this.isSaving.set(true);
    const updatedEquipment: Equipment = this.editEquipmentForm.value;

    this.equipmentService.updateEquipment(equipment._id, updatedEquipment)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: (updatedItem: Equipment) => {
          this.equipmentListe.update((items) =>
            items.map((item) => (item._id === updatedItem._id ? updatedItem : item)),
          );

          this.showEditModal.set(false);
          this.selectedEquipment.set(null);
          this.actionError.set(null);

          this.editEquipmentForm.reset({
            priceDay: 0,
            quantity: 1,
          });
        },
        error: (error: unknown) => {
          console.error('[Verwaltung] Aktualisierung fehlgeschlagen:', error);
          this.actionError.set('Aktualisierung des Equipments fehlgeschlagen.');
        },
      });
  }

  public closeEditModal(): void {
    this.showEditModal.set(false);
    this.selectedEquipment.set(null);

    this.editEquipmentForm.reset({
      priceDay: 0,
      quantity: 1,
    });
  }

  // --- Löschen ---

  public openDeleteModal(equipment: Equipment): void {
    this.selectedEquipment.set(equipment);
    this.showDeleteModal.set(true);
  }

  public closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.selectedEquipment.set(null);
  }

  public onConfirmDelete(): void {
    const equipment = this.selectedEquipment();

    if (!equipment?._id || this.isSaving()) {
      return;
    }

    this.isSaving.set(true);

    this.equipmentService.deleteEquipment(equipment._id)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: () => {
          this.equipmentListe.update((items) => items.filter((item) => item._id !== equipment._id));

          this.showDeleteModal.set(false);
          this.selectedEquipment.set(null);
          this.actionError.set(null);
        },
        error: (error: unknown) => {
          console.error('[Verwaltung] Löschen fehlgeschlagen:', error);
          this.actionError.set('Löschen des Equipments fehlgeschlagen.');
        },
      });
  }

  // --- Erstellen ---
  public toggleCreateModal(): void {
    this.showCreateModal.update((wert) => !wert);

    if (!this.showCreateModal()) {
      this.equipmentForm.reset({ priceDay: 0, quantity: 1 });
    }
  }

  public onSubmitCreate(): void {
    if (this.equipmentForm.invalid) {
      return;
    }

    const newEquipment: Equipment = this.equipmentForm.value;

    this.equipmentService.createEquipment(newEquipment).subscribe({
      next: (createdItem: Equipment) => {
        this.equipmentListe.update((items) => [...items, createdItem]);
        this.equipmentForm.reset({ priceDay: 0, quantity: 1 });
        this.showCreateModal.set(false);
      },
      error: (error: unknown) => {
        console.error('[Verwaltung] Erstellen fehlgeschlagen:', error);
        this.actionError.set('Erstellen des Equipments fehlgeschlagen.');
      },
    });
  }
}
