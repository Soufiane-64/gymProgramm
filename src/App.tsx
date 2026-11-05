import { useMemo, useState } from "react";

type Exercise = { name: string; scheme: string; note?: string };
type Day = { title: string; focus: string; type: "Upper" | "Lower"; exercises: Exercise[] };

const days: Day[] = [
  {
    title: "Upper 1",
    focus: "Chest focus",
    type: "Upper",
    exercises: [
      { name: "Bench Press", scheme: "2×5–8", note: "+1×8–12 back-off" },
      { name: "Incline Bench Press", scheme: "3×8–12" },
      { name: "Weighted Pull-Ups", scheme: "3×8–12", note: "Or bodyweight / assisted" },
      { name: "Straight-Arm Pull-Downs", scheme: "3×12–15" },
      { name: "Barbell Strict Curl", scheme: "3×8–10" },
      { name: "Hammer Curls", scheme: "3×12–20" },
      { name: "Skull Crushers", scheme: "3×12–15" },
      { name: "Lateral Raises", scheme: "3×12–20" },
      { name: "Bent-Over Rear Delt Flies", scheme: "3×12–20" },
    ],
  },
  {
    title: "Lower 1",
    focus: "Quad focus",
    type: "Lower",
    exercises: [
      { name: "Barbell Squats", scheme: "2×5–8", note: "+1×8–12 back-off" },
      { name: "Lunges", scheme: "3×12–20" },
      { name: "Leg Extensions", scheme: "3×12–20" },
      { name: "Romanian Deadlifts", scheme: "3×8–12" },
      { name: "Calf Raises", scheme: "3×8–12" },
    ],
  },
  {
    title: "Upper 2",
    focus: "Back focus",
    type: "Upper",
    exercises: [
      { name: "Lat Pull-Downs", scheme: "3×8–12" },
      { name: "Barbell Rows", scheme: "3×8–12" },
      { name: "Overhead Press", scheme: "3×8–12" },
      { name: "Face Pulls", scheme: "3×12–20" },
      { name: "Bench Press", scheme: "2×5–8", note: "+1×8–12 back-off" },
      { name: "Dumbbell Flies", scheme: "3×12–20" },
      { name: "Preacher Curls", scheme: "3×12–15" },
      { name: "Cable Hammer Curls", scheme: "3×12–15" },
      { name: "Cable Push-Downs", scheme: "3×8–12", note: "Can superset with Skull Crushers" },
      { name: "Skull Crushers", scheme: "3×8–12" },
    ],
  },
  {
    title: "Lower 2",
    focus: "Glute & hamstring focus",
    type: "Lower",
    exercises: [
      { name: "Hip Thrusts", scheme: "3×8–12" },
      { name: "Good Mornings", scheme: "3×8–12" },
      { name: "Hamstring Curls", scheme: "3×15–20" },
      { name: "Leg Press", scheme: "3×12–20" },
      { name: "Glute Kickbacks", scheme: "3×12–20" },
      { name: "Calf Raises", scheme: "3×15–20" },
    ],
  },
  {
    title: "Upper 3",
    focus: "Shoulder & arm focus",
    type: "Upper",
    exercises: [
      { name: "Barbell Strict Curl", scheme: "3×8–10" },
      { name: "Concentration Curls", scheme: "3×12–20" },
      { name: "Overhead Press", scheme: "2×5–8", note: "+1×8–12 back-off" },
      { name: "Lateral Raises", scheme: "3×12–20" },
      { name: "Incline Bench Press", scheme: "3×12–15" },
      { name: "Cable Flies", scheme: "3×12–20" },
      { name: "Meadows Rows", scheme: "3×12–15" },
      { name: "Seated Cable Rows", scheme: "3×12–15" },
      { name: "Triceps Push-Down", scheme: "3×12–15" },
    ],
  },
];

const storageKey = "form-split-checks";
const readChecks = (): Record<string, boolean> => {
  try {
    return JSON.parse(localStorage.getItem(storageKey) ?? "{}") as Record<string, boolean>;
  } catch {
    return {};
  }
};

function CheckIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7" /></svg>;
}

function FlameIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21c4.4 0 7-2.7 7-6.4 0-3.1-1.6-5.3-4-7.9-.2 2-1 3.2-2.2 4.1.1-3.4-1.4-6.3-4-8.8.2 3.9-3.8 6.4-3.8 11.2C5 17.7 7.6 21 12 21Z" /></svg>;
}

