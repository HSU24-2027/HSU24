# Funktionsliste der Mitarbeiter-App (vollständig, mit ehrlichem Stand)

Stand: 08.10.2026. Quelle der Aussagen: Dokumente und Code im Repo `Saadat-commits/https-www-interpreting-nbg-de`
(`main`): `docs/STAND.md`, `docs/HAMRAH_DIGITAL_WORKFLOW.md`, `docs/AUTOMATION_MAP.md`, `docs/design/mitarbeiter-app.md`,
`src/lib/*.functions.ts`, `src/components/team/*`, `src/components/team2/*`.
**Diese Liste wurde aus Dateinamen, Funktionsnamen und den Docs erstellt. Nicht jede Zeile Code wurde ausgeführt oder getestet.**
Wo etwas nur laut Doku so ist, steht "laut Doku".

## 0. Wofür diese Datei da ist
Wer an dieser Expo-App arbeitet (Claude Code, Emergent, Entwickler), baut **Funktion für Funktion** nach dieser Liste nach und hakt ab.
Die Expo-App soll **dieselben Funktionen, dieselben Regeln und dieselben Daten** wie die bestehende Hamrah-Mitarbeiter-App nutzen.
Nichts wird doppelt gebaut, nichts wird erfunden, nichts wird gelöscht.

## 1. Legende
- **FERTIG**: im Web-Code vorhanden und mit Server-Funktion verbunden (Funktionsname genannt). Ob es fehlerfrei läuft, ist damit nicht bewiesen.
- **TEST**: nur im Testmodus (Beispieldaten im Browser-Speicher, `team2/store.ts`), nicht mit der echten Datenbank verbunden.
- **LOGIK**: Regeln sind als getesteter Code da, aber noch nicht an Oberfläche oder Server angebunden.
- **FEHLT**: nicht gebaut.
- **OFFEN**: braucht eine Entscheidung des Inhabers, einen externen Dienst oder eine Rechtsprüfung.
- Spalte **Expo**: Stand in dieser Expo-App. Heute überall "Hülle" (Bildschirm da, keine echte Funktion) oder "fehlt". Seit der Zusammenführung: Bildschirme laufen über die DataSource mit markierten Demo-Daten (Zeit, Aufgaben, Aufträge, Lohn, Chat, Dokumente, Urlaub, Learning, Melden); "Hülle" heißt jetzt: noch nicht an die Hamrah-API angeschlossen.

## 2. Zwei Welten im Hamrah-Repo (wichtig zu verstehen)
1. **Die echte App `/app`** (`src/routes/app.tsx`) nutzt `src/components/team/*` und die Server-Funktionen (`useStaffApi`, `useCrewApi`, `useJobsApi`, `useChatApi`, `useMeApi`, `useAppsApi`, `useBankApi`). Sie spricht mit der Datenbank.
2. **Der Testmodus** (`/app?test=mitarbeiter`, früher `/mitarbeiter`) nutzt `src/components/team2/*` mit einem **Browser-Speicher** (`team2/store.ts`, `kunde2/store.ts`). Das ist eine Sandbox mit Beispieldaten, kein Echtbetrieb.
Die Expo-App richtet sich nach **Welt 1** (echt). Aus Welt 2 übernimmt sie nur Abläufe und Optik (zum Beispiel Bewerbung, Ausweis, Einführung).


### Wo der Code der bestehenden App liegt (Hamrah-Repo `Saadat-commits/https-www-interpreting-nbg-de`, Branch `main`)

