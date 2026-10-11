import type {
  Availability,
  Conversation,
  Course,
  Employee,
  IssueKind,
  EmployeeDocument,
  LeaveBalance,
  LeaveRequest,
  LeaveType,
  Notification,
  Payslip,
  Shift,
  Task,
  TaskStatus,
  TimeEntry,
  TimeEvent,
  TimeEventKind,
} from '../domain/types';

/**
 * Typisierte Datenschnittstelle der App. Implementierungen:
 * - MockDataSource: klar gekennzeichnete Demo-Daten, nur im Speicher
 * - SupabaseDataSource: echte Daten, geschützt durch RLS
 * Alle Abfragen beziehen sich ausschließlich auf den angemeldeten Mitarbeiter.
 */
export interface DataSource {
  readonly isDemo: boolean;
  getProfile(): Promise<Employee>;

  listShifts(): Promise<Shift[]>;
  respondToShift(id: string, response: 'confirmed' | 'declined', reason?: string): Promise<Shift>;
  requestShiftSwap(id: string, note: string): Promise<void>;

  listTodayTimeEvents(): Promise<TimeEvent[]>;
  /** Zeitstempel wird serverseitig gesetzt; der Client übermittelt nur die Art. */
  recordTimeEvent(kind: TimeEventKind): Promise<TimeEvent>;
  listTimeEntries(): Promise<TimeEntry[]>;
  requestTimeCorrection(entryId: string, note: string): Promise<void>;

  listTasks(): Promise<Task[]>;
  updateTaskStatus(id: string, status: TaskStatus): Promise<Task>;
  toggleChecklistItem(taskId: string, itemId: string): Promise<Task>;

  listConversations(): Promise<Conversation[]>;
  listNotifications(): Promise<Notification[]>;

  listDocuments(): Promise<EmployeeDocument[]>;
  listPayslips(): Promise<Payslip[]>;

  getLeaveBalance(): Promise<LeaveBalance>;
  listLeaveRequests(): Promise<LeaveRequest[]>;
  createLeaveRequest(input: {
    type: LeaveType;
    from: string;
    to: string;
    days: number;
    note?: string;
  }): Promise<LeaveRequest>;
  getAvailability(): Promise<Availability>;
  setAvailability(availability: Availability): Promise<Availability>;

  /** Meldung ans Büro; das Büro entscheidet über weitere Schritte. */
  reportIssue(kind: IssueKind, note: string): Promise<void>;

  listCourses(): Promise<Course[]>;
  completeLesson(courseId: string, lessonId: string): Promise<Course>;
}
