import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EquipmentService } from './services/equipment';
import { Equipment } from './interfaces/equipment.interface';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('lichttechnik-verleih-frontend');
  protected readonly equipmentListe = signal<Equipment[]>([]);
  
  private readonly equipmentService = inject(EquipmentService);

  ngOnInit(): void {
    this.equipmentService.getEquipment().subscribe({
      next: (data: Equipment[]) => {
        this.equipmentListe.set(data);
      },
      error: (error: any) => {
        console.error('API Error:', error);
      }
    });
  }
}