| Was                              | Datei                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| Haupt-App (alle Bildschirme)     | `src/components/team2/app.tsx` (2867 Zeilen), `src/routes/app.tsx` |
| Bewerbung und Einstellung        | `team2/bewerbung.tsx`, `team2/onboarding.tsx`, `team2/ident.tsx`   |
| Einsatzzeit (Stempeln)           | `team2/einsatzzeit.tsx`, `kunde2/zeit.ts`, `kunde2/zeitkarten.tsx` |
| Recht, Minijob                   | `team2/recht.ts`, `team2/minijob.ts`                               |
| App-Center (Apps-Raster)         | `team2/hamrah-app-center.tsx`                                      |
| Design-Bausteine                 | `team2/ui2.tsx`                                                    |
| Server-Funktionen (Daten, Regeln)| `src/lib/{staff,me,jobs,crew,apps,chat,akte,ausweis,apply}.functions.ts` |
| Personalakte, Ablauf-Warnungen   | `src/lib/hr/*`, Cron `src/routes/api/cron/akte-ablauf.ts`          |
| Datenbank                        | `supabase/migrations/*` (Tabellen u. a. `team_members`, `jobs`, `job_assignments`, `time_entries`, `member_documents`, `absences`) |

## 3. Die Funktionen

### A. Zugang
| Funktion | Web-Stand | Quelle / Server-Funktion | Expo |
| --- | --- | --- | --- |
| Anmeldung mit E-Mail und Passwort | FERTIG | `teamSignIn` (staff.functions.ts), Supabase Auth | fehlt |
| Aktivierung eines neuen Kontos | FERTIG | `activationStart`, `activationCheck`, `activationComplete` | fehlt |
| PIN (6 Stellen), PIN ändern, Sperre nach 5 Min | FERTIG | `pinVerify`, `pinChange`, PIN-Sperre in der Team-App | fehlt |
| Face ID beim Öffnen | FERTIG im Wrapper `mobile/App.tsx` (WebView) | `expo-local-authentication` | fehlt (neu nativ) |
| Zwei-Faktor-Anmeldung (MFA) | OFFEN (laut `docs/FAHRPLAN.md` noch offen) | - | fehlt |
| Konto löschen in der App (Store-Pflicht) | OFFEN (laut `docs/HAMRAH_DIGITAL_WORKFLOW.md` Abschnitt 12 noch offen) | - | fehlt |

### B. Home
| Funktion | Web-Stand | Quelle | Expo |
| --- | --- | --- | --- |
| Verdienst des Monats (Betrag, Auszahlungstag, maskierte IBAN) | FERTIG (Daten) | `staffHome`, `myPayroll` | Hülle (zeigt Strich, keine Zahlen) |
| Schnellaktionen Stempeln, Aufträge, Melden, Apps | FERTIG | `staff.tsx`, `crew.tsx` | Hülle |
| Heutiger Einsatz, nächster Einsatz | FERTIG | `crewToday`, `crewEinsaetze` | Hülle |
| Offene Aufträge für dich | FERTIG | `jobBoard` | Hülle |
| Widgets: Verdienst-Kurve, Minijob-Grenze | TEST (Kurve), LOGIK (Minijob-Grenze in `team2/minijob.ts`) | `team2/minijob.ts`, `memberPerformance` | fehlt |
| Angebot / Werbung (nur hier, als "Angebot" markiert) | FEHLT als Inhalt | Design-Regel in `docs/design-mitarbeiter-app.md` | fehlt |

### C. Aufträge (Einsatz-Börse)
| Funktion | Web-Stand | Quelle | Expo |
| --- | --- | --- | --- |
| Karte mit Preis-Markern und eigenem Standort | FERTIG | `team/mmap.tsx`, `team/mapp.tsx` | fehlt (braucht Karten-Modul) |
| Liste und Filter (Neu, Dienstplan, Vergangene, Bewerbungen, Absagen) | FERTIG | `jobBoard`, `myJobs` | Hülle (Filter da, keine Daten) |
| Auftrag-Detail (Verdienst, Stundenlohn, Dauer, Datum, Entfernung, Mitbringen) | FERTIG | `jobBriefing`, `jobBoard` | fehlt |
| Auftrag übernehmen / bewerben, zurückziehen | FERTIG | `jobApply`, `jobDecide` | fehlt |
| Mindestlohn-Schutz (kein Satz unter Mindestlohn) | FERTIG (Server) | `src/lib/law.ts` | nicht nötig im Client |
| Doppelbuchung wird gesperrt, Statusfolge erzwungen | FERTIG (Server) | `jobs.server.ts`, `crew.server.ts` | nicht nötig im Client |
| Uber-Knopf "Mit Uber hinfahren" | FERTIG | `src/lib/uber.ts` | fehlt |

