class modal {
    constructor() {
        this.overlay = $(".screen_close");
        this.init();
    }
    init() {
        this.initEventClose();
    }

    initEventClose() {
        this.modals = $$(".modal");
        let modals = this.modals;
        for (let modal of modals) {
            let closeBtns = modal.querySelectorAll(
                ".modal__close, .modal__close-btn, .js-modal-accept"
            );

            for (let closeBtn of closeBtns) {
                this.createEventClose(closeBtn, modal);
            }
        }
    }

    createEventClose(element, modal) {
        element.addEventListener("click", (e) => {
            this.overlay.classList.add("hide");
            modal.classList.add("hide");
        });
    }

    buildNotify(
        type,
        title,
        message,
        callback,
        submitText = "Đồng ý",
        cancelText = "Huỷ"
    ) {
        let body = $("body");
        let notifySection = $("#notify");

        if (!notifySection) {
            notifySection = document.createElement("div");
            notifySection.setAttribute("id", "notify");
            body.appendChild(notifySection);
        }

        let notify = document.createElement("div");
        notify.classList.add("modal", "modal-notify");
        notifySection.innerHTML = "";
        notify.innerHTML = `<div class="modal__header">
                    <h3 class="modal__title">${title}</h3>
                    <span class="modal__close">
                        <i class="fas fa-times"></i>
                    </span>
                </div>
                <div class="modal__body">
                    <div class="notify notify--${type}">
                        <span class="notify__icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </span>
                        <p class="notify__text">
                           ${message}
                        </p>
                    </div>
                </div>
                <div class="modal__footer">
                    <button class="btn btn-group btn--${type} js-modal-accept">
                        <span class="btn-icon__text">${submitText}</span>
                    </button>
                    <button class="btn btn--default modal__close-btn">
                        ${cancelText}
                    </button>
                </div>`;

        notifySection.appendChild(notify);
        let acceptBtn = notify.querySelector(".js-modal-accept");
        acceptBtn.addEventListener("click", (e) => {
            callback();
        });
        this.initEventClose();
    }
}
