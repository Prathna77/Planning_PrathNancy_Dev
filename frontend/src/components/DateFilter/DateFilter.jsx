import { useMemo, useState } from "react";
import "./dateFilter.css";

function digitsOnly(s) {
    return (s || "").replace(/\D/g, "");
}

// Affichage utilisateur: DD/MM/YYYY (auto slash)
// Interne: YYYY-MM-DD
function formatToDisplay(raw) {
    const d = digitsOnly(raw).slice(0, 8); // DDMMYYYY max
    const dd = d.slice(0, 2);
    const mm = d.slice(2, 4);
    const yyyy = d.slice(4, 8);

    let out = "";
    if (dd) out += dd;
    if (mm) out += (out.length ? "/" : "") + mm;
    if (yyyy) out += (out.length ? "/" : "") + yyyy;
    return out;
}

function displayToISO(display) {
    const d = digitsOnly(display);

    // Cas 1: DDMMYYYY (8 chiffres)
    if (d.length === 8) {
        const dd = d.slice(0, 2);
        const mm = d.slice(2, 4);
        const yyyy = d.slice(4, 8);
        return `${yyyy}-${mm}-${dd}`;
    }

    // Cas 2: YYYYMMDD (8 chiffres mais commence par 19/20/21..)
    // (optionnel) si l'utilisateur tape 20260113 sans slash
    if (d.length === 8 && (d.startsWith("19") || d.startsWith("20") || d.startsWith("21"))) {
        const yyyy = d.slice(0, 4);
        const mm = d.slice(4, 6);
        const dd = d.slice(6, 8);
        return `${yyyy}-${mm}-${dd}`;
    }

    // Cas 3: DDMMYY (6 chiffres) -> 20YY
    if (d.length === 6) {
        const dd = d.slice(0, 2);
        const mm = d.slice(2, 4);
        const yy = d.slice(4, 6);
        return `20${yy}-${mm}-${dd}`;
    }

    // Cas 4: si l’utilisateur colle déjà YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(display.trim())) return display.trim();

    // Cas 5: si l’utilisateur colle DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(display.trim())) {
        const [dd, mm, yyyy] = display.trim().split("/");
        return `${yyyy}-${mm}-${dd}`;
    }

    return null;
}

function isValidISODate(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

export default function DateFilter({ onGo }) {
    const [display, setDisplay] = useState("");
    const iso = useMemo(() => displayToISO(display), [display]);
    const ok = useMemo(() => isValidISODate(iso), [iso]);

    function onChange(e) {
        const next = formatToDisplay(e.target.value);
        setDisplay(next);
    }

    function submit(e) {
        e.preventDefault();
        if (!ok) return;
        onGo?.(iso);
    }

    return (
        <div className="filterCard">
            <div className="filterTitle">Rechercher une date</div>

            <form onSubmit={submit} className="filterForm">
                <input
                    className="input"
                    placeholder="JJ/MM/AAAA (ex: 13/01/2026)"
                    value={display}
                    onChange={onChange}
                    inputMode="numeric"
                />
                <button className={`btn btnPrimary ${ok ? "" : "disabledBtn"}`} type="submit" disabled={!ok}>
                    Go
                </button>
            </form>

            <div className="filterHint">
                {ok ? `→ ${iso} (OK)` : "Tape 8 chiffres : JJMMYYYY (les / se mettent tout seuls)"}
            </div>
        </div>
    );
}
