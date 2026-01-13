import { useState } from "react";
import "./settingsPanel.css";

const COLOR_PALETTE = [
    /* BLEUS */
    "#60A5FA", // blue
    "#38BDF8", // sky
    "#1E3A8A", // blue night

    /* VERTS */
    "#34D399", // green
    "#A3E635", // lime

    /* JAUNE / ORANGE */
    "#FACC15", // yellow
    "#FB923C", // orange

    /* ROUGE / ROSE */
    "#DC2626", // red
    "#F472B6", // pink

    /* VIOLET */
    "#C084FC", // purple

    /* NEUTRES */
    "#F5F5DC", // beige
    "#94A3B8", // slate
    "#000000", // black
    "#FFFFFF"  // white
];

const GRADIENT_PRESETS = [
    /* BLEU PROFOND */
    "linear-gradient(135deg, #0f172a, #1e3a8a)",

    /* GRIS MODERNE */
    "linear-gradient(135deg, #111827, #374151)",

    /* NOIR ÉLÉGANT */
    "linear-gradient(135deg, #020617, #020617)",

    /* ROSE DOUX */
    "linear-gradient(135deg, #831843, #f472b6)",

    /* ROUGE INTENSE */
    "linear-gradient(135deg, #450a0a, #dc2626)",

    /* VIOLET PROFOND */
    "linear-gradient(135deg, #2e1065, #7c3aed)",

];

const DEFAULT_WEEK_A = "#2D6CDF";
const DEFAULT_WEEK_B = "#F59E0B";
const DEFAULT_GRADIENT = "linear-gradient(135deg, #0f172a, #111827)";

function ColorPalette({ value, onChange }) {
    return (
        <div className="colorPalette" role="list" aria-label="Palette de couleurs">
            {COLOR_PALETTE.map((c) => (
                <button
                    key={c}
                    type="button"
                    className={`colorSwatch ${value === c ? "active" : ""}`}
                    style={{ background: c }}
                    onClick={() => onChange(c)}
                    aria-label={`Choisir ${c}`}
                    title={c}
                />
            ))}
        </div>
    );
}

function GradientPalette({ value, onSelect }) {
    return (
        <div className="gradientPalette" role="list" aria-label="Presets de gradients">
            {GRADIENT_PRESETS.map((g) => (
                <button
                    key={g}
                    type="button"
                    className={`gradientSwatch ${value === g ? "active" : ""}`}
                    style={{ background: g }}
                    onClick={() => onSelect(g)}
                    aria-label="Choisir ce gradient"
                    title="Choisir ce gradient"
                />
            ))}
        </div>
    );
}

export default function SettingsPanel({
    settings,
    backgrounds,
    onSaveSettings,
    onUploadBackground,
    onDeleteBackground,
    onSelectBackground,
    onSelectGradient,
    apiBaseUrl
}) {
    // Valeurs "source" (props) avec fallback
    const sourceWeekA = settings?.weekA_color || DEFAULT_WEEK_A;
    const sourceWeekB = settings?.weekB_color || DEFAULT_WEEK_B;

    const sourceGradient =
        settings?.background_type === "gradient"
            ? (settings?.background_value || DEFAULT_GRADIENT)
            : DEFAULT_GRADIENT;

    const activeImageUrl =
        settings?.background_type === "image" ? settings?.background_value : null;

    /**
     * IMPORTANT:
     * - On garde des états "draft" seulement pour éditer
     * - On les "réinitialise" quand settings change via `key`
     *   (pas de useEffect, donc pas de warning)
     */
    const resetKey = `${settings?.weekA_color || ""}|${settings?.weekB_color || ""}|${settings?.background_type || ""}|${settings?.background_value || ""}`;

    return (
        <div className="settings" key={resetKey}>
            <SettingsPanelInner
                sourceWeekA={sourceWeekA}
                sourceWeekB={sourceWeekB}
                sourceGradient={sourceGradient}
                activeImageUrl={activeImageUrl}
                backgrounds={backgrounds}
                apiBaseUrl={apiBaseUrl}
                settings={settings}
                onSaveSettings={onSaveSettings}
                onUploadBackground={onUploadBackground}
                onDeleteBackground={onDeleteBackground}
                onSelectBackground={onSelectBackground}
                onSelectGradient={onSelectGradient}
            />
        </div>
    );
}

