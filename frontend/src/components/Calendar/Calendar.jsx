import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import "./calendar.css";
import { buildMonthGrid, getISOWeek, isWeekend, monthNameFR, toISODateString } from "../../utils/date.js";

function weekLabelFromParity(isWeekA) {
    return isWeekA ? "Matin" : "Après-midi";
}

function useMediaQuery(query) {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

    useEffect(() => {
        const m = window.matchMedia(query);
        const handler = () => setMatches(m.matches);
        handler();
        m.addEventListener?.("change", handler);
        return () => m.removeEventListener?.("change", handler);
    }, [query]);

    return matches;
}

const Calendar = forwardRef(function Calendar(
    { year, todayISO, notesByDate, weekAColor, weekBColor, onDayClick },
    ref
) {
    const isMobile = useMediaQuery("(max-width: 720px)");
    const dayRefs = useRef({}); // iso -> element

    useImperativeHandle(ref, () => ({
        scrollToDate(iso) {
            const el = dayRefs.current[iso];
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }));

    // Auto scroll to today on first render (only if viewing current year)
    useEffect(() => {
        if (!todayISO) return;
        const currentYear = Number(todayISO.slice(0, 4));
        if (year !== currentYear) return;

        // petit délai pour laisser le DOM se rendre
        const t = setTimeout(() => {
            const el = dayRefs.current[todayISO];
            if (el) el.scrollIntoView({ behavior: "auto", block: "center" });
        }, 80);

        return () => clearTimeout(t);
    }, [year, todayISO]);

    if (isMobile) {
        return (
            <MobileDayList
                year={year}
                todayISO={todayISO}
                notesByDate={notesByDate}
                weekAColor={weekAColor}
                weekBColor={weekBColor}
                onDayClick={onDayClick}
                dayRef={(iso, el) => (dayRefs.current[iso] = el)}
            />
        );
    }

    return (
        <DesktopMonthGrid
            year={year}
            todayISO={todayISO}
            notesByDate={notesByDate}
            weekAColor={weekAColor}
            weekBColor={weekBColor}
            onDayClick={onDayClick}
            dayRef={(iso, el) => (dayRefs.current[iso] = el)}
        />
    );
});

function DesktopMonthGrid({ year, todayISO, notesByDate, weekAColor, weekBColor, onDayClick, dayRef }) {
    const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);

    return (
        <div className="calendarWrap">
            {months.map((m) => (
                <MonthSection
                    key={m}
                    year={year}
                    monthIndex={m}
                    todayISO={todayISO}
                    notesByDate={notesByDate}
                    weekAColor={weekAColor}
                    weekBColor={weekBColor}
                    onDayClick={onDayClick}
                    dayRef={dayRef}
                />
            ))}
        </div>
    );
}

