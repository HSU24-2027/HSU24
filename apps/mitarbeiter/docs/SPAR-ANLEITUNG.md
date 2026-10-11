# Spar-Anleitung für Emergent und andere KI-Werkzeuge (Credits sparen)

Diese Datei ist kurz mit Absicht. **Lies nur diese Datei und danach genau die Dateien, die dein aktueller Schritt nennt.**

## Bestätigung ist erteilt
Der Inhaber hat bestätigt: richtiges Projekt ist `Saadat-commits/HSU-Mitarbeiter-App-`, Arbeit auf dem Branch
`feature/mitarbeiter-app`, nicht auf `main`. **Frage nicht erneut nach der Identität. Beginne mit dem Schritt unten.**

## Regeln, die Credits sparen
1. **Ein Schritt pro Auftrag.** Nur den Schritt bearbeiten, den der Inhaber nennt. Danach stoppen und kurz berichten.
2. **Nicht das ganze Repo lesen.** Lies nur: diese Datei, den Schritt in `docs/FUNKTIONSLISTE.md` (Abschnitt 5) und die dort genannten Dateien.
3. **Nichts neu aufsetzen.** Kein neues Projekt, kein neues Gerüst, kein Wechsel der Expo-Version, kein Umbau der Ordner. Das Gerüst steht (`App.tsx`, `src/`).
4. **Nichts löschen, nichts doppelt bauen.** Bestehende Dateien erweitern. Der Datenzugang läuft nur über `src/data/repository.ts`.
5. **Keine großen Umschreibungen.** Pro Auftrag höchstens etwa 5 Dateien ändern.
6. **Nicht raten, nicht erfinden.** Keine Zahlen, Namen, Bewertungen. Fehlt etwas, den Platz leer lassen und "Testmodus" anzeigen.
7. **Prüfen mit einem Befehl:** `npm run typecheck`. Mehr nicht, keine langen Test-Läufe, kein erneutes Bauen für den Store.
8. **Kurz berichten:** drei Sätze: was geändert, was geprüft, was als Nächstes. Keine langen Erklärungen, keine Listen mit Vorschlägen.
9. **Bei Unsicherheit eine einzige Frage** stellen, dann warten. Nicht mehrere Varianten ausarbeiten.
10. **Nichts veröffentlichen.** Kein EAS-Build, kein Store, kein Deploy ohne ausdrückliche Freigabe.

## Festes Design (nicht anfassen)
Dunkel, Revolut-Stil. Farben und Schrift stehen in `src/theme.ts`, Bausteine in `src/components/ui.tsx`.
Neue Bildschirme nutzen diese Bausteine. Keine neuen Farben, keine Emojis, kein Wort "KI" für Mitarbeitende (heißt "Assistent").

## Der nächste Schritt (jeweils den ersten offenen nehmen)
Die Schritte stehen mit "Fertig wenn" in `docs/FUNKTIONSLISTE.md`, Abschnitt 5. Reihenfolge:
0 Schnittstelle (im Hamrah-Repo, nur mit Freigabe), 1 Anmeldung, 2 Home und Einsätze lesen, 3 Aufträge übernehmen,
4 Stempeln, 5 Melden, 6 Lohn, 7 Dokumente und Vertrag, 8 Chat, 9 Profil, 10 Mitteilungen, 11 Bewerbung, 12 Akte, 13 Lernen, 14 Store.

**Schritt 0 ist noch offen.** Bis die Schnittstelle existiert, bleiben die Bildschirme Hüllen. Baue bis dahin nur Dinge,
die ohne Server gehen (zum Beispiel Layout-Feinschliff), oder warte auf die Freigabe.

## Fertige Kurz-Aufträge zum Einfügen (der Inhaber kopiert einen davon)

**Design verfeinern**
> Lies `docs/SPAR-ANLEITUNG.md`. Verfeinere nur das Layout des Bildschirms "Home" in `src/screens/Home.tsx` mit den vorhandenen Bausteinen. Danach `npm run typecheck` und drei Sätze Bericht.

**Anmeldung (Schritt 1, erst nach Schritt 0)**
> Lies `docs/SPAR-ANLEITUNG.md` und Schritt 1 in `docs/FUNKTIONSLISTE.md`. Baue die Anmeldung mit PIN-Bildschirm. Nur die Dateien, die dafür nötig sind. Danach `npm run typecheck` und drei Sätze Bericht.

**Beliebiger Schritt N**
> Lies `docs/SPAR-ANLEITUNG.md` und Schritt N in `docs/FUNKTIONSLISTE.md`, Abschnitt 5. Bearbeite nur diesen Schritt. Danach `npm run typecheck` und drei Sätze Bericht.
