import { punishments } from "./data.js";
import { renderPunishments } from "./render.js";

export function initSearch() {
    const input   = document.getElementById("search-input");
    const shadow  = document.getElementById("search-shadow");
    const measure = document.getElementById("search-measure");
    const box     = document.getElementById("search-suggestions");


    input.addEventListener("input", () => {
        const raw      = input.value;            
        const rawClean = cleanName(raw);           
        const q        = rawClean.toLowerCase();    

        shadow.textContent = "";
        box.classList.remove("visible");

        if (q.length < 2) {
            renderPunishments(punishments);
            return;
        }

        // ===== ПРЕДПРОСМОТР КАРТОЧЕК =====
        const previewFiltered = punishments.filter(p =>
            cleanName(p.player || '').toLowerCase().includes(q) ||
            cleanName(p.moderator || '').toLowerCase().includes(q)
        );
        renderPunishments(previewFiltered, q, previewFiltered.length);

        // ===== УНИКАЛЬНЫЕ ИМЕНА =====
        const names = new Map();
        punishments.forEach(p => {
            if (p.player) {
                const c = cleanName(p.player);
                names.set(c.toLowerCase(), c);
            }
            if (p.moderator) {
                const c = cleanName(p.moderator);
                names.set(c.toLowerCase(), c);
            }
        });

        // ===== ПОИСК СОВПАДЕНИЙ =====
        const matches = [...names.entries()]
            .filter(([lower]) => lower.includes(q))
            .map(([_, clean]) => clean);

        if (matches.length === 0) return;

        // ===== АВТОДОПОЛНЕНИЕ =====
        const first = matches[0];
        const lowerFirst = first.toLowerCase();

        if (lowerFirst.startsWith(q) && q.length >= 3) {
            const completion = first.slice(q.length);
            
            // Измеряем текст
            measure.style.font = window.getComputedStyle(input).font;
            measure.textContent = input.value;
            const textWidth = measure.offsetWidth;
            
            // Получаем реальные координаты
            const inputRect = input.getBoundingClientRect();
            const wrapperRect = document.querySelector('.search-field-wrapper').getBoundingClientRect();
            
            // Позиция тени = левый край инпута + ширина текста
            // inputRect.left - wrapperRect.left = смещение инпута внутри обёртки
            shadow.style.left = (inputRect.left - wrapperRect.left + textWidth) + "px";
            shadow.textContent = completion;
        } else {
            shadow.textContent = "";
        }

        // ===== ПОДСКАЗКИ =====
        box.innerHTML = "";
        matches.forEach(cleanNameDisplay => {
            const count = punishments.filter(p =>
                cleanName(p.player) === cleanNameDisplay ||
                cleanName(p.moderator) === cleanNameDisplay
            ).length;

            const role = getRole(cleanNameDisplay);

            const item = document.createElement("div");
            item.className = "search-suggestion-item";

            item.innerHTML = `
                <span class="search-suggestion-name">
                    ${highlightMatch(cleanNameDisplay, q)}
                    <span class="search-suggestion-role">(${role})</span>
                </span>
                <span class="search-suggestion-count">${count} результатов</span>
            `;

            item.onclick = () => {
                input.value = cleanNameDisplay;
                shadow.textContent = "";
                box.classList.remove("visible");
                filterPunishments(cleanNameDisplay, q);
            };

            box.appendChild(item);
        });

        box.classList.add("visible");
    });

    // ===== ENTER → ДОПОЛНЕНИЕ =====
    input.addEventListener("keydown", e => {
        if (e.key === "Enter" && shadow.textContent.length > 0) {
            const fullValue = cleanName(input.value + shadow.textContent);
            input.value = fullValue;
            shadow.textContent = "";
            box.classList.remove("visible");
            filterPunishments(fullValue, cleanName(input.value));
        }
    });

    document.addEventListener("click", e => {
        if (!e.target.closest(".search-panel")) {
            box.classList.remove("visible");
            shadow.textContent = "";
        }
    });
}

function cleanName(name) {
    return String(name)
        .replace(/\s+/g, "")
        .replace(/[\u00A0]/g, "");
}

function highlightMatch(display, q) {
    const lower = display.toLowerCase();
    const index = lower.indexOf(q);
    if (index === -1) return display;

    const before = display.slice(0, index);
    const match  = display.slice(index, index + q.length);
    const after  = display.slice(index + q.length);

    const container = document.createElement("span");

    container.appendChild(document.createTextNode(before));

    const span = document.createElement("span");
    span.className = "highlight";
    span.textContent = match;
    container.appendChild(span);

    container.appendChild(document.createTextNode(after));

    return container.outerHTML;
}

function getRole(clean) {
    const isModerator = punishments.some(p => cleanName(p.moderator) === clean);
    const isPlayer    = punishments.some(p => cleanName(p.player) === clean);

    if (isModerator && isPlayer) return "модератор / нарушитель";
    if (isModerator) return "модератор";
    return "нарушитель";
}

function filterPunishments(cleanTarget, highlightQ = null) {
    const filtered = punishments.filter(p =>
        cleanName(p.player) === cleanTarget ||
        cleanName(p.moderator) === cleanTarget
    );

    renderPunishments(filtered, highlightQ);
}

function initSortPanel() {
    const sortButtons = document.querySelectorAll(".sort-tab");

    sortButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const sort = btn.dataset.sort;
            const type = btn.dataset.type;

            if (sort) {
                document
                    .querySelectorAll('[data-sort]')
                    .forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
            }

            if (type) {
                document
                    .querySelectorAll('[data-type]')
                    .forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
            }

            applySortingAndFiltering();
        });
    });
}

function applySortingAndFiltering() {
    const sort = document.querySelector(".sort-tab.active[data-sort]")?.dataset.sort;
    const type = document.querySelector(".sort-tab.active[data-type]")?.dataset.type;

    let list = [...punishments];

    // фильтр по типу
    if (type && type !== "all") {
        list = list.filter(p => p.type === type);
    }

    // сортировка
    if (sort === "newest") {
        list.sort((a, b) => b.timestamp - a.timestamp);
    } else if (sort === "oldest") {
        list.sort((a, b) => a.timestamp - b.timestamp);
    }

    renderPunishments(list);
}
