export interface Equipment {
  id: string | number;
  name: string;
  verfuegbar: boolean;
  beschreibung?: string;
  kategorie?: string;
  preis: number;
}