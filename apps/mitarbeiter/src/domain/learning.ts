import { starterModules } from '../modules/learning';
import type { Course } from './types';

export function courseProgress(course: Pick<Course, 'lessons'>): number {
  if (course.lessons.length === 0) return 0;
  const done = course.lessons.filter((l) => l.done).length;
  return Math.round((done / course.lessons.length) * 100);
}

export function overallProgress(courses: Pick<Course, 'lessons'>[]): number {
  const lessons = courses.flatMap((c) => c.lessons);
  if (lessons.length === 0) return 0;
  return Math.round((lessons.filter((l) => l.done).length / lessons.length) * 100);
}

export function isCompleted(course: Pick<Course, 'lessons'>): boolean {
  return course.lessons.length > 0 && course.lessons.every((l) => l.done);
}

/**
 * Wandelt die Startermodule aus dem ursprünglichen Prototyp (src/modules/learning.ts)
 * in Kurse um, damit My Learning darauf aufbaut statt sie zu ersetzen.
 */
export function coursesFromStarterModules(): Course[] {
  return starterModules.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    durationMinutes: m.durationMinutes,
    category: m.id === 'safety' ? 'safety' : m.id === 'time' ? 'process' : 'onboarding',
    mandatory: true,
    certificate: m.id === 'safety',
    lessons: m.lessons.map((title, index) => ({ id: `${m.id}-${index + 1}`, title, done: false })),
  }));
}
