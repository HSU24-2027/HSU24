# HSU Mitarbeiter-App: Architektur

Stand: zusammengeführte App (eine Codebasis), Revolut-Stil, klassisch weiß (dunkel wählbar). Funktionen und Quellcode der bestehenden App: `docs/FUNKTIONSLISTE.md`. 

## Aufbau (eine App, Expo Router)
```
app/_layout.tsx          Wurzel: Theme, Anmeldung, Stempeluhr, Stack mit Schutz (angemeldet / Login)
app/login.tsx            Anmeldung bzw. Demo
app/(tabs)/              Reiter in schwebender Kapsel: index (Home), auftraege, lohn, chat, apps
app/*.tsx, app/*/[id]    zeit, aufgaben, profil, melden, dokumente, urlaub, learning, einsatz/[id], aufgabe/[id]
src/design/              Tokens und ThemeProvider (Standard hell (Revolut-Stil), Dunkel/System wählbar)
src/components/          ein Satz Bausteine (Screen, Card, ListItem, Button, Badge, ...)
src/data/DataSource.ts   einziger Zugang zu Daten (Schnittstelle)
src/data/mock/           klar markierte Demo-Daten (nur im Speicher)
src/data/supabase/       Server-Anbindung (wird auf die Hamrah-API umgestellt, siehe FUNKTIONSLISTE Schritt 0)
src/domain/              reine Regeln (Zeit, Urlaub, Lernen, Einsätze), getestet in tests/
```

Der frühere Prototyp liegt unverändert in `docs/prototype-App.tsx.txt` und in der Git-Historie (Commit a55886e).

## Regeln
1. Die App speichert keine Geschäftsdaten selbst. Alles kommt über das Repository vom Server.
2. Demo-Daten sind immer sichtbar markiert („Testmodus").
3. Zeiten, Lohn und Personaldaten werden in der App nie erfunden oder berechnet.
4. Keine Geheimnisse im Client. Anmeldung, Rollen und API kommen in Phase 2 über das Repository.
5. Mindestgröße der Tippflächen 48, Beschriftungen für Screenreader, Kontrast mindestens 4,5 zu 1.
6. Keine Emojis, keine Kleinschrift-Überzeilen über Überschriften.

## Nächste Phasen
- Phase 2: Anmeldung, Rollen, echte Einsätze und Zeiterfassung (Serverzeit, Korrekturantrag).
- Phase 3: My Learning, Benachrichtigungen, Dokumente, Tests.
- Phase 4: Sicherheitsprüfung, Geräte-Tests, Veröffentlichung (nur nach separater Freigabe).

## Start
```
npm install
npx expo start --tunnel      # oder --lan im selben WLAN
npm run check      # Typen, Lint, Tests
```
