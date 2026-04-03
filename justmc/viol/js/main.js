import { loadPunishments, loadPrefixes } from "./data.js";
import { initSearch} from "./search.js";
import { initFAQ } from "./faq.js";
import { initSortPanel } from "./switch.js";

window.addEventListener("DOMContentLoaded", () => {
    loadPrefixes();
    loadPunishments();

    initSearch();
    initSortPanel();
    initFAQ();
});
