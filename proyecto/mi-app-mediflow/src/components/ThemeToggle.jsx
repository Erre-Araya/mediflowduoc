import { useEffect, useState } from "react";

export default function ThemeToggle() {
const [dark, setDark] = useState(() => {
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
    title={dark ? "Modo día" : "Modo noche"}
>
    <span>☀️</span>

    <div className="theme-track">
    <div className="theme-thumb" />
    </div>

    <span>🌙</span>
</button>
);
}