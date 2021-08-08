
const onClickViewSchemaButton = () => {
    fetch("/view")
    .then(res => res.json)
    .then(data => console.log(data))
    .catch(err => console.log(err))
}

const onClickLogoutButton = () => {
    // handle logout here
    $('#logoutModal').modal('show');
}

const logoutButton = document.querySelector(".logoutButton");
logoutButton.addEventListener("click", onClickLogoutButton, false);

const logoutCancel = document.getElementById("logoutModalCancelBtn");
logoutCancel.addEventListener("click", () => $('#logoutModal').modal('hide'), false);

const viewSchemaButton = document.getElementById("viewSchemaButton");
viewSchemaButton.addEventListener("click",onClickViewSchemaButton,false);


switch (window.location.pathname) {
    case "/home":
        document.getElementById("homeButton").style.color = "#00ead3";
        document.getElementById("homeButton").style.textDecoration = "underline";
        break;

    case "/view":
        document.getElementById("viewSchemaButton").style.color = "#00ead3";
        document.getElementById("viewSchemaButton").style.textDecoration = "underline";
        break;

    case "/view/table":
        document.getElementById("viewDataButton").style.color = "#00ead3";
        document.getElementById("viewDataButton").style.textDecoration = "underline";
        break;

    default:
        break;
}
