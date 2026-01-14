import { useMemo, useState } from "react";
import "./dateFilter.css";

function digitsOnly(s) {
    return (s || "").replace(/\D/g, "");
}

// Affichage: JJ/MM/AAAA (auto /)
function formatToDisplay(raw) {
    const d = digitsOnly(raw).slice(0, 8); // JJMMYYYY max
    const dd = d.slice(0, 2);
    const mm = d.slice(2, 4);
    const yyyy = d.slice(4, 8);

    let out = "";
    if (dd) out += dd;
    if (mm) out += (out.length ? "/" : "") + mm;
    if (yyyy) out += (out.length ? "/" : "") + yyyy;
    return out;
}

// Convertit vers ISO YYYY-MM-DD
function displayToISO(display) {
    const d = digitsOnly(display);

    // JJMMYYYY
    if (d.length === 8) {
        const dd = d.slice(0, 2);
        const mm = d.slice(2, 4);
        const yyyy = d.slice(4, 8);
        return `${yyyy}-${mm}-${dd}`;
    }

    // JJMMYY -> 20YY
    if (d.length === 6) {
        const dd = d.slice(0, 2);
        const mm = d.slice(2, 4);
        const yy = d.slice(4, 6);
        return `20${yy}-${mm}-${dd}`;
    }

    // Déjà ISO
    if (/^\d{4}-\d{2}-\d{2}$/.test(display.trim())) return display.trim();

    // Collé en JJ/MM/YYYY
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

const MONTHS = [
    { label: "Janv.", mm: "01" },
    { label: "Fév.", mm: "02" },
    { label: "Mars", mm: "03" },
    { label: "Avr.", mm: "04" },
    { label: "Mai", mm: "05" },
    { label: "Juin", mm: "06" },
    { label: "Juil.", mm: "07" },
    { label: "Août", mm: "08" },
    { label: "Sept.", mm: "09" },
    { label: "Oct.", mm: "10" },
    { label: "Nov.", mm: "11" },
    { label: "Déc.", mm: "12" }
];

export default function DateFilter({ year, onGo }) {
    const [display, setDisplay] = useState("");

    const iso = useMemo(() => displayToISO(display), [display]);
    const ok = useMemo(() => isValidISODate(iso), [iso]);

    function onChange(e) {
        setDisplay(formatToDisplay(e.target.value));
    }

    function submit(e) {
        e.preventDefault();
        if (!ok) return;
        onGo?.(iso);
    }

    function goMonth(mm) {
        const y = Number(year) || new Date().getFullYear();
        // scroll au 1er du mois
        onGo?.(`${y}-${mm}-01`);
    }

    return (
        <div className="filterCard">
            <div className="filterTitle">Rechercher une date</div>

            {/* Boutons mois */}
            <div className="monthJump">
                {MONTHS.map((m) => (
                    <button
                        key={m.mm}
                        type="button"
                        className="monthBtn"
                        onClick={() => goMonth(m.mm)}
                        aria-label={`Aller à ${m.label}`}
                    >
                        {m.label}
                    </button>
                ))}
            </div>

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
