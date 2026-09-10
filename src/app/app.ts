import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EquipmentService } from './services/equipment'; 
import { Equipment } from './interfaces/equipment.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule], 
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  private readonly fb = inject(FormBuilder);

  protected readonly title = signal('lichttechnik-verleih-frontend');
  
  protected readonly equipmentListe = signal<Equipment[]>([]);
  protected readonly isLoading = signal<boolean>(true);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly searchTerm = signal<string>('');
  protected readonly selectedCategory = signal<string>('all');

  // --- NEU: Zustand & Validierung für das Erstellen-Modal ---
  protected readonly showCreateModal = signal<boolean>(false);

  protected readonly equipmentForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    category: ['', Validators.required],
    priceDay: [0, [Validators.required, Validators.min(0.01)]],
    quantity: [1, [Validators.required, Validators.min(0)]],
    description: ['']
  });

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

  public rentEquipment(id: string): void {
    this.equipmentService.rentEquipment(id).subscribe({
      next: (updatedEquipment: Equipment) => {
        this.equipmentListe.update(items => items.map(item => item._id === updatedEquipment._id ? updatedEquipment : item));
      },
      error: (error: unknown) => {
        console.error('[AppCore] Equipment rental failed:', error);
        this.errorMessage.set('Miete des Equipments fehlgeschlagen.');
      }
    }); 
  }

  // --- NEU: Handlers für das Create-Formular ---
  public toggleCreateModal(): void {
    this.showCreateModal.update(val => !val);
  }

  public onSubmitCreate(): void {
    if (this.equipmentForm.valid) {
      const newEquipment = this.equipmentForm.value;
      this.equipmentService.createEquipment(newEquipment).subscribe({
        next: (createdItem: Equipment) => {
          this.equipmentListe.update(items => [...items, createdItem]);
          this.equipmentForm.reset({ priceDay: 0, quantity: 1 });
          this.showCreateModal.set(false);
        },
        error: (error: unknown) => {
          console.error('[AppCore] Equipment creation failed:', error);
          this.errorMessage.set('Erstellen des Equipments fehlgeschlagen.');
        }
      });
    }
  }
}

