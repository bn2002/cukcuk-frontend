function getAllDepartment(callback = () => {}) {
    let department = localStorage.getItem("department");
    if (department) {
        return callback(JSON.parse(department));
    }

    axios
        .get(`${rootApi}/Departments`)
        .then((response) => {
            let department = response.data;
            localStorage.setItem("department", JSON.stringify(department));
            callback(department);
        })
        .catch(buildErrorNotify);
}
