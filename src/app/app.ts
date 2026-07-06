import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { EquipmentService } from './services/equipment'; 
import { Equipment } from './interfaces/equipment.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  protected readonly title = signal('lichttechnik-verleih-frontend');
  
  protected readonly equipmentListe = signal<Equipment[]>([]);
  protected readonly isLoading = signal<boolean>(true);
  protected readonly errorMessage = signal<string | null>(null);

  constructor(private equipmentService: EquipmentService) {}

  ngOnInit(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.equipmentService.getEquipment().subscribe({
      next: (data: Equipment[]) => {
        this.equipmentListe.set(data);
        this.isLoading.set(false); 
      },
      error: (error: any) => {
        console.error('API Error:', error);
        this.errorMessage.set('Verbindung zum Server fehlgeschlagen.');
        this.isLoading.set(false); 
      }
    });
  }
}