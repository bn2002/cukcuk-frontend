function getAllPosition(callback = () => {}) {
    let position = localStorage.getItem("position");
    if (position) {
        return callback(JSON.parse(position));
    }

    axios
        .get(`${rootApi}/Positions`)
        .then((response) => {
            let position = response.data;
            localStorage.setItem("position", JSON.stringify(position));
            callback(position);
        })
        .catch(buildErrorNotify);
}
