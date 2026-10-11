import { useEffect, useState, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  BriefcaseBusiness,
  CheckSquare,
  ChevronRight,
  Clock3,
  FileText,
  Home as HomeIcon,
  LayoutGrid,
  MapPin,
  MessageCircle,
  Moon,
  MoreHorizontal,
  Plane,
  Plus,
  ShieldCheck,
  Stethoscope,
  Sun,
  Timer,
  X,
  WalletCards,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

type NoticeState = { title: string; message: string } | null;

function ExampleTag() {
  return <span className="example-label">Beispiel</span>;
}

function Card({ children, className = '', ...props }: { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return <div className={`card ${className}`} {...props}>{children}</div>;
}

function AppButton({
  children,
  tone = 'primary',
  onClick,
  className = '',
  ...props
}: {
  children: ReactNode;
  tone?: 'primary' | 'light' | 'quiet';
  onClick?: () => void;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`button button-${tone} ${className}`} onClick={onClick} {...props}>{children}</button>;
}

function Statistic({ label, value, suffix, footnote }: { label: string; value: string; suffix: string; footnote: string }) {
  return (
    <Card className="hours-card">
      <div className="card-top">
        <p className="card-heading">{label}</p>
        <div className="subtle-icon"><Timer size={18} strokeWidth={1.8} /></div>
      </div>
      <div>
        <div className="hours-number" data-testid="statistic-weekly-hours">{value}<span>{suffix}</span></div>
        <p className="hours-caption">{footnote}</p>
        <div className="progress-track" aria-label="Beispielhafter Wochenfortschritt"><div className="progress-value" /></div>
        <div className="hours-footer"><span>Beispiel · Ziel: 10 Std.</span><span>6,4 Std.</span></div>
      </div>
    </Card>
  );
}

function SectionHeading({ title, subtitle, action, onAction, id }: { title: string; subtitle?: string; action?: string; onAction?: () => void; id?: string }) {
  return (
    <div className="section-head">
      <div>
        <h2 className="section-title" id={id}>{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {action && <button className="text-action" onClick={onAction}>{action}<ChevronRight size={14} /></button>}
    </div>
  );
}

function ListRow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`list-row ${className}`}>{children}</div>;
}

function BottomNavigation() {
  const items = [
    { label: 'Home', Icon: HomeIcon, active: true },
    { label: 'Aufträge', Icon: BriefcaseBusiness, active: false },
    { label: 'Lohn', Icon: WalletCards, active: false },
    { label: 'Chat', Icon: MessageCircle, active: false },
    { label: 'Apps', Icon: LayoutGrid, active: false },
  ];
  return (
    <nav className="bottom-nav" aria-label="Hauptnavigation">
      <div className="nav-inner">
        {items.map(({ label, Icon, active }) => (
          <button key={label} className={`nav-item${active ? ' active' : ''}`} aria-current={active ? 'page' : undefined} aria-label={active ? label : `${label}, in dieser Vorschau nicht aktiv`} disabled={!active} data-testid={`nav-${label.toLowerCase()}`}>
            <Icon size={19} strokeWidth={active ? 2.2 : 1.8} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function dateAfter(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function formatExampleDate(days: number) {
  const date = dateAfter(days);
  return {
    weekday: new Intl.DateTimeFormat('de-DE', { weekday: 'short' }).format(date).replace('.', ''),
    dayMonth: new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'short' }).format(date),
  };
}

function Home() {
  const [notice, setNotice] = useState<NoticeState>(null);
  const [isDark, setIsDark] = useState(() => window.localStorage.getItem('hsu-theme') === 'dark');
  const displayDate = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  const hour = new Date().getHours();
  const greeting = hour < 11 ? 'Guten Morgen' : hour < 18 ? 'Guten Tag' : 'Guten Abend';
  const upcomingShifts = [
    { days: 2, title: 'Sprachmittlung', place: 'Klinikum Fürth', time: '09:00', end: '13:00' },
    { days: 4, title: 'Begleitung', place: 'Beratungsstelle Nürnberg', time: '14:00', end: '17:30' },
    { days: 7, title: 'Sprachmittlung', place: 'Praxis am Stadtpark', time: '10:30', end: '12:30' },
  ];
  const showPreview = (title: string, message: string) => setNotice({ title, message });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    window.localStorage.setItem('hsu-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const quickActions = [
    { label: 'Zeiterfassung', Icon: Clock3, message: 'Die Zeiterfassung ist in dieser Vorschau nicht verbunden. Es wird keine Arbeitszeit gestartet oder gespeichert.' },
    { label: 'Aufgaben', Icon: CheckSquare, message: 'Hier würden deine offenen Aufgaben erscheinen. Die Inhalte in dieser Vorschau sind Beispiele.' },
    { label: 'Urlaub', Icon: Plane, message: 'Urlaubsanträge sind in dieser Vorschau nicht aktiv.' },
    { label: 'Dokumente', Icon: FileText, message: 'Deine Dokumente sind in dieser Vorschau nicht hinterlegt.' },
    { label: 'Krank melden', Icon: Stethoscope, message: 'Die Krankmeldung ist in dieser Vorschau nicht aktiv. Bitte nutze dafür deinen bekannten Kontakt zum HSU-Team.' },
  ];

  return (
    <div className="app-shell">
      <main className="dashboard">
        <header className="topbar">
          <div className="brand" aria-label="Hamrah Sprachservice">
            <div className="brand-mark">hsu</div>
            <div>
              <div className="brand-name">Hamrah Sprachservice</div>
              <div className="brand-caption">Mitarbeiter-App · Fürth</div>
            </div>
          </div>
          <div className="topbar-actions">
            <button className="theme-toggle" onClick={() => setIsDark((value) => !value)} aria-label={isDark ? 'Helles Design aktivieren' : 'Dunkles Design aktivieren'} title={isDark ? 'Helles Design' : 'Dunkles Design'} data-testid="button-theme-toggle">
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button className="profile-chip" onClick={() => showPreview('Profil', 'Dies ist eine Beispielansicht. In dieser Vorschau sind keine persönlichen Kontodaten hinterlegt.')} aria-label="Beispielprofil öffnen" data-testid="button-profile">
              <span className="profile-initials">LM</span>
              <span className="profile-name">Lea M.</span>
              <MoreHorizontal size={17} color="#818B87" />
            </button>
          </div>
        </header>

        <section className="welcome-row" aria-labelledby="welcome-heading">
          <div>
            <p className="eyebrow">Dein Überblick</p>
            <h1 className="welcome-title" id="welcome-heading">{greeting}, Lea <ExampleTag /></h1>
          </div>
          <div className="welcome-date" data-testid="text-current-date">{displayDate}</div>
        </section>

        <section className="hero-grid" aria-label="Heutiger Dienst und Wochenstunden">
          <article className="shift-card">
            <div className="shift-topline">
              <span className="shift-label">Dein Dienst heute</span>
              <span className="shift-status"><span className="status-dot" />Geplant</span>
            </div>
            <h2 className="shift-title">Sprachmittlung</h2>
            <div className="shift-location"><MapPin size={14} style={{ verticalAlign: '-2px', marginRight: 4 }} />Klinikum Fürth · Beispiel</div>
            <div className="shift-details">
              <span className="shift-time"><Clock3 size={16} />09:00 – 13:00</span>
              <ExampleTag />
            </div>
            <div className="shift-bottom">
              <span className="shift-note">Bitte sei 10 Minuten früher vor Ort.</span>
              <AppButton tone="light" data-testid="button-start-shift" onClick={() => showPreview('Nur Vorschau', 'Ein Dienststart wird hier nicht erfasst oder gespeichert. In der fertigen App verbindest du dich mit deiner Zeiterfassung.')}>
                <Plus size={15} />Dienst starten
              </AppButton>
            </div>
          </article>
          <Statistic label="Diese Woche" value="6,4" suffix="Std." footnote="von 10 Wochenstunden · Beispiel" />
        </section>

        <section className="section-block" aria-labelledby="quick-title">
          <SectionHeading id="quick-title" title="Was möchtest du tun?" subtitle="Deine wichtigsten Wege auf einen Blick" />
          <div className="quick-grid">
            {quickActions.map(({ label, Icon, message }) => (
              <button key={label} className="quick-action" onClick={() => showPreview(label, message)} data-testid={`quick-${label.toLowerCase().replaceAll(' ', '-')}`}>
                <span className="quick-icon"><Icon size={19} strokeWidth={1.8} /></span>
                <span className="quick-label">{label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="section-block content-grid" aria-label="Weitere Informationen">
          <div className="content-column">
            <Card className="panel">
              <div className="panel-heading-row">
                <div>
                  <h2 className="section-title">Deine nächsten Dienste</h2>
                  <p className="section-subtitle">Gut vorbereitet in die Woche</p>
                </div>
                <ExampleTag />
              </div>
              {upcomingShifts.map((shift) => {
                const date = formatExampleDate(shift.days);
                return (
                  <ListRow key={`${shift.title}-${shift.days}`}>
                    <div className="date-block"><span className="date-day">{date.weekday}</span><span className="date-month">{date.dayMonth}</span></div>
                    <div className="row-copy"><div className="row-title">{shift.title}</div><div className="row-meta">{shift.place} · Beispiel</div></div>
                    <div className="row-end">{shift.time}<small>bis {shift.end}</small></div>
                  </ListRow>
                );
              })}
            </Card>

            <Card className="panel">
              <div className="panel-heading-row">
                <div>
                  <h2 className="section-title">Das steht noch an</h2>
                  <p className="section-subtitle">Ein kleiner Schritt, dann ist es erledigt</p>
                </div>
                <span className="task-badge">1 offen</span>
              </div>
                 <ListRow className="task-row">
                <span className="task-marker" />
                 <div className="row-copy"><div className="task-title">Stundenzettel prüfen</div><div className="task-due">Fällig am {formatExampleDate(4).dayMonth} · Beispiel</div></div>
                <ArrowRight size={16} color="#818B87" />
              </ListRow>
            </Card>
          </div>

          <div className="content-column">
            <Card className="message-card">
              <div className="message-top">
                <div className="message-icon"><MessageCircle size={17} /></div>
                <div className="row-copy"><div className="message-from">Nachricht vom HSU-Team</div></div>
                <ExampleTag />
              </div>
              <h2 className="message-title">Neue Einsatzbestätigung</h2>
              <p className="message-body">Dein Einsatz am Freitag ist bestätigt. Die Details findest du in deiner Dienstübersicht.</p>
              <div className="message-meta"><span>Heute, 08:42 · Beispiel</span><span>Ungelesen</span></div>
            </Card>

            <Card className="employee-card">
              <div className="employee-card-art"><ShieldCheck size={24} strokeWidth={1.7} /></div>
              <div className="employee-copy">
                <div className="employee-title">Dein Mitarbeiterausweis</div>
                <div className="employee-description">Deine digitale Karte immer griffbereit · Beispiel</div>
              </div>
              <button className="employee-arrow" aria-label="Mitarbeiterausweis Vorschau" onClick={() => showPreview('Mitarbeiterausweis', 'Dein digitaler Mitarbeiterausweis wird in der fertigen App verfügbar sein. Dies ist nur ein Beispiel.')} data-testid="button-employee-card">
                <ArrowDownRight size={16} />
              </button>
            </Card>

            <div className="footer-note">Alle angezeigten Angaben sind Beispiele. Diese Vorschau erfasst oder speichert keine Daten.</div>
          </div>
        </section>
      </main>

      <BottomNavigation />
      {notice && (
        <aside className="notice" role="status" aria-live="polite">
          <button className="notice-dismiss" aria-label="Hinweis schließen" data-testid="button-dismiss-notice" onClick={() => setNotice(null)}><X size={15} /></button>
          <h2 className="notice-title">{notice.title}</h2>
          <p className="notice-copy">{notice.message}</p>
        </aside>
      )}
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
