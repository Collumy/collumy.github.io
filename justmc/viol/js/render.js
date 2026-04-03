export function renderPunishments(list, highlightQuery = null, count = null) {
    const container = document.getElementById("punish-list");
    container.innerHTML = "";


    list.forEach((p, i) => {
        const card = document.createElement("div");
        card.className = `punish-card ${p.type}`;

        const highlightMod = highlightQuery ? highlightMatch(p.moderator, highlightQuery) : p.moderator;
        const highlightPlayer = highlightQuery ? highlightMatch(p.player, highlightQuery) : p.player;

        card.innerHTML = `
            <div class="punish-header">
                <img src="https://mc-heads.net/avatar/${p.moderator}/64">
                <div>
                    <div class="name">${highlightMod}</div>
                    <div class="time">${p.time}</div>
                </div>
            </div>

            <div class="punish-title">
                ${p.type === "ban" ? "Бан" : "Мут"} ${highlightPlayer}
                <span class="small">на ${p.duration}</span>
            </div>

            <div class="punish-reason">${p.reason}</div>
        `;

        container.appendChild(card);
    });

    const realCount = count ?? list.length;
    document.querySelector(".punish-subtitle").textContent =
        `${realCount} результатов`;

    // Останавливаем наблюдение за всеми карточками
    document.querySelectorAll(".punish-card").forEach(card => {
        observer.unobserve(card);
        card.classList.remove("visible");
        card.style.transitionDelay = "0ms";
    });

    // Запускаем наблюдение за новыми карточками
    document.querySelectorAll(".punish-card").forEach(card => {
        observer.observe(card);
    });
}

export function updateStats(punishments) {
    const total = punishments.length;
    const today = punishments.filter(p => isTodayTimestamp(p.timestamp)).length;

    document.getElementById("stats-total").textContent = total;
    document.getElementById("stats-today").textContent = today;
}

function isTodayTimestamp(ts) {
    const date = new Date(ts); 
    const now = new Date();

    return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
    );
}



function highlightMatch(display, q) {
    if (!q || !display) return display;
    const lower = display.toLowerCase();
    const index = lower.indexOf(q.toLowerCase());
    if (index === -1) return display;
    const before = display.slice(0, index);
    const match  = display.slice(index, index + q.length);
    const after  = display.slice(index + q.length);
    return `${before}<span class="highlight">${match}</span>${after}`;
}

// Создаём observer с функцией для появления и исчезновения
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const el = entry.target;
        const index = parseInt(el.getAttribute("data-index")) || 0;

        if (entry.isIntersecting) {
            // Карточка появилась в зоне видимости
            el.style.transitionDelay = (index * 50) + "ms";
            el.classList.add("visible");
        } else {
            // Карточка ушла из зоны видимости — убираем класс
            el.style.transitionDelay = "0ms";
            el.classList.remove("visible");
        }
    });
}, {
    threshold: 0.1, // 10% карточки видно — появляется
    rootMargin: "0px 0px -50px 0px" // небольшой отступ снизу
});