/** Domain-Typen der HSU24 Mitarbeiter-App. Entsprechen dem SQL-Schema in supabase/schema.sql. */

export type ID = string;
/** ISO-8601-Zeitstempel (UTC), z. B. "2026-10-08T07:00:00Z". */
export type ISODateTime = string;
/** ISO-Datum ohne Zeit, z. B. "2026-10-08". */
export type ISODate = string;

export type EmployeeRole = 'employee' | 'team_lead' | 'admin';

export type Employee = {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  personnelNumber: string;
  role: EmployeeRole;
  department: string;
  phone?: string;
};

export type ShiftStatus = 'offered' | 'confirmed' | 'declined' | 'completed' | 'cancelled';

export type Shift = {
  id: ID;
  title: string;
  start: ISODateTime;
  end: ISODateTime;
  location: { name: string; address: string; lat?: number; lng?: number };
  contact: { name: string; phone?: string };
  status: ShiftStatus;
  notes?: string;
  breakMinutes?: number;
};

export type TimeEventKind = 'start' | 'pause' | 'resume' | 'end';

export type TimeEvent = {
  id: ID;
  kind: TimeEventKind;
  /** Wird serverseitig gesetzt (now()); der Client sendet keine eigenen Zeitstempel. */
  at: ISODateTime;
  shiftId?: ID;
};

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export type TimeEntry = {
  id: ID;
  date: ISODate;
  start: ISODateTime;
  end?: ISODateTime;
  breakMinutes: number;
  workedMinutes: number;
  status: ApprovalStatus;
  shiftId?: ID;
};

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'open' | 'in_progress' | 'done';

export type Task = {
  id: ID;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  due?: ISODateTime;
  shiftId?: ID;
  checklist: { id: ID; label: string; done: boolean }[];
  commentCount: number;
  attachmentCount: number;
};

export type Conversation = {
  id: ID;
  title: string;
  kind: 'direct' | 'shift' | 'announcement';
  lastMessage: string;
  lastMessageAt: ISODateTime;
  unread: number;
};

export type DocumentCategory = 'contract' | 'personal' | 'certificate' | 'payslip' | 'policy';

export type EmployeeDocument = {
  id: ID;
  title: string;
  category: DocumentCategory;
  updatedAt: ISODateTime;
  version: number;
  sizeKb: number;
  requiresAcknowledgement?: boolean;
};

export type Payslip = {
  id: ID;
  period: string; // "2026-09"
  grossCents: number;
  netCents: number;
  hours: number;
  surchargesCents: number;
  status: 'processing' | 'paid';
  paidOn?: ISODate;
};

export type LeaveType = 'vacation' | 'sick' | 'unpaid' | 'other';

export type LeaveRequest = {
  id: ID;
  type: LeaveType;
  from: ISODate;
  to: ISODate;
  days: number;
  status: ApprovalStatus;
  note?: string;
};

export type LeaveBalance = { entitlement: number; taken: number; planned: number };

export type Availability = { weekday: number; available: boolean; note?: string }[];

export type Course = {
  id: ID;
  title: string;
  description: string;
  durationMinutes: number;
  category: 'onboarding' | 'safety' | 'process' | 'compliance';
  mandatory: boolean;
  lessons: { id: ID; title: string; done: boolean }[];
  dueDate?: ISODate;
  certificate?: boolean;
};

export type Notification = {
  id: ID;
  title: string;
  body: string;
  at: ISODateTime;
  read: boolean;
  kind: 'shift' | 'task' | 'message' | 'document' | 'system';
};

/** Meldung ans Büro: später, krank, Problem am Einsatz, Adresse falsch. */
export type IssueKind = 'late' | 'sick' | 'problem' | 'address';
