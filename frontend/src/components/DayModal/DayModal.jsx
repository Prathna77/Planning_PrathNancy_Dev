import { useEffect, useMemo, useState } from "react";
import "./dayModal.css";

function formatFR(iso) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export default function DayModal({ isOpen, dateISO, note, onClose, onSave, onDelete }) {
    const [value, setValue] = useState(note || "");

    useEffect(() => {
        setValue(note || "");
    }, [note, dateISO]);

    const title = useMemo(() => formatFR(dateISO), [dateISO]);

    if (!isOpen) return null;

    return (
        <>
            <div className="modalOverlay" onClick={onClose} />
            <div className="modal" role="dialog" aria-modal="true">
                <div className="modalHead">
                    <div>
                        <div className="modalTitle">Note</div>
                        <div className="modalSub">{title}</div>
                    </div>
                    <button className="btn" onClick={onClose}>Fermer</button>
                </div>

                <div className="modalBody">
                    <textarea
                        className="modalTextarea"
                        placeholder="Écris ta note ici..."
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <div className="modalActions">
                        <button className="btn btnPrimary" onClick={() => onSave?.(value)}>Enregistrer</button>
                        <button className="btn btnDanger" onClick={() => onDelete?.()}>Supprimer</button>
                    </div>
                    <div className="modalHint">Si tu laisses vide et tu enregistres, la note sera supprimée.</div>
                </div>
            </div>
        </>
    );
}