function SettingsPanelInner({
    sourceWeekA,
    sourceWeekB,
    sourceGradient,
    activeImageUrl,
    backgrounds,
    apiBaseUrl,
    settings,
    onSaveSettings,
    onUploadBackground,
    onDeleteBackground,
    onSelectBackground,
    onSelectGradient
}) {
    // États d'édition (draft) initialisés à partir des valeurs source
    const [weekA, setWeekA] = useState(sourceWeekA);
    const [weekB, setWeekB] = useState(sourceWeekB);
    const [gradient, setGradient] = useState(sourceGradient);

    async function saveWeekColors() {
        if (!settings) return;
        await onSaveSettings?.({
            weekA_color: weekA,
            weekB_color: weekB,
            background_type: settings.background_type,
            background_value: settings.background_value
        });
    }

    async function applyGradient() {
        if (!settings) return;
        // On applique le gradient/couleur via le handler existant
        await onSelectGradient?.(gradient);
    }

    async function onPickFile(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        await onUploadBackground?.(file);
        e.target.value = "";
    }

    return (
        <>
            <div className="settingsTitle">Personnalisation</div>

            {/* Couleurs des semaines */}
            <div className="settingsBlock">
                <div className="settingsLabel">Couleurs des semaines</div>

                <div className="colorRow">
                    <div className="colorItem">
                        <div className="colorName">Semaine A (Matin)</div>

                        <ColorPalette value={weekA} onChange={setWeekA} />

                        <input
                            className="input"
                            value={weekA}
                            onChange={(e) => setWeekA(e.target.value)}
                            placeholder={DEFAULT_WEEK_A}
                        />
                        <div className="miniHint">Palette + code HEX (si besoin).</div>
                    </div>

                    <div className="colorItem">
                        <div className="colorName">Semaine B (Après-midi)</div>

                        <ColorPalette value={weekB} onChange={setWeekB} />

                        <input
                            className="input"
                            value={weekB}
                            onChange={(e) => setWeekB(e.target.value)}
                            placeholder={DEFAULT_WEEK_B}
                        />
                        <div className="miniHint">Palette + code HEX (si besoin).</div>
                    </div>
                </div>

                <button className="btn btnPrimary" onClick={saveWeekColors} type="button">
                    Enregistrer couleurs
                </button>
            </div>

            {/* Background gradient/couleur */}
            <div className="settingsBlock">
                <div className="settingsLabel">Background (Gradient / Couleur)</div>

                <GradientPalette value={gradient} onSelect={setGradient} />

                <input
                    className="input"
                    value={gradient}
                    onChange={(e) => setGradient(e.target.value)}
                    placeholder="linear-gradient(...) ou #000000"
                />
                <div className="miniHint">
                    Choisis un preset ou écris ton gradient CSS (ou une couleur).
                </div>

                <button className="btn btnPrimary" onClick={applyGradient} type="button">
                    Appliquer gradient
                </button>
            </div>

            {/* Background images */}
            <div className="settingsBlock">
                <div className="settingsLabel">Background images</div>

                <div className="uploadRow">
                    <label className="uploadBtn">
                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={onPickFile}
                        />
                        Uploader une image
                    </label>
                    <div className="miniHint">png / jpg / webp (max 5MB)</div>
                </div>

                <div className="imgGrid">
                    {backgrounds?.length ? (
                        backgrounds.map((img) => {
                            const isActive = activeImageUrl === img.url;
                            const fullUrl = `${apiBaseUrl}${img.url}`;

                            return (
                                <div className={`imgCard ${isActive ? "active" : ""}`} key={img.id}>
                                    <div
                                        className="imgThumb"
                                        style={{ backgroundImage: `url("${fullUrl}")` }}
                                    />

                                    <div className="imgMeta">
                                        <div className="imgName" title={img.original_name}>
                                            {img.original_name}
                                        </div>

                                        <div className="imgActions">
                                            <button
                                                className="btn btnPrimary"
                                                type="button"
                                                onClick={() => onSelectBackground?.(img.url)}
                                            >
                                                Utiliser
                                            </button>

                                            <button
                                                className="btn btnDanger"
                                                type="button"
                                                onClick={() => onDeleteBackground?.(img.id)}
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="emptyText">Aucune image uploadée.</div>
                    )}
                </div>
            </div>

            <div className="miniHint" style={{ marginTop: 8 }}>
                Prochainement tu pourras ajouter d’autres options ici (comme tu voulais).
            </div>
        </>
    );
}
