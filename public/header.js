
const onClickViewSchemaButton = () => {
    fetch("/view")
    .then(res => res.json)
    .then(data => console.log(data))
    .catch(err => console.log(err))
}

const onClickHistoryButton = () => {
    // handle HISTORY here
}

const viewSchemaButton = document.getElementById("viewSchemaButton");
viewSchemaButton.addEventListener("click",onClickViewSchemaButton,false);

// const historyButton = document.getElementById("historyButton");
// historyButton.addEventListener("click",onClickHistoryButton,false);

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
