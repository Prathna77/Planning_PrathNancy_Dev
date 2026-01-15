const BASE_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? "http://localhost:4000" : "");
if (!BASE_URL) throw new Error("VITE_API_URL missing in production build");

async function request(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            ...(options.headers || {})
        }
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`API error ${res.status}: ${text}`);
    }

    // Some endpoints may return empty
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return null;
    return res.json();
}

export const api = {
    health: () => request("/health"),

    getNotesByYear: (year) => request(`/api/notes?year=${year}`),
    getNote: (date) => request(`/api/notes/${date}`),
    upsertNote: (date, content) =>
        request(`/api/notes/${date}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content })
        }),
    deleteNote: (date) => request(`/api/notes/${date}`, { method: "DELETE" }),

    getSettings: () => request("/api/settings"),
    saveSettings: (payload) =>
        request("/api/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }),

    listBackgrounds: () => request("/api/backgrounds"),
    uploadBackground: async (file) => {
        const form = new FormData();
        form.append("image", file);
        const res = await fetch(`${BASE_URL}/api/backgrounds`, { method: "POST", body: form });
        if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
        return res.json();
    },
    deleteBackground: (id) => request(`/api/backgrounds/${id}`, { method: "DELETE" }),

    baseUrl: BASE_URL
};
