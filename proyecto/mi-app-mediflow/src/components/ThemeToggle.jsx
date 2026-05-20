import { useEffect, useState } from "react";

export default function ThemeToggle() {
const [dark, setDark] = useState(() => {
// Persiste la preferencia del usuario
return localStorage.getItem("theme") === "dark";
});

useEffect(() => {
const root = document.documentElement;
if (dark) {
    root.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
} else {
    root.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
}
}, [dark]);

return (
<button
    className="theme-toggle"
    onClick={() => setDark(!dark)}
    aria-label={dark ? "Cambiar a modo día" : "Cambiar a modo noche"}
    title={dark ? "Modo día" : "Modo noche"}
    style={{ background: "none", border: "none", padding: 0 }}
>
    {/* Sol */}
    <span className="theme-toggle-icon" style={{ opacity: dark ? 0.35 : 1 }}>
    ☀️
    </span>

    {/* Track del switch */}
    <div className="theme-track">
    <div className="theme-thumb" />
    </div>

    {/* Luna */}
    <span className="theme-toggle-icon" style={{ opacity: dark ? 1 : 0.35 }}>
    🌙
    </span>
</button>
);
}
