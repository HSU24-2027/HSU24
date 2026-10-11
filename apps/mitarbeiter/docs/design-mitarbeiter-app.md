# Mitarbeiter-App – Hauptdesign (verbindlich)

Freigegeben vom Inhaber am 30.09.2026. Vorlage: Claude-Design-Canvas „Hamrah Mitarbeiter-App“,
Seite „Entwurf 2 – wie Revolut“ (https://claude.ai/artifact/BgDikJ4jiUrFKr3Eaduohd).
Grundlage der Marke: Design-System „Hamrah“ (https://claude.ai/artifact/3nMynU1MNmGe7gqB24spCF).

**Dieses Design bleibt.** Neue Funktionen werden in die bestehende Struktur einsortiert – es kommt
keine neue Optik, keine neue Navigation und kein neuer Stil dazu. Vor jeder neuen Funktion wird dem
Inhaber ein Platz aus der Tabelle „Wohin kommt Neues?“ vorgeschlagen und bestätigt.

## Navigation

Schwebende Leiste unten (Kapsel, 5 Punkte, aktiver Punkt als hellere Pille):

| Tab      | Inhalt                                                                                     |
| -------- | ------------------------------------------------------------------------------------------ |
| Home     | Verdienst des Monats, Schnellaktionen, heutiger Einsatz, offene Aufträge; darunter Widgets |
| Aufträge | Karte mit Preis-Markern + Blatt „Aufträge in deiner Nähe“ mit Filtern → Auftrag-Detail     |
| Lohn     | Lohn und Gehalt des Monats (Einsätze einzeln, Auszahlung, PDF, Drucken) → Auswertung       |
| Chat     | KI-Assistent oben, Team-Ankündigungen, Einsatz-Chats, Büro                                 |
| Apps     | Raster: „Mein Bereich“ + „Vom Chef freigeschaltet“ (Sehen/Bearbeiten) + gesperrt (Schloss) |

Oben auf Home: Kreis mit Initialen/Foto (→ Profil), Suchleiste als Pille, zwei runde Glasknöpfe
(Auswertung, Chat). Profil ist **nicht** in der Leiste, sondern hinter dem Kreis oben links.

## Bildschirme und feste Reihenfolge

1. **Anmeldung** – Kreis, „Hallo, {Vorname}“, 6 PIN-Punkte, runde Glastasten, Face ID unten links, „PIN vergessen?“.
2. **Home** – (1) „Verdient im {Monat}“ 48 px + Cents 24 px, Auszahlungstag und maskierte IBAN, Pille „Lohn & Gehalt“;
   (2) Schnellaktionen Stempeln · Aufträge · Melden · Apps; (3) Karte „Heute · dein nächster Einsatz“ mit
   Adresse, Entfernung, Verdienst, Einstempel-Fenster; (4) „Offene Aufträge für dich“ (1 Zeile + „Alle“).
3. **Home · Widgets** (weiter unten) – Verdienst-Kurve mit Vergleich Vormonat, Karte „Deine Einsätze“,
   Minijob-Grenze, neue Aufträge, **Angebot/Werbung** (nur hier, klar als „Angebot“ markiert).
4. **Aufträge** – Karte oben (Preis-Marker, eigener Standort), Blatt mit Titel, Filter-Pillen, Liste → „Details“.
5. **Auftrag-Detail** – Karte mit Route, Kategorie + freie Plätze, Titel, Kunde, 6 Kacheln (Verdienst, Stundenlohn,
   Dauer, Datum, Zeit, Entfernung), Adresse + Treffpunkt + Route, „Mitbringen“, Knopf „Auftrag übernehmen“.
6. **Einsatz · Standort** – Karte mit Einstempel-Umkreis (Standard 150 m), eigene Entfernung, Status-Pille
   „Im Einsatzbereich“, Adresse/Eingang/Route, Ansprechpartner/Chat, gelber Knopf „Jetzt einstempeln · {Zeit}“.
7. **Kunde bestätigt** – Zusammenfassung (Mitarbeiter, Ein/Aus, Ort GPS-geprüft, Arbeitszeit), helles
   Unterschriftsfeld, Sterne, „Bestätigen und ausstempeln“.
8. **Melden** – 4 Kacheln (später, krank, Problem, Adresse falsch), KI-Vorschlag an den Kunden, Foto als Nachweis,
   „Per SMS und E-Mail senden“.
9. **Lohn und Gehalt** – Monatswahl, Leiste Brutto · Stunden · Einsätze, Auszahlung, Einsätze einzeln
   (Unterschrift-Status, Abzüge), Krank-/Verspätungstage, „Nachweis PDF“ + „Monat drucken“.
10. **Auswertung** – Verdient mit Kurve, Stunden, Pünktlichkeit, „Wo du gearbeitet hast“.
11. **Chat** – KI-Assistent zuerst, dann Kanäle und Einzelchats, ungelesen als grüne Zahl.
12. **Profil** – Gruppen **Konto** (Persönliche Daten, Vertrag und Dokumente, Lohn und Auszahlung),
    **Arbeit** (Verfügbarkeit, Bewertungen, Vorteile), **App** (Design, Benachrichtigungen, Sicherheit, Sprache),
    **Rechtliches** (Datenschutz, Kündigen – nur schriftlich wirksam, § 623 BGB).
13. **Persönliche Daten** – Filter-Pillen; Gruppen Kontakt und Adresse · **Bankverbindung** · Steuer und
    Sozialversicherung · Aufenthalt · Notfallkontakt; je Feld „Ändern“; Bank/Steuer prüft das Büro.
14. **Dokumente** – Segment Alle · Vertrag · Lohn; Gruppen Lohnabrechnungen, Vertrag, Bescheinigungen; „Neu“-Marke.
    **Arbeitsvertrag wird hier direkt gelesen und digital unterschrieben.**
15. **Design** – Hell · Dunkel · System, Hintergründe; Abbrechen · Anwenden.

## Optik

- Grund `#0c0e0d`; oben diagonaler Lichtschimmer (Wald-Metall, Grün-Silber), nach unten in den Grund auslaufend.
- Karten `rgba(255,255,255,0.08)`, Radius 24 px, keine Schatten, keine Ränder.
- Glasknöpfe: rund, `rgba(255,255,255,0.10–0.14)`, 1 px `rgba(255,255,255,0.14)`.
- Primärknopf: weiße Pille, Text `#0c0e0d`. Dringende Handlung (Einstempeln): gelbe Pille `#fcd34d`.
- Akzente: Grün `#6ee7a0` (Plus, Erfolg, aktive Links), Gelb `#fcd34d` (Achtung/Jetzt), Rot `#fb7185` (Kündigen, Abzug-Hinweis),
  Kreis-Symbole in `#6ee7a0`, `#38bdf8`, `#2dd4bf`, `#fcd34d`, `#fb923c`, `#cfd8c6`.
- Zweittext `rgba(255,255,255,0.64)`.
- Schrift Inter. Seitentitel 28/34 700; Abschnittslabel 13 700 (Zweitfarbe); Listentitel 15–16 600–700;
  Zahlen in Karten 18–26 700, Hauptbetrag Home 48 px; immer Tabellenziffern. Nichts größer.
- Keine Emojis, keine Flaggen, keine religiösen Symbole, keine fremden Marken/Logos.

## Wohin kommt Neues?

| Neue Funktion                                                             | Platz                                                                                                                                   |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Identitätsprüfung, Aufenthaltstitel hochladen                             | Profil › Konto › Persönliche Daten › „Aufenthalt“; offene Aufgabe als Karte auf Home über „Heute“                                       |
| Neue persönliche Angabe                                                   | Persönliche Daten, passende Gruppe (neue Gruppe nur nach Rückfrage)                                                                     |
| Neues Dokument / Vertrag / Vertragsänderung                               | Dokumente, Gruppe Vertrag; Unterschreiben dort; Hinweis „Neu“ + Mitteilung                                                              |
| Neuer Arbeitsablauf im Einsatz                                            | Einsatz · Standort (Knöpfe unter der Adresse) oder Melden (neue Kachel)                                                                 |
| Neue Auswertung / Kennzahl                                                | Auswertung oder Home · Widgets                                                                                                          |
| Angebot, Aktion, Werbung                                                  | nur Home · Widgets als „Angebot“-Karte                                                                                                  |
| Neue App (vom Chef freischaltbar)                                         | Apps › „Vom Chef freigeschaltet“ mit Sehen/Bearbeiten                                                                                   |
| Einstellung                                                               | Profil › App                                                                                                                            |
| Rechtliches (Einwilligung, Datenschutz)                                   | Profil › Rechtliches                                                                                                                    |
| Bewerbung und Einstellung (Angaben, Unterlagen, Ausweis, Steuer, Vertrag) | Eigener Ablauf vor bzw. direkt nach der Anmeldung im Hauptdesign: eine Frage pro Bildschirm, Fortschrittsbalken oben, weiße Pille unten |

Passt nichts davon: Vorschlag machen und den Inhaber fragen – nicht eigenmächtig einen neuen Bereich bauen.

## Testmodus-App /mitarbeiter (03.10.2026)

Vom Inhaber gewünscht: Funktionen wie große Zeitarbeits-Apps, Optik Hamrah, kreativ. Gelobtes bleibt.

- **Leiste:** Start · Einsätze · Ausweis · Lohn · Ich.
- **Einstellung als eigener Ablauf:** Bewerbung (6 Fragen) → Ausweis fotografieren, KI liest → KI-Prüfung → Lohn-Angaben
  (Steuer-ID, SV-Nummer, Krankenkasse, IBAN, weitere Beschäftigung) → Vertrag → Hamrah-Ausweis fliegt herein.
- **Ausweis:** schimmernde Karte mit Name, Tätigkeiten, „Identität und Arbeitserlaubnis geprüft“, QR-Code, 6-stelliger
  PIN mit Ring (30 s). Der Kunde scannt oder tippt ihn in seinem Auftrag unter „Ist das wirklich …?“.
- **Einsätze:** Filter Neu, Dienstplan, Vergangene, Bewerbungen, Absagen, Kalenderwoche, „Nur meine Tätigkeiten“.
  Karte mit Datumsblock, Stundenlohn, freie Plätze, Marken „Direkt vom Kunden“ und „Unterschrift erforderlich“.
- **Ich (Persönlicher Bereich):** Verfügbarkeit, Deine Zeiten, Mein Profil, Meine Daten (Kontakt, Ausweis und Aufenthalt
  mit Kopie und Wiedervorlage, Lohn, Vertrag), Anträge, Rechtliches.
- **Recht:** Kopie nur bei Aufenthaltsdokumenten Pflicht (§ 4a Abs. 5 AufenthG), Personalausweis nur Angaben (§ 20 PAuswG),
  Hinweis zu Leiharbeit bei Duldung/Gestattung (§ 40 AufenthG, § 32 BeschV), Absage entscheidet ein Mensch (Art. 22 DSGVO).

### Einstellung wie Revolut (03.10.2026, vom Inhaber gewünscht)

Bewerbung mit Lebenslauf (KI füllt aus) → Unterschrift „Angaben sind wahr“ → Entscheidung Hamrah → Identität
(Dokument wählen, Kamera mit grünem Kartenrahmen, Selfie im Oval, KI-Prüfung mit Häkchen-Liste, Ergebnis grün/gelb/rot
mit Grund und Lösung) → Lohn → Vertrag → „Deine Personalnummer“ mit Ausweis → Einführung als Karte unten, App wechselt
dahinter den Bereich.

### Design 2 der Testmodus-App (03.10.2026, ersetzt die Glas-Optik in /mitarbeiter)

Feste Flächen #111413 mit Haarlinie statt Glas, eine Akzentfarbe Mint, Leiste „Heute · Einsätze · Ausweis · Lohn · Ich“.
Bewegung: Schubladen 420 ms iOS-Kurve, Bedienung unter 300 ms, Druckgefühl 0,97, gestaffeltes Erscheinen 45 ms,
Beträge zählen hoch, Ausweis dreht sich (3D), Wochenbalken wachsen. Bei „Bewegung reduzieren“ alles ruhig.