### D. Einsatz, Stempeln, Zeit (Hamrah Time)
| Funktion | Web-Stand | Quelle | Expo |
| --- | --- | --- | --- |
| Standort-Prüfung (Umkreis 150 m), Einstempeln | FERTIG | `jobCheckIn`, `crewCheckIn`, `crewPing`, `staffStamp` | Hülle (nur Stoppuhr, Testmodus) |
| Pause, Ausstempeln | FERTIG | `jobCheckOut`, `team2/einsatzzeit.tsx`, `kunde2/zeit.ts` | Hülle (nur Stoppuhr) |
| Ereignisprotokoll mit Serverzeit, Zeitnachweis | FERTIG, getestet (`tests/unit/zeit.test.ts`) | `kunde2/zeit.ts`, `jobProof` | fehlt |
| Kunde bestätigt: Unterschrift, Sterne | FERTIG | `jobProof`, `customerRate` | fehlt |
| Zeit-Reklamation, Korrekturantrag | FERTIG | `timeDesk`, `jobManualTime` | fehlt |
| Melden: später, krank, Problem, Adresse falsch, Foto | FERTIG | `jobIncident`, `incidentDraft`, `staffAbsence` | Hülle |
| Nachricht an den Kunden (Vorschlag per Assistent, Mensch sendet) | FERTIG | `incidentDraft` | fehlt |
| Einsatz-Chat | FERTIG | `jobChat`, `jobChatSend` | fehlt |

### E. Lohn und Finanzen
| Funktion | Web-Stand | Quelle | Expo |
| --- | --- | --- | --- |
| Lohn und Gehalt: Monat, Einsätze einzeln, Abzüge, Auszahlung | FERTIG | `myPayroll`, `jobAccounting`, `team/me.tsx` (PayrollView) | Hülle (leer, keine Beträge) |
| Nachweis als PDF, Monat drucken | FERTIG | `team/me.tsx` | fehlt |
| Auswertung: Verdienst, Stunden, Pünktlichkeit, "Wo du gearbeitet hast" | FERTIG | `memberPerformance`, `team/manalysen.tsx` | fehlt |
| Auszahlung / Bank (Revolut Business) | Vorbereitet, Sandbox; Mollie/Stripe/Revolut-Schlüssel fehlen | `bank.functions.ts`, `team/bank.tsx`, `bank.server.ts` | fehlt |
| Minijob-Grenze und Kosten | LOGIK | `team2/minijob.ts` | fehlt |
| Lohnabrechnung rechtlich (Steuer, SV, DEÜV) | OFFEN (Steuerberater, Lohnprogramm) | `docs/LEGAL_COMPLIANCE_MATRIX.md` | fehlt |
| "Finanz-App" im Apps-Raster für freigeschaltete Rollen | FERTIG (für Rollen mit Freigabe) | `financeRanking`, `team/bank.tsx`, `appsMe` | fehlt |

