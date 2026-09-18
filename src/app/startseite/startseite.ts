import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-startseite',
  imports: [RouterLink],
  templateUrl: './startseite.html',
  styleUrl: './startseite.css',
})
export class Startseite {
  kategorieGruppen = [
    {
      titel: 'Scheinwerfer',
      unterpunkte: ['PAR-Scheinwerfer', 'LED-Scheinwerfer', 'Profilscheinwerfer', 'LED-Bars', 'Stufenlinsen', 'Halogen-Scheinwerfer', 'Schwarzlicht']
    },
    {
      titel: 'Lichteffekte',
      unterpunkte: ['Nebelmaschinen', 'Effektmaschinen', 'Dekorative Beleuchtung']
    },
    {
      titel: 'Lichtsteuerung',
      unterpunkte: ['Lichtpulte & Controller', 'DMX-Interfaces', 'Lasersteuerung', 'Steuerungs-PC']
    },
    {
      titel: 'Laser',
      unterpunkte: ['Showlaser']
    },
    {
      titel: 'Dimmer & Strom',
      unterpunkte: ['Dimmer', 'Netzteile', 'Stromverteilung']
    },
    {
      titel: 'Kabel & Adapter',
      unterpunkte: ['DMX-Signalverteilung', 'DMX-Kabel', 'Stromkabel', 'Verlängerungskabel', 'DMX-Adapter']
    },
    {
      titel: 'Zubehör',
      unterpunkte: ['Projektion', 'Event-Zubehör', 'LED-/Pixel-Zubehör']
    }
  ];
}

