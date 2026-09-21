import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentService } from '../services/equipment';
import { Equipment } from '../interfaces/equipment.interface';

@Component({
  selector: 'app-shop',
  imports: [CommonModule],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {

  protected readonly equipmentListe = signal<Equipment[]>([]);
  protected readonly isLoading = signal<boolean>(true);
  protected readonly errorMessage = signal<string | null>(null);
  
  constructor(private readonly equipmentService: EquipmentService) {}

  public ngOnInit(): void {
    this.equipmentService.getEquipment().subscribe({
      next: (equipment: Equipment[]) => {
        this.equipmentListe.set(equipment);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        this.errorMessage.set('Fehler beim Laden der Ausrüstung: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }
}
