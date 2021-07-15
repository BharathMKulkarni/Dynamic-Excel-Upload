
const allDeleteButtons = document.querySelectorAll(".delete-btn");

console.table(allDeleteButtons);

const handleDeleteClick = (event) => {
    const btnId = event.target.id;
    const rowIndex = btnId.substring(3);
    const phone = document.getElementById("phone"+rowIndex).innerText.trim();

    console.log(phone);

    fetch('/userdata/delete', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ phone })
    })
    .then(res => {
        window.location.reload();
    })
    .catch(err => {
    });
}

allDeleteButtons.forEach(delBtn => {
    delBtn.onclick = handleDeleteClick;
})