import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, finalize } from 'rxjs';
import { EquipmentService } from '../services/equipment';
import { Equipment } from '../interfaces/equipment.interface';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css'],
})
export class Shop implements OnInit {
  private readonly equipmentService = inject(EquipmentService);
  private readonly route = inject(ActivatedRoute);

  protected readonly equipmentListe = signal<Equipment[]>([]);
  protected readonly isLoading = signal<boolean>(true);

  protected readonly loadError = signal<string | null>(null);
  protected readonly actionError = signal<string | null>(null);

  protected readonly isSaving = signal<boolean>(false);

  protected readonly searchTerm = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('suche') ?? '')),
    { initialValue: '' },
  );

  protected readonly selectedCategory = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('kategorie') ?? 'all')),
    { initialValue: 'all' },
  );

  protected readonly filteredEquipmentListe = computed<Equipment[]>(() => {
    const rawSearch = this.searchTerm().toLowerCase().trim();
    const selectedCategory = this.selectedCategory();
    const dataSet = this.equipmentListe();

    if (!rawSearch && selectedCategory === 'all') {
      return dataSet;
    }

    return dataSet.filter((equipment: Equipment) => {
      const matchesSearch =
        !rawSearch ||
        equipment.name.toLowerCase().includes(rawSearch) ||
        (equipment.description || '').toLowerCase().includes(rawSearch);

      const matchesCategory =
        selectedCategory === 'all' || equipment.subCategory === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  });

  public ngOnInit(): void {
    this.fetchEquipmentInventory();
  }

  private fetchEquipmentInventory(): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.equipmentService.getEquipment().subscribe({
      next: (data: Equipment[]) => {
        this.equipmentListe.set(data);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        console.error('[ShopCore] Fehler beim Laden des Inventars:', error);
        this.loadError.set('Verbindung zum Server fehlgeschlagen.');
        this.isLoading.set(false);
      },
    });
  }

  public rentEquipment(id: string): void {
    if (this.isSaving()) {
      return;
    }

    this.isSaving.set(true);

    this.equipmentService
      .rentEquipment(id)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: (updatedEquipment: Equipment) => {
          this.equipmentListe.update((items: Equipment[]) =>
            items.map((item) => (item._id === updatedEquipment._id ? updatedEquipment : item)),
          );
          this.actionError.set(null);
        },
        error: (error: unknown) => {
          console.error('[ShopCore] Miete fehlgeschlagen:', error);
          this.actionError.set('Miete des Produkts fehlgeschlagen.');
        },
      });
  }
}
