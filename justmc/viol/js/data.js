const DATA_URL = "https://raw.githubusercontent.com/Collumy/collumy.github.io/main/justmc/viol/data.json";
const PREF_URL = "https://raw.githubusercontent.com/Collumy/collumy.github.io/main/justmc/viol/prefix.json";

export let punishments = [];
export let prefixes = {};

import { secondsToShort, formatTime } from "./utils.js";
import { renderPunishments, updateStats } from "./render.js";

export async function loadPunishments() {
    const response = await fetch(DATA_URL);
    const data = await response.json();

    const list = [];

    for (const player in data) {
        const entry = data[player];

        entry.mutes.forEach(m => {
            list.push({
                type: "mute",
                player,
                moderator: m.w,
                duration: secondsToShort(m.l),
                reason: m.r,

                time: formatTime(m.s),
                timestamp: m.s
            });
        });

        entry.bans.forEach(b => {
            list.push({
                type: "ban",
                player,
                moderator: b.w,
                duration: secondsToShort(b.l),
                reason: b.r,

                time: formatTime(b.s),
                timestamp: b.s
            });
        });
    }

    list.sort((a, b) => b.timestamp - a.timestamp);

    punishments = list;
    renderPunishments(list);
    updateStats(list);
}


const PREFIX_OPACITY = 0.15;
const RANK_COLORS = {
    "Meteor":  `rgba(170, 170, 170, ${PREFIX_OPACITY})`,
    "Moon":    `rgba(85, 255, 255, ${PREFIX_OPACITY})`,
    "Planet":  `rgba(85, 255, 85, ${PREFIX_OPACITY})`,
    "Star":    `rgba(255, 255, 85, ${PREFIX_OPACITY})`,
    "Galaxy":  `rgba(255, 85, 255, ${PREFIX_OPACITY})`,
    "Nova":    `rgba(255, 85, 85, ${PREFIX_OPACITY})`,

    "Support": `rgba(85, 255, 85, ${PREFIX_OPACITY})`,
    "Mod":     `rgba(85, 85, 255, ${PREFIX_OPACITY})`,
    "Sr. Mod": `rgba(85, 85, 255, ${PREFIX_OPACITY})`,
    "Dev":     `rgba(255, 85, 255, ${PREFIX_OPACITY})`,
    "Admin":   `rgba(255, 170, 0, ${PREFIX_OPACITY})`
};

export async function loadPrefixes() {
    const response = await fetch(PREF_URL);
    const raw = await response.json();
    const normalized = {};

    for (const nick in raw) {
        const rank = raw[nick]; // например "Mod"
        if (rank == "") continue;

        normalized[nick] = {
            text: rank,                          
            color: RANK_COLORS[rank] || `rgba(255, 170, 0, ${PREFIX_OPACITY})`  
        };
    }

    prefixes = normalized;
}