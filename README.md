# Lichttechnik-Verleih Frontend

Dieses Repository enthält die clientseitige Benutzeroberfläche (Frontend) der Lichttechnik-Verleihplattform. Die Anwendung ermöglicht Usern und Admins die visuelle Interaktion mit dem Lichttechnik-Bestand.

## Technologie-Stack

- **Framework:** Angular (v17/v18)
- **Design-Framework:** Bootstrap (v5)
- **Styling:** CSS3

## Aktueller Entwicklungsstand

Das Frontend-Grundgerüst, die Datenbeschaffung sowie die responsive Benutzeroberfläche wurden erfolgreich implementiert:
- **Workspace-Architektur:** Initialisierung des Angular-Projekts inklusive Routing-Konfiguration und strikter Typisierung.
- **UI-Infrastruktur:** Lokale Installation des Bootstrap-Frameworks und globale Registrierung über die Konfigurationsdatei `angular.json`.
- **API-Service-Integration:** Implementierung eines zentralen asynchronen Datendienstes (`EquipmentService`) unter Verwendung des Angular `HttpClient` zur Kommunikation mit der Express-REST-API (`http://localhost:3000/api/equipment`).
- **Reaktives Zustandsmanagement:** Anbindung des Services an die App-Komponente mittels moderner Angular *Signals* (`signal`) zur performanten, feingranularen Datenverwaltung.
- **Datenschicht-Typisierung:** Erstellung eines dedizierten TypeScript-Interfaces (`Equipment`), welches die Datenstruktur der MongoDB-Dokumente zur Compile-Zeit absichert.
- **Responsive Bestands-Visualisierung (Ticket #10):** Realisierung eines dynamischen Grid-Layouts mittels Bootstrap-Cards. Die Anzeige verfügt über integriertes Lade- und Fehlermanagement (Spinner/Alert-Erkennung via Signals) sowie kontextbasierte Status-Badges („Bereit“ / „Verliehen“) via `ngClass`.

## Dokumentation technischer Herausforderungen

### 1. Merge-Konflikte bei der Projekt-Initialisierung
**Problem:** Bei der Erstellung des Angular-Workspaces direkt im Projektverzeichnis mittels Angular CLI kam es zu Dateikonflikten mit den bereits durch GitHub automatisch generierten Dateien (`.gitignore` und `README.md`). 
**Lösung:** Das Verzeichnis wurde manuell bereinigt. Anschließend wurde der Initialisierungsbefehl der Angular CLI erneut ausgeführt, wodurch die vollständige Angular-Dateistruktur fehlerfrei generiert werden konnte.

### 2. Typisierungs- und Compilerkonflikte beim TypeScript-Build
**Problem:** Der Compiler meldete Fehler bezüglich fehlender Typdefinitionen für das Test-Framework `jasmine` innerhalb der Datei `tsconfig.spec.json`. Parallel dazu traten implizite `any`-Typfehler bei den API-Callback-Parametern auf.
**Lösung:** Die globalen Test-Typen im `types`-Array der `tsconfig.spec.json` wurden geleert. Die impliziten Typen wurden durch eine explizite Typisierung der Callback-Parameter (`data: Equipment[]`, `error: any`) im Datenstrom aufgelöst.

### 3. Fehlendes Injection-Token im Komponenten-Constructor
**Problem:** Aufgrund der restriktiven Konfiguration der TypeScript-Metadaten verweigerte Angular die klassische Constructor-Injection des `EquipmentService` innerhalb der Hauptkomponente (`No suitable injection token`).
**Lösung:** Die Architektur wurde auf die funktionale Dependency Injection von Angular umgestellt. Der Service wird nun direkt als Klassenattribut über die integrierte `inject()`-Funktion instanziiert.

### 4. Template- und Typisierungsasynchronität nach Git-Operationen
**Problem:** Nach der Isolation von Feature-Zweigen mittels Git kam es zu einem temporären strukturellen Mismatch zwischen dem fortgeschrittenen HTML-Template und den zugrundeliegenden TypeScript-Dateien. Der Compiler meldete 12 Defizite (u. a. fehlende Property-Zuweisungen auf dem `Equipment`-Typ sowie ein blockiertes `ngClass`-Binding).
**Lösung:** Das `Equipment`-Interface wurde um die fehlenden optionalen und strikten Entitätsfelder erweitert. Zudem wurde das `CommonModule` explizit in die `imports` der Standalone-Komponente aufgenommen, um die Angular-Direktiven für das Template nutzbar zu machen und den Build-Prozess zu stabilisieren.

## Zukünftige Erweiterungen / Roadmap

Die folgenden Implementierungsschritte sind für die clientseitige Entwicklung geplant:
1. **Filter- und Suchfunktionen:** Implementierung clientseitiger Such- und Filtermechanismen zur effizienten Navigation innerhalb des Verleih-Sortiments (z.B. nach Kategorie oder Verfügbarkeit).
2. **Echtzeit-Validierung:** Integration von reaktiven Formularen (`ReactiveFormsModule`) für das spätere Hinzufügen neuer Lichttechnik-Komponenten.