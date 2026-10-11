# Auftrag an Emergent (zum Einfügen)

```
AUFTRAG: HSU Mitarbeiter-App (Expo). Höchstens 90 Credits. Kaum Fragen.

QUELLE: https://github.com/Saadat-commits/HSU-Mitarbeiter-App- , Branch main. Das ist die richtige und fertige Basis (Expo SDK 54, Expo Router, TypeScript). Bestätigung ist erteilt: keine Rückfragen zur Identität. Importiere genau diesen Stand und arbeite darauf weiter. Kein Neubau, kein Wechsel von Expo-Version oder Navigation.

WICHTIG: Das ist KEINE Studenten-App. Es ist die Mitarbeiter-App der Firma Hamrah (Minijob-Personal für Einsätze). Alles, was nur für Studenten oder die Helmut-Schmidt-Universität gedacht war (Campus, Kurse der Uni, Mensa, Stundenplan, Studentenrolle), entfällt.
Gut Gebautes aus deinem bisherigen Projekt DARFST und SOLLST du behalten und ruhig klüger machen, wenn es zu Mitarbeitern passt:
- Der Assistent (KI-Funktion) bleibt, wird nur "Assistent" genannt. Das Wort "KI" sehen Mitarbeiter nie.
- Vorteile (Benefits) bleiben und kommen als Bereich in "My Learning" bzw. "Apps".
- Gute Ideen aus deiner Lern-Logik fließen in "My Learning" (Onboarding, Pflichtschulungen, Fortschritt).
Alles andere vom Studenten-Projekt weg. Nichts doppelt: ein Bildschirm, ein Baustein, eine Datenquelle.

DESIGN (fest): Revolut-Stil, klassisch weiß. Heller Hintergrund, weiße Karten, schwarze Schrift, ein ruhiger grüner Akzent, große runde Karten, ruhige Animationen, schwebende Kapsel-Navigation unten: Home, Aufträge, Lohn, Chat, Apps. Dunkel bleibt als Option. Tokens: src/design/tokens.ts. Handy und Computer sehen gleich aus. Keine Emojis, keine Flaggen, keine kleinen Überzeilen über Überschriften. Tippflächen mindestens 44.

DENKEN ERLAUBT: Struktur, Platzierung und Reihenfolge der Elemente entscheidest du selbst, wenn es klarer, schöner oder schneller bedienbar wird. Fasse zusammen statt zu duplizieren. Du darfst verbessern, was auffällt.

REGELN: Daten nur über src/data/DataSource.ts (Demo-Daten klar als "Beispiel" markiert). Keine Geschäftsdaten selbst erfinden: Lohn, Zeiten, Personaldaten kommen später vom Server (Hamrah-Datenbank bleibt unverändert). Menschliche Freigabe für Geld, Verträge, Sperren, Streit bleibt Pflicht. Nie behaupten "rechtssicher" oder "zertifiziert".

KREDIT-GRENZE (hart): Stoppe bei 90 Credits. Kannst du den Verbrauch nicht sehen: höchstens 3 kurze Runden. Keine Store-Builds. Lies nur: README.md und docs/SPAR-ANLEITUNG.md, sonst nur, was du für eine Datei brauchst.

LIVE ZUERST: Stelle in der ERSTEN Runde bereit, dass ich die App sofort in Expo Go auf dem iPhone sehe (QR-Code und Code), bevor du Feinschliff machst. Halte es bis zum Schluss bereit und sag kurz, wie ich es öffne.

QUALITÄT: Nach jeder Runde npm run check (Typen, Lint, Tests), dann committen und auf einen Branch feature/emergent pushen, nicht auf main.

BERICHT: Pro Runde höchstens 3 Sätze: was geändert, was geprüft, Credits (Schätzung). Keine Vorschlagslisten.
```

## Zusatz: Automatisierung und Assistent (ausführlich, zum Einfügen)

