export function initFAQ() {
    const faqButton = document.querySelector(".faq-button");
    const faqPanel = document.querySelector(".faq-panel");
    const faqItems = document.querySelectorAll(".faq-panel-item");

    faqButton.addEventListener("click", () => {
        faqPanel.classList.toggle("open");
    });

    document.addEventListener("click", e => {
        if (!e.target.closest(".faq-floating")) {
            faqPanel.classList.remove("open");
        }
    });

    let lastScroll = 0;
    window.addEventListener("scroll", () => {
        const current = window.scrollY;
        if (Math.abs(current - lastScroll) > 20) {
            faqPanel.classList.remove("open");
        }
        lastScroll = current;
    });

    function typeText(element, text) {
        element.innerHTML = "";
        let i = 0;

        function type() {
            if (i < text.length) {
                element.innerHTML += text[i];
                i++;
                setTimeout(type, 18);
            }
        }
        type();
    }

    faqItems.forEach(item => {
        const answer = item.querySelector(".faq-panel-answer");
        const originalText = answer.textContent.trim();

        item.addEventListener("click", () => {
            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove("open");
                    const ans = other.querySelector(".faq-panel-answer");
                    ans.style.display = "none";
                    ans.style.opacity = "0";
                }
            });

            const isOpen = item.classList.toggle("open");

            if (isOpen) {
                answer.style.display = "block";
                answer.style.opacity = "1";
                answer.innerHTML = "";
                typeText(answer, originalText);
            } else {
                answer.style.display = "none";
                answer.style.opacity = "0";
            }
        });
    });
}
