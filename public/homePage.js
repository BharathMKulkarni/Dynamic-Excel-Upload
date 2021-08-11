let columns;
let dataFromExcel = [];
let prevInputFileName;
let inputFileName;
let dbCols = [];
let mappedElements = {};
let sheetNo = 1;
let noOfSheets = 0;
let sheetsRemaining = true;

const sheetSelector = document.getElementById("sheetNo");
let dropDownItems = document.querySelectorAll(".dropDownMenuItems");

const cols = document.querySelectorAll(".columns");
cols.forEach(col => {
    dbCols.push(col.innerText.trim());
})

// ----------------------------------------------HANDLING FILE INPUT EVENTS-----------------------------------------------------------------------------------
const input = document.getElementById('input');

input.addEventListener('click',() => {

    // WHEN NO FILE IS SELECTED
    if(inputFileName === undefined){
        nameOfFileChosen.innerText = 'no file chosen';
        document.getElementById("choseFileInstruction").innerHTML = `choose a file or drag and drop a file here`;
        document.getElementById("chooseFileText").innerText = "Choose File";
        document.getElementById("doneButton").style = "cursor: auto";
        $("#doneButton").attr("disabled",true);
    }
})

input.addEventListener('change', ()=> {

    inputFileName = input.files[0];
    if (!inputFileName.name.endsWith(".xlsx") && !inputFileName.name.endsWith(".csv")) {
        alert("please select .xlsx or .csv files");
        inputFileName = undefined;
    } else {
        
    }
    if(prevInputFileName == undefined){
        prevInputFileName = inputFileName;
    } else {
        if(inputFileName == undefined){
            inputFileName = prevInputFileName;
        } else {
            prevInputFileName = inputFileName;
        } 
    }

    const fileInputDiv = document.getElementById('input').closest(".filePickerDiv");
    const nameOfFileChosen = document.getElementById("nameOfFileChosen");
    nameOfFileChosen.innerText = inputFileName.name;
    document.getElementById("choseFileInstruction").innerHTML = `<u>${inputFileName.name}</u> is selected`;
    document.getElementById("chooseFileText").innerText = "Chose Again";
    document.getElementById("doneButton").style = "cursor: pointer";
    $("#doneButton").attr("disabled",false);
    fileInputDiv.classList.add("filePickerDiv-over");
    
    document.getElementById("fileNameForMappingView")
    .innerHTML = `<i>you are now mapping <span id="fileNameForMappingView-withFileName">${inputFileName.name}</span></i>`;

})


// --------------------------------------------------HANDLING SHEET NO SELECTION---------------------------------------------------------------------
const getSelectedSheetNo = async () => {
    // Start the loading spinner animation
    var spinner = document.querySelector(".loader");
    spinner.classList.remove("hidden");

    // CLEARING THE MAPPED ELEMENTS OBJECT AND DISABLING THE PREVIEW BUTTON:
    mappedElements = {};
    document.getElementById("previewButton").disabled = "true";

    // GETTING THE SHEET NO. SELECTED FROM THE DROPDOWN
    sheetNo = parseInt(sheetSelector.options[sheetSelector.selectedIndex].value);

    // READING THE DATA FROM THE NEW SHEET
    await readXlsxFile(inputFileName, {sheet: sheetNo} )
        .then( rows => {
            dataFromExcel = [];
            rows.forEach( row => dataFromExcel.push(row) );
        })

    if(dataFromExcel == []){
        document.getElementById("mapColumnView").style.display = "none";
        document.getElementById("outer").innerHTML = "<h1 style='color: #ffffff' >No data to show</h1>"
    }
    
    // CLEARING THE LINKICON COLORS WHEN A NEW SHEET IS SELECTED
    for (let i = 0; i < dbCols.length; i++) {
        document.getElementById(`linkIconFor${dbCols[i]}`).style.color = "#656464";
        document.getElementById(`linkIconFor${dbCols[i]}`).style.opacity = "0.4";
    }

    // CLEARING THE DROPDOWNS WHEN A NEW SHEET IS SELECTED AND REPOPULATING THEM WITH THE COLUMN NAMES OF THE NEW SHEET
    columns = dataFromExcel[0];
    dropDownItems.forEach(individualdropDown => {
        individualdropDown.innerHTML ="";
        individualdropDown.innerHTML = "<option selected>None</option>";
        columns.forEach(col => {
            individualdropDown.innerHTML += `<option>${col}</option>`;
        })
    })
    // HIDING THE PREVIEW SECTION
    document.getElementById("previewSection").style.display = "none";

    //remove the loading spinner
    spinner.classList.add("hidden");
}


