import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isDropdownOpen = signal(false);
  aktiveKategorie = signal<string | null>(null);

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
}
