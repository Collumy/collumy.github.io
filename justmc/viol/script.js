const API_URL = "https://script.google.com/macros/s/AKfycbxPYAG3xM-ju3V8DockaI2UbOIpUd4w5XO2FZsdOagsUzfNKjX_wph1DA-sqeUPhVmJ/exec";
let punishments = [];

async function loadPunishments() {
    const response = await fetch(API_URL);
    const data = await response.json();

    const list = [];

    // Преобразуем структуру Google Script → список наказаний
    for (const player in data) {
        const entry = data[player];

        // MUTES
        entry.mutes.forEach(m => {
            list.push({
                type: "mute",
                player: player,
                moderator: m.w,
                duration: secondsToShort(m.l),
                reason: m.r,
                time: formatTime(m.s),
                timestamp: m.s
            });
        });

        // BANS
        entry.bans.forEach(b => {
            list.push({
                type: "ban",
                player: player,
                moderator: b.w,
                duration: secondsToShort(b.l),
                reason: b.r,
                time: formatTime(b.s),
                timestamp: b.s
            });
        });
    }

    // Сортировка по времени (новые сверху)
    list.sort((a, b) => a.timestamp - b.timestamp);

    punishments = list;
    renderPunishments(list);
}

function renderPunishments(list) {
    const container = document.getElementById("punish-list");
    container.innerHTML = "";

    list.forEach((p, i) => {
        const card = document.createElement("div");
        card.className = `punish-card ${p.type}`;

        card.innerHTML = `
            <div class="punish-header">
                <img src="https://mc-heads.net/avatar/${p.moderator}/64">
                <div>
                    <div class="name">${p.moderator}</div>
                    <div class="time">${p.time}</div>
                </div>
            </div>

            <div class="punish-title">
                ${p.type === "ban" ? "Бан" : "Мут"} ${p.player}
                <span class="small">на ${p.duration}</span>
            </div>

            <div class="punish-reason">${p.reason}</div>
        `;

        container.appendChild(card);
        setTimeout(() => {
    requestAnimationFrame(() => card.classList.add("visible"));
}, 80 + i * 120);

    });
}


function secondsToShort(sec) {
  sec = Number(sec);

  const units = [
    { value: 31536000, label: "г" },   // год
    { value: 2592000,  label: "мес" }, // месяц
    { value: 86400,    label: "д" },   // день
    { value: 3600,     label: "ч" },   // час
    { value: 60,       label: "м" },   // минута
    { value: 1,        label: "с" }    // секунда
  ];

  let result = [];

  for (const u of units) {
    const amount = Math.floor(sec / u.value);
    if (amount > 0) {
      result.push(amount + u.label);
      sec -= amount * u.value;
    }
  }

  return result.join(" ");
}

function formatTime(timestamp) {
    const date = new Date(timestamp);

    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");

    const day = date.getDate();
    const year = date.getFullYear();

    const months = [
        "января", "февраля", "марта", "апреля",
        "мая", "июня", "июля", "августа",
        "сентября", "октября", "ноября", "декабря"
    ];

    const monthName = months[date.getMonth()];

    return `${hh}:${mm}:${ss}, ${day} ${monthName} ${year}`;
}

loadPunishments();



// Поиск
const searchInput = document.querySelector(".search-box input");
const suggestionsBox = document.getElementById("search-suggestions");

searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();

    if (q.length < 3) {
        suggestionsBox.classList.remove("visible");
        renderPunishments(punishments);
        return;
    }

    // === УНИКАЛЬНЫЕ ИМЕНА ===
    const names = new Map();

    punishments.forEach(p => {
        if (p.player) {
            const original = String(p.player);
            names.set(original.toLowerCase(), original);
        }
        if (p.moderator) {
            const original = String(p.moderator);
            names.set(original.toLowerCase(), original);
        }
    });

    // === ФИЛЬТРАЦИЯ ===
    const matches = [...names.entries()]
        .filter(([lower]) => lower.includes(q))
        .map(([lower, original]) => original);

    if (matches.length === 0) {
        suggestionsBox.classList.remove("visible");
        return;
    }

    // === ПОКАЗ ПОДСКАЗОК ===
    suggestionsBox.innerHTML = "";
    matches.forEach(name => {
        const div = document.createElement("div");
        div.textContent = name;
        div.onclick = () => {
            searchInput.value = name;
            suggestionsBox.classList.remove("visible");
            filterPunishments(name);
        };
        suggestionsBox.appendChild(div);
    });

    suggestionsBox.classList.add("visible");
});



function filterPunishments(name) {
    name = name.toLowerCase();

    const filtered = punishments.filter(p =>
        (p.player && p.player.toLowerCase() === name) ||
        (p.moderator && p.moderator.toLowerCase() === name)
    );

    renderPunishments(filtered);
}


document.addEventListener("click", e => {
    if (!e.target.closest(".search-box")) {
        suggestionsBox.classList.remove("visible");
    }
});