### F. Dokumente und digitaler Vertrag
| Funktion | Web-Stand | Quelle | Expo |
| --- | --- | --- | --- |
| Meine Dokumente (Alle, Vertrag, Lohn), "Neu"-Marke | FERTIG | `myDocuments`, `team/me.tsx` (DocumentsView) | Hülle (leer) |
| Dokument hochladen (Foto, PDF), löschen | FERTIG | `documentUpload`, `documentDelete` | fehlt |
| **Arbeitsvertrag lesen und digital unterschreiben (einfache Zeichen-Unterschrift)** | FERTIG | `documentSign`, `member_documents.signature` | fehlt |
| Vertrag erzeugen, Version mit Prüfsumme, Signaturstufen | LOGIK (Migration `20261016090000`, `lib/hr/signature.ts`); **Migration noch nicht in der echten Datenbank geprüft** | `lib/hr/signature.ts`, `document_versions`, `contract_signatures` | fehlt |
| Qualifizierte / fortgeschrittene Signatur (eIDAS) | OFFEN (Vertrauensdienst fehlt) | - | fehlt |
| Vertragsänderung, Kündigung | FERTIG nur als Entwurf; **Kündigung nur schriftlich wirksam (§ 623 BGB)**, nicht in der App | `contractChange`, `terminationCreate`, `myResignation`, `member_terminations` | fehlt |
| Vertragstexte | OFFEN: LEGAL REVIEW REQUIRED | `contract_templates` | - |

### G. Chat und Assistent
| Funktion | Web-Stand | Quelle | Expo |
| --- | --- | --- | --- |
| Team-Ankündigungen, Kanäle, Einzelchats, ungelesen | FERTIG | `chatOverview`, `channelMessages`, `channelSend`, `chatThreads`, `chatMessages`, `chatSend`, `team/chat.tsx` | Hülle (leer) |
| Datei und Foto im Chat | FERTIG (laut Aufgabenliste) | `chat.functions.ts` | fehlt |
| **Assistent für Mitarbeitende** (im Design oben im Chat vorgesehen) | **Im Code nicht gefunden.** Der KI-Assistent "Lina" gibt es im Chef-Cockpit (`team/office.tsx`, `office.functions.ts`), für Kunden gibt es `sendChatMessage`/`accountAssistant`. Für Mitarbeitende ist er laut Design geplant, aber nicht gefunden. | - | Hülle (Name "Assistent", ohne Funktion) |
| Regel: Mitarbeitende sehen nie das Wort "KI" | Design-Regel | `docs/design-mitarbeiter-app.md` | eingehalten |

### H. Apps-Raster
| Funktion | Web-Stand | Quelle | Expo |
| --- | --- | --- | --- |
| Mein Bereich, vom Chef freigeschaltet (Sehen/Bearbeiten), gesperrt | FERTIG | `appsMe`, `accessOverview`, `accessSave`, `team2/hamrah-app-center.tsx` | Hülle (Mein Bereich, "nichts freigeschaltet") |
| Chef-Apps (Personal, Einsatzplanung, Finanzen, Dokumente, KI-Büro) | FERTIG, **eigener Teil für den Inhaber**, nicht Teil der Mitarbeiter-App | `team/office.tsx`, `team/personnel.tsx`, `team/ocockpit.tsx` | nicht Teil dieser App |
| IT-Tools / Werkzeuge im App-Center | Neu, andere Sitzung (`team2/it-tools-app.tsx`) | - | fehlt |
| My Learning (Schulungen, Onboarding, Quiz) | FEHLT in der Web-App; in `EMERGENT_HANDOFF.md` als neuer Bereich gefordert | - | Hülle (Kachel) |

### I. Profil und persönliche Daten
| Funktion | Web-Stand | Quelle | Expo |
| --- | --- | --- | --- |
| Persönliche Daten ändern (Kontakt, Adresse, Notfall) | FERTIG | `staffProfileSave`, `crewSaveMyData`, `team/crew.tsx` (MyDataForm) | Hülle |
| Bank, Steuer-ID, SV-Nummer, Krankenkasse (Büro prüft) | FERTIG, **Klartext in der Datenbank, Verschlüsselung offen** (laut Doku) | `team_members`, `staffProfileSave` | fehlt |
| Aufenthalt / Arbeitserlaubnis (Kopie, Wiedervorlage) | FERTIG (Testmodus), Prüfung durch Büro | `team2/ident.tsx`, `confirmWorkAuthorization` | fehlt |
| Verfügbarkeit, Abwesenheit, Urlaub | FERTIG | `staffAbsence`, `staffAbsenceDelete`, `availability` | Hülle |
| Bewertungen, Vorteile | FERTIG | `benefitsList`, `reviews` | Hülle |
| Einstellungen: Design, Benachrichtigungen, Sicherheit, Sprache | FERTIG | `mySettings`, `saveSettings`, `team/me.tsx` (SettingsPanel) | Hülle |
| Rechtliches: Datenschutz, Kündigen nur schriftlich | FERTIG (Texte: LEGAL REVIEW REQUIRED) | `src/routes/datenschutz.tsx` | Hülle |
| Sprachen de/en/fa/ps | Web: fa/ps brauchen Muttersprachler-Prüfung | `src/lib/i18n.ts` | fehlt |

