import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { EquipmentService } from './services/equipment'; 
import { Equipment } from './interfaces/equipment.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  protected readonly title = signal('lichttechnik-verleih-frontend');
  
  protected readonly equipmentListe = signal<Equipment[]>([]);
  protected readonly isLoading = signal<boolean>(true);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly searchTerm = signal<string>('');
  protected readonly selectedCategory = signal<string>('all');

  /**
   * Extracts unique equipment categories dynamically.
   * Leverages computed caching to avoid redundant array transformations on layout repaints.
   */
  protected readonly dynamischeKategorien = computed<string[]>(() => {
    const alleKategorien = this.equipmentListe().map(item => item.category || 'Allgemein');
    return [...new Set(alleKategorien)];
  });

  /**
   * Reactive evaluation pipeline for data filtering.
   * Implements null-safe parsing and early-exit optimizations for empty filter queries.
   */
  protected readonly filteredEquipmentListe = computed<Equipment[]>(() => {
    const rawSearch = this.searchTerm().toLowerCase().trim();
    const selectedCategory = this.selectedCategory();
    const dataSet = this.equipmentListe();

    // Performance shortcut for pristine state
    if (!rawSearch && selectedCategory === 'all') {
      return dataSet;
    }

    return dataSet.filter(equipment => {
      const matchesSearch = !rawSearch || 
        equipment.name.toLowerCase().includes(rawSearch) || 
        (equipment.description || '').toLowerCase().includes(rawSearch);
        
      const matchesCategory = selectedCategory === 'all' || 
        (equipment.category || 'Allgemein') === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  });

  constructor(private readonly equipmentService: EquipmentService) {}

  public ngOnInit(): void {
    this.fetchEquipmentInventory();
  }

  /**
   * Orchestrates the backend data stream initialization.
   * Note: Angular HttpClient handles auto-completion; explicit unsubscription is omitted by architectural design.
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
        console.error('[AppCore] Critical API link failure:', error);
        this.errorMessage.set('Verbindung zum Server fehlgeschlagen.');
        this.isLoading.set(false); 
      }
    });
  }
}