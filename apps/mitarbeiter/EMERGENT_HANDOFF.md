# HSU Mitarbeiter-App: Übergabe

> **Credits sparen: Lies zuerst nur `docs/SPAR-ANLEITUNG.md`.** Die Projekt-Bestätigung unten ist bereits erteilt (Repo `Saadat-commits/HSU-Mitarbeiter-App-`, Branch `feature/mitarbeiter-app`). Nicht erneut fragen, nicht das ganze Repo lesen, ein Schritt pro Auftrag.

(Ausführliche Übergabe von früher, nur bei Bedarf lesen:)

## STOP: Projektidentität zuerst bestätigen
Bevor du Dateien bearbeitest, installierst, migrierst, deployest oder ein neues Projekt erzeugst, lies diese Datei und bestätige dem Auftraggeber explizit:
1. GitHub Repository: `Saadat-commits/HSU-Mitarbeiter-App-`
2. URL: https://github.com/Saadat-commits/HSU-Mitarbeiter-App-
3. Branch: `main` (nur lesen; Änderungen erst nach Freigabe auf separatem Feature-Branch)
4. App: **HSU Mitarbeiter-App**, keine Chef-App, keine Website.
5. Bestehende Dateien `App.tsx`, `package.json`, `app.json` sind eine Expo/React-Native-Grundlage und dürfen nicht ungefragt gelöscht oder überschrieben werden.

Antworte zuerst wörtlich mit dem Sinn: „Ich habe das Repository Saadat-commits/HSU-Mitarbeiter-App- und die bestehende Expo-App geprüft. Ist das das richtige Projekt, und darf ich mit der Entwicklung beginnen?“
**Bestätigung wurde vom Inhaber erteilt (siehe oben).**

## Aktueller Stand (Ergänzung)
- Die Entwicklung läuft auf dem Branch `feature/mitarbeiter-app`. Phase 1 ist fertig, das **dunkle Hauptdesign** (Revolut-Stil) ist umgesetzt.
- **Zuerst lesen:** `docs/FUNKTIONSLISTE.md` (alle Funktionen mit ehrlichem Stand und Bauplan, **das ist die Aufgabenliste**), dann `docs/design-mitarbeiter-app.md` (verbindliches Design), `docs/design-hamrah-kurz.md` (Regeln), `docs/ARCHITEKTUR.md`.
- Das helle Design aus dem ersten Prototyp gilt nicht mehr. Der Prototyp liegt unter `docs/prototype-App.tsx.txt`.
- Die Expo-App soll die **komplette** bestehende Mitarbeiter-App nachbauen, nicht nur eine Übersicht.

## Ziel nach Freigabe
Entwickle eine hochwertige, produktionsfähige native Mitarbeiter-App für iOS und Android mit professionellem, intuitivem, vertrauenswürdigem Design. Orientiere dich an hochwertigen Fintech- und Produktivitäts-Apps, ohne fremde Designs zu kopieren. Mobile-first, barrierearm, flüssige Animationen, klarer Kontrast, hervorragende Lade-/Leer-/Fehlerzustände.

## Hauptbereiche
- Heute: personalisiertes Dashboard, nächster Einsatz, aktuelle Aufgaben, Nachrichten, Benachrichtigungen, Schnellaktionen
- Einsätze: Kalender, Details, Orte, Arbeitszeiten, Annahme/Ablehnung, Änderungen, Schichttausch-Anfragen
- Zeiterfassung: Start, Pause, Ende, Verlauf, Korrekturantrag, Freigabe, nachvollziehbare Serverzeit
- Aufgaben: zugewiesene Aufgaben, Checklisten, Status, Anhänge, Prioritäten
- Kommunikation: Teamnachrichten, Einsatzchat, Push-Mitteilungen
- Dokumente: sichere Personalunterlagen, Verträge, Upload, Unterschrift nach rechtlicher Prüfung
- Finanzen: persönliche Lohnabrechnungen, Stundenübersicht, Auszahlungstatus, niemals fremde Mitarbeiterdaten
- Profil: persönliche Angaben, Verfügbarkeit, Urlaub/Abwesenheiten, Einstellungen, Datenschutz, Support
- **My Learning**: Schulungen, Onboarding, Lernmodule, Fortschritt, Quiz und Wissensmaterial

## Bestehenden Prototyp bewahren
Die derzeitige `App.tsx` ist ein früher Expo-Prototyp mit Dashboard, Bottom Navigation, Demo-Aufgaben und Demo-Zeiterfassung. Sie bleibt erhalten. Ihre Ideen und UI-Elemente dürfen für **My Learning** und das Onboarding wiederverwendet werden. Vor einer größeren Migration die Ausgangsversion in Git/GitHub nachvollziehbar sichern. My Learning ist ein zusätzlicher Bereich **innerhalb derselben Mitarbeiter-App**, nicht eine zweite separate Store-App, solange der Auftraggeber nichts anderes bestätigt.

## Technik und Sicherheit
- Bestehende Expo/React-Native/TypeScript-Struktur prüfen und bevorzugt weiterentwickeln.
- GitHub bleibt Source of Truth; Änderungen nachvollziehbar in Feature-Branch/PR.
- Backend/API mit Rollen und serverseitiger Mandanten- und Mitarbeiterisolation; keine Secrets im Client.
- Authentifizierung, sichere Tokenverwaltung, Datenschutz, Audit-Logs, minimale Berechtigungen.
- Zeit-/Lohn-/Personaldaten nicht fälschen; Demo-Modus klar markieren.
- Erst Tests und Preview, dann EAS/TestFlight/Store nach separater Freigabe.
- Keine Chef-App und keine Website in diesem Repo.

## Vorgehen
**Phase 0: Identität bestätigen und auf ausdrückliches OK warten.**
Phase 1: Bestandsaufnahme, UI-Konzept, Navigation und Architektur.
Phase 2: echte Mitarbeiter-Flows, API/Backend und Rollen.
Phase 3: My Learning, Benachrichtigungen, Dokumente, Tests.
Phase 4: Security Review, Geräte-Tests, Release-Vorbereitung.

Bitte zuerst nur die Projektidentität bestätigen, nichts verändern.
