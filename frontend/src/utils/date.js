export function pad2(n) {
    return String(n).padStart(2, "0");
}

export function toISODateString(d) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// ISO week number (1..53)
export function getISOWeek(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

export function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
}

export function monthNameFR(m) {
    return [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ][m];
}

export function dayNameShortFR(dow) {
    // 1..7 (Mon..Sun)
    return ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"][dow - 1];
}

// Create month grid: weeks rows of 7 days (Mon..Sun) with leading/trailing days
export function buildMonthGrid(year, monthIndex) {
    const first = new Date(year, monthIndex, 1);
    const last = new Date(year, monthIndex + 1, 0);

    // get monday-based index for first day
    const firstDow = ((first.getDay() + 6) % 7); // Mon=0..Sun=6
    const start = new Date(year, monthIndex, 1 - firstDow);

    const cells = [];
    const cursor = new Date(start);
    cursor.setHours(0, 0, 0, 0);

    // 6 weeks grid (42 cells) for stable layout
    for (let i = 0; i < 42; i++) {
        cells.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + 1);
    }

    return { cells, monthStart: first, monthEnd: last };
}
