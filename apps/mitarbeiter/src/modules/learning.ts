export type LearningModule = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  lessons: string[];
};
export const starterModules: LearningModule[] = [
  {
    id: 'onboarding',
    title: 'Willkommen bei HSU24',
    description: 'So funktioniert dein Mitarbeiterbereich.',
    durationMinutes: 10,
    lessons: ['Dein Dashboard', 'Einsätze finden', 'Hilfe bekommen'],
  },
  {
    id: 'safety',
    title: 'Sicher arbeiten',
    description: 'Grundlagen zu Sicherheit und Datenschutz.',
    durationMinutes: 15,
    lessons: ['Persönliche Daten schützen', 'Sicherheitsregeln am Einsatzort', 'Probleme melden'],
  },
  {
    id: 'time',
    title: 'Arbeitszeit richtig erfassen',
    description: 'Start, Pause, Ende und Korrekturen.',
    durationMinutes: 8,
    lessons: ['Schichtbeginn', 'Pausen', 'Korrekturen anfragen'],
  },
];
