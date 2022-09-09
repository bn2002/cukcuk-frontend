function renderPagination(currentPage, totalCount, perPage, selector) {
    let totalPage = Math.ceil(totalCount / perPage);
    let pageArray = [];
    let fp = 1;
    let lp = totalPage;
    if (Math.abs(currentPage - fp) < 3) {
        if (lp > 4) {
            pageArray = [1, 2, 3, 4, "...", lp];
        } else {
            for (let index = 1; index <= lp; index++) {
                pageArray.push(index);
            }
        }
    } else if (Math.abs(currentPage - lp) < 3) {
        pageArray = [1, "...", lp - 3, lp - 2, lp - 1, lp];
    } else if (lp <= 6) {
        for (let i = 1; i <= lp; i++) {
            pageArray.push(i);
        }
    } else {
        pageArray = [
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            lp,
        ];
    }
    // Thanh trạng thái

    let start = (currentPage - 1) * perPage + 1;
    let end = start + perPage - 1;
    end = end <= totalCount ? end : totalCount;
    document.querySelector("#total-record").textContent = totalCount;
    document.querySelector("#start-record").textContent = start;
    document.querySelector("#end-record").textContent = end;

    let paginationElement = `<ul class="pagination__list">
                                <li
                                    class="pagination__item pagination__item--none-border js-first-page ${
                                        currentPage === fp ? "disabled" : ""
                                    }"
                                    onclick="setPage(${fp})"
                                    >
                                    <img
                                        src="./assets/icon/btn-firstpage.svg"
                                        class="pagination__icon"
                                        alt="" />
                                </li>
                                <li
                                    class="pagination__item pagination__item--none-border js-prev-page ${
                                        currentPage === fp ? "disabled" : ""
                                    }"
                                    onclick="setPage(${currentPage - 1})"
                                    >
                                    <img
                                        src="./assets/icon/btn-prev-page.svg"
                                        class="pagination__icon"
                                        alt="" />
                                </li>
                               `;
    for (let item of pageArray) {
        if (currentPage === item) {
            paginationElement += `
                <li class="pagination__item pagination__item--active disabled">${item}</li>
            `;
        } else {
            if (item === "...") {
                paginationElement += `
                    <li class="pagination__item disabled">...</li>
                `;
            } else {
                paginationElement += `
                    <li class="pagination__item" onclick="setPage(${item})">${item}</li>
                `;
            }
        }
    }

    paginationElement += ` <li
                                    class="pagination__item pagination__item--none-border js-next-page ${
                                        currentPage === lp ? "disabled" : ""
                                    }"
                                    onclick="setPage(${currentPage + 1})"
                                    >
                                    <img
                                        src="./assets/icon/btn-next-page.svg"
                                        class="pagination__icon"
                                        alt="" />
                                </li>
                                <li
                                    class="pagination__item pagination__item--none-border js-last-page ${
                                        currentPage === lp ? "disabled" : ""
                                    }"
                                    onclick="setPage(${lp})"
                                    >
                                    <img
                                        src="./assets/icon/btn-lastpage.svg"
                                        class="pagination__icon"
                                        alt="" />
                                </li>
                            </ul>`;

    let rootElement = document.querySelector(selector);
    if (rootElement) {
        rootElement.innerHTML = paginationElement;
    }
}

function setPage(page) {
    window.currentPage = page;
    handleFilter();
}
