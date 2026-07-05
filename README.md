# Lichttechnik-Verleih Frontend

Dieses Repository enthält die clientseitige Benutzeroberfläche (Frontend) der Lichttechnik-Verleihplattform. Die Anwendung ermöglicht Usern und Admins die visuelle Interaktion mit dem Lichttechnik-Bestand.

## Technologie-Stack

- **Framework:** Angular (v17/v18)
- **Design-Framework:** Bootstrap (v5)
- **Styling:** CSS3

## Aktueller Entwicklungsstand

Das Frontend-Grundgerüst sowie die Kernarchitektur zur Datenbeschaffung wurden erfolgreich aufgesetzt:
- **Workspace-Architektur:** Initialisierung des Angular-Projekts inklusive Routing-Konfiguration und strikter Typisierung.
- **UI-Infrastruktur:** Lokale Installation des Bootstrap-Frameworks und globale Registrierung über die Konfigurationsdatei `angular.json`, um responsive UI-Komponenten zu gewährleisten.
- **API-Service-Integration:** Implementierung eines zentralen asynchronen Datendienstes (`EquipmentService`) unter Verwendung des Angular `HttpClient` zur Kommunikation mit der Express-REST-API (`http://localhost:3000/api/equipment`).
- **Reaktives Zustandsmanagement:** Anbindung des Services an die App-Komponente mittels moderner Angular *Signals* (`signal`) zur performanten, feingranularen Datenverwaltung und Vermeidung unnötiger Change-Detection-Zyklen.
- **Datenschicht-Typisierung:** Erstellung eines dedizierten TypeScript-Interfaces (`Equipment`), welches die Datenstruktur der MongoDB-Dokumente zur Compile-Zeit absichert.

## Dokumentation technischer Herausforderungen

### 1. Merge-Konflikte bei der Projekt-Initialisierung
**Problem:** Bei der Erstellung des Angular-Workspaces direkt im Projektverzeichnis mittels Angular CLI kam es zu Dateikonflikten mit den bereits durch GitHub automatisch generierten Dateien (`.gitignore` und `README.md`). Die CLI brach den Vorgang ab, um bestehende Daten nicht zu überschreiben.
**Lösung:** Das Verzeichnis wurde manuell bereinigt (Entfernung der blockierenden, rudimentären GitHub-Dateien). Anschließend wurde der Initialisierungsbefehl der Angular CLI erneut ausgeführt, wodurch die vollständige und optimierte Angular-Dateistruktur (inklusive einer dedizierten `.gitignore` für Node.js-Projekte) fehlerfrei generiert werden konnte.

### 2. Typisierungs- und Compilerkonflikte beim TypeScript-Build
**Problem:** Der Compiler meldete Fehler bezüglich fehlender Typdefinitionen für das Test-Framework `jasmine` innerhalb der Datei `tsconfig.spec.json`. Parallel dazu traten durch unvollständige Pfad-Zuordnungen implizite `any`-Typfehler bei den API-Callback-Parametern auf.
**Lösung:** Die globalen Test-Typen im `types`-Array der `tsconfig.spec.json` wurden geleert, da diese für den aktuellen Funktionsstand der Laufzeitumgebung nicht restriktiv benötigt werden. Die impliziten Typen wurden durch eine explizite Typisierung der Callback-Parameter (`data: Equipment[]`, `error: any`) im Datenstrom aufgelöst.

### 3. Fehlendes Injection-Token im Komponenten-Constructor
**Problem:** Aufgrund der minimalen und strikten Konfiguration der TypeScript-Metadaten verweigerte Angular die klassische Constructor-Injection des `EquipmentService` innerhalb der Hauptkomponente (`No suitable injection token`).
**Lösung:** Die Architektur wurde auf die funktionale Dependency Injection von Angular umgestellt. Der Service wird nun direkt als Klassenattribut über die integrierte `inject()`-Funktion instanziiert. Der leere Constructor wurde vollständig entfernt.

## Zukünftige Erweiterungen / Roadmap

Die folgenden Implementierungsschritte sind für die clientseitige Entwicklung geplant:
1. **Bestands-Komponente:** Entwicklung einer responsiven Übersichtskomponente (Grid- oder Tabellen-Layout) mithilfe von Bootstrap-Cards zur strukturierten Darstellung von Geräten, Preisen und Verfügbarkeiten aus dem geladenen Signal-Datenbestand.
2. **Filter- und Suchfunktionen:** Implementierung clientseitiger Such- und Filtermechanismen zur effizienten Navigation innerhalb des Verleih-Sortiments.