# Lichttechnik-Verleih Frontend

Dieses Repository enthält die clientseitige Benutzeroberfläche (Frontend) der Lichttechnik-Verleihplattform. Die Anwendung ermöglicht Usern und Admins die visuelle Interaktion mit dem Lichttechnik-Bestand.

## Technologie-Stack

- **Framework:** Angular (v17/v18)
- **Design-Framework:** Bootstrap (v5)
- **Styling:** CSS3

## Aktueller Entwicklungsstand

Das Frontend-Grundgerüst wurde erfolgreich aufgesetzt:
- **Workspace-Architektur:** Initialisierung des Angular-Projekts inklusive Routing-Konfiguration und strikter Typisierung.
- **UI-Infrastruktur:** Lokale Installation des Bootstrap-Frameworks und globale Registrierung über die Konfigurationsdatei `angular.json`, um responsive UI-Komponenten zu gewährleisten.

## Dokumentation technischer Herausforderungen

### 1. Merge-Konflikte bei der Projekt-Initialisierung
**Problem:** Bei der Erstellung des Angular-Workspaces direkt im Projektverzeichnis mittels Angular CLI kam es zu Dateikonflikten mit den bereits durch GitHub automatisch generierten Dateien (`.gitignore` und `README.md`). Die CLI brach den Vorgang ab, um bestehende Daten nicht zu überschreiben.
**Lösung:** Das Verzeichnis wurde manuell bereinigt (Entfernung der blockierenden, rudimentären GitHub-Dateien). Anschließend wurde der Initialisierungsbefehl der Angular CLI erneut ausgeführt, wodurch die vollständige und optimierte Angular-Dateistruktur (inklusive einer dedizierten `.gitignore` für Node.js-Projekte) fehlerfrei generiert werden konnte.

## Zukünftige Erweiterungen / Roadmap

Die folgenden Implementierungsschritte sind für die clientseitige Entwicklung geplant:
1. **API-Service-Integration (Ticket #6):** Erstellung eines Angular-Daten-Services (`EquipmentService`) unter Nutzung des `HttpClient`, um asynchrone Anfragen an das Express-Backend zu senden.
2. **Bestands-Komponente (Ticket #6):** Entwicklung einer responsiven Übersichtskomponente (Grid- oder Tabellen-Layout) mithilfe von Bootstrap-Cards zur strukturierten Darstellung von Geräten, Preisen und Verfügbarkeiten.
3. **Filter- und Suchfunktionen:** Implementierung clientseitiger Such- und Filtermechanismen zur effizienten Navigation innerhalb des Verleih-Sortiments.