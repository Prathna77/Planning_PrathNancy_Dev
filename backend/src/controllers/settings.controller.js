import { SettingsModel } from "../models/settings.model.js";

const DEFAULTS = {
    weekA_color: "#2D6CDF",
    weekB_color: "#F59E0B",
    background_type: "gradient",
    background_value: "linear-gradient(135deg, #0f172a, #111827)"
};

export const SettingsController = {
    async get(req, res) {
        try {
            const settings = await SettingsModel.get();
            res.json(settings);
        } catch {
            res.status(500).json({ error: "Server error" });
        }
    },

    async update(req, res) {
        try {
            const current = await SettingsModel.get();

            const weekA_color = String(req.body?.weekA_color ?? current?.weekA_color ?? DEFAULTS.weekA_color).trim();
            const weekB_color = String(req.body?.weekB_color ?? current?.weekB_color ?? DEFAULTS.weekB_color).trim();

            const background_typeRaw = String(req.body?.background_type ?? current?.background_type ?? DEFAULTS.background_type).trim();
            const background_type = background_typeRaw === "image" ? "image" : "gradient";

            const background_value = String(
                req.body?.background_value ?? current?.background_value ?? DEFAULTS.background_value
            ).trim();

            const updated = await SettingsModel.update({
                weekA_color: weekA_color || DEFAULTS.weekA_color,
                weekB_color: weekB_color || DEFAULTS.weekB_color,
                background_type,
                background_value: background_value || DEFAULTS.background_value
            });

            res.json(updated);
        } catch {
            res.status(500).json({ error: "Server error" });
        }
    }
};