```
ZUSATZ-AUFTRAG: Vollautomatische Abläufe mit Assistent. Gleiche Credit-Grenze (insgesamt 90),
nichts doppelt, vorhandene Bausteine nutzen.

GRUNDIDEE
Der Mitarbeiter soll fast nichts tun müssen: ein Tipp, ein Foto, eine Unterschrift. Den Rest
erledigt der Assistent im Hintergrund: lesen, sortieren, prüfen, erinnern, vorschlagen,
Nachweise ablegen. Das Büro bekommt nur Ausnahmen und Freigaben. Jeder Schritt hinterlässt
einen Nachweis (wer, was, wann, Version), damit nichts diskutiert werden muss.

ROLLE DES ASSISTENTEN (überall gleich)
Er darf: Texte und Fotos auslesen, Felder vorbelegen, Fristen überwachen, erinnern, Unstimmigkeiten
markieren, Vorschläge mit Begründung machen, Zusammenfassungen schreiben.
Er darf NIE allein: Geld auszahlen oder kürzen, Verträge abschließen oder kündigen, jemanden sperren,
Bewerber ablehnen, Streit entscheiden, Krankmeldungen ablehnen, medizinische Schlüsse ziehen.
Jede dieser Entscheidungen hat einen Freigabe-Knopf für das Büro mit Pflichtbegründung im Verlauf.
Jeder Vorschlag zeigt: "Warum?" (die erkannten Daten) und "Unsicher?" (Hinweis, wenn Lesung schlecht).
Ist der Assistent unsicher, fragt er den Menschen, er rät nicht.
Mitarbeiter sehen nie das Wort "KI", nur "Assistent".

STATUS-MODELL (für alle Abläufe gleich, eine Komponente "Verlauf")
entwurf, gesendet, in Prüfung, Rückfrage, bestätigt, abgelehnt (nur vom Büro, mit Grund), abgeschlossen.
Jeder Wechsel: Zeitstempel vom Server, Akteur (Mitarbeiter, Assistent, Büro), Grund. Verlauf ist nur lesbar.

1. KRANKMELDUNG (am wichtigsten, bitte besonders sorgfältig)
Ablauf Mitarbeiter: Button "Krank melden" auf Home und in Apps. Schritt 1: ab wann, voraussichtlich bis
wann (Datum wählen, "unklar" erlaubt). Schritt 2: optional Foto oder PDF der Bescheinigung (kann auch
später nachgereicht werden, mit Erinnerung). Schritt 3: Senden. Gesamt unter 20 Sekunden.
Automatisch danach:
 a) Büro bekommt sofort eine Mitteilung mit Name, Zeitraum und betroffenen Einsätzen.
 b) Betroffene Einsätze im Zeitraum werden markiert "Ausfall gemeldet". Der Mitarbeiter sieht sie als
    abgesagt wegen Krankheit, ohne dass er jeden einzeln absagen muss.
 c) Ersatz-Suche wird angestoßen: Vorschlagsliste verfügbarer Kollegen (Fähigkeiten, Sprachen, Nähe,
    Verfügbarkeit), das Büro wählt mit einem Tipp. Kein Kollege wird automatisch verpflichtet.
 d) Wenn eine Bescheinigung fehlt: Erinnerung nach 1 und nach 3 Tagen (freundlich, kurz). Danach nur
    Hinweis ans Büro, keine Sanktion durch den Assistenten.
 e) Wird eine Bescheinigung hochgeladen: Assistent liest nur Zeitraum und Ausstellungsdatum aus und
    gleicht mit der Meldung ab. Abweichung: "Rückfrage" zum Büro, nicht automatisch ablehnen.
 f) Verlängerung: Ein Tipp "Verlängern" mit neuem Enddatum, gleicher Ablauf.
 g) Gesundung: Ein Tipp "Wieder gesund ab", Einsätze werden wieder freigegeben, Büro informiert.
Datensparsamkeit (fest): Diagnosen NIE auslesen, anzeigen oder speichern. Gespeichert wird nur Zeitraum,
Ausstellungsdatum, Status und die Datei selbst (nur für Mitarbeiter und Büro-Personalrolle sichtbar).
Datei wird nach der gesetzlichen Frist zur Löschung vorgeschlagen. Auf dem Sperrbildschirm und in
Push-Texten steht kein Gesundheitsbezug, nur "Neue Nachricht".
Hinweis im Bildschirm: "Rechtliche Prüfung erforderlich" bei Fristen und Nachweispflichten
(Meldung unverzüglich, Nachweis nach Vertrag; elektronische Krankmeldung der Krankenkasse wird vom
Büro abgerufen). Der Assistent behauptet keine Rechtslage, er zeigt nur die im Betrieb hinterlegte Regel.
Sonderfälle bauen: Krank während laufendem Einsatz (Einsatz sofort beenden, Zeit bis dahin sichern),
Krank für Zeitraum mit Urlaub (Konflikt markieren, Büro entscheidet), doppelte Meldung (zusammenführen
mit Hinweis), Meldung ohne Netz (lokal vormerken, senden sobald Netz, Zeitpunkt der Absicht bleibt sichtbar).

2. PERFEKTE ZEITERFASSUNG
 - Start, Pause, Ende per Tipp. Zeitstempel kommt immer vom Server, nie vom Gerät. Der Client schickt nur
   die Art des Ereignisses.
 - Einstempeln nur am Einsatzort (Umkreis, einstellbar). Außerhalb: Hinweis und Antrag auf manuelle
   Freigabe, nie stilles Zulassen.
 - Pausenregel automatisch vorschlagen (gesetzliche Mindestpause je Dauer), Mitarbeiter bestätigt mit einem Tipp.
 - Der Assistent erkennt: vergessenes Ende (lange offener Einsatz), unmögliche Zeiten, Überschneidungen,
   Überschreiten der Minijob-Monatsgrenze (frühzeitige Warnung an Büro und Mitarbeiter), Mindestlohn
   unterschritten (blockiert die Abrechnung, Büro muss entscheiden).
 - Korrektur: Nur als Antrag mit Begründung, Büro gibt frei. Original bleibt im Verlauf sichtbar.
 - Am Tagesende: Zusammenfassung "Heute 6 h 30, Pause 30 min, bestätigt vom Kunden".
 - Monatsnachweis als PDF automatisch erzeugen (nur Anzeige von Daten, die das Büro freigegeben hat).

3. KUNDENUNTERSCHRIFT
 - Am Einsatzende: Kunde prüft Zeiten und Aufgaben, unterschreibt auf dem Gerät, gibt optional Sterne.
 - Daraus entsteht automatisch der Zeitnachweis (PDF) mit Auftragsnummer, Zeiten, Unterschrift, Zeitstempel.
 - Verweigert der Kunde oder reklamiert: Pflichtfeld Grund, Fall geht als Reklamation ans Büro.
   Der Assistent fasst den Fall neutral zusammen, entscheidet aber nichts.
 - Ohne Kunde vor Ort: Bestätigungslink an den Kunden, Erinnerung nach 24 h, danach Büro.

4. VERTRAGSUNTERSCHRIFT
 - Vertrag wird aus den Stammdaten und der freigegebenen Vorlage erzeugt (nur Minijob). Der Mitarbeiter sieht
   Zusammenfassung in einfacher Sprache und den vollen Text. Erst nach Scrollen bis zum Ende ist
   "Unterschreiben" aktiv.
 - Gespeichert: Vertragsversion, Zeitpunkt, Unterschriftsbild, Gerätehinweis. Kopie automatisch per E-Mail
   an den Mitarbeiter, Original im Dokumentenbereich.
 - Änderungen am Vertrag erzeugen eine neue Version, die erneut unterschrieben werden muss. Alte Versionen
   bleiben lesbar.
 - Vertragsvorlagen und Kündigungen sind immer "Rechtliche Prüfung erforderlich" und brauchen
   Büro-Freigabe vor Versand.

5. AUSWEIS-SCAN
 - Schritt für Schritt wie bei einer Banking-App: Ausweis Vorderseite, Rückseite, Arbeitserlaubnis falls
   nötig, Selfie. Live-Hilfe bei Unschärfe und Spiegelung ("Bitte näher heran").
 - Der Assistent liest Name, Geburtsdatum, Gültigkeit, Nummer. Der Mitarbeiter bestätigt oder korrigiert.
 - Gültigkeit wird überwacht, Erinnerungen 90, 60, 30, 7 Tage vorher, bei Ablauf wird der Mitarbeiter für neue
   Einsätze auf "Nachweis fehlt" gesetzt (Büro bestätigt die Sperre, nicht der Assistent).
 - Fotos nur verschlüsselt und nur für den Betroffenen und die Personalrolle. Nach Prüfung nur das
   Ergebnis behalten, Rohfotos nach der im Betrieb festgelegten Frist löschen vorschlagen.
 - Im Testmodus ausschließlich Beispielbilder.
 - Gesichtsabgleich Selfie gegen Ausweis nur als Hinweis an das Büro ("passt wahrscheinlich"), nie als
   Entscheidung. "Rechtliche Prüfung erforderlich" wegen Datenschutz.

6. BEWERBUNG LESEN
 - Bewerbung (Formular, Lebenslauf als PDF oder Foto) wird automatisch gelesen: Kontaktdaten, Sprachen mit
   Niveau, Fähigkeiten, Erfahrung, Verfügbarkeit, Führerschein.
 - Ergebnis als Karteikarte mit "Warum passt das?" für das Büro. Keine Bewertung nach Name, Herkunft,
   Alter, Geschlecht, Religion oder Gesundheit. Diese Angaben fließen nie in Vorschläge ein.
 - Entscheidung (Einladen, Zusage, Absage) macht immer ein Mensch. Standardtexte für Zusage und Absage
   werden vorgeschlagen und vom Büro freigegeben.
 - Zusage löst automatisch aus: Konto anlegen, Einführung, Vertragsablauf (Punkt 4), Ausweis-Scan (Punkt 5).

7. EINSÄTZE, ZUSAGEN, ERINNERUNGEN
 - Angebot erscheint auf Home. Zusage oder Absage mit einem Tipp (bei Absage kurzer Grund zur Auswahl).
 - Erinnerungen: am Vortag und eine Stunde vorher, mit Adresse, Ansprechperson und Hinweisen.
 - "Ich komme später" und "Adresse falsch" als Ein-Tipp-Meldung, Büro und (nach Freigabe) Kunde werden
   informiert.
 - Überschneidende Einsätze und Überschreiten der Wochen- oder Monatsgrenzen werden vorab gezeigt.

8. BÜRO-SICHT FÜR DIESE ABLÄUFE (kleiner Bereich "Freigaben" in der App für Rolle Büro, sonst unsichtbar)
 Eine Liste "Zu entscheiden" mit Karten: Krankmeldung mit Rückfrage, Zeitkorrektur, Reklamation,
 Ausweis zur Prüfung, Bewerbung, Vertrag zur Freigabe. Jede Karte zeigt den Vorschlag des Assistenten,
 "Warum?", und drei Knöpfe: Freigeben, Rückfrage, Ablehnen (mit Pflichtgrund).

REGELN (fest)
- Nie behaupten "rechtssicher", "zertifiziert" oder "100 % DSGVO-konform". Immer "Rechtliche Prüfung
  erforderlich", wo Recht berührt wird.
- Gesundheitsdaten, Ausweise, Unterschriften: Zugriff nur Betroffener und zuständige Büro-Rolle, nichts in
  Logs, Fehlertexten oder Push-Vorschauen.
- Alles, was nicht echt verbunden ist, trägt sichtbar "Testmodus" oder "Beispiel". Keine echten Personendaten
  im Testmodus.
- Keine Emojis. Handy und Computer gleich.

QUALITÄT
Jeder Ablauf hat Lade-, Fehler- und Leerzustand und bleibt ohne Netz verständlich. Reine Regeln (Pausen,
Fristen, Statusübergänge, Überschneidungen, Minijob-Grenze, Mindestlohn) in src/domain/ mit Tests. Daten nur
über src/data/DataSource.ts. Dann npm run check.

AUSSERDEM
Die Server-Automatisierung (Ablauf-Erinnerungen der Personalakte, Cron-Aufgaben, Behördenmeldungen) läuft
schon im Hamrah-System. NICHT nachbauen. Die App löst Aktionen aus und zeigt Ergebnisse.
```

