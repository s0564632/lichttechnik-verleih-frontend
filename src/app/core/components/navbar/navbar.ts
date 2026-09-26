import { Component, signal, HostListener, ElementRef, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly elementRef = inject(ElementRef);

  isDropdownOpen = signal(false);
  offeneGruppe = signal<string | null>(null);

  kategorieGruppen = [
    {
      titel: 'Scheinwerfer',
      unterpunkte: [
        'PAR-Scheinwerfer',
        'LED-Scheinwerfer',
        'Profilscheinwerfer',
        'LED-Bars',
        'Stufenlinsen',
        'Halogen-Scheinwerfer',
        'Schwarzlicht',
      ],
    },
    {
      titel: 'Lichteffekte',
      unterpunkte: ['Nebelmaschinen', 'Effektmaschinen', 'Dekorative Beleuchtung'],
    },
    {
      titel: 'Lichtsteuerung',
      unterpunkte: ['Lichtpulte & Controller', 'DMX-Interfaces', 'Lasersteuerung', 'Steuerungs-PC'],
    },
    {
      titel: 'Laser',
      unterpunkte: ['Showlaser'],
    },
    {
      titel: 'Dimmer & Strom',
      unterpunkte: ['Dimmer', 'Netzteile', 'Stromverteilung'],
    },
    {
      titel: 'Kabel & Adapter',
      unterpunkte: [
        'DMX-Signalverteilung',
        'DMX-Kabel',
        'Stromkabel',
        'Verlängerungskabel',
        'DMX-Adapter',
      ],
    },
    {
      titel: 'Zubehör',
      unterpunkte: ['Projektion', 'Event-Zubehör', 'LED-/Pixel-Zubehör'],
    },
  ];

  toggleHauptmenue(): void {
    this.isDropdownOpen.set(!this.isDropdownOpen());
    if (!this.isDropdownOpen()) {
      this.offeneGruppe.set(null);
    }
  }

  toggleGruppe(titel: string): void {
    this.offeneGruppe.set(this.offeneGruppe() === titel ? null : titel);
  }

  closeMenu(): void {
    this.isDropdownOpen.set(false);
    this.offeneGruppe.set(null);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isDropdownOpen() && !this.elementRef.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeMenu();
  }
}