// --------------------------------------------------HANDLING DRAG AND DROP EVENTS-------------------------------------------------------------------
const dropZoneElement = document.getElementById('input').closest(".filePickerDiv");

["dragover","dragleave","dragend","drop"].forEach(dragType => {
    dropZoneElement.addEventListener(dragType, e => {
        if(dragType==="dragover"){
            e.preventDefault();
            dropZoneElement.classList.add("filePickerDiv-over");
            if(inputFileName === undefined)
                document.getElementById("choseFileInstruction").innerText = "drop here!";
        }
        if(dragType=="dragleave" || dragType==="dragend") {
            if(inputFileName === undefined){
                document.getElementById("choseFileInstruction").innerText = "choose a file or drag and drop a file here";
                dropZoneElement.classList.remove("filePickerDiv-over");
                const nameOfFileChosen = document.getElementById("nameOfFileChosen");
                nameOfFileChosen.innerText = "no file chosen";
            }
            if(inputFileName !== undefined) 
                document.getElementById("choseFileInstruction").innerHTML = `<u>${inputFileName.name}</u> is selected`;
        }
        if(dragType=="drop"){
            e.preventDefault();
            inputFileName = e.dataTransfer.files[0];
            if(inputFileName.name.endsWith(".xlsx") || inputFileName.name.endsWith(".csv")){
                const nameOfFileChosen = document.getElementById("nameOfFileChosen");
                nameOfFileChosen.innerText = inputFileName.name;
                document.getElementById("choseFileInstruction").innerHTML = `<u>${inputFileName.name}</u> is selected`;
                document.getElementById("chooseFileText").innerText = "Chose Again";
                $("#doneButton").attr("disabled",false);
                document.getElementById("fileNameForMappingView").innerHTML = `<i>you are now mapping <span id="fileNameForMappingView-withFileName">${inputFileName.name}</span></i>`;
            } else {
                alert("Only .xlsx and .csv files are accepted");
                const nameOfFileChosen = document.getElementById("nameOfFileChosen");
                nameOfFileChosen.innerText = "no file chosen";
                document.getElementById("choseFileInstruction").innerHTML = `choose a file or drag and drop a file here`;
                document.getElementById("chooseFileText").innerText = "Chose File";
                dropZoneElement.classList.remove("filePickerDiv-over");
            }  
        }
    })
})



// ------------------------------------------HANDLING UPLOAD BUTTON CLICK--------------------------------------------------
const handleUpload = (event) => {
    // add loading spinner to button
    event.target.classList.add('loading');
    document.getElementById("upBtnNormal").style.display = "none";
    document.getElementById("upBtnLoad").style.display = "inline";
    document.getElementById("preUpNormal").style.display = "none";
    document.getElementById("preUpLoad").style.display = "inline";

    let dataToPost = new FormData();
    dataToPost.append("file",inputFileName);
    Object.entries(mappedElements).forEach(pair => {
        let [key,value] = pair;
        dataToPost.append(key,value);
    })
    dataToPost.append("sheetNo",sheetNo);
    
    const params = {    
        method : 'POST',
        body : dataToPost
    }

    fetch('/userdata/upload/',params)
    .then(res => res.json())
    .then(data => {
        $('#uploadStatusModal').modal('show')
        let modalBody = document.getElementById("uploadStatusModalBody");
        if(!data.line)
            modalBody.innerHTML = `<p class="alert alert-success" role="alert">${data.message}</p>`
        else 
            modalBody.innerHTML = `<p class="alert alert-danger" role="alert">At line ${data.line}: <br> ${data.message} </p>`;

        document.getElementById("upBtnNormal").style.display = "inline";
        document.getElementById("upBtnLoad").style.display = "none";
        document.getElementById("preUpNormal").style.display = "inline";
        document.getElementById("preUpLoad").style.display = "none";
        event.target.classList.remove('loading');
    })
    .catch(err => {
        $('#uploadStatusModal').modal('show')
        let modalBody = document.getElementById("uploadStatusModalBody");
        modalBody.innerHTML = `<p class="alert alert-danger" role="alert">A Network error has occured</p>`;

        document.getElementById("upBtnNormal").style.display = "inline";
        document.getElementById("upBtnLoad").style.display = "none";
        document.getElementById("preUpNormal").style.display = "inline";
        document.getElementById("preUpLoad").style.display = "none";
        event.target.classList.remove('loading');
    })
}



