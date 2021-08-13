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
.catch(err => window.location.reload());


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
            window.location.reload();
        });
    };
}

allDeleteButtons.forEach(delBtn => {
    delBtn.addEventListener('click', handleDeleteClick, false);
})


//------------------------------------ HANDLING SEARCH BAR QUERIES DYNAMICALLY -----------------------

const searchBar = document.getElementById("searchText");
let debounceTimer = null;

const filterTableOnSearchText = (event = null, pageNumber = 1) => {
    var tableDiv = document.querySelector("#viewSection > table");
    tableDiv.style.display = "none";
    var spinner = document.querySelector(".div-loader");
    spinner.style.display = "flex";

    const queryText = searchBar.value;
    const url = `/view/table/search?page=${pageNumber-1}&size=10`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({search: queryText})
    })
    .then( res => res.json() )
    .then( resData => {
        document.getElementById("tableBody").innerHTML = "";
        let totalPages = resData.totalPages;
        renderTable(resData.data, resData.columns);
        document.getElementById("pageNumber").innerText = pageNumber;

        document.getElementById("prevPage").classList.remove("disable");
        document.getElementById("nextPage").classList.remove("disable");
        if(pageNumber === 1) 
            document.getElementById("prevPage").classList.add("disable");
        if(pageNumber === totalPages) 
            document.getElementById("nextPage").classList.add("disable");

        spinner.style.display = "none";
        tableDiv.style.display = "block";
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

//------------------------------------- PAGINATION -------------------------------------

const prevButton = document.getElementById("prevPage");
const nextButton = document.getElementById("nextPage");

const loadPreviousPage = () => {
    const pageNumber = Number.parseInt(document.getElementById("pageNumber").innerText.trim());
    if(!prevButton.classList.contains("disable"))
        filterTableOnSearchText(null, pageNumber-1);
}
const loadNextPage = () => {
    const pageNumber = Number.parseInt(document.getElementById("pageNumber").innerText.trim());
    if(!nextButton.classList.contains("disable"))
        filterTableOnSearchText(null, pageNumber+1);
}

prevButton.addEventListener('click', loadPreviousPage, false);
nextButton.addEventListener('click', loadNextPage, false);

//--------------------------------------- RENDERING THE TABLE ------------------------------------

const deleteColumnHtml = '<td class="text-end fixed-column" style="background-color: black"><a id="del{{@index}}" type="button" class="delete-btn btn btn-info btn-small"><i class="bi bi-person-x"></i> Delete</a></td>'

const renderTable = (tableData, tableHead) => {
    
    if(tableData.length === 0){
        document.getElementById("tableBody").innerHTML =  "<tr><h5 class='messageWhenEmpty'><i>No data to show. Data you've uploaded previously shows up here!</i></h5></tr>";
        ["prevPage","nextPage","pageNumber"].forEach(ele => $(`#${ele}`).hide());
    }

    if(tableData === null){
        
        return;
    }
    
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