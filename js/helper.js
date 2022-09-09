// Định dạng số
function formatNumber(number) {
    return new Intl.NumberFormat("vi-VN").format(number);
}

// Định dạng thời gian dd/mm/yyy
function formatDate(myDate) {
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    };
    let date = new Date(myDate);
    return date.toLocaleDateString("vi-VN", options);
}

// Tạo thông báo toast hoặc cảnh báo
function buildErrorNotify(response) {
    let userMsg = response?.response?.data?.userMsg ?? "";
    let errorsLists = response?.response?.data?.errors ?? "";
    console.log(response);
    if (errorsLists) {
        for (let key in errorsLists) {
            toast.show(errorsLists[key][0], "danger");
        }
    } else if (userMsg) {
        toast.show(userMsg, "danger");
    } else {
        window.myNotify("danger", "Lỗi", response);
    }
}

// Mở modal
function openEmployeeModal(title = "", textCancel = "Đóng", textSubmit = "") {
    let overlay = document.querySelector(".screen_close");
    let modal = document.querySelector("#employee-modal");
    //restart form input
    let form = modal.querySelector("form");
    if (form) {
        form.reset();
    }
    // Thiết lập các title, btn cho modal
    document.querySelector("#modal-title").textContent = title;
    document.querySelector("#modal-submit-btn").textContent = textSubmit;
    document.querySelector("#modal-cancel-btn").textContent = textCancel;
    overlay.classList.remove("hide");
    modal.classList.remove("hide");
}
