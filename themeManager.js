document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme") || "dark";
    document.body.classList.add(currentTheme + "-theme");

    if (currentTheme === "light") toggle.checked = true;

    toggle.addEventListener("change", () => {
        document.body.classList.toggle("dark-theme");
        document.body.classList.toggle("light-theme");
        const newTheme = toggle.checked ? "light" : "dark";
        localStorage.setItem("theme", newTheme);
    });
});
