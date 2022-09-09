let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);
let menuLeft = $(".menu-left");
let toggleMenuBtn = $$(".menu-toggle-js");
let navControl = $(".navbar__control");
let content = $(".content");
// Event đóng mở thanh menu trái
for (let element of toggleMenuBtn) {
    element.addEventListener("click", function (e) {
        e.preventDefault();
        menuLeft.classList.toggle("hide");
        navControl.classList.toggle("hide");
        content.classList.toggle("content--large-padding");
    });
}
