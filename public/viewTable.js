let keyColumn = null;
fetch('/userdata/key', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
})
.then( res => res.json())
.then( json => {
    keyColumn = json.data;
})
.catch(err => console.log("Error in /userdata/key api call"));


//------------------------------- HANDLING DELETE REQUEST FOR EACH ROW IN TABLE --------------------------

const allDeleteButtons = document.querySelectorAll(".delete-btn");
document.getElementById("deleteModalNoBtn").addEventListener('click', () => {
    $('#deleteConfirmationModal').modal('hide');
}, false);

const handleDeleteClick = (event) => {
    const btnId = event.target.id;
    const rowIndex = btnId.substring(3);
    const phone = document.getElementById(keyColumn+rowIndex).innerText.trim();

    // Show confirmation modal
    $('#deleteConfirmationModal').modal('show');
    
    // HANDLING THE 'YES' BUTTON IN CONFIRMATION MODAL
    document.getElementById("deleteModalYesBtn").onclick = () => {
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
            console.error("Error /userdata/delete")
        });
    };
}

allDeleteButtons.forEach(delBtn => {
    delBtn.addEventListener('click', handleDeleteClick, false);
})


//------------------------------------ HANDLING SEARCH BAR QUERIES DYNAMICALLY -----------------------

const searchBar = document.getElementById("searchText");
let debounceTimer = null;

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
    .catch( err => console.error("error in /view/table/search"));
}

const debounce = function(fn, delay) {
    let timer;
    return function() {
        let context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    }
}

// MAKE EXCPLICIT CALL INITIALLY TO RENDER ALL DATA AFTER LOADING PAGE
filterTableOnSearchText();
searchBar.addEventListener('input', debounce(filterTableOnSearchText, 500), false);

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
                tableCell.id = `${colHead}${rowIndex}`;
                tableCell.innerText = rowData[colHead];
                tableRow.appendChild(tableCell);
            }
        });
        const deleteColumnHtml = `<td class="text-end fixed-column" style="background-color: black"><a id="del${rowIndex}" type="button" class="delete-btn btn btn-info btn-small"><i class="bi bi-person-x"></i> Delete</a></td>`
        tableRow.innerHTML += deleteColumnHtml;
    });

    // Adding event listeners for delete buttons of all rows rendered
    const allDeleteButtons = document.querySelectorAll(".delete-btn");
    allDeleteButtons.forEach(delBtn => {
        delBtn.addEventListener('click', handleDeleteClick, false);
    })
}