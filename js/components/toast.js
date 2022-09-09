class toast {
    static show(message, type = "info", duration = 3000) {
        let body = $("body");
        let toastSection = $("#toast");
        // Khoi tao khung chua tat ca thong bao toast
        if (!toastSection) {
            toastSection = document.createElement("div");
            toastSection.setAttribute("id", "toast");
            body.appendChild(toastSection);
        }

        let toast = document.createElement("div");
        // Tu dong xoa toast
        let timerId = setTimeout(function () {
            toastSection.removeChild(toast);
        }, duration + 1000);

        // Xoa toast khi click
        toast.onclick = (e) => {
            if (e.target.closest(".toast__close")) {
                toastSection.removeChild(toast);
                clearTimeout(timerId);
            }
        };

        // Tao thong bao toast
        let icons = {
            success: "fas fa-check",
            warning: "fas fa-exclamation-circle",
            danger: "fas fa-exclamation-triangle",
            info: "fas fa-exclamation-circle",
        };

        let icon = icons[type];
        toast.classList.add("toast", `toast--${type}`);
        let delay = (duration / 1000).toFixed(2);
        toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;
        toast.innerHTML = `
            <span class="toast__icon">
                    <i class="${icon}"></i>
                </span>
                <span class="toast__text">${message}</span>
                <span class="toast__icon toast__close">
                    <i class="fas fa-times"></i>
            </span>
        `;

        toastSection.appendChild(toast);
    }
}
