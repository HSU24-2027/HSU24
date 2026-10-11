import type { DataSource } from '../DataSource';
import { nextClockState, deriveClockState } from '../../domain/time';
import type { TimeEvent, TimeEventKind } from '../../domain/types';
import { createSeed, MockDb } from './seed';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/**
 * Demo-Datenquelle: hält alle Daten nur im Arbeitsspeicher.
 * Nichts wird gespeichert oder übertragen – Zeiten sind keine echten Arbeitszeiten.
 */
export class MockDataSource implements DataSource {
  readonly isDemo = true;
  private db: MockDb;
  private events: TimeEvent[] = [];
  private seq = 0;

  constructor(
    private latencyMs = 250,
    base: Date = new Date(),
  ) {
    this.db = createSeed(base);
  }

  private async respond<T>(fn: () => T): Promise<T> {
    if (this.latencyMs > 0) await new Promise((r) => setTimeout(r, this.latencyMs));
    return clone(fn());
  }

  private id(prefix: string) {
    this.seq += 1;
    return `${prefix}-${Date.now()}-${this.seq}`;
  }

  getProfile() {
    return this.respond(() => this.db.profile);
  }

  listShifts() {
    return this.respond(() => this.db.shifts);
  }

  respondToShift(id: string, response: 'confirmed' | 'declined', reason?: string) {
    return this.respond(() => {
      const shift = this.db.shifts.find((s) => s.id === id);
      if (!shift) throw new Error('Einsatz nicht gefunden');
      if (shift.status !== 'offered')
        throw new Error('Dieser Einsatz kann nicht mehr beantwortet werden');
      if (response === 'declined' && !reason?.trim())
        throw new Error('Bitte eine Begründung angeben');
      shift.status = response;
      if (reason) shift.notes = `Begründung: ${reason}`;
      return shift;
    });
  }

  requestShiftSwap(id: string, note: string) {
    return this.respond(() => {
      if (!this.db.shifts.some((s) => s.id === id)) throw new Error('Einsatz nicht gefunden');
      if (!note.trim()) throw new Error('Bitte eine Notiz angeben');
    });
  }

  listTodayTimeEvents() {
    return this.respond(() => this.events);
  }

  recordTimeEvent(kind: TimeEventKind) {
    return this.respond(() => {
      const state = deriveClockState(this.events);
      if (nextClockState(state, kind) === null) {
        throw new Error('Diese Aktion ist im aktuellen Status nicht möglich');
      }
      // Im echten Backend setzt der Server den Zeitstempel (now()).
      const event: TimeEvent = { id: this.id('e'), kind, at: new Date().toISOString() };
      this.events.push(event);
      return event;
    });
  }

  listTimeEntries() {
    return this.respond(() => this.db.timeEntries);
  }

  requestTimeCorrection(entryId: string, note: string) {
    return this.respond(() => {
      const entry = this.db.timeEntries.find((e) => e.id === entryId);
      if (!entry) throw new Error('Eintrag nicht gefunden');
      if (!note.trim()) throw new Error('Bitte den Korrekturgrund angeben');
      entry.status = 'pending';
    });
  }

  listTasks() {
    return this.respond(() => this.db.tasks);
  }

  updateTaskStatus(id: string, status: 'open' | 'in_progress' | 'done') {
    return this.respond(() => {
      const task = this.db.tasks.find((t) => t.id === id);
      if (!task) throw new Error('Aufgabe nicht gefunden');
      task.status = status;
      return task;
    });
  }

  toggleChecklistItem(taskId: string, itemId: string) {
    return this.respond(() => {
      const task = this.db.tasks.find((t) => t.id === taskId);
      const item = task?.checklist.find((c) => c.id === itemId);
      if (!task || !item) throw new Error('Checklistenpunkt nicht gefunden');
      item.done = !item.done;
      return task;
    });
  }

  listConversations() {
    return this.respond(() => this.db.conversations);
  }

  listNotifications() {
    return this.respond(() => this.db.notifications);
  }

  listDocuments() {
    return this.respond(() => this.db.documents);
  }

  listPayslips() {
    return this.respond(() => this.db.payslips);
  }

  getLeaveBalance() {
    return this.respond(() => this.db.leaveBalance);
  }

  listLeaveRequests() {
    return this.respond(() => this.db.leaveRequests);
  }

  createLeaveRequest(input: Parameters<DataSource['createLeaveRequest']>[0]) {
    return this.respond(() => {
      const request = { id: this.id('l'), status: 'pending' as const, ...input };
      this.db.leaveRequests.unshift(request);
      if (input.type === 'vacation') this.db.leaveBalance.planned += input.days;
      return request;
    });
  }

  reportIssue(_kind: Parameters<DataSource['reportIssue']>[0], _note: string) {
    return this.respond(() => undefined);
  }

  getAvailability() {
    return this.respond(() => this.db.availability);
  }

  setAvailability(availability: MockDb['availability']) {
    return this.respond(() => {
      this.db.availability = clone(availability);
      return this.db.availability;
    });
  }

  listCourses() {
    return this.respond(() => this.db.courses);
  }

  completeLesson(courseId: string, lessonId: string) {
    return this.respond(() => {
      const course = this.db.courses.find((c) => c.id === courseId);
      const lesson = course?.lessons.find((l) => l.id === lessonId);
      if (!course || !lesson) throw new Error('Lektion nicht gefunden');
      lesson.done = true;
      return course;
    });
  }
}