### J. Bewerbung und Einstellung (vor und direkt nach der Anmeldung)
| Funktion | Web-Stand | Quelle | Expo |
| --- | --- | --- | --- |
| Bewerbung (Fragen, Lebenslauf lesen, Fähigkeiten) | FERTIG; Lebenslauf-Auswertung ist "Lesehilfe", entscheidet nie | `applyOptions`, `applySubmit`, `readCv`, `team2/bewerbung.tsx` | fehlt |
| Ausweis fotografieren und lesen, Selfie, Prüfung | TEST/FERTIG, Bild wird nicht gespeichert; Bestätigung nur durch Büro | `readIdDocument`, `verifyIdentity`, `team2/ident.tsx` | fehlt |
| eID (Online-Ausweisfunktion), Liveness/Gesicht | OFFEN (Anbieter und Rechtsprüfung fehlen) | `docs/HAMRAH_DIGITAL_WORKFLOW.md` Abschnitt 3 | fehlt |
| Lohn-Angaben (Steuer-ID, SV, Krankenkasse, IBAN, weitere Beschäftigung) | FERTIG | `team2/onboarding.tsx` | fehlt |
| Vertrag unterschreiben, Personalnummer, Hamrah-Ausweis (QR, PIN 30 s) | TEST | `team2/onboarding.tsx`, `kunde2/ausweis.ts` | fehlt |
| Einführung (Tour) | FERTIG | `team2/tour.tsx` | fehlt |

### K. Personalakte, Automatik, Behörden (Büro-Seite mit Wirkung auf die Mitarbeiter)
| Funktion | Web-Stand | Quelle | Expo |
| --- | --- | --- | --- |
| Meine Akte (Mitarbeiter sieht eigene Unterlagen und Fristen) | FEHLT (laut Doku "nächste Stufe") | Tabellen vorhanden | fehlt |
| Ablauf-Warnung für Ausweis, Aufenthaltstitel (90, 60, 30, 7 Tage) | LOGIK, getestet; Tageslauf `/api/cron/akte-ablauf` existiert, **im Lovable-Zeitplan noch einzutragen** | `lib/hr/expiry.ts`, `akte.server.ts` | fehlt (nur Anzeige nötig) |
| Bei Ablauf: Aufgabe für Büro, niemand wird automatisch gesperrt | LOGIK | `lib/hr/expiry.ts` | - |
| Onboarding-Lückenliste (wer muss was tun) | LOGIK, Anbindung offen | `lib/hr/onboarding.ts` | fehlt |
| Automatik-Regeln (`dok_ablauf`, `dok_abgelaufen`, `onboarding_vollstaendig`, `meldung_faellig`, `offboarding_start`) | LOGIK; "Anbindung offen"; Folgen für Personen laufen nie allein | `lib/hr/automation.ts`, `docs/AUTOMATION_MAP.md` | - |
| Bestehende Automatik: Zahlungserinnerung (täglich), Mindestlohn, Doppelbuchung, Statusfluss | FERTIG und läuft laut Doku | `/api/cron/erinnerungen` | - |
| Behörden-Meldungen (SV-Anmeldung, Sofortmeldung) vorbereiten, Status | LOGIK; **keine Behörden-Schnittstelle gebaut** | `lib/hr/government.ts`, `akteOverview`, `createGovernmentReport` | - |
| Fähigkeitsprofil mit Beleg, Zuteilungs-Vorschläge mit Begründung (Büro entscheidet) | LOGIK; Matching in Büro-Zuteilung nicht eingehängt | `lib/hr/skills.ts`, `src/domains/matching` (neu) | - |
| Offboarding (Einsätze beenden, Zugriffe reduzieren, Abmeldung) | Nur Regel angelegt, Ausführung offen | `member_terminations` | - |

