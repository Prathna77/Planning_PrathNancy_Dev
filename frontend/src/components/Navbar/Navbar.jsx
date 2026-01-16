import "./navbar.css";

export default function Navbar({ year, onYearPrev, onYearNext, onOpenDrawer }) {
    return (
        <div className="navWrap">
            <div className="navInner">
                <div className="brand">
                    <div className="logoDot" />
                    <div className="brandText">
                        <div className="brandTop">
                            <div className="brandTitle">Calendrier</div>

                            <div className="yearControl">
                                <button className="btn" onClick={onYearPrev} aria-label="Année précédente">◀</button>
                                <div className="yearValue">{year}</div>
                                <button className="btn" onClick={onYearNext} aria-label="Année suivante">▶</button>
                            </div>
                        </div>

                        {/* <div className="brandSub">Notes • Semaine Matin/Après-midi</div> */}
                    </div>
                </div>

                <div className="navActions">
                    {/* <button className="burgerBtn" onClick={onOpenDrawer} aria-label="Ouvrir le menu">
                        <span />
                        <span />
                        <span />
                    </button> */}
                    <button className="settingBtn" onClick={onOpenDrawer} aria-label="Ouvrir le menu">
                        <i className="bi bi-gear-fill"></i>
                    </button>
                </div>

            </div>
        </div>
    );
}