## Zusatz 2: Autopilot, die App führt den Betrieb (zum Einfügen)

```
ZUSATZ-AUFTRAG 2: AUTOPILOT. Gleiche Credit-Grenze (insgesamt 90), nichts doppelt.

LEITBILD
Der Inhaber ist nicht im Büro. Die App führt den Betrieb: Sie plant, erinnert, stempelt, prüft,
rechnet vor, sammelt Nachweise und meldet nur Ausnahmen. Sie soll so gebaut sein, dass sie mit
tausenden Mitarbeitern und Einsätzen gleichzeitig funktioniert, ohne dass jemand von Hand
nachfasst. Ziel: jeder Prozess von Anfang bis Ende digital, ohne Papier, ohne Telefonate, ohne
doppelte Eingabe. Eine Eingabe, einmal, an einer Stelle, danach läuft alles weiter.

ARBEITSWEISE: EREIGNISSE STATT KNÖPFE
Jeder Prozess ist eine Kette aus Ereignissen: Auslöser, automatische Schritte, Wartepunkt
(nur wenn ein Mensch entscheiden muss), Abschluss. Baue EINE gemeinsame Ablauf-Schicht
(src/domain/flows/): Ereignis, Status, nächster Schritt, Frist, Erinnerung, Eskalation. Alle
Prozesse (Krankmeldung, Zeit, Vertrag, Ausweis, Bewerbung, Einsatz, Rechnung, Lohn-Vorbereitung)
nutzen diese eine Schicht. Keine Sonderlogik pro Bildschirm.

AUTOPILOT-STUFEN (einstellbar im Bereich "Freigaben", pro Prozess)
 Stufe 1 Assistent: schlägt vor, Mensch klickt.
 Stufe 2 Halbautomatik: erledigt Routine selbst, fragt bei Ausnahmen.
 Stufe 3 Autopilot: erledigt alles selbst, außer den Pflicht-Freigaben unten, und schickt dem
 Inhaber eine kurze Tageszusammenfassung.
Standard ist Stufe 2. Der Inhaber kann hochschalten. Jede Stufe zeigt klar, was sie darf.

PFLICHT-FREIGABEN (nie ohne Mensch, auch nicht in Stufe 3)
Auszahlung und Kürzung von Lohn, Kündigung und Vertragsabschluss mit Rechtsfolgen, Sperren
von Mitarbeitern, Ablehnung von Bewerbern, Streitfälle und Reklamationen, Krankmeldung
ablehnen, Rechnungs-Stornos, alles mit Gesundheits- oder Ausweisdaten außerhalb der
Standardprüfung. Der Mensch bekommt eine fertig vorbereitete Entscheidung mit Begründung und
drei Knöpfen: Freigeben, Rückfrage, Ablehnen. Der Inhaber bleibt Verantwortlicher, die App
ersetzt keine rechtliche Entscheidung.

WAS DER AUTOPILOT SELBST TUT (Beispiele, alle mit Verlauf)
 Einsatzplanung: passende Mitarbeiter vorschlagen und anfragen (Fähigkeit, Sprache, Nähe,
   Verfügbarkeit, Wochen- und Monatsgrenze, noch nicht überlastet), Zusagen einsammeln,
   Ersatz suchen, wenn jemand absagt oder krank ist, Kunden automatisch informieren (nach den
   gesetzten Regeln).
 Zeit: Erinnern, Stempeln prüfen, vergessene Enden erkennen, Pausen vorschlagen, Kundenbestätigung
   einholen, Zeitnachweis erzeugen, Monatsnachweise bereitstellen.
 Einstellung: Bewerbung lesen, Vorschlag erzeugen, nach Zusage Konto, Einführung, Vertrag,
   Ausweis-Scan, Bankdaten und Steuerangaben automatisch nacheinander anstoßen und nachfassen.
 Fristen: Ausweis- und Erlaubnisablauf, Schulungen, Verträge, Unterlagen, jeweils rechtzeitig
   erinnern und eskalieren (Mitarbeiter, dann Büro, dann Inhaber).
 Abrechnung: aus bestätigten Zeiten eine Lohn-Vorbereitung und Rechnungsentwürfe erzeugen
   (Mindestlohn- und Minijob-Prüfung, Auffälligkeiten markiert). Auszahlung und Versand an Kunden
   erst nach Freigabe.
 Kommunikation: Standardantworten im Chat vorschlagen oder (Stufe 3, nur Routinefragen) selbst
   senden, mit Hinweis "automatisch beantwortet". Alles Heikle geht an einen Menschen.

LEITSTAND (neuer Reiter "Leitstand" für die Rolle Inhaber/Büro, sonst unsichtbar)
Eine einzige Seite: Ampel pro Prozess (läuft, wartet auf Mensch, gestört), Zähler (heute im
Einsatz, offene Freigaben, Ausnahmen, Fristen diese Woche), Liste "Braucht dich" (sortiert nach
Dringlichkeit, jede Karte mit fertigem Vorschlag), Tageszusammenfassung in 5 Sätzen. Die Seite
zeigt in einer Minute, ob alles läuft. Wenn nichts zu tun ist, steht dort "Alles läuft".

GRÖSSE (denke von Anfang an so)
 Alles idempotent (ein Ereignis zweimal verarbeitet ergibt kein Doppel). Jede Aktion hat eine
 eindeutige Kennung. Listen immer paginiert und gefiltert, nie "alles laden". Erinnerungen und
 Eskalationen gebündelt, nicht einzeln gespammt. Fehler eines Mitarbeiters oder Einsatzes
 blockieren nie die anderen. Jede Warteschlange hat Status, Wiederholung und "gescheitert,
 Mensch informieren". Mehrmandantenfähig denken (spätere weitere Firmen), ohne es jetzt zu bauen.

NACHWEISE (alles beweisbar)
 Server-Zeit, Akteur, Version, Begründung, unveränderlicher Verlauf. Zu jedem Vorgang lässt sich
 ein Nachweis-PDF erzeugen (wer hat was wann bestätigt). Kein Löschen von Verlauf, nur
 Korrektur-Einträge.

SICHERHEIT UND RECHT
 Rechtliche Prüfung erforderlich bei allem, was Recht berührt, nie "rechtssicher" oder
 "100 % DSGVO-konform" behaupten. Zugriff streng nach Rolle. Gesundheit, Ausweis, Unterschrift,
 Bank: nur Betroffener und zuständige Rolle, nichts in Logs oder Push-Vorschauen. Alles nicht
 Echte trägt sichtbar "Testmodus" oder "Beispiel". Mitarbeiter sehen nie "KI", nur "Assistent".

ERLEICHTERUNG FÜR MITARBEITER (Maßstab für jeden Bildschirm)
Wenn ein Schritt mehr als drei Tipper braucht, vereinfache ihn. Nichts doppelt fragen, was die App
schon weiß. Vorbelegen statt eintippen. Fortschrittsanzeige und klare nächste Aktion auf Home
("Als Nächstes: Ausweis hochladen"). Keine Wartezeiten ohne Anzeige, was passiert.

DEINE AUFGABE JETZT (in dieser Reihenfolge, Credits sparen)
 1. Ablauf-Schicht src/domain/flows/ mit Tests (Status, Fristen, Eskalation, Stufen, Pflicht-Freigaben).
 2. Reiter "Leitstand" und Bereich "Freigaben" mit Beispieldaten über DataSource.
 3. Mindestens diese Abläufe anschließen: Krankmeldung, Zeit, Einsatz-Zusage, Ausweis-Fristen.
 4. Rest nur, wenn Credits übrig sind. Dann npm run check, pushen auf feature/emergent.

AUSSERDEM
Die Server-Automatisierung (Akte, Ablauf-Erinnerungen, Cron, Behördenmeldung) läuft schon im
Hamrah-System. NICHT nachbauen. Die App löst Aktionen aus und zeigt Ergebnisse.
```

