import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Sunrise,
  Anchor,
  CalendarDays,
  Wind,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Play,
  Square,
  Search,
  Sparkles,
} from "lucide-react";

const MOODS = [
  { key: "tough", label: "Really tough", color: "#FF9166", level: 1 },
  { key: "low", label: "Low", color: "#FFC857", level: 2 },
  { key: "okay", label: "Okay", color: "#B8A6FF", level: 3 },
  { key: "good", label: "Good", color: "#4FD1C5", level: 4 },
  { key: "great", label: "Great", color: "#7CE3B0", level: 5 },
];

const CATEGORY_COLOR = {
  "Cognitive (CBT)": "#FF7A6B",
  "Mindfulness & DBT": "#4FD1C5",
  "Self-care": "#FFC857",
};

const MILESTONES = [3, 7, 14, 30, 60, 100];

const TECHNIQUES = [
  {
    category: "Cognitive (CBT)",
    items: [
      {
        title: "Reframe a thought",
        summary: "A short thought record for catching and testing an unhelpful thought.",
        source: "Beck, 1979 — Cognitive Therapy of Depression",
        steps: [
          "Write the exact thought that's bothering you, in quotes.",
          "Name the feeling it brings up and rate it 0–10.",
          "List the evidence that supports the thought.",
          "List the evidence against it — be as thorough as you were above.",
          "Write one more balanced thought that fits the evidence.",
          "Re-rate the feeling. Notice any shift, even a small one.",
        ],
      },
      {
        title: "Behavioral activation",
        summary: "Do a small meaningful thing before you feel ready — motivation follows action.",
        source: "Jacobson et al., 1996 — Component Analysis of BA",
        steps: [
          "Pick one activity you used to enjoy, or that matters to you.",
          "Shrink it until it takes under 10 minutes.",
          "Put a specific time on it today.",
          "Do it without waiting to feel like it.",
          "Notice how you feel afterward, not before — that's the data that counts.",
        ],
      },
      {
        title: "Worry postponement",
        summary: "Contain worry to one window instead of letting it run all day.",
        source: "Borkovec et al., 1983 — Stimulus Control for Worry",
        steps: [
          "When a worry shows up, jot it in one line on a list.",
          "Tell yourself: not now, at worry time.",
          "Set a daily 10-minute worry window, same time each day.",
          "At that time, go through the list and actually think it through.",
          "Close the notebook when the 10 minutes are up.",
        ],
      },
      {
        title: "Behavioral experiment",
        summary: "Test a feared prediction in real life instead of arguing with it in your head.",
        source: "Beck, 1979 — Cognitive Therapy of Depression",
        steps: [
          "Write the specific prediction you're afraid of ('If I go, everyone will notice I'm anxious').",
          "Rate how strongly you believe it, 0–100%.",
          "Design a small, safe way to test it.",
          "Run the experiment and record what actually happened.",
          "Compare the outcome to the prediction and re-rate your belief.",
        ],
      },
    ],
  },
  {
    category: "Mindfulness & DBT",
    items: [
      {
        title: "5-4-3-2-1 grounding",
        summary: "Pull attention back into the room through your senses.",
        source: "Common grounding protocol, DBT skills tradition",
        steps: [
          "Name 5 things you can see.",
          "Name 4 things you can touch.",
          "Name 3 things you can hear.",
          "Name 2 things you can smell.",
          "Name 1 thing you can taste.",
        ],
      },
      {
        title: "Box breathing",
        summary: "A steady four-part breath used to calm the nervous system quickly.",
        source: "Diaphragmatic breathing research, physiological calming",
        steps: [
          "Inhale slowly for 4 counts.",
          "Hold for 4 counts.",
          "Exhale slowly for 4 counts.",
          "Hold empty for 4 counts.",
          "Repeat for 4–8 rounds. There's a guided version in Unwind.",
        ],
      },
      {
        title: "TIPP (crisis skill)",
        summary: "For moments of intense distress — changes body chemistry fast.",
        source: "Linehan, 1993 — DBT Skills Training Manual",
        steps: [
          "Temperature: hold cold water or ice against your face for 15–30 seconds.",
          "Intense exercise: 1–2 minutes of jumping jacks or running in place.",
          "Paced breathing: exhale longer than you inhale.",
          "Paired muscle relaxation: tense a muscle group for 5 seconds, then release.",
        ],
      },
      {
        title: "Body scan",
        summary: "A slow pass through the body to notice and release tension.",
        source: "Kabat-Zinn, 1990 — Full Catastrophe Living",
        steps: [
          "Sit or lie down somewhere comfortable.",
          "Bring attention to your feet — just notice, don't change anything.",
          "Move attention slowly upward: legs, torso, arms, shoulders, face.",
          "Where you find tension, breathe into it and let it soften.",
          "Finish by noticing how the whole body feels, as one piece.",
        ],
      },
      {
        title: "Progressive muscle relaxation",
        summary: "Tense-and-release cycles that teach your body what 'let go' feels like.",
        source: "Jacobson, 1938 — Progressive Relaxation",
        steps: [
          "Start at your feet. Tense the muscles hard for 5 seconds.",
          "Release suddenly and notice the contrast.",
          "Move upward: calves, thighs, stomach, hands, arms, shoulders, face.",
          "Breathe naturally between each muscle group.",
          "Finish with the whole body relaxed for 30 seconds.",
        ],
      },
    ],
  },
  {
    category: "Self-care",
    items: [
      {
        title: "Sleep wind-down",
        summary: "A short checklist for a body that has trouble settling at night.",
        source: "CBT-I sleep hygiene guidelines",
        steps: [
          "Screens off 30 minutes before bed if you can manage it.",
          "Dim the lights in the last hour.",
          "Write down anything on your mind so it isn't held in your head.",
          "Keep the room cool and dark.",
          "If you're not asleep in 20 minutes, get up and do something quiet, then try again.",
        ],
      },
      {
        title: "Movement snack",
        summary: "A short burst of movement — no workout plan required.",
        source: "Exercise & mood research, general consensus",
        steps: [
          "Stand up from where you are right now.",
          "Walk for 5 minutes, outside if possible.",
          "Let your arms swing, unclench your jaw.",
          "No pace goal — just moving counts.",
        ],
      },
      {
        title: "One honest connection",
        summary: "Isolation feeds most of these conditions — this counters it directly.",
        source: "Social support & depression literature",
        steps: [
          "Think of one person you trust, even a little.",
          "Send one honest sentence about how you're actually doing.",
          "You don't need a plan for their reply — sending it is the win.",
        ],
      },
      {
        title: "Gratitude practice",
        summary: "Briefly noting what went right nudges attention away from threat-scanning.",
        source: "Emmons & McCullough, 2003 — Counting Blessings",
        steps: [
          "Write down 3 specific things from today, big or small.",
          "For each, add one line on why it mattered.",
          "Read them back once before you close the notebook.",
        ],
      },
      {
        title: "Self-compassion break",
        summary: "Speak to yourself the way you'd speak to someone you love.",
        source: "Neff, 2003 — Self-Compassion",
        steps: [
          "Name what's hard: 'This is a moment of struggle.'",
          "Normalize it: 'Struggling is part of being human.'",
          "Offer yourself kindness: 'May I be kind to myself right now.'",
        ],
      },
    ],
  },
];

