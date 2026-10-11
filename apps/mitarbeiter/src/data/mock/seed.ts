/**
 * DEMO-DATEN – frei erfunden, keine echten Personen, Einsätze, Arbeitszeiten oder Löhne.
 * Werden nur im Demo-Modus (EXPO_PUBLIC_DATA_MODE=mock) verwendet und in der UI gekennzeichnet.
 */
import { countWorkdays } from '../../domain/leave';
import { coursesFromStarterModules } from '../../domain/learning';
import type {
  Availability,
  Conversation,
  Course,
  Employee,
  EmployeeDocument,
  LeaveBalance,
  LeaveRequest,
  Notification,
  Payslip,
  Shift,
  Task,
  TimeEntry,
} from '../../domain/types';

function at(dayOffset: number, hours: number, minutes = 0, base: Date = new Date()): string {
  const d = new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate() + dayOffset,
    hours,
    minutes,
  );
  return d.toISOString();
}

function dateOnly(dayOffset: number, base: Date = new Date()): string {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + dayOffset);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d
    .getDate()
    .toString()
    .padStart(2, '0')}`;
}

function period(monthsBack: number, base: Date = new Date()): string {
  const d = new Date(base.getFullYear(), base.getMonth() - monthsBack, 1);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
}

export type MockDb = {
  profile: Employee;
  shifts: Shift[];
  timeEntries: TimeEntry[];
  tasks: Task[];
  conversations: Conversation[];
  notifications: Notification[];
  documents: EmployeeDocument[];
  payslips: Payslip[];
  leaveBalance: LeaveBalance;
  leaveRequests: LeaveRequest[];
  availability: Availability;
  courses: Course[];
};

export function createSeed(base: Date = new Date()): MockDb {
  const starter = coursesFromStarterModules();
  return {
    profile: {
      id: 'demo-employee',
      firstName: 'Alex',
      lastName: 'Beispiel',
      email: 'alex.beispiel@example.com',
      personnelNumber: 'DEMO-0001',
      role: 'employee',
      department: 'HSU24 · Standort Nürnberg (Demo)',
      phone: '+49 000 0000000',
    },
    shifts: [
      {
        id: 's1',
        title: 'Büroreinigung (Beispiel)',
        start: at(0, 8, 0, base),
        end: at(0, 16, 30, base),
        breakMinutes: 30,
        location: {
          name: 'Bürohaus Nürnberg-Mitte (Beispiel)',
          address: 'Beispielstraße 1, 90402 Nürnberg',
        },
        contact: { name: 'Jana Vorbild (Teamleitung)', phone: '+49 000 1111111' },
        status: 'confirmed',
        notes: 'Bitte 10 Minuten früher zur Übergabe erscheinen.',
      },
      {
        id: 's2',
        title: 'Umzugshelfer (Beispiel)',
        start: at(1, 12, 0, base),
        end: at(1, 20, 0, base),
        breakMinutes: 30,
        location: {
          name: 'Privatumzug München (Beispiel)',
          address: 'Beispielallee 12, 80331 München',
        },
        contact: { name: 'Tom Platzhalter', phone: '+49 000 2222222' },
        status: 'offered',
      },
      {
        id: 's3',
        title: 'Service im Restaurant (Beispiel)',
        start: at(1, 18, 0, base),
        end: at(1, 23, 0, base),
        breakMinutes: 0,
        location: { name: 'Standort Musterstraße', address: 'Musterstraße 1, 00000 Beispielstadt' },
        contact: { name: 'Jana Vorbild (Teamleitung)' },
        status: 'confirmed',
      },
      {
        id: 's4',
        title: 'Veranstaltung Aufbau (Beispiel)',
        start: at(3, 7, 30, base),
        end: at(3, 15, 30, base),
        breakMinutes: 30,
        location: { name: 'Standort Musterstraße', address: 'Musterstraße 1, 00000 Beispielstadt' },
        contact: { name: 'Jana Vorbild (Teamleitung)' },
        status: 'confirmed',
      },
      {
        id: 's5',
        title: 'Dolmetschen vor Ort (Beispiel)',
        start: at(6, 9, 0, base),
        end: at(6, 14, 0, base),
        breakMinutes: 30,
        location: { name: 'Schulungsraum 2', address: 'Lernweg 3, 00000 Beispielstadt' },
        contact: { name: 'Mia Muster (Ausbildung)' },
        status: 'offered',
      },
      {
        id: 's0',
        title: 'Spülkraft Küche (Beispiel)',
        start: at(-2, 8, 0, base),
        end: at(-2, 16, 0, base),
        breakMinutes: 30,
        location: { name: 'Standort Musterstraße', address: 'Musterstraße 1, 00000 Beispielstadt' },
        contact: { name: 'Jana Vorbild (Teamleitung)' },
        status: 'completed',
      },
    ],
    timeEntries: [
      {
        id: 't1',
        date: dateOnly(-1, base),
        start: at(-1, 8, 2, base),
        end: at(-1, 16, 31, base),
        breakMinutes: 30,
        workedMinutes: 479,
        status: 'pending',
      },
      {
        id: 't2',
        date: dateOnly(-2, base),
        start: at(-2, 7, 58, base),
        end: at(-2, 16, 4, base),
        breakMinutes: 30,
        workedMinutes: 456,
        status: 'approved',
      },
      {
        id: 't3',
        date: dateOnly(-3, base),
        start: at(-3, 12, 0, base),
        end: at(-3, 20, 15, base),
        breakMinutes: 45,
        workedMinutes: 450,
        status: 'approved',
      },
      {
        id: 't4',
        date: dateOnly(-6, base),
        start: at(-6, 8, 0, base),
        end: at(-6, 14, 0, base),
        breakMinutes: 0,
        workedMinutes: 360,
        status: 'rejected',
      },
    ],
    tasks: [
      {
        id: 'k1',
        title: 'Arbeitsmaterial prüfen',
        description: 'Ausweis, Funkgerät und Dienstkleidung vor Schichtbeginn kontrollieren.',
        priority: 'high',
        status: 'open',
        due: at(0, 8, 0, base),
        shiftId: 's1',
        checklist: [
          { id: 'c1', label: 'Dienstausweis', done: true },
          { id: 'c2', label: 'Funkgerät geladen', done: false },
          { id: 'c3', label: 'Dienstkleidung', done: false },
        ],
        commentCount: 1,
        attachmentCount: 0,
      },
      {
        id: 'k2',
        title: 'Einsatzbestätigung vorbereiten',
        description: 'Zu- oder Absage für den Veranstaltungsdienst geben.',
        priority: 'medium',
        status: 'in_progress',
        due: at(1, 10, 0, base),
        shiftId: 's2',
        checklist: [],
        commentCount: 0,
        attachmentCount: 1,
      },
      {
        id: 'k3',
        title: 'Dokumente aktualisieren',
        description: 'Neue Datenschutzrichtlinie lesen und bestätigen.',
        priority: 'low',
        status: 'open',
        due: at(4, 18, 0, base),
        checklist: [],
        commentCount: 0,
        attachmentCount: 1,
      },
      {
        id: 'k4',
        title: 'Übergabeprotokoll ausfüllen',
        priority: 'medium',
        status: 'done',
        due: at(-2, 16, 0, base),
        shiftId: 's0',
        checklist: [],
        commentCount: 2,
        attachmentCount: 0,
      },
    ],
    conversations: [
      {
        id: 'm1',
        title: 'Jana Vorbild',
        kind: 'direct',
        lastMessage: 'Danke für die schnelle Rückmeldung!',
        lastMessageAt: at(0, 7, 12, base),
        unread: 1,
      },
      {
        id: 'm2',
        title: 'Büroreinigung Nürnberg',
        kind: 'shift',
        lastMessage: 'Parkplätze heute auf der Rückseite.',
        lastMessageAt: at(0, 6, 45, base),
        unread: 2,
      },
      {
        id: 'm3',
        title: 'HSU24 Mitteilungen',
        kind: 'announcement',
        lastMessage: 'Neue Schulung „Sicher arbeiten“ verfügbar.',
        lastMessageAt: at(-1, 15, 0, base),
        unread: 0,
      },
    ],
    notifications: [
      {
        id: 'n1',
        title: 'Neuer Einsatz angeboten',
        body: 'Veranstaltungsdienst morgen, 12:00 – 20:00',
        at: at(0, 6, 30, base),
        read: false,
        kind: 'shift',
      },
      {
        id: 'n2',
        title: 'Dokument bereitgestellt',
        body: 'Datenschutzrichtlinie 2026 bitte bestätigen',
        at: at(-1, 9, 0, base),
        read: false,
        kind: 'document',
      },
      {
        id: 'n3',
        title: 'Zeiteintrag freigegeben',
        body: 'Dein Eintrag vom Vortag wurde freigegeben',
        at: at(-1, 17, 0, base),
        read: true,
        kind: 'system',
      },
    ],
    documents: [
      {
        id: 'd1',
        title: 'Arbeitsvertrag (Demo)',
        category: 'contract',
        updatedAt: at(-120, 9, 0, base),
        version: 1,
        sizeKb: 240,
      },
      {
        id: 'd2',
        title: 'Datenschutzrichtlinie 2026',
        category: 'policy',
        updatedAt: at(-1, 9, 0, base),
        version: 3,
        sizeKb: 180,
        requiresAcknowledgement: true,
      },
      {
        id: 'd3',
        title: 'Erste-Hilfe-Nachweis',
        category: 'certificate',
        updatedAt: at(-40, 9, 0, base),
        version: 1,
        sizeKb: 95,
      },
      {
        id: 'd4',
        title: 'Personalfragebogen',
        category: 'personal',
        updatedAt: at(-118, 9, 0, base),
        version: 2,
        sizeKb: 130,
      },
    ],
    payslips: [
      {
        id: 'p1',
        period: period(1, base),
        grossCents: 245000,
        netCents: 172340,
        hours: 152,
        surchargesCents: 8650,
        status: 'paid',
        paidOn: dateOnly(-8, base),
      },
      {
        id: 'p2',
        period: period(2, base),
        grossCents: 238000,
        netCents: 168120,
        hours: 148,
        surchargesCents: 6200,
        status: 'paid',
        paidOn: dateOnly(-38, base),
      },
      {
        id: 'p3',
        period: period(3, base),
        grossCents: 251500,
        netCents: 176010,
        hours: 156,
        surchargesCents: 10400,
        status: 'paid',
        paidOn: dateOnly(-69, base),
      },
    ],
    leaveBalance: {
      entitlement: 28,
      taken: 12,
      planned: countWorkdays(dateOnly(21, base), dateOnly(25, base)),
    },
    leaveRequests: [
      {
        id: 'l1',
        type: 'vacation',
        from: dateOnly(21, base),
        to: dateOnly(25, base),
        days: countWorkdays(dateOnly(21, base), dateOnly(25, base)),
        status: 'pending',
      },
      {
        id: 'l2',
        type: 'vacation',
        from: dateOnly(-60, base),
        to: dateOnly(-51, base),
        days: countWorkdays(dateOnly(-60, base), dateOnly(-51, base)),
        status: 'approved',
      },
    ],
    availability: [
      { weekday: 1, available: true },
      { weekday: 2, available: true },
      { weekday: 3, available: true, note: 'nur vormittags' },
      { weekday: 4, available: true },
      { weekday: 5, available: true },
      { weekday: 6, available: false },
      { weekday: 0, available: false },
    ],
    courses: [
      ...starter.map((c, i) =>
        i === 0
          ? { ...c, lessons: c.lessons.map((l, j) => ({ ...l, done: j < 2 })) }
          : i === 1
            ? { ...c, dueDate: dateOnly(14, base) }
            : c,
      ),
      {
        id: 'privacy',
        title: 'Datenschutz im Arbeitsalltag',
        description: 'DSGVO-Grundlagen für den Umgang mit personenbezogenen Daten.',
        durationMinutes: 20,
        category: 'compliance',
        mandatory: false,
        certificate: true,
        lessons: [
          { id: 'privacy-1', title: 'Was sind personenbezogene Daten?', done: false },
          { id: 'privacy-2', title: 'Datensparsamkeit', done: false },
          { id: 'privacy-3', title: 'Abschlussquiz', done: false },
        ],
      },
    ],
  };
}
