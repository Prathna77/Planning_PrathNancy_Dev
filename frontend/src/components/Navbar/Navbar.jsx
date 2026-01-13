import "./navbar.css";

export default function Navbar({ year, onYearPrev, onYearNext, onOpenDrawer }) {
    return (
        <div className="navWrap">
            <div className="navInner">
                <div className="brand">
                    <div className="logoDot" />
                    <div>
                        <div className="brandTitle">Calendrier</div>
                        <div className="brandSub">Notes • Semaine Matin/Après-midi</div>
                    </div>
                </div>

                <div className="navActions">
                    <div className="yearControl">
                        <button className="btn" onClick={onYearPrev} aria-label="Année précédente">◀</button>
                        <div className="yearValue">{year}</div>
                        <button className="btn" onClick={onYearNext} aria-label="Année suivante">▶</button>
                    </div>

                    <button className="burgerBtn" onClick={onOpenDrawer} aria-label="Ouvrir le menu">
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
            </div>
        </div>
    );
}
