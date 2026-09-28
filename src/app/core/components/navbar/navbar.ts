import { Component, signal, HostListener, ElementRef, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly elementRef = inject(ElementRef);
  private readonly router = inject(Router);

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

  search(value: string): void {
    this.router.navigate(['/shop'],
      { queryParams: {
        suche: value.trim() || null,
      }, 
    queryParamsHandling: 'merge',
  });
  }

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

  handleKeydown(event: KeyboardEvent, index: number): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        // Springt zur nächsten Oberkategorie
        const nextBtn = document.getElementById(`subBtn-${index + 1}`);
        if (nextBtn) nextBtn.focus();
        break;

      case 'ArrowUp':
        event.preventDefault();
        // Springt zur vorherigen Oberkategorie
        const prevBtn = document.getElementById(`subBtn-${index - 1}`);
        if (prevBtn) prevBtn.focus();
        break;

      case 'ArrowRight':
      case 'Enter':
      case ' ':
        // Öffnet das Untermenü mit Signals und fokussiert den ersten Link
        if (this.offeneGruppe() !== this.kategorieGruppen[index].titel) {
          this.toggleGruppe(this.kategorieGruppen[index].titel);
        }
        setTimeout(() => {
          const subMenu = document.getElementById(`subMenu-${index}`);
          const firstLink = subMenu?.querySelector('a');
          if (firstLink) firstLink.focus();
        }, 50);
        break;

      case 'ArrowLeft':
        event.preventDefault();
        // Schließt das Untermenü und springt zurück auf die Oberkategorie
        this.offeneGruppe.set(null);
        document.getElementById(`subBtn-${index}`)?.focus();
        break;
    }
  }

}