### L. Benachrichtigungen
| Funktion | Web-Stand | Quelle | Expo |
| --- | --- | --- | --- |
| Mitteilungen in der App (Liste, gelesen) | FERTIG | `notificationsList`, `notificationsRead`, `app_notifications` | fehlt |
| Push-Mitteilungen aufs Handy | FEHLT (offen, empfohlen für Store-Freigabe) | `docs/STORE-CHECKLISTE.md` | fehlt |
| E-Mail und SMS aus dem System | E-Mail: `outbox` vorhanden; SMS/WhatsApp nicht geprüft | `outbox`, `src/domains/notifications` (neu, Regeln) | - |

### M. Sicherheit und Recht (gilt für alles)
- Server prüft Anmeldung und Rolle bei jeder Funktion (147 von 168 mit Auth). Mitarbeitende sehen **nur eigene** Daten. Die Expo-App darf **nie** direkt auf fremde Daten zugreifen.
- Keine Schlüssel im Client. Keine erfundenen Zahlen. Testmodus sichtbar. Keine Emojis, keine Flaggen.
- Steuer-ID, SV-Nummer, IBAN sind heute im Klartext in `team_members`: **Verschlüsselung offen**.
- Offene Rechtsfragen (alle: LEGAL REVIEW REQUIRED): Arbeitnehmerüberlassung, Betriebsrat, Datenschutz-Folgenabschätzung, EU-KI-Verordnung (Aufgabenzuteilung, Bewerberauswahl), § 20 PAuswG, Signaturformen, Aufbewahrungsfristen. Siehe `docs/LEGAL_COMPLIANCE_MATRIX.md` im Hamrah-Repo.

## 4. Testlage der bestehenden Web-App (ehrlich)
- Unit-Tests vorhanden: `zeit.test.ts` (Zeit-Kern), `personalakte.test.ts` (22 Prüfungen), `partner.test.ts`, `abgleich*.test.ts`, `order.test.ts`, `domains.test.ts`, `sitemap.test.ts`, `headers.test.ts`.
- End-to-End: `einsatz-zeit.mjs`, `mitarbeiter-einstellung.mjs`, `zugang.mjs`, `geraete.mjs`. Laut `docs/STAND.md` scheiterte `npm run test:e2e` (Mitarbeiter-App) schon vor dem Neubau am Knopf "Wann kommt mein Lohn?".
- Am 08.10.2026 hatte `main` im Hamrah-Repo 43 Typfehler in `src/components/team/mapp.tsx` und `src/routes/chef.tsx` (Arbeitsstand einer anderen Sitzung, mit nicht definierten Variablen). **Das muss vor dem Anbinden geklärt werden.**
- Die Datenbank-Migration der Personalakte wurde nicht gegen eine echte Datenbank ausgeführt.

## 5. Bauplan für die Expo-App (Reihenfolge, je Schritt prüfbar)
Jeder Schritt: Typcheck grün, auf dem Handy geprüft, ehrlich "Testmodus" wo nötig. **Erst die Schnittstelle, dann die Bildschirme.**

