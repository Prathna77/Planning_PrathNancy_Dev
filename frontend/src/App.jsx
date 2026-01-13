import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { api } from "./api/client.js";

import Navbar from "./components/Navbar/Navbar.jsx";
import BurgerDrawer from "./components/BurgerDrawer/BurgerDrawer.jsx";
import Calendar from "./components/Calendar/Calendar.jsx";
import DayModal from "./components/DayModal/DayModal.jsx";
import DateFilter from "./components/DateFilter/DateFilter.jsx";
import SettingsPanel from "./components/SettingsPanel/SettingsPanel.jsx";

export default function App() {
  // YYYY-MM-DD (stable)
  const todayISO = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${da}`;
  }, []);

  const [year, setYear] = useState(Number(todayISO.slice(0, 4)));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [notesByDate, setNotesByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(null); // ISO string
  const [selectedNote, setSelectedNote] = useState("");

  const [settings, setSettings] = useState(null);
  const [backgrounds, setBackgrounds] = useState([]);

  const calendarRef = useRef(null);

  // Apply background to CSS variable (external system: DOM)
  useEffect(() => {
    if (!settings) return;

    const root = document.documentElement;

    if (settings.background_type === "image") {
      const url = `${api.baseUrl}${settings.background_value}`;
      root.style.setProperty("--app-bg", `url("${url}")`);
    } else {
      root.style.setProperty("--app-bg", settings.background_value);
    }
  }, [settings]);

  // Load all data for a year (NO setState in a called function from the effect body)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [notes, s, imgs] = await Promise.all([
          api.getNotesByYear(year),
          api.getSettings(),
          api.listBackgrounds(),
        ]);

        if (cancelled) return;

        setNotesByDate(notes || {});
        setSettings(s);
        setBackgrounds(imgs || []);
      } catch (err) {
        if (!cancelled) console.error(err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [year]);

  const onDayClick = useCallback(
    (iso) => {
      setSelectedDate(iso);
      setSelectedNote(notesByDate[iso] || "");
    },
    [notesByDate]
  );

  const saveNote = useCallback(
    async (content) => {
      if (!selectedDate) return;

      await api.upsertNote(selectedDate, content);

      setNotesByDate((prev) => {
        const next = { ...prev };
        if (!content.trim()) delete next[selectedDate];
        else next[selectedDate] = content;
        return next;
      });

      setSelectedNote(content);
    },
    [selectedDate]
  );

  const deleteNote = useCallback(async () => {
    if (!selectedDate) return;

    await api.deleteNote(selectedDate);

    setNotesByDate((prev) => {
      const next = { ...prev };
      delete next[selectedDate];
      return next;
    });

    setSelectedNote("");
  }, [selectedDate]);

  const scrollToDate = useCallback((iso) => {
    if (!calendarRef.current) return;
    calendarRef.current.scrollToDate(iso);
  }, []);

  const goToday = useCallback(() => {
    const currentYear = Number(todayISO.slice(0, 4));
    if (year === currentYear) {
      scrollToDate(todayISO);
    } else {
      // si tu es sur une autre année, on te remet au début de l'année affichée
      scrollToDate(`${year}-01-01`);
    }
  }, [todayISO, year, scrollToDate]);

  const onSaveSettings = useCallback(async (payload) => {
    const updated = await api.saveSettings(payload);
    setSettings(updated);
  }, []);

  const onUploadBackground = useCallback(async (file) => {
    const created = await api.uploadBackground(file);
    setBackgrounds((prev) => [created, ...prev]);
  }, []);

  const onDeleteBackground = useCallback(async (id) => {
    await api.deleteBackground(id);

    const [imgs, s] = await Promise.all([api.listBackgrounds(), api.getSettings()]);
    setBackgrounds(imgs || []);
    setSettings(s);
  }, []);

  return (
    <div className="app">
      <Navbar
        year={year}
        onYearPrev={() => setYear((y) => y - 1)}
        onYearNext={() => setYear((y) => y + 1)}
        onOpenDrawer={() => setDrawerOpen(true)}
      />

      <div className="container">
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr" }}>
          <div className="card" style={{ padding: 14 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>Calendrier {year}</div>
              <div style={{ color: "var(--muted)" }}>
                Clique une date pour ajouter/modifier une note
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 14 }}>
            <Calendar
              ref={calendarRef}
              year={year}
              todayISO={todayISO}
              notesByDate={notesByDate}
              weekAColor={settings?.weekA_color || "#2D6CDF"}
              weekBColor={settings?.weekB_color || "#F59E0B"}
              onDayClick={onDayClick}
            />
          </div>
        </div>
      </div>

      <DayModal
        isOpen={!!selectedDate}
        dateISO={selectedDate}
        note={selectedNote}
        onClose={() => setSelectedDate(null)}
        onSave={saveNote}
        onDelete={deleteNote}
      />

      <BurgerDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div style={{ display: "grid", gap: 14 }}>
          <DateFilter
            onGo={(iso) => {
              scrollToDate(iso);
              setDrawerOpen(false);
            }}
          />

          <div className="hr" />

          <SettingsPanel
            settings={settings}
            backgrounds={backgrounds}
            onSaveSettings={onSaveSettings}
            onUploadBackground={onUploadBackground}
            onDeleteBackground={onDeleteBackground}
            onSelectBackground={(url) =>
              onSaveSettings({
                weekA_color: settings?.weekA_color,
                weekB_color: settings?.weekB_color,
                background_type: "image",
                background_value: url,
              })
            }
            onSelectGradient={(gradient) =>
              onSaveSettings({
                weekA_color: settings?.weekA_color,
                weekB_color: settings?.weekB_color,
                background_type: "gradient",
                background_value: gradient,
              })
            }
            apiBaseUrl={api.baseUrl}
          />
        </div>
      </BurgerDrawer>

      <button className="todayFab" onClick={goToday} aria-label="Revenir à aujourd'hui">
        Aujourd’hui
      </button>
    </div>
  );
}