function MonthSection({ year, monthIndex, todayISO, notesByDate, weekAColor, weekBColor, onDayClick, dayRef }) {
    const { cells } = useMemo(() => buildMonthGrid(year, monthIndex), [year, monthIndex]);

    return (
        <div className="month">
            <div className="monthHeader">
                <div className="monthTitle">{monthNameFR(monthIndex)}</div>
                <div className="monthLegend">
                    <span className="legendDot" style={{ background: weekAColor }} /> Semaine A (Matin)
                    <span className="legendDot" style={{ background: weekBColor }} /> Semaine B (Après-midi)
                    <span className="legendText">Week-end neutre</span>
                </div>
            </div>

            <div className="dow">
                <div>Lun</div><div>Mar</div><div>Mer</div><div>Jeu</div><div>Ven</div><div>Sam</div><div>Dim</div>
            </div>

            <div className="grid">
                {cells.map((dateObj, idx) => {
                    const iso = toISODateString(dateObj);
                    const inMonth = dateObj.getFullYear() === year && dateObj.getMonth() === monthIndex;
                    const weekend = isWeekend(dateObj);

                    const weekNo = getISOWeek(dateObj);
                    const isWeekA = weekNo % 2 === 0;
                    const weekColor = isWeekA ? weekAColor : weekBColor;

                    const isToday = iso === todayISO;

                    return (
                        <button
                            key={iso + "-" + idx}
                            ref={(el) => dayRef(iso, el)}
                            className={`cell ${inMonth ? "" : "out"} ${weekend ? "weekend" : ""} ${isToday ? "today" : ""}`}
                            onClick={() => inMonth && onDayClick?.(iso)}
                            title={iso}
                            style={
                                weekend
                                    ? undefined
                                    : {
                                        borderColor: "rgba(255,255,255,0.12)",
                                        background: `linear-gradient(180deg, ${hexToRgba(weekColor, 0.26)}, rgba(255,255,255,0.04))`
                                    }
                            }
                        >
                            <div className="cellHeaderRow">
                                <div className="cellTop">
                                    <div className="dayNum">{dateObj.getDate()}</div>
                                </div>

                                {/* Zone top-right */}
                                {weekend && getISOWeek(dateObj) % 2 === 0 ? (
                                    <div className="childBadge">
                                        Kaylan 🧒
                                    </div>
                                ) : (
                                    !weekend && inMonth && (
                                        <div
                                            className="slotBadge"
                                            style={{
                                                background: hexToRgba(weekColor, 0.25),
                                                borderColor: hexToRgba(weekColor, 0.45)
                                            }}
                                        >
                                            {weekLabelFromParity(isWeekA)}
                                        </div>
                                    )
                                )}
                            </div>
                            {inMonth && notesByDate?.[iso] ? (
                                <div className="notePreview withIcon">
                                    <span className="noteIcon" aria-hidden>📝</span>
                                    <span className="noteText">{notesByDate[iso]}</span>
                                </div>
                            ) : (
                                <div className="notePreview empty" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function MobileDayList({ year, todayISO, notesByDate, weekAColor, weekBColor, onDayClick, dayRef }) {
    const sections = useMemo(() => {
        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31);

        const byMonth = [];
        let currentMonth = -1;
        let bucket = null;

        const cur = new Date(start);
        cur.setHours(0, 0, 0, 0);

        while (cur <= end) {
            const m = cur.getMonth();
            if (m !== currentMonth) {
                currentMonth = m;
                bucket = { monthIndex: m, days: [] };
                byMonth.push(bucket);
            }
            bucket.days.push(new Date(cur));
            cur.setDate(cur.getDate() + 1);
        }

        return byMonth;
    }, [year]);

    const weekdayShort = (d) => {
        // ex: "mer." -> "mer"
        const w = d.toLocaleDateString("fr-FR", { weekday: "short" });
        return w.replace(".", "").toLowerCase();
    };

    return (
        <div className="mobileList">
            {sections.map((section) => (
                <div key={`${year}-${section.monthIndex}`} className="mobileMonthSection">
                    <div className="mobileMonthTitle">{monthNameFR(section.monthIndex)}</div>

                    <div className="mobileMonthDays">
                        {section.days.map((d) => {
                            const iso = toISODateString(d);
                            const weekend = isWeekend(d);

                            const weekNo = getISOWeek(d);
                            const isWeekA = weekNo % 2 === 0;
                            const weekColor = isWeekA ? weekAColor : weekBColor;

                            const hasNote = !!notesByDate?.[iso];
                            const isToday = iso === todayISO;

                            return (
                                <button
                                    key={iso}
                                    ref={(el) => dayRef(iso, el)}
                                    className={`dayRow ${weekend ? "weekend" : ""} ${isToday ? "today" : ""}`}
                                    onClick={() => onDayClick?.(iso)}
                                    style={
                                        weekend
                                            ? undefined
                                            : {
                                                borderColor: "rgba(255,255,255,0.12)",
                                                background: `linear-gradient(180deg, ${hexToRgba(weekColor, 0.12)}, rgba(255,255,255,0.04))`
                                            }
                                    }
                                >
                                    <div className="dayRowMain">
                                        <div className="dayRowHeaderRow">
                                            <div className="dayRowDateCompact">
                                                <span className="dayRowDow">{weekdayShort(d)}</span>
                                                <span className="dayRowDayNum">{String(d.getDate()).padStart(2, "0")}</span>
                                            </div>

                                            {weekend && getISOWeek(d) % 2 === 0 ? (
                                                <div className="childBadgeMobile">Kaylan 🧒</div>
                                            ) : (
                                                !weekend && (
                                                    <div
                                                        className="dayRowBadge"
                                                        style={{
                                                            background: hexToRgba(weekColor, 0.22),
                                                            borderColor: hexToRgba(weekColor, 0.45)
                                                        }}
                                                    >
                                                        {weekLabelFromParity(isWeekA)}
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        {hasNote ? (
                                            <div className="dayRowNotePreview">
                                                <span className="noteIcon" aria-hidden>📝</span>
                                                <span className="dayRowNoteText">{notesByDate[iso]}</span>
                                            </div>
                                        ) : (
                                            <div className="dayRowNotePreview empty">Aucune note</div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

function hexToRgba(hex, a) {
    const h = (hex || "").replace("#", "").trim();
    if (h.length !== 6) return `rgba(255,255,255,${a})`;
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
}

export default Calendar;