0. **Schnittstelle im Hamrah-Repo** (`src/routes/api/mobile/*`): dünne HTTP-Endpunkte, die dieselben Funktionen und Prüfungen wie die Web-App nutzen (Bearer-Token von Supabase, Rolle und PIN serverseitig, Rate-Limit, Zod-Prüfung). **Keine Logik doppelt.** Endpunkte (Vorschlag): `/api/mobile/me`, `/home`, `/jobs`, `/jobs/:id/apply`, `/time/checkin`, `/time/checkout`, `/payroll`, `/documents`, `/documents/:id/sign`, `/chat/*`, `/notifications`, `/profile`, `/absence`, `/report`.
1. **Anmeldung:** E-Mail und Passwort (Supabase), PIN, Face ID, sicherer Speicher für das Token (`expo-secure-store`). Fertig, wenn: Anmelden, PIN setzen, App sperren nach 5 Min.
2. **Home und Einsätze (nur lesen):** `/me`, `/home`, `/jobs`. Fertig, wenn: echter heutiger Einsatz und echte Liste, leer wenn keine Daten.
3. **Aufträge übernehmen** und Detail.
4. **Stempeln mit Standort** (`expo-location`, Umkreis, Serverzeit, Pause, Ende) und Kunde bestätigt (Unterschrift, Sterne).
5. **Melden** (später, krank, Problem, Adresse falsch, Foto per `expo-image-picker`).
6. **Lohn** (nur eigene Daten, PDF-Nachweis).
7. **Dokumente und Vertrag:** lesen, hochladen, **digital unterschreiben** (`documentSign`). Rechtstexte erst nach Anwalt (LEGAL REVIEW REQUIRED).
8. **Chat** (Kanäle, Einsatz-Chat), danach Assistent (nur wenn Mitarbeiter-Assistent im Hamrah-Repo existiert oder freigegeben wird).
9. **Profil und persönliche Daten, Verfügbarkeit, Abwesenheit, Einstellungen.**
10. **Mitteilungen** und **Push** (Expo Notifications, Zustimmung, Abmeldung).
11. **Bewerbung und Einstellung** nativ (Kamera: Ausweis, Selfie).
12. **Meine Akte** (Fristen, Ablauf-Hinweise) sobald das Büro-Teil im Hamrah-Repo fertig ist.
13. **My Learning** (neuer Bereich, Inhalte vom Inhaber).
14. **Store-Reife:** Konto löschen, Datenschutz, Test-Zugang für Prüfer, Barrierefreiheit, Berechtigungstexte (siehe `docs/STORE-CHECKLISTE.md` im Hamrah-Repo).

## 6. Entscheidungen und Freigaben, die der Inhaber treffen muss
1. Sollen Mitarbeitende einen **Assistenten** im Chat bekommen (heute für sie nicht gefunden)? Wenn ja, welche Regeln?
2. Identitätsanbieter (eID, Liveness), Signaturdienst, SV-Meldeweg: **Entscheidung offen**.
3. Zahlungsanbieter-Schlüssel (Mollie, Stripe, Revolut): fehlen.
4. Apple Developer Programm (etwa 99 € pro Jahr) und Google Play (einmalig etwa 25 $): nicht geprüft, vor dem Bezahlen nachsehen.
5. Anwalt und Steuerberater für Verträge, Fristen, Lohn.
6. Push-Mitteilungen: bauen ja oder nein.
7. Der Tageslauf `/api/cron/akte-ablauf` muss im Lovable-Zeitplan eingetragen werden.

## 7. Regeln für alle, die hier bauen
- Zuerst `docs/design-mitarbeiter-app.md`, `docs/design-hamrah-kurz.md`, diese Datei.
- Eine Funktion nach der anderen. Nach jedem Schritt: `npm run typecheck`, auf dem Handy prüfen, Commit auf `feature/mitarbeiter-app`.
- Nichts löschen, nichts doppelt bauen, keine erfundenen Zahlen, keine Geheimnisse im Code.
- Demo und Testmodus immer sichtbar markieren. Mitarbeitende sehen nie das Wort "KI".
- Geld, Sperren, Kündigungen, Streit, Behördenmeldungen: nie automatisch, immer ein Mensch im Büro.
- Dort, wo ein Satz rechtlich klingt: "LEGAL REVIEW REQUIRED", nie "rechtssicher" oder "zertifiziert".