function pad(n) {
  return n < 10 ? "0" + n : "" + n;
}
function dateKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function moodInfo(key) {
  return MOODS.find((m) => m.key === key);
}
function allTechniqueItems() {
  return TECHNIQUES.flatMap((cat) =>
    cat.items.map((item) => ({ ...item, category: cat.category }))
  );
}

export default function Harbor() {
  const [tab, setTab] = useState("today");
  const [navOpen, setNavOpen] = useState(false);
  const [moodLog, setMoodLog] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [burst, setBurst] = useState(false);
  const prevStreakRef = useRef(0);

  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");

  const [expandedTech, setExpandedTech] = useState(null);
  const [techQuery, setTechQuery] = useState("");
  const [techFilter, setTechFilter] = useState("All");
  const [showCrisis, setShowCrisis] = useState(false);

  const today = new Date();
  const todayKey = dateKey(today);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("moodlog", false);
        if (res && res.value) setMoodLog(JSON.parse(res.value));
      } catch (e) {
        /* no entry yet */
      }
      setLoaded(true);
    })();
  }, []);

  function computeStreak(log) {
    let streak = 0;
    let cursor = new Date();
    while (log[dateKey(cursor)]) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  const saveMood = useCallback(
    async (key, mood, note) => {
      const updated = { ...moodLog, [key]: { mood, note: note || "" } };
      setMoodLog(updated);
      const newStreak = computeStreak(updated);
      if (MILESTONES.includes(newStreak) && newStreak !== prevStreakRef.current) {
        setBurst(true);
        setTimeout(() => setBurst(false), 1400);
      }
      prevStreakRef.current = newStreak;
      try {
        const result = await window.storage.set("moodlog", JSON.stringify(updated), false);
        if (!result) setStorageError(true);
      } catch (e) {
        setStorageError(true);
      }
    },
    [moodLog]
  );

  const streak = computeStreak(moodLog);

  const navItems = [
    { key: "today", label: "Today", icon: Sunrise, color: "#FFC857" },
    { key: "techniques", label: "Techniques", icon: Anchor, color: "#FF7A6B" },
    { key: "tracker", label: "Tracker", icon: CalendarDays, color: "#4FD1C5" },
    { key: "unwind", label: "Unwind", icon: Wind, color: "#B8A6FF" },
  ];

  return (
    <div className="harbor-root">
      <FontStyles />
      {burst && <ConfettiBurst />}
      <div className="shell">
        <aside className={`sidebar ${navOpen ? "open" : ""}`}>
          <div className="brand">
            <span className="brand-ring" aria-hidden="true" />
            <span className="brand-name">Harbor</span>
          </div>
          <nav className="navlist" aria-label="Sections">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = tab === item.key;
              return (
                <button
                  key={item.key}
                  className={`navitem ${active ? "active" : ""}`}
                  style={{ "--nav-color": item.color }}
                  onClick={() => {
                    setTab(item.key);
                    setNavOpen(false);
                  }}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon size={18} strokeWidth={1.75} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <button className="crisis-toggle" onClick={() => setShowCrisis(true)}>
            <LifeBuoy size={16} strokeWidth={1.75} />
            <span>Need support now?</span>
          </button>
        </aside>

        <button className="mobile-nav-toggle" onClick={() => setNavOpen((v) => !v)} aria-label="Toggle navigation">
          {navOpen ? <X size={20} /> : <Sunrise size={20} />}
          <span>{navItems.find((n) => n.key === tab)?.label}</span>
        </button>

        <main className="content">
          {tab === "today" && (
            <TodayView streak={streak} todayKey={todayKey} moodLog={moodLog} onLogMood={saveMood} goTo={setTab} />
          )}
          {tab === "techniques" && (
            <TechniquesView
              expandedTech={expandedTech}
              setExpandedTech={setExpandedTech}
              query={techQuery}
              setQuery={setTechQuery}
              filter={techFilter}
              setFilter={setTechFilter}
            />
          )}
          {tab === "tracker" && (
            <TrackerView
              loaded={loaded}
              moodLog={moodLog}
              monthOffset={monthOffset}
              setMonthOffset={setMonthOffset}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              noteDraft={noteDraft}
              setNoteDraft={setNoteDraft}
              onLogMood={saveMood}
              streak={streak}
              storageError={storageError}
            />
          )}
          {tab === "unwind" && <UnwindView />}
        </main>
      </div>

      {showCrisis && <CrisisPanel onClose={() => setShowCrisis(false)} />}
    </div>
  );
}

function ConfettiBurst() {
  const colors = ["#FF7A6B", "#4FD1C5", "#FFC857", "#B8A6FF", "#7CE3B0"];
  const particles = Array.from({ length: 18 }).map((_, i) => {
    const angle = (i / 18) * Math.PI * 2;
    const dist = 90 + Math.random() * 70;
    return {
      id: i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      color: colors[i % colors.length],
      delay: Math.random() * 0.15,
    };
  });
  return (
    <div className="confetti-layer" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            "--dx": `${p.x}px`,
            "--dy": `${p.y}px`,
            background: p.color,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function TodayView({ streak, todayKey, moodLog, onLogMood, goTo }) {
  const loggedToday = moodLog[todayKey];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const dayIndex = Math.floor(Date.now() / 86400000);
  const allItems = allTechniqueItems();
  const dailyPick = allItems[dayIndex % allItems.length];

  return (
    <div className="view today-view">
      <section className="hero">
        <div className="hero-blobs" aria-hidden="true">
          <span className="blob blob-1" />
          <span className="blob blob-2" />
          <span className="blob blob-3" />
        </div>
        <div className="breathing-ring" aria-hidden="true">
          <span className="ring ring-1" />
          <span className="ring ring-2" />
          <span className="ring ring-3" />
        </div>
        <h1>{greeting}.</h1>
        <p className="hero-sub">One small, evidence-based thing today is enough. This is a quiet place to find it.</p>
      </section>

      <section className="card checkin-card">
        <h2>How are you, right now?</h2>
        {loggedToday ? (
          <p className="checkin-done">
            Logged as{" "}
            <strong style={{ color: moodInfo(loggedToday.mood)?.color }}>{moodInfo(loggedToday.mood)?.label}</strong>{" "}
            today. You can change it any time from the Tracker.
          </p>
        ) : (
          <div className="mood-row">
            {MOODS.map((m) => (
              <button
                key={m.key}
                className="mood-btn"
                style={{ "--mood-color": m.color }}
                onClick={() => onLogMood(todayKey, m.key, "")}
              >
                <span className="mood-dot" />
                {m.label}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="card daily-pick" style={{ "--accent": CATEGORY_COLOR[dailyPick.category] }}>
        <span className="daily-pick-tag">
          <Sparkles size={14} strokeWidth={2} /> Today's pick
        </span>
        <h3>{dailyPick.title}</h3>
        <p>{dailyPick.summary}</p>
        <button className="btn-ghost" onClick={() => goTo("techniques")}>
          See the steps
        </button>
      </section>

      <section className="today-grid">
        <button className="quick-card" style={{ "--accent": "#FF7A6B" }} onClick={() => goTo("techniques")}>
          <Anchor size={20} strokeWidth={1.75} />
          <div>
            <h3>Find a technique</h3>
            <p>CBT, mindfulness &amp; DBT, and self-care, in plain steps.</p>
          </div>
        </button>
        <button className="quick-card" style={{ "--accent": "#B8A6FF" }} onClick={() => goTo("unwind")}>
          <Wind size={20} strokeWidth={1.75} />
          <div>
            <h3>Guided breathing &amp; games</h3>
            <p>Paced breathing, a ripple pool, and bubble pop.</p>
          </div>
        </button>
        <div className="quick-card streak-card" style={{ "--accent": "#4FD1C5" }}>
          <CalendarDays size={20} strokeWidth={1.75} />
          <div>
            <h3>{streak > 0 ? `${streak}-day streak` : "Start a streak"}</h3>
            <p>{streak > 0 ? "Consecutive days you've checked in." : "Log today to begin one."}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function TechniquesView({ expandedTech, setExpandedTech, query, setQuery, filter, setFilter }) {
  const categories = ["All", ...TECHNIQUES.map((c) => c.category)];
  const q = query.trim().toLowerCase();

  return (
    <div className="view">
      <header className="view-header">
        <h1>Techniques</h1>
        <p>A working library of approaches drawn from CBT, mindfulness/DBT, and general self-care research.</p>
      </header>

      <div className="tech-controls">
        <div className="search-box">
          <Search size={16} strokeWidth={2} />
          <input
            type="text"
            placeholder="Search techniques..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="filter-chips">
          {categories.map((c) => (
            <button
              key={c}
              className={`chip ${filter === c ? "active" : ""}`}
              style={{ "--chip-color": CATEGORY_COLOR[c] || "#F5F1FF" }}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {TECHNIQUES.filter((cat) => filter === "All" || filter === cat.category).map((cat) => {
        const visibleItems = cat.items.filter(
          (item) =>
            !q || item.title.toLowerCase().includes(q) || item.summary.toLowerCase().includes(q)
        );
        if (visibleItems.length === 0) return null;
        return (
          <section key={cat.category} className="tech-section">
            <h2 className="tech-category" style={{ color: CATEGORY_COLOR[cat.category] }}>
              {cat.category}
            </h2>
            <div className="tech-list">
              {visibleItems.map((item) => {
                const id = cat.category + "|" + item.title;
                const open = expandedTech === id;
                return (
                  <div
                    key={id}
                    className={`tech-card ${open ? "open" : ""}`}
                    style={{ "--accent": CATEGORY_COLOR[cat.category] }}
                  >
                    <button
                      className="tech-card-head"
                      onClick={() => setExpandedTech(open ? null : id)}
                      aria-expanded={open}
                    >
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.summary}</p>
                      </div>
                      <ChevronDown className="chevron" size={18} strokeWidth={1.75} />
                    </button>
                    {open && (
                      <>
                        <ol className="tech-steps">
                          {item.steps.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ol>
                        <p className="tech-source">Rooted in: {item.source}</p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function TrackerView({
  loaded,
  moodLog,
  monthOffset,
  setMonthOffset,
  selectedDay,
  setSelectedDay,
  noteDraft,
  setNoteDraft,
  onLogMood,
  streak,
  storageError,
}) {
  const base = new Date();
  const viewDate = new Date(base.getFullYear(), base.getMonth() + monthOffset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const firstWeekday = new Date(year, month, 1).getDay();
