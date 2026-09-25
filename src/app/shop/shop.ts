import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipmentService } from '../services/equipment';
import { Equipment } from '../interfaces/equipment.interface';
@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css'],
})
export class Shop implements OnInit {
  private readonly equipmentService = inject(EquipmentService);

  // Signale für den Komponentenstatus
  protected readonly equipmentListe = signal<Equipment[]>([]);
  protected readonly isLoading = signal<boolean>(true);
  protected readonly errorMessage = signal<string | null>(null);

  // Signale für Filter und Suche
  protected readonly searchTerm = signal<string>('');
  protected readonly selectedCategory = signal<string>('all');
  /**
   * Filtert die Equipment-Liste basierend auf Suchbegriff und Kategorie.
   * Nutzt computed für automatisches Caching bei Layout-Änderungen.
   */
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
        selectedCategory === 'all' || (equipment.category || 'Allgemein') === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  });

  public ngOnInit(): void {
    this.fetchEquipmentInventory();
  }

  /**
   * Lädt den aktuellen Equipment-Bestand vom API-Server.
   */
  private fetchEquipmentInventory(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.equipmentService.getEquipment().subscribe({
      next: (data: Equipment[]) => {
        this.equipmentListe.set(data);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        console.error('[ShopCore] Fehler beim Laden des Inventars:', error);
        this.errorMessage.set('Verbindung zum Server fehlgeschlagen.');
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Führt den Mietvorgang für ein bestimmtes Equipment-Objekt aus.
   */
  public rentEquipment(id: string): void {
    this.equipmentService.rentEquipment(id).subscribe({
      next: (updatedEquipment: Equipment) => {
        this.equipmentListe.update((items: Equipment[]) =>
          items.map((item) => (item._id === updatedEquipment._id ? updatedEquipment : item)),
        );
      },
      error: (error: unknown) => {
        console.error('[ShopCore] Miete fehlgeschlagen:', error);
        this.errorMessage.set('Miete des Produkts fehlgeschlagen.');
      },
    });
  }
}