## Zusatz 3: Zeiterfassung wie eine Fahrt-App (zum Einfügen)

```
ZUSATZ-AUFTRAG 3: SICHERE ZEITERFASSUNG WIE UBER. Gleiche Credit-Grenze (insgesamt 90), nichts doppelt.

ZIEL
Wir müssen sicher sein, dass der Mitarbeiter wirklich zum Einsatz geht, pünktlich ist und die Zeit stimmt.
Kunde, Firma und Mitarbeiter werden geschützt. WICHTIG: Der Kunde wird NICHT belästigt. Er scannt nichts,
bestätigt nichts extra und muss nie etwas tun. Die Sicherheit kommt allein vom Mitarbeiter und seinem Gerät.
Du darfst Struktur, Reihenfolge und Bildschirme selbst gestalten und verbessern. Denke mit.

DER WEG DES MITARBEITERS WIE EINE FAHRT (ein Bildschirm "Einsatz heute" mit großem Statusband)
Geplant -> Auf dem Weg -> Angekommen -> Läuft -> Beendet. Eine große Hauptaktion je Zustand (ein Tipp).
1. Erinnerungen: Vortag 18:00, 60 Min. vorher, 15 Min. vorher.
2. "Ich fahre los": Mitarbeiter tippt. Nur ab jetzt sammelt die App wenige Standortpunkte (alle ca. 60 s)
   bis zur Ankunft, mit Hinweis vorab (Datenschutz). Danach Punkte nicht mehr sammeln.
3. Anfahrt prüfen (reine Funktion): mindestens 3 Punkte, mindestens 5 Minuten beobachtet, Genauigkeit
   höchstens 150 m, nähert sich dem Einsatzort, kein Sprung (über 200 km/h bei mehr als 1 km), steht nicht
   nur zuhause still, Spur endet höchstens 5 Min. vor dem Stempeln. Schon vor Ort (früh da) ist in Ordnung.
4. Warnung vorher (Pünktlichkeit): Nicht losgefahren 60 bis 30 Min. vor Beginn = Hinweis an den Mitarbeiter,
   unter 30 Min. = Hinweis an das Büro mit Ersatz-Vorschlag. Unterwegs: voraussichtliche Ankunft aus
   Restentfernung (ca. 25 km/h). Absehbar bis 9 Min. später = Hinweis an Mitarbeiter, ab 10 Min. = Büro.
5. "Angekommen" stempeln: nur 5 Min. vor Beginn bis Plan-Ende, nur im Umkreis (Standard 150 m plus
   Genauigkeit bis 50 m), Serverzeit statt Gerätezeit. Gerät muss echt sein (App Attest / Play Integrity),
   Standort darf nicht simuliert sein, Gerät muss das registrierte Gerät des Mitarbeiters sein.
6. Ergebnis der Stempelung: "geprüft" bei echtem Gerät plus mindestens zwei Belegen aus Ort, Anfahrt, Foto
   (oder freiwilliger Bestätigung). Ein Beleg = angenommen, aber "ungeprüft" (Büro schaut nach). Kein Beleg =
   nur als Antrag an das Büro. Abgelehnt bei simuliertem Standort, fremdem Gerät, zu früh, nach Ende.
7. Ankunftsfoto (nur bei neuem Einsatzort, bei neuen Mitarbeitern in den ersten 5 Einsätzen und nach
   Auffälligkeit): Aufnahme nur mit der App-Kamera (keine Galerie), Aufgabe vom Server (z. B. "Foto vom
   Eingang"), Ort muss passen.
8. Pause und Ende: Pause Start/Ende per Tipp. Pausenpflicht-Hinweis (über 6 Std. = 30 Min., über 9 Std. =
   45 Min.). Ende mit Unterschrift der Ansprechperson auf dem Gerät des Mitarbeiters (so ist es schon geplant).
   Höchstens 10 Std. Arbeit pro Tag, 11 Std. Ruhezeit zwischen Einsätzen, Warnung vor der Minijob-Grenze.
9. Vergessenes Ausstempeln: 2 Std. nach Plan-Ende erkennen, Mitarbeiter fragen, Korrektur nur als Antrag
   mit Begründung, Büro gibt frei. Original bleibt im Verlauf sichtbar.

VORZEITIGES ENDE ("wir brauchen dich nur noch 2 statt 4 Stunden")
Mitarbeiter muss immer begründen (mindestens 10 Zeichen). Mit Unterschrift des Kunden vor Ort sofort bestätigt.
Ohne Unterschrift geht die Begründung als Information an den Kunden-Link, er kann annehmen oder ablehnen.
Annehmen = bestätigt. Ablehnen (mit Begründung) = Fall geht an das Büro. Schweigt der Kunde: nach 2 Std.
eine Erinnerung, nach 48 Std. Büro-Prüfung. Schweigen gilt NIE als Zustimmung und NIE als Ablehnung. Ende-Zeit
ist die Serverzeit der Anfrage. Der Mitarbeiter bekommt nie weniger als seine tatsächliche Arbeitszeit
automatisch gekürzt. Alles Weitere zur Abrechnung entscheidet das Büro. Jeder Schritt im Verlauf (wer, wann,
warum). Zustände: laufend, wartet_kunde, bestätigt, streit, büro_prüfung, entschieden.

KUNDEN-LINK (nur Information, keine Pflicht)
Der Kunde bekommt einen Link per SMS/E-Mail mit Status, zum Beispiel "Ihr Mitarbeiter ist unterwegs, Ankunft
gegen 08:55" (auf 5 Min. gerundet). KEINE Karte, KEINE genaue Position, KEIN Name. Dort kann er jederzeit
tippen: "Nicht gekommen", "Zu spät", "Zu früh gegangen", "Problem" (ab 15 Min. vor Beginn bis 24 Std. nach
Ende). Eine Meldung löst nie automatisch eine Strafe aus: das System vergleicht sie mit den Daten und gibt dem
BÜRO einen Hinweis mit Dringlichkeit. Beispiel: Kunde sagt "nicht gekommen", Daten zeigen "geprüft anwesend"
= Widerspruch, freundlich rückfragen. Keine Stempelung = Daten stützen die Meldung, hoch, sofort Ersatz prüfen.
Beide Seiten werden angehört.

AUFFÄLLIGKEITEN (reine Regeln, Hinweis für das Büro, kein Urteil)
Standort-Sprung zwischen Stempelungen, zwei Mitarbeiter mit demselben Gerät innerhalb 10 Min., 3 von 5
Stempelungen knapp am Rand des Umkreises, sechs Mal dieselbe Minute der Stunde. Ein Verdacht ist kein Beweis.

BÜRO-BEREICH "Freigaben" (nur für die Rolle Büro)
Karten für Auffälligkeiten, Korrekturanträge, Kundenmeldungen, Streitfälle, Gerätewechsel. Jede Karte zeigt den
Vorschlag, "Warum?" und drei Knöpfe: Freigeben, Rückfrage, Ablehnen (Pflichtgrund).

REGELN
- Bau die Regeln als reine, getestete Funktionen in src/domain/time/ (Anfahrt, Anwesenheit, Pünktlichkeit,
  vorzeitiges Ende, Pausen, Auffälligkeiten) mit Tests. Daten nur über src/data/DataSource.ts. Heute mit
  Beispieldaten ("Testmodus"). Die echte Serveranbindung und die unveränderliche Verlaufs-Tabelle kommen später
  im Hamrah-System, NICHT nachbauen.
- Das System meldet und schlägt vor. Maßnahmen gegen einen Mitarbeiter und Abzüge entscheidet immer ein Mensch.
  Lohn nur für tatsächlich geleistete Zeit, nie automatisch gekürzt.
- Standort nur im Fenster "Auf dem Weg" bis Ankunft, nie dauerhaft. Selfie/Gesichtsabgleich nicht als Standard.
- Nie behaupten "rechtssicher", "zertifiziert" oder "100 % DSGVO-konform". An passenden Stellen "Rechtliche
  Prüfung erforderlich". Mitarbeiter sehen nie das Wort "KI".
- Handy und Computer gleich. Jeder Ablauf mit Lade-, Fehler- und Leerzustand, verständlich ohne Netz.
- Gerätenachweis (App Attest, Play Integrity) braucht ein natives Modul und einen eigenen Build. Baue die
  Schnittstelle dafür ein (Feld "integrity: ok | schwach | fail") und simuliere im Testmodus.

REIHENFOLGE (Credits sparen): 1) reine Regeln mit Tests, 2) Bildschirm "Einsatz heute" mit Statusband und
Hauptaktion, 3) Pünktlichkeits-Warnungen, 4) vorzeitiges Ende, 5) Büro-"Freigaben", 6) Kunden-Link-Vorschau.
Dann npm run check und auf feature/emergent pushen. Bericht höchstens 3 Sätze pro Runde.
```
