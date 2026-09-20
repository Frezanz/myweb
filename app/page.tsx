"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Task = { id: number; text: string; done: boolean };
type Note = { id: number; text: string; created: string };

const starterTasks: Task[] = [
  { id: 1, text: "Choose one thing worth finishing today", done: false },
  { id: 2, text: "Do the hardest 25 minutes first", done: false },
  { id: 3, text: "Clear one small thing you've been avoiding", done: false },
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function Home() {
  const [tab, setTab] = useState<"today" | "notes">("today");
  const [tasks, setTasks] = useState<Task[]>(starterTasks);
  const [notes, setNotes] = useState<Note[]>([]);
  const [note, setNote] = useState("");
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [focusCount, setFocusCount] = useState(0);
  const [command, setCommand] = useState(false);
  const [dark, setDark] = useState(false);
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const savedTasks = localStorage.getItem("daylight-tasks");
    const savedNotes = localStorage.getItem("daylight-notes");
    const savedFocus = localStorage.getItem("daylight-focus");
    const savedTheme = localStorage.getItem("daylight-theme");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedFocus) setFocusCount(Number(savedFocus));
    if (savedTheme === "dark") setDark(true);
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
  }, []);

  useEffect(() => localStorage.setItem("daylight-tasks", JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem("daylight-notes", JSON.stringify(notes)), [notes]);
  useEffect(() => localStorage.setItem("daylight-focus", String(focusCount)), [focusCount]);
  useEffect(() => localStorage.setItem("daylight-theme", dark ? "dark" : "light"), [dark]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          setRunning(false);
          setFocusCount((count) => count + 1);
          return 25 * 60;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommand((value) => !value);
      }
      if (event.key === "Escape") setCommand(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const completed = tasks.filter((task) => task.done).length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  const dateLabel = useMemo(
    () => new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date()),
    []
  );

  function addTask() {
    const text = window.prompt("What needs doing?");
    if (!text?.trim()) return;
    setTasks((items) => [...items, { id: Date.now(), text: text.trim(), done: false }]);
  }

  function saveNote() {
    if (!note.trim()) return;
    setNotes((items) => [{ id: Date.now(), text: note.trim(), created: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, ...items]);
    setNote("");
  }

  function resetTimer() {
    setRunning(false);
    setSeconds(25 * 60);
  }

  return (
    <main className={dark ? "shell dark" : "shell"}>
      <div className="grain" />
      <header className="topbar">
        <button className="brand" onClick={() => setTab("today")} aria-label="Go home">
          <span className="brand-mark">✦</span>
          <span>daylight</span>
        </button>
        <div className="top-actions">
          <button className="icon-btn" onClick={() => setDark((v) => !v)} aria-label="Toggle theme">{dark ? "☼" : "◐"}</button>
          <button className="command-btn" onClick={() => setCommand(true)}><span>Search</span><kbd>⌘ K</kbd></button>
        </div>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">{dateLabel}</p>
          <h1>{greeting}<span>.</span></h1>
          <p className="hero-copy">A small space for the things that deserve your attention.</p>
        </div>
        <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}>
          <strong>{progress}%</strong><span>complete</span>
        </div>
      </section>

      <nav className="tabs" aria-label="Sections">
        <button className={tab === "today" ? "active" : ""} onClick={() => setTab("today")}>Today</button>
        <button className={tab === "notes" ? "active" : ""} onClick={() => setTab("notes")}>Notes <span>{notes.length}</span></button>
      </nav>

      <AnimatePresence mode="wait">
        {tab === "today" ? (
          <motion.div key="today" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid">
            <section className="card tasks-card">
              <div className="card-head"><div><p className="label">Focus list</p><h2>Make today count.</h2></div><button className="small-btn" onClick={addTask}>+ Add</button></div>
              <div className="task-list">
                {tasks.map((task) => (
                  <button className={task.done ? "task done" : "task"} key={task.id} onClick={() => setTasks((items) => items.map((item) => item.id === task.id ? { ...item, done: !item.done } : item))}>
                    <span className="check">{task.done ? "✓" : ""}</span><span>{task.text}</span>
                  </button>
                ))}
              </div>
              <div className="meter"><span style={{ width: `${progress}%` }} /></div>
              <div className="muted-row"><span>{completed} of {tasks.length} finished</span><button onClick={() => setTasks([])}>Clear all</button></div>
            </section>

            <section className="card focus-card">
              <div className="card-head"><div><p className="label">Deep work</p><h2>{formatTime(seconds)}</h2></div><span className={running ? "live-dot active" : "live-dot"} /></div>
              <p className="timer-copy">{running ? "Stay here. Everything else can wait." : "Twenty-five minutes. One thing. No noise."}</p>
              <div className="timer-actions">
                <button className="primary" onClick={() => setRunning((v) => !v)}>{running ? "Pause" : "Start focus"}</button>
                <button className="secondary" onClick={resetTimer}>Reset</button>
              </div>
              <div className="focus-stat"><span>Sessions completed</span><strong>{focusCount}</strong></div>
            </section>

            <section className="card quote-card">
              <span className="quote-mark">“</span>
              <p>Clarity is often just the result of removing what doesn't matter.</p>
              <span className="quote-source">— a useful reminder</span>
            </section>

            <section className="card quick-card">
              <div className="card-head"><div><p className="label">Quick capture</p><h2>Get it out of your head.</h2></div></div>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") saveNote(); }} placeholder="An idea, thought, reminder..." />
              <button className="primary full" onClick={saveNote}>Save note <span>⌘ ↵</span></button>
            </section>
          </motion.div>
        ) : (
          <motion.section key="notes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="notes-view">
            <div className="notes-heading"><div><p className="label">Your thoughts</p><h2>Notes.</h2></div><button className="small-btn" onClick={() => document.querySelector("textarea")?.focus()}>New note</button></div>
            {notes.length === 0 ? <div className="empty"><span>✦</span><h3>Nothing here yet.</h3><p>Capture something from the Today view and it will stay here on this device.</p></div> : (
              <div className="notes-list">{notes.map((item) => <article className="note" key={item.id}><p>{item.text}</p><small>{item.created}</small></article>)}</div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      <footer><span>daylight</span><span>Everything is stored locally on this device.</span><button onClick={() => setCommand(true)}>⌘ K</button></footer>

      <AnimatePresence>
        {command && (
          <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCommand(false)}>
            <motion.div className="command-panel" initial={{ y: 20, scale: .98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: .98 }} onClick={(e) => e.stopPropagation()}>
              <div className="search-line"><span>⌕</span><input autoFocus placeholder="What do you want to do?" /></div>
              <button onClick={() => { setTab("today"); setCommand(false); }}>Today <kbd>1</kbd></button>
              <button onClick={() => { setTab("notes"); setCommand(false); }}>Notes <kbd>2</kbd></button>
              <button onClick={() => { setRunning((v) => !v); setCommand(false); }}>Start / pause focus <kbd>3</kbd></button>
              <button onClick={() => { setDark((v) => !v); setCommand(false); }}>Toggle appearance <kbd>4</kbd></button>
              <p>Press Esc to close</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
