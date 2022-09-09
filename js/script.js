axios.interceptors.request.use(function (config) {
    config.headers = {
        "Content-Type": "application/json",
    };
    return config;
});

function handleOnLoad() {
    // Khởi tạo modal và notify
    window.myModal = new modal();

    window.myNotify = myModal.buildNotify.bind(window.myModal);

    // Lấy thông tin từ API && Khởi tạo combobox
    getAllEmployees();

    let positionList = [];
    let departmentList = [];

    getAllPosition((position) => {
        let selectPosition = document.querySelector("#PositionID");
        if (selectPosition) {
            let optionElements = `<option value="">Chọn vị trí</option>`;
            for (let item of position) {
                optionElements += `<option value="${item.positionID}">${item.positionName}</option>`;
                positionList.push({
                    value: item.positionID,
                    title: item.positionName,
                });
            }

            selectPosition.innerHTML = optionElements;
            new combobox(
                "#position-combobox",
                positionList,
                "Chọn, nhập thông tin"
            );
        }
    });

    getAllDepartment((department) => {
        let selectDepartment = document.querySelector("#DepartmentID");
        if (selectDepartment) {
            let optionElements = `<option value="">Chọn phòng ban</option>`;
            for (let item of department) {
                optionElements += `<option value="${item.departmentID}">${item.departmentName}</option>`;
                departmentList.push({
                    value: item.departmentID,
                    title: item.departmentName,
                });
            }

            selectDepartment.innerHTML = optionElements;

            new combobox(
                "#department-combobox",
                departmentList,
                "Chọn, nhập thông tin"
            );
        }
    });

    // Khởi tạo combobox

    // Lắng nghe sự kiện filter
    let positionFilterElement = document.querySelector(
        "#position-combobox-selected"
    );

    if (positionFilterElement) {
        positionFilterElement.addEventListener("change", (e) => {
            window.currentPage = 1;
            handleFilter();
        });
    }

    let departmentFilterElement = document.querySelector(
        "#department-combobox-selected"
    );

    if (departmentFilterElement) {
        departmentFilterElement.addEventListener("change", (e) => {
            window.currentPage = 1;
            handleFilter();
        });
    }

    let keywordInputElement = document.querySelector("#keyword-filter");
    if (keywordInputElement) {
        keywordInputElement.addEventListener("input", (e) => {
            window.currentPage = 1;
            handleFilter();
        });
    }
    // event thêm nhân viên
    let addEmployeeElement = document.querySelector(".js-click-employee");
    addEmployeeElement.addEventListener("click", handleAddEmployee);

    // Sự kiện khi submit form
    let employeeForm = document.querySelector("#employee-form");
    employeeForm.addEventListener("submit", function (e) {
        e.preventDefault();
        let action = e.target.querySelector(`input[name="action"]`)?.value;
        let formData = new FormData(this);
        if (action === "create") {
            createEmployee(formData);
        }

        if (action === "update") {
            updateEmployee(formData);
        }
    });

    // Sự kiện khi click nút xoá

    let removeBtn = document.querySelector(".js-delete-btn");
    removeBtn.addEventListener("click", handleRemoveEmployee);

    // Sự kiện tải lại bảng nhân viên

    let reloadTableBtn = document.querySelector(".js-reload-table");
    reloadTableBtn.addEventListener("click", handleFilter);

    // Sự kiện nhân bản nhân viên

    let cloneBtn = document.querySelector(".js-clone-btn");
    cloneBtn.addEventListener("click", handleCloneEmployee);

    // Format number khi nhập lương
    let salaryInput = document.querySelector("#Salary");
    if (salaryInput) {
        salaryInput.addEventListener("input", function (event) {
            let currentValue = this.value.replace(/[^0-9]/g, "");
            event.target.value = currentValue;
            if (currentValue === "") {
                event.target.value = "";
            } else {
                event.target.value = formatNumber(parseInt(currentValue));
            }
        });
    }

    // Sự kiện thay đổi số record/trang
    let perPageSelect = document.querySelector("#per-page");
    if (perPageSelect) {
        perPageSelect.value = window.perPage;

        perPageSelect.addEventListener("change", (e) => {
            window.perPage = parseInt(e.target.value);
            handleFilter();
        });
    }
}
