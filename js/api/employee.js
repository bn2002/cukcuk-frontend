function getAllEmployees(keyword = "", position_id = "", department_id = "") {
    let params = {
        keyword,
        position_id,
        department_id,
        size: window.perPage,
        page: window.currentPage,
    };
    let paramString = new URLSearchParams(params);
    axios
        .get(`${rootApi}/Employees?${paramString}`)
        .then((response) => response.data)
        .then(renderEmployeeTable)
        .catch(buildErrorNotify);
}

function handleFilter() {
    let position = "";
    let keyword = "";
    let department = "";

    let positionFilter = document.querySelector("#position-combobox-selected");

    if (positionFilter) {
        position = positionFilter.value;
    }

    let departmentFilter = document.querySelector(
        "#department-combobox-selected"
    );

    if (departmentFilter) {
        department = departmentFilter.value;
    }

    let keywordFilter = document.querySelector("#keyword-filter");

    if (keywordFilter) {
        keyword = keywordFilter.value;
    }

    getAllEmployees(keyword, position, department);
}

function createEmployee(formData) {
    let params = createParam(formData);
    axios
        .post(`${rootApi}/Employees`, JSON.stringify(params))
        .then((result) => {
            handleFilter();
            let message = result?.data?.message ?? "Thao tác thành công";
            toast.show(message, "success");
        })
        .catch(buildErrorNotify);
}

function createParam(formData) {
    let params = {};
    for (let [key, value] of formData) {
        if (value.trim() !== "") {
            if (key === "salary") {
                value = value.replace(/\D/g, "");
            }
            params[key] = value;
        }
    }

    return params;
}

function getNewEmployeeCode(callback) {
    fetch(`${rootApi}/Employees/NewEmployeeCode`)
        .then((response) => response.json())
        .then(callback)
        .catch(buildErrorNotify);
}

function getEmployeeById(employeeID, callback) {
    axios
        .get(`${rootApi}/Employees/${employeeID}`)
        .then((result) => {
            callback(result);
        })
        .catch(buildErrorNotify);
}

function updateEmployee(formData) {
    let employeeId = formData.get("employeeID");
    console.log(employeeId);
    if (employeeId === "") {
        buildErrorNotify("ID nhân viên không được để trống");
        return;
    }
    let params = createParam(formData);
    axios
        .put(`${rootApi}/Employees/${employeeId}`, JSON.stringify(params))
        .then((result) => {
            handleFilter();
            let message = result?.data?.message ?? "Thao tác thành công";
            toast.show(message, "success");
        })
        .catch(buildErrorNotify);
}

function removeEmployee(listIDSelect) {
    axios
        .delete(`${rootApi}/Employees`, {
            data: JSON.stringify(listIDSelect),
        })
        .then((result) => {
            let message = result?.data?.message ?? "";
            if (message) {
                toast.show(message, "success");
            }
            getAllEmployees();
        })
        .catch(buildErrorNotify);
}

function renderEmployeeTable(response) {
    let employeesTable = $("#js-employee-table tbody");
    employeesTable.innerHTML = "";
    const { data: employees, totalCount } = response;
    for (let employee of employees) {
        let newRecord = `
                    <tr ondblclick="handleUpdateEmployee('${
                        employee.employeeID
                    }')">
                        <td>
                            <label class="checkbox">
                                <input
                                    type="checkbox"
                                    class="js-row-select"
                                    value="${employee.employeeID}"
                                    data-employeeCode = "${
                                        employee.employeeCode
                                    }"
                                />
                                <span
                                    class="checkbox__checkmark"></span>
                            </label>
                        </td>
                        <td>${employee.employeeCode}</td>
                        <td>${employee.employeeName}</td>
                        <td>${getGenderString(employee.gender)}</td>
                        <td>${
                            employee.dateOfBirth &&
                            formatDate(employee.dateOfBirth)
                        }</td>
                        <td>${employee.phoneNumber}</td>
                        <td>${employee.email}</td>
                        <td>${employee.positionName}</td>
                        <td>${employee.departmentName}</td>
                        <td>${formatNumber(Math.round(employee.salary))}</td>
                        <td>${getStatusWorkString(employee.workStatus)}</td>
                       
                    </tr>
                `;

        employeesTable.insertAdjacentHTML("beforeend", newRecord);
    }
    initTableCheckBox();
    renderPagination(
        window.currentPage,
        totalCount,
        window.perPage,
        "#employee_pagination"
    );
}

