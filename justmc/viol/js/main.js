import { loadPunishments } from "./data.js";
import { initSearch} from "./search.js";
import { initFAQ } from "./faq.js";
import { initSortPanel } from "./switch.js";

window.addEventListener("DOMContentLoaded", () => {
    loadPunishments();
    initSearch();
    initSortPanel();
    initFAQ();
});