function App() {
  const [activeDay, setActiveDay] = useState(0);
  const [checks, setChecks] = useState<Record<string, boolean>>(readChecks);
  const day = days[activeDay];
  const completed = day.exercises.filter((_, index) => checks[`${activeDay}-${index}`]).length;
  const totalCompleted = Object.values(checks).filter(Boolean).length;
  const totalExercises = days.reduce((sum, item) => sum + item.exercises.length, 0);
  const weeklyPercent = Math.round((totalCompleted / totalExercises) * 100);
  const progress = Math.round((completed / day.exercises.length) * 100);

  const updateChecks = (next: Record<string, boolean>) => {
    setChecks(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const toggleExercise = (index: number) => {
    const key = `${activeDay}-${index}`;
    updateChecks({ ...checks, [key]: !checks[key] });
  };

  const resetDay = () => {
    const next = { ...checks };
    day.exercises.forEach((_, index) => delete next[`${activeDay}-${index}`]);
    updateChecks(next);
  };

  const weekLabel = useMemo(() => `${totalCompleted} / ${totalExercises} exercises`, [totalCompleted, totalExercises]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">F</span><span>FORM</span></div>
        <button className="icon-button" aria-label="Profile"><span className="avatar">S</span></button>
      </header>

      <main>
        <section className="hero">
          <div className="eyebrow"><span className="pulse" /> YOUR TRAINING SYSTEM</div>
          <h1>Build your<br /><em>strongest</em> self.</h1>
          <p>Five focused sessions. Zero wasted movement.</p>
        </section>

        <section className="stats-grid" aria-label="Weekly stats">
          <article className="stat-card featured"><span className="stat-label">WEEKLY PROGRESS</span><strong>{weeklyPercent}%</strong><div className="mini-track"><i style={{ width: `${weeklyPercent}%` }} /></div><small>{weekLabel}</small></article>
          <article className="stat-card"><span className="stat-label">SPLIT</span><strong>3<span className="slash">/</span>2</strong><small>Upper / Lower</small></article>
          <article className="stat-card"><span className="stat-label">STREAK</span><strong><FlameIcon /> 0</strong><small>Days completed</small></article>
        </section>

        <section className="section-heading"><div><span className="eyebrow">THIS WEEK</span><h2>Training split</h2></div><span className="week-count">5 DAYS</span></section>
        <div className="day-picker" role="tablist">
          {days.map((item, index) => (
            <button key={item.title} className={`day-pill ${activeDay === index ? "selected" : ""}`} onClick={() => setActiveDay(index)} role="tab" aria-selected={activeDay === index}>
              <span className="day-number">0{index + 1}</span><span>{item.type}</span><i>{item.title.split(" ")[1]}</i>
            </button>
          ))}
        </div>

        <section className="workout-head">
          <div><span className="eyebrow">{day.type.toUpperCase()} / DAY 0{activeDay + 1}</span><h2>{day.title}</h2><p>{day.focus}</p></div>
          <div className="completion"><strong>{completed}</strong><span>/{day.exercises.length}</span><small>DONE</small></div>
        </section>
        <div className="progress-track"><i style={{ width: `${progress}%` }} /></div>

        <section className="exercise-list" aria-label={`${day.title} exercises`}>
          {day.exercises.map((exercise, index) => {
            const done = Boolean(checks[`${activeDay}-${index}`]);
            const heavy = exercise.note?.startsWith("+");
            return <button className={`exercise ${done ? "done" : ""}`} key={exercise.name + index} onClick={() => toggleExercise(index)}>
              <span className="exercise-index">0{index + 1}</span><span className="exercise-info"><strong>{exercise.name}</strong><span className="exercise-meta"><b className={heavy ? "heavy" : ""}>{exercise.scheme}</b>{heavy && <b className="backoff">{exercise.note}</b>}</span>{exercise.note && !heavy && <small>{exercise.note}</small>}</span><span className="check"><CheckIcon /></span>
            </button>;
          })}
        </section>

        <button className="reset-button" onClick={resetDay}>Reset today’s checks <span>↻</span></button>
      </main>
      <nav className="bottom-nav" aria-label="Main navigation"><button className="active"><span>▦</span>WORKOUT</button><button><span>◷</span>HISTORY</button><button><span>◎</span>PROFILE</button></nav>
    </div>
  );
}

export default App;
