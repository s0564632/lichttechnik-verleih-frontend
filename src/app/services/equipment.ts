import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipment } from '../interfaces/equipment.interface';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private apiUrl = 'http://localhost:3000/api/equipment';

  constructor(private http: HttpClient) {}

  getEquipment(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(this.apiUrl);
  }

  rentEquipment(id: string): Observable<Equipment> {
    return this.http.patch<Equipment>(`${this.apiUrl}/${id}/rent`, {});
  } 
}