import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EquipmentService } from '../services/equipment';
import { Equipment } from '../interfaces/equipment.interface';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop implements OnInit {
  protected readonly equipmentListe = signal<Equipment[]>([]);
  protected readonly isLoading = signal<boolean>(true);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly searchTerm = signal<string>('');
  protected readonly selectedCategory = signal<string>('all');

  constructor(
    private readonly equipmentService: EquipmentService,
    private readonly route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.equipmentService.getEquipment().subscribe({
      next: (equipment: Equipment[]) => {
        this.equipmentListe.set(equipment);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        this.errorMessage.set('Fehler beim Laden der Ausrüstung: ' + error.message);
        this.isLoading.set(false);
      },
    });

    this.route.queryParams.subscribe((params) => {
      if (params['kategorie']) {
        this.selectedCategory.set(params['kategorie']);
      } else {
        this.selectedCategory.set('all');
      }
    });
  }

  public rentEquipment(id: string): void {
    this.equipmentService.rentEquipment(id).subscribe({
      next: (updatedEquipment: Equipment) => {
        this.equipmentListe.update((items) =>
          items.map((item) => (item._id === updatedEquipment._id ? updatedEquipment : item)),
        );
      },
      error: (error: unknown) => {
        console.error('[AppCore] Equipment rental failed:', error);
        this.errorMessage.set('Miete des Produkts fehlgeschlagen.');
      },
    });
  }

  protected readonly filteredEquipmentListe = computed<Equipment[]>(() => {
    const rawSearch = this.searchTerm().toLowerCase().trim();
    const selectedCategory = this.selectedCategory();
    const dataSet = this.equipmentListe();

    // Performance shortcut for pristine state
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
}
