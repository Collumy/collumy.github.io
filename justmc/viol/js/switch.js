import { punishments } from "./data.js";
import { renderPunishments } from "./render.js";

export function initSortPanel() {
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
    console.log("изменили");

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