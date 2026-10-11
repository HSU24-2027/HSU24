import { courseProgress } from '../src/domain/learning';
import { countWorkdays, remainingLeave, validateLeaveRequest } from '../src/domain/leave';
import { buildTheme } from '../src/design/tokens';

describe('Urlaub', () => {
  const balance = { entitlement: 20, taken: 5, planned: 3 };
  it('zählt nur Arbeitstage', () => {
    expect(countWorkdays('2026-10-05', '2026-10-11')).toBe(5);
  });
  it('berechnet Resturlaub', () => {
    expect(remainingLeave(balance)).toBe(12);
  });
  it('lehnt Zeitraum in der Vergangenheit und zu viele Tage ab', () => {
    const today = new Date(2026, 9, 8);
    expect(validateLeaveRequest('2026-10-01', '2026-10-02', balance, today).ok).toBe(false);
    expect(validateLeaveRequest('2026-11-02', '2026-12-31', balance, today).ok).toBe(false);
    expect(validateLeaveRequest('2026-11-02', '2026-11-04', balance, today)).toEqual({
      ok: true,
      days: 3,
    });
  });
});

describe('Lernen', () => {
  it('berechnet Fortschritt in Prozent', () => {
    expect(
      courseProgress({
        lessons: [
          { id: 'a', title: 'a', done: true },
          { id: 'b', title: 'b', done: false },
        ],
      }),
    ).toBe(50);
  });
});

describe('Design', () => {
  it('Revolut-Palette: hell weiß, dunkel verfügbar', () => {
    expect(buildTheme('light').colors.surface).toBe('#FFFFFF');
    expect(buildTheme('dark').colors.background).toBe('#0C0E0D');
  });
});
