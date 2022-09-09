// Combobox
class combobox {
    constructor(selector, listData, placeholder, callback) {
        this.selector = selector;
        this.listItem = listData;
        this.placeholder = placeholder;
        this.selectedValue = "";
        this.defaultValue = "";
        this.init();
    }

    init() {
        let comboboxElement = document.querySelector(this.selector);
        if (!comboboxElement) {
            return;
        }

        this.comboboxElement = comboboxElement;
        this.comboboxListElement =
            comboboxElement.querySelector(".combobox__list");

        this.selectElement = comboboxElement.querySelector(".combobox__select");

        this.btnElement = comboboxElement.querySelector(".combobox__btn");

        this.valueElement = comboboxElement.querySelector(".combobox__value");

        this.hiddenInputElement =
            comboboxElement.querySelector(`input[type="hidden"]`);
        // Set default value
        this.setDefaultValue();
        // Render select list
        this.renderListItem();
        // Handle click combobox select
        this.handleClickSelectSection();
        // Handle click element
        this.handleClickItem();
    }

    renderListItem() {
        let comboboxList = this.comboboxListElement;
        comboboxList.innerHTML = "";
        this.listItem.forEach((item) => {
            let otherClassCss =
                item.value === this.selectedValue
                    ? "combobox__item--active"
                    : "";

            let icon =
                item.value === this.selectedValue
                    ? '<i class="fas fa-check"></i>'
                    : "";
            let li = `
            <li class="combobox__item ${otherClassCss}" data-value="${item.value}">${icon}<span>${item.title}</span></li>`;
            comboboxList.insertAdjacentHTML("beforeend", li);
        });
    }

    handleClickSelectSection() {
        let comboboxSelect = this.selectElement;
        let comboboxList = this.comboboxListElement;
        let comboboxBtn = this.btnElement;
        comboboxSelect.addEventListener("click", function (e) {
            comboboxList.classList.toggle("combobox__list--active");
            comboboxSelect.classList.toggle("combobox__select--active");
            comboboxBtn.classList.toggle("combobox__btn--active");
        });
    }

    handleClickItem() {
        let comboboxElement = this.comboboxElement;
        let comboboxSelect = this.selectElement;
        let comboboxList = this.comboboxListElement;
        let comboboxBtn = this.btnElement;
        let itemElements = comboboxElement.querySelectorAll(".combobox__item");
        for (let itemElement of itemElements) {
            itemElement.addEventListener("click", (e) => {
                comboboxSelect.classList.remove("combobox__select--active");
                comboboxList.classList.remove("combobox__list--active");
                comboboxBtn.classList.remove("combobox__btn--active");
                let li = e.target.closest("li");
                if (this.selectedValue === li.dataset.value) {
                    this.selectedValue = "";
                    this.valueElement.textContent = this.placeholder;
                    this.valueElement.classList.remove(
                        "combobox__value--active"
                    );
                } else {
                    this.selectedValue = li.dataset.value;
                    // this.valueElement.textContent = this.selectedValue;
                    this.valueElement.textContent = e.target.textContent;
                    this.valueElement.classList.add("combobox__value--active");
                }

                this.hiddenInputElement.value = this.selectedValue;
                this.hiddenInputElement.dispatchEvent(new Event("change"));
                this.renderListItem();
                this.handleClickItem();
            });
        }
    }

    setDefaultValue() {
        let defaultValue = this.listItem.find(
            (item) => item?.isDefault === true
        );
        if (defaultValue) {
            defaultValue = defaultValue.value;
            this.valueElement.classList.add("combobox__value--active");
            this.valueElement.textContent = defaultValue;
            this.selectedValue = defaultValue;
        }
    }

    getValue() {
        return this.selectedValue;
    }
}
