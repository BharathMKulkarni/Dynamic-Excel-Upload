
//------------------------------- HANDLING DELETE REQUEST FOR EACH ROW IN TABLE --------------------------

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


//------------------------------------ HANDLING SEARCH BAR QUERIES DYNAMICALLY -----------------------

const searchBar = document.getElementById("searchText");

const filterTableOnSearchText = () => {
    const queryText = searchBar.value;

    fetch('/view/table/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({search: queryText})
    })
    .then( res => res.json() )
    .then( resData => {
        document.getElementById("tableBody").innerHTML = "";
        renderTable(resData.data, resData.columns);
    })
    .catch( err => console.error(err));
}

searchBar.addEventListener('input', filterTableOnSearchText);

//--------------------------------------- RENDERING THE TABLE ------------------------------------

const deleteColumnHtml = '<td class="text-end fixed-column" style="background-color: black"><a id="del{{@index}}" type="button" class="delete-btn btn btn-info btn-small"><i class="bi bi-person-x"></i> Delete</a></td>'

const renderTable = (tableData, tableHead) => {
    
    if(tableData === null)
        return;
    
    tableData.forEach( (rowData, rowIndex) => {
        let tableRow = document.createElement("tr");
        tableRow.setAttribute('id',`tableRow${rowIndex}`);
        document.getElementById("tableBody").appendChild(tableRow);

        // Ignoring empty rows
        let isEmpty = true;
        for(let i in rowData) {
            if(rowData[i]) {
                isEmpty = false;
                break;
            }
        }
        if(isEmpty)
            return;

        tableHead.forEach(colHead => {
            if(rowData.hasOwnProperty(colHead)) {
                let tableCell = document.createElement("td");
                tableCell.innerText = rowData[colHead];
                tableRow.appendChild(tableCell);
            }
        });

        tableRow.innerHTML += deleteColumnHtml;
    })
}