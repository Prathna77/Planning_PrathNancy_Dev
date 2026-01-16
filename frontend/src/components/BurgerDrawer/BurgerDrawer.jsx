import { useEffect } from "react";
import "./burgerDrawer.css";

export default function BurgerDrawer({ open, onClose, children }) {
    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") onClose?.();
        }
        if (open) window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    return (
        <>
            <div className={`drawerOverlay ${open ? "open" : ""}`} onClick={onClose} />
            <div className={`drawer ${open ? "open" : ""}`} role="dialog" aria-modal="true">
                <div className="drawerHead">
                    <div className="drawerTitle">Réglage</div>
                    <button className="btn" onClick={onClose}>Fermer</button>
                </div>
                <div className="drawerBody">{children}</div>
            </div>
        </>
    );
}