// --------------------------------------------------------HANDLING CSV FILES-----------------------------------------------------------------------
const handleCsvFiles = () => {
    return new Promise((resolve,reject)=>{
        // console.log("inside HandleCSV")
        Papa.parse(inputFileName, {
            worker:true,
            delimiter:',',
            skipEmptyLines:true,
            download:false,
            header:false,
            complete: results => resolve(results.data)
        })
    })
}


// -----------------------------------------------------------HANDLING CLICK OF DONE BUTTON---------------------------------------------------------
const handleDoneButton = async () => {
    // Start the loading spinner animation
    var spinner = document.querySelector(".loader");
    spinner.classList.remove("hidden");

    if(inputFileName == undefined){
        alert("Please choose a valid file type");
        window.location.reload();
    }



    document.getElementById("chooseFileView").style.display = "none";
    document.getElementById("mapColumnView").style.display = "block";
    // console.log("PRESSED DONE BUTTON!");

    if(inputFileName.name.endsWith(".xlsx")){
        await readXlsxFile(inputFileName, { getSheets: true }).then((sheets) => {
            sheetSelector.onchange = getSelectedSheetNo;
            noOfSheets = sheets.length;
            for (let index = 1; index < noOfSheets; index++) {
                sheetSelector.innerHTML += `<option value="${index+1}">sheet ${index+1}</option>`;  
            }
        })
        await readXlsxFile(inputFileName, {sheet: sheetNo} )
        .then( rows => { 
            rows.forEach( row => dataFromExcel.push(row) );
        })
    } else if(inputFileName.name.endsWith(".csv")==true){
        await handleCsvFiles().then(results =>{
            results.forEach(row => dataFromExcel.push(row))
        })
    } else return;
    
    if(dataFromExcel.length == 0){
        document.getElementById("mapColumnView").style.display = "none";
        document.getElementById("messageWhenNullFileIsChosen").style.display = "flex";
    } else {

    const uploadButton = document.getElementById('uploadButton');
    uploadButton.style.display = "inline";
    uploadButton.addEventListener("click",handleUpload,false);

    columns = dataFromExcel[0];

    document.querySelectorAll(".dropDownMenus").forEach(menuButton => {
        menuButton.setAttribute("style","display:inline;");
    })
    
    dropDownItems.forEach(individualdropDown => {
        columns.forEach(col => {
            individualdropDown.innerHTML += `<option>${col}</option>`;
        })
    })
    
    for(let i=0; i<dbCols.length; i++){
        let selectedElement = document.getElementById(`selectedFor${dbCols[i]}`);
        if(selectedElement.addEventListener){
            selectedElement.addEventListener('change',()=>{
                mappedElements[dbCols[i]] = columns[parseInt(selectedElement.selectedIndex)-1];

                if(columns[parseInt(selectedElement.selectedIndex)-1]!=undefined){
                    document.getElementById(`linkIconFor${dbCols[i]}`).style.color = "#00EAD3";
                    document.getElementById(`linkIconFor${dbCols[i]}`).style.opacity = "1";
                }
                else{
                    document.getElementById(`linkIconFor${dbCols[i]}`).style.color = "#656464";
                    document.getElementById(`linkIconFor${dbCols[i]}`).style.opacity = "0.4";
                }
            },false);
        } else {
            selectedElement.attachEvent('onChange',()=>{
                mappedElements[dbCols[i]] = columns[parseInt(selectedElement.selectedIndex)-1];
                if(columns[parseInt(selectedElement.selectedIndex)-1]){
                    document.getElementById(`linkIconFor${dbCols[i]}`).style.color = "#00EAD3";
                    document.getElementById(`linkIconFor${dbCols[i]}`).style.opacity = "1";
                }
                else{
                    document.getElementById(`linkIconFor${dbCols[i]}`).style.color = "#656464";
                    document.getElementById(`linkIconFor${dbCols[i]}`).style.opacity = "0.4";
                }
            },false);
        }
    }

    

    }

    //remove the loading spinner
    spinner.classList.add("hidden");
}

