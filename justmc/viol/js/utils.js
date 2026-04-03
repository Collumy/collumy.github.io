export function secondsToShort(sec) {
    sec = Number(sec);

    const units = [
        { value: 31536000, label: "г" },
        { value: 2592000,  label: "мес" },
        { value: 86400,    label: "д" },
        { value: 3600,     label: "ч" },
        { value: 60,       label: "м" },
        { value: 1,        label: "с" }
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

export function formatTime(timestamp) {
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

    return `${hh}:${mm}:${ss}, ${day} ${months[date.getMonth()]} ${year}`;
}
