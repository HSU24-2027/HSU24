import type { BadgeTone } from '../components/Badge';
import type {
  ApprovalStatus,
  DocumentCategory,
  LeaveType,
  ShiftStatus,
  TaskPriority,
  TaskStatus,
} from './types';

export const shiftStatusLabel: Record<ShiftStatus, { label: string; tone: BadgeTone }> = {
  offered: { label: 'Angeboten', tone: 'warning' },
  confirmed: { label: 'Zugesagt', tone: 'success' },
  declined: { label: 'Abgesagt', tone: 'danger' },
  completed: { label: 'Abgeschlossen', tone: 'neutral' },
  cancelled: { label: 'Storniert', tone: 'neutral' },
};

export const approvalLabel: Record<ApprovalStatus, { label: string; tone: BadgeTone }> = {
  pending: { label: 'In Prüfung', tone: 'warning' },
  approved: { label: 'Freigegeben', tone: 'success' },
  rejected: { label: 'Abgelehnt', tone: 'danger' },
};

export const taskStatusLabel: Record<TaskStatus, { label: string; tone: BadgeTone }> = {
  open: { label: 'Offen', tone: 'neutral' },
  in_progress: { label: 'In Bearbeitung', tone: 'primary' },
  done: { label: 'Erledigt', tone: 'success' },
};

export const priorityLabel: Record<TaskPriority, { label: string; tone: BadgeTone }> = {
  high: { label: 'Hoch', tone: 'danger' },
  medium: { label: 'Mittel', tone: 'warning' },
  low: { label: 'Niedrig', tone: 'neutral' },
};

export const documentCategoryLabel: Record<DocumentCategory, string> = {
  contract: 'Vertrag',
  personal: 'Persönlich',
  certificate: 'Nachweis',
  payslip: 'Abrechnung',
  policy: 'Richtlinie',
};

export const leaveTypeLabel: Record<LeaveType, string> = {
  vacation: 'Urlaub',
  sick: 'Krankmeldung',
  unpaid: 'Unbezahlt',
  other: 'Sonstiges',
};

export const weekdayLabel = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
];