const doneButton = document.getElementById("doneButton");
doneButton.onclick = handleDoneButton; 



// ----------------------------------------------HANDLING CLICK OF PREVIEW BUTTON------------------------------------------------------------------------
const showPreview = () => {

    // HIDING THE PREVIEW SECTION
    document.getElementById("previewSection").style.display = "flex";

    window.location.href = "#previewSection";
    document.getElementById("previewSection").style.visibility = "visible";
    document.getElementById("previewSection").style.height = "90vh";

    if(dataFromExcel.length <= 1){
        document.querySelector("#previewTable").innerHTML += "<h5 class='messageWhenEmpty'><i>No data to show. Looks like your file is empty !</i></h5>"
    }
    document.getElementById("previewUploadBtn").addEventListener("click", handleUpload, false);
    document.getElementById("tableBody").innerHTML = "";

    if(dataFromExcel == null)
        return;
    columns = dataFromExcel[0];
    var colPositions = {}; 
    // Mapping excel column names to index number
    for(let colIndex = 0; colIndex < columns.length; colIndex++) {
        colPositions[columns[colIndex]] = colIndex;
    }
    // Creating table rows dynamically and adding table data in the chosen mapping order
    for(let rowIndex = 0; rowIndex < Math.min(6, dataFromExcel.length); rowIndex++) {
        let row = dataFromExcel[rowIndex];
        let tableRow = document.createElement("tr");
        tableRow.setAttribute('id',`tableRow${rowIndex}`);
        document.getElementById("tableBody").appendChild(tableRow);

        // Ignoring empty rows
        let isEmpty = true;
        for(let i = 0; i < row.length; i++) {
            if(row[i]) {
                isEmpty = false;
                break;
            }
        }
        if(isEmpty)
            continue;

        dbCols.forEach( colName => {

            if(mappedElements.hasOwnProperty(colName)) {
                let rowElement = row[colPositions[mappedElements[colName]]] || "";
                let tableCell = document.createElement( (rowIndex === 0? "th" : "td") );
                if(rowIndex === 0) {
                    tableCell.innerHTML = `<span class="col-head">${colName}</span>${rowElement}`;
                }
                else
                    tableCell.innerHTML = rowElement;
                tableRow.appendChild(tableCell);
            }
        });
    }
}

const previewBtn = document.getElementById("previewButton");
if(mappedElements !== {}){
    previewBtn.onclick = showPreview;
}



// ---------------------------------------------------HANDLING AUTO MAP--------------------------------------------------------
const mapColumnsByOrder = () => {
    $('#previewButton').removeAttr('disabled');
    for(let i = 0; i < dbCols.length; i++) {
        let dropDown = document.getElementById(`selectedFor${dbCols[i]}`);
        dropDown.selectedIndex = i+1;
        const event = new Event('change');
        dropDown.dispatchEvent(event);
    }
}

const autoMapBtn = document.getElementById("autoMapBtn");
autoMapBtn.onclick = mapColumnsByOrder;


// -----------------------------------------------------HANDLING CANCEL BUTTON--------------------------------------------------
const cancelFileBtn = document.getElementById("cancelBtn");
cancelFileBtn.onclick = () => {
    window.location.reload();
}