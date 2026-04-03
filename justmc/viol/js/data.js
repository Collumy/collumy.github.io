const DATA_URL = "https://raw.githubusercontent.com/Collumy/collumy.github.io/main/justmc/viol/data.json";
export let punishments = [];

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