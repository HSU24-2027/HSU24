import type { SupabaseClient } from '@supabase/supabase-js';

import type { DataSource } from '../DataSource';
import type {
  IssueKind,
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
  TaskStatus,
  TimeEntry,
  TimeEvent,
  TimeEventKind,
} from '../../domain/types';

type Row = Record<string, any>;

function unwrap<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  if (result.data === null) throw new Error('Keine Daten erhalten');
  return result.data;
}

export const mapShift = (r: Row): Shift => ({
  id: r.id,
  title: r.title,
  start: r.starts_at,
  end: r.ends_at,
  breakMinutes: r.break_minutes ?? 0,
  location: {
    name: r.location_name,
    address: r.location_address,
    lat: r.lat ?? undefined,
    lng: r.lng ?? undefined,
  },
  contact: { name: r.contact_name, phone: r.contact_phone ?? undefined },
  status: r.status,
  notes: r.notes ?? undefined,
});

const mapTask = (r: Row): Task => ({
  id: r.id,
  title: r.title,
  description: r.description ?? undefined,
  priority: r.priority,
  status: r.status,
  due: r.due_at ?? undefined,
  shiftId: r.shift_id ?? undefined,
  checklist: (r.task_checklist_items ?? [])
    .sort((a: Row, b: Row) => a.position - b.position)
    .map((c: Row) => ({ id: c.id, label: c.label, done: c.done })),
  commentCount: r.comment_count ?? 0,
  attachmentCount: r.attachment_count ?? 0,
});

/**
 * Supabase-Implementierung. Jede Abfrage wird serverseitig per RLS auf den
 * angemeldeten Mitarbeiter (auth.uid()) beschränkt – der Client filtert NICHT selbst
 * nach fremden IDs. Schreibende Zeit-Aktionen laufen über RPCs mit Server-Zeitstempel.
 *
 * Hinweis: Noch nicht gegen eine echte Supabase-Instanz getestet.
 */
export class SupabaseDataSource implements DataSource {
  readonly isDemo = false;
  constructor(private db: SupabaseClient) {}

  async getProfile(): Promise<Employee> {
    const r = unwrap(await this.db.from('employees').select('*').single()) as Row;
    return {
      id: r.id,
      firstName: r.first_name,
      lastName: r.last_name,
      email: r.email,
      personnelNumber: r.personnel_number,
      role: r.role,
      department: r.department ?? '',
      phone: r.phone ?? undefined,
    };
  }

  async listShifts(): Promise<Shift[]> {
    const rows = unwrap(await this.db.from('shifts').select('*').order('starts_at')) as Row[];
    return rows.map(mapShift);
  }

  async respondToShift(id: string, response: 'confirmed' | 'declined', reason?: string) {
    const r = unwrap(
      await this.db.rpc('respond_to_shift', {
        p_shift_id: id,
        p_response: response,
        p_reason: reason ?? null,
      }),
    ) as Row;
    return mapShift(r);
  }

  async requestShiftSwap(id: string, note: string) {
    const { error } = await this.db
      .from('shift_change_requests')
      .insert({ shift_id: id, kind: 'swap', note });
    if (error) throw new Error(error.message);
  }

  async listTodayTimeEvents(): Promise<TimeEvent[]> {
    const rows = unwrap(await this.db.rpc('my_time_events_today')) as Row[];
    return rows.map((r) => ({
      id: r.id,
      kind: r.kind,
      at: r.recorded_at,
      shiftId: r.shift_id ?? undefined,
    }));
  }

  async recordTimeEvent(kind: TimeEventKind): Promise<TimeEvent> {
    const r = unwrap(await this.db.rpc('record_time_event', { p_kind: kind })) as Row;
    return { id: r.id, kind: r.kind, at: r.recorded_at, shiftId: r.shift_id ?? undefined };
  }

  async listTimeEntries(): Promise<TimeEntry[]> {
    const rows = unwrap(
      await this.db
        .from('time_entries')
        .select('*')
        .order('work_date', { ascending: false })
        .limit(60),
    ) as Row[];
    return rows.map((r) => ({
      id: r.id,
      date: r.work_date,
      start: r.started_at,
      end: r.ended_at ?? undefined,
      breakMinutes: r.break_minutes,
      workedMinutes: r.worked_minutes,
      status: r.status,
      shiftId: r.shift_id ?? undefined,
    }));
  }

  async requestTimeCorrection(entryId: string, note: string) {
    const { error } = await this.db
      .from('time_corrections')
      .insert({ time_entry_id: entryId, reason: note });
    if (error) throw new Error(error.message);
  }

  async listTasks(): Promise<Task[]> {
    const rows = unwrap(
      await this.db
        .from('tasks')
        .select('*, task_checklist_items(*)')
        .order('due_at', { nullsFirst: false }),
    ) as Row[];
    return rows.map(mapTask);
  }

