
const onClickViewSchemaButton = () => {
    fetch("/view")
    .then(res => res.json)
    .then(data => console.log(data))
    .catch(err => console.log(err))
}

const onClickHistoryButton = () => {
    // handle HISTORY here
}

const onClickLogoutButton = () => {
    // handle LOGOUT here
}

const viewSchemaButton = document.getElementById("viewSchemaButton");
viewSchemaButton.addEventListener("click",onClickViewSchemaButton,false);

const historyButton = document.getElementById("historyButton");
historyButton.addEventListener("click",onClickHistoryButton,false);

const logoutButton = document.getElementById("logoutButton");
logoutButton.addEventListener("click",onClickLogoutButton,false);