function handleUpdateEmployee(employeeID) {
    openEmployeeModal("Cập nhật thông tin", "Huỷ", "Lưu hồ sơ");
    getEmployeeById(employeeID, (response) => {
        fillDataToForm(response.data);
    });

    document.querySelector(`#action`).value = "update";
    document.querySelector(`#EmployeeCode`).focus();
}

function handleRemoveEmployee(event) {
    event.preventDefault();
    let activeRows = document.querySelectorAll(".js-row-select:checked");
    let listIDSelect = [];
    let listEmployeeCode = [];
    for (let row of activeRows) {
        if (row.value !== "") {
            listIDSelect.push(row.value);
            listEmployeeCode.push(row.dataset.employeecode);
        }
    }

    if (listIDSelect.length > 0) {
        myNotify(
            "danger",
            "Thông báo",
            `Bạn có chắc muốn xoá nhân viên <b>${listEmployeeCode.join(
                ", "
            )}</b> không?`,
            () => {
                removeEmployee(listIDSelect);
            },
            "Có",
            "Không"
        );
    } else {
        toast.show("Vui lòng chọn nhân viên cần xoá", "danger");
    }
}

function handleAddEmployee(event) {
    openEmployeeModal("Thêm nhân viên", "Huỷ", "Lập hồ sơ");
    // Lấy mã nhân viên mới nhất
    getNewEmployeeCode((response) => {
        document.querySelector(`#EmployeeCode`).value = response.code;
    });
    document.querySelector(`#action`).value = "create";

    // foscus vào mã nhân viên
    document.querySelector(`#EmployeeCode`).focus();
}

function handleCloneEmployee(event) {
    let activeRows = document.querySelector(".js-row-select:checked");
    if (!activeRows) {
        toast.show("Vui lòng chọn nhân viên cần nhân bản", "info");
        return;
    }

    let employeeId = activeRows.value;
    if (!employeeId) {
        toast.show("Không lấy được ID người cần nhân bản", "danger");
        return;
    }
    openEmployeeModal("Nhân bản nhân viên", "Huỷ", "Lưu hồ sơ");
    getEmployeeById(employeeId, (response) => {
        fillDataToForm(response.data);
    });

    document.querySelector(`#action`).value = "create";
    document.querySelector(`#EmployeeCode`).focus();
}

function fillDataToForm(data) {
    for (let field in data) {
        let inputElement = document.querySelector(`#${field}`);
        if (inputElement) {
            if (data[field] !== null) {
                if (inputElement.getAttribute("type") === "date") {
                    let date = new Date(data[field]);
                    date.setDate(date.getDate() + 1);
                    inputElement.value = date.toISOString().substring(0, 10);
                } else {
                    if (field === "Salary") {
                        data[field] = formatNumber(Math.floor(data[field]));
                    }
                    inputElement.value = data[field];
                }
            } else if (
                data[field] == null &&
                inputElement.tagName === "SELECT"
            ) {
                inputElement.value = "";
            } else if (
                data[field] == null &&
                inputElement.getAttribute("type") === "date"
            ) {
                inputElement.value = "";
            }
        }
    }
}

function initTableCheckBox() {
    let tableCheckBoxs = $$(
        `#js-employee-table .checkbox input[type="checkbox"]`
    );
    for (let checkbox of tableCheckBoxs) {
        checkbox.addEventListener("change", function (e) {
            let trElement = e.target.closest("tr");
            trElement.classList.toggle("row--active");
        });
    }
}

function getGenderString(gender) {
    return gender === 1 ? "Nam" : gender === 0 ? "Nữ" : "Khác";
}

function getStatusWorkString(status) {
    if (status === null) return null;
    return status === 1
        ? "Đang làm việc"
        : status === 2
        ? "Thực tập"
        : "Nghỉ việc";
}