  async updateTaskStatus(id: string, status: TaskStatus) {
    const r = unwrap(
      await this.db
        .from('tasks')
        .update({ status })
        .eq('id', id)
        .select('*, task_checklist_items(*)')
        .single(),
    ) as Row;
    return mapTask(r);
  }

  async toggleChecklistItem(taskId: string, itemId: string) {
    const { error } = await this.db.rpc('toggle_checklist_item', { p_item_id: itemId });
    if (error) throw new Error(error.message);
    const r = unwrap(
      await this.db.from('tasks').select('*, task_checklist_items(*)').eq('id', taskId).single(),
    ) as Row;
    return mapTask(r);
  }

  async listConversations(): Promise<Conversation[]> {
    const rows = unwrap(await this.db.from('my_conversations').select('*')) as Row[];
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      kind: r.kind,
      lastMessage: r.last_message ?? '',
      lastMessageAt: r.last_message_at,
      unread: r.unread_count ?? 0,
    }));
  }

  async listNotifications(): Promise<Notification[]> {
    const rows = unwrap(
      await this.db
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50),
    ) as Row[];
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      body: r.body,
      at: r.created_at,
      read: !!r.read_at,
      kind: r.kind,
    }));
  }

  async listDocuments(): Promise<EmployeeDocument[]> {
    const rows = unwrap(
      await this.db.from('documents').select('*').order('updated_at', { ascending: false }),
    ) as Row[];
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      updatedAt: r.updated_at,
      version: r.version,
      sizeKb: Math.round((r.size_bytes ?? 0) / 1024),
      requiresAcknowledgement: r.requires_acknowledgement && !r.acknowledged_at,
    }));
  }

  async listPayslips(): Promise<Payslip[]> {
    const rows = unwrap(
      await this.db.from('payslips').select('*').order('period', { ascending: false }),
    ) as Row[];
    return rows.map((r) => ({
      id: r.id,
      period: r.period,
      grossCents: r.gross_cents,
      netCents: r.net_cents,
      hours: Number(r.hours),
      surchargesCents: r.surcharges_cents,
      status: r.status,
      paidOn: r.paid_on ?? undefined,
    }));
  }

  async getLeaveBalance(): Promise<LeaveBalance> {
    const r = unwrap(await this.db.rpc('my_leave_balance')) as Row;
    return { entitlement: r.entitlement, taken: r.taken, planned: r.planned };
  }

  async listLeaveRequests(): Promise<LeaveRequest[]> {
    const rows = unwrap(
      await this.db.from('leave_requests').select('*').order('starts_on', { ascending: false }),
    ) as Row[];
    return rows.map((r) => ({
      id: r.id,
      type: r.type,
      from: r.starts_on,
      to: r.ends_on,
      days: Number(r.days),
      status: r.status,
      note: r.note ?? undefined,
    }));
  }

  async createLeaveRequest(input: Parameters<DataSource['createLeaveRequest']>[0]) {
    const r = unwrap(
      await this.db
        .from('leave_requests')
        .insert({
          type: input.type,
          starts_on: input.from,
          ends_on: input.to,
          days: input.days,
          note: input.note ?? null,
        })
        .select('*')
        .single(),
    ) as Row;
    return {
      id: r.id,
      type: r.type,
      from: r.starts_on,
      to: r.ends_on,
      days: Number(r.days),
      status: r.status,
      note: r.note ?? undefined,
    };
  }

  async getAvailability(): Promise<Availability> {
    const rows = unwrap(await this.db.from('availability').select('*').order('weekday')) as Row[];
    return rows.map((r) => ({
      weekday: r.weekday,
      available: r.available,
      note: r.note ?? undefined,
    }));
  }

  async setAvailability(availability: Availability) {
    const { error } = await this.db.rpc('set_my_availability', { p_items: availability });
    if (error) throw new Error(error.message);
    return this.getAvailability();
  }

  async reportIssue(kind: IssueKind, note: string): Promise<void> {
    const { error } = await this.db.rpc('report_issue', { p_kind: kind, p_note: note });
    if (error) throw new Error(error.message);
  }

  async listCourses(): Promise<Course[]> {
    const rows = unwrap(await this.db.from('my_courses').select('*')) as Row[];
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      durationMinutes: r.duration_minutes,
      category: r.category,
      mandatory: r.mandatory,
      certificate: r.has_certificate,
      dueDate: r.due_on ?? undefined,
      lessons: (r.lessons ?? []).map((l: Row) => ({ id: l.id, title: l.title, done: !!l.done })),
    }));
  }

  async completeLesson(courseId: string, lessonId: string) {
    const { error } = await this.db.rpc('complete_lesson', { p_lesson_id: lessonId });
    if (error) throw new Error(error.message);
    const course = (await this.listCourses()).find((c) => c.id === courseId);
    if (!course) throw new Error('Kurs nicht gefunden');
    return course;
  }
}
