let columns;
let dataFromExcel = [];
let prevInputFileName;
let inputFileName;
let dbCols = [];
let mappedElements = {};

const cols = document.querySelectorAll(".columns");
cols.forEach(col => {
    dbCols.push(col.innerHTML.trim());
})
console.log(dbCols); 

// ----------------------------------------------HANDLING FILE INPUT EVENTS-----------------------------------------------------------------------------------
const input = document.getElementById('input');

input.addEventListener('click',() => {

    if(inputFileName === undefined){
        nameOfFileChosen.innerText = 'no file chosen';
        document.getElementById("choseFileInstruction").innerHTML = `choose a file or drag and drop a file here`;
        document.getElementById("chooseFileText").innerText = "Choose File";
        document.getElementById("doneButton").style = "cursor: auto";
        $("#doneButton").attr("disabled",true);
    }
})

input.addEventListener('change', ()=> {

    if(prevInputFileName == undefined){
        inputFileName = input.files[0];
        prevInputFileName = inputFileName;
    } else inputFileName = prevInputFileName;
    const nameOfFileChosen = document.getElementById("nameOfFileChosen");
    nameOfFileChosen.innerText = inputFileName.name;
    document.getElementById("choseFileInstruction").innerHTML = `<u>${inputFileName.name}</u> is selected`;
    document.getElementById("chooseFileText").innerText = "Chose Again";
    document.getElementById("doneButton").style = "cursor: pointer";
    $("#doneButton").attr("disabled",false);
    document.getElementById("fileNameForMappingView").innerHTML = `<i>you are now mapping <span id="fileNameForMappingView-withFileName">${inputFileName.name}</span></i>`;
})



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
            if(inputFileName.name.endsWith(".xlsx") || inputFileName.name.endsWith(".csv") || inputFileName.name.endsWith(".xls")){
                const nameOfFileChosen = document.getElementById("nameOfFileChosen");
                nameOfFileChosen.innerText = inputFileName.name;
                document.getElementById("choseFileInstruction").innerHTML = `<u>${inputFileName.name}</u> is selected`;
                document.getElementById("chooseFileText").innerText = "Chose Again";
                $("#doneButton").attr("disabled",false);
                document.getElementById("fileNameForMappingView").innerHTML = `<i>you are now mapping <span id="fileNameForMappingView-withFileName">${inputFileName.name}</span></i>`;
            } else {
                alert("Only .xlsx, .xls and .csv files are accepted");
                const nameOfFileChosen = document.getElementById("nameOfFileChosen");
                nameOfFileChosen.innerText = "no file chosen";
                document.getElementById("choseFileInstruction").innerHTML = `choose a file or drag and drop a file here`;
                document.getElementById("chooseFileText").innerText = "Chose File";
                dropZoneElement.classList.remove("filePickerDiv-over");
            }  
        }
    })
})


//  ------------------------------------------------------TEXT ANIMATION -----------------------------------------------------

// const headTitle = document.querySelector(".headTitle-title");
// const headTitleText = headTitle.textContent;
// const splitText = headTitleText.split("");
// headTitle.textContent = "";
// for (let i = 0; i < splitText.length; i++) {
//     headTitle.innerHTML += "<span>"+splitText[i]+"</span>";
    
// }

// let char = 0;
// let timer = setInterval(onTick,500);
// function onTick(){
//     const span = headTitle.querySelectorAll("span")[char];
//     span.classList.add('fade');
//     char++;
//     if(char===splitText.length){
//         complete();
//         return;
//     }
// }

// function complete(){
//     clearInterval(timer);
//     timer=null;
// }



// ------------------------------------------------------------HANDLING UPLOAD BUTTON CLICK---------------------------------------------------------
const handleUpload = () => {

    console.log("PRESSED UPLOAD BUTTON!");
    let dataToPost = new FormData();
    dataToPost.append("file",inputFileName);
    Object.entries(mappedElements).forEach(pair => {
        let [key,value] = pair;
        dataToPost.append(key,value);
    })

    const params = {
        method : 'POST',
        body : dataToPost
    }

    fetch('/userdata/upload/',params)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        $('#uploadStatusModal').modal('show')
        let modalBody = document.getElementById("uploadStatusModalBody");
        if(!data.line)
            modalBody.innerHTML = `<p class="alert alert-success" role="alert">${data.message}</p>`
        else 
            modalBody.innerHTML = `<p class="alert alert-danger" role="alert">At line ${data.line}: <br> ${data.message}`;
    })
    .catch(err => console.log(`ERROR>>> ${err}`))
}



// --------------------------------------------------------HANDLING CSV FILES-----------------------------------------------------------------------
const handleCsvFiles = () => {
    return new Promise((resolve,reject)=>{
        console.log("inside HandleCSV")
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

    document.getElementById("chooseFileView").style.display = "none";
    document.getElementById("mapColumnView").style.display = "block";
    console.log("PRESSED DONE BUTTON!");
    
    if(inputFileName.name.endsWith(".xlsx")==true){
        await readXlsxFile(inputFileName)
        .then( rows => { 
            rows.forEach( row => dataFromExcel.push(row) );
        })
        console.log(dataFromExcel);
    }

    if(inputFileName.name.endsWith(".csv")==true){
        await handleCsvFiles().then(results =>{
            results.forEach(row => dataFromExcel.push(row))
        })
        console.log(dataFromExcel);
    }
    
    const uploadButton = document.getElementById('uploadButton');
    uploadButton.style.display = "inline";
    uploadButton.addEventListener("click",handleUpload,false);

    let columns = dataFromExcel[0];

    document.querySelectorAll(".dropDownMenus").forEach(menuButton => {
        menuButton.setAttribute("style","display:inline;");
    })
    
    let dropDownItems = document.querySelectorAll(".dropDownMenuItems");
    dropDownItems.forEach(individualdropDown => {
        // console.log(columns)
        columns.forEach(col => {
            individualdropDown.innerHTML += `<option>${col}</option>`;
        })
    })
    
    for(let i=0; i<dbCols.length; i++){
        let selectedElement = document.getElementById(`selectedFor${dbCols[i]}`);
        if(selectedElement.addEventListener){
            selectedElement.addEventListener('change',()=>{
                mappedElements[dbCols[i]] = columns[parseInt(selectedElement.selectedIndex)-1];
                console.log(`${dbCols[i]} mapped to ${columns[parseInt(selectedElement.selectedIndex)-1]}`);
                if(columns[parseInt(selectedElement.selectedIndex)-1]!=undefined){
                    document.getElementById(`linkIconFor${dbCols[i]}`).style.color = "#00EAD3";
                    document.getElementById(`linkIconFor${dbCols[i]}`).style.opacity = "1";
                }
                else{
                    document.getElementById(`linkIconFor${dbCols[i]}`).style.color = "#656464";
                    document.getElementById(`linkIconFor${dbCols[i]}`).style.opacity = "0.4";
                }
                console.log(mappedElements);
            },false);
        } else {
            selectedElement.attachEvent('onChange',()=>{
                mappedElements[dbCols[i]] = columns[parseInt(selectedElement.selectedIndex)-1];
                console.log(`${dbCols[i]} mapped to ${columns[parseInt(selectedElement.selectedIndex)-1]}`);
                if(columns[parseInt(selectedElement.selectedIndex)-1]){
                    document.getElementById(`linkIconFor${dbCols[i]}`).style.color = "#00EAD3";
                    document.getElementById(`linkIconFor${dbCols[i]}`).style.opacity = "1";
                }
                else{
                    document.getElementById(`linkIconFor${dbCols[i]}`).style.color = "#656464";
                    document.getElementById(`linkIconFor${dbCols[i]}`).style.opacity = "0.4";
                }
                console.log(mappedElements);
            },false);
        }
    }
}

const doneButton = document.getElementById("doneButton");
doneButton.onclick = handleDoneButton; 



// ----------------------------------------------HANDLING CLICK OF PREVIEW BUTTON------------------------------------------------------------------------
const showPreview = () => {
    window.location.href = "#previewSection";
    document.getElementById("previewSection").style.visibility = "visible";
    document.getElementById("previewSection").style.height = "90vh";
    document.getElementById("previewUploadBtn").addEventListener("click", handleUpload, false);
    document.getElementById("tableBody").innerHTML = "";

    if(dataFromExcel == null)
        return;
    var columns = dataFromExcel[0];
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
        console.log("outside foreach: ", row);

        // Ignoring empty rows
        let isEmpty = true;
        for(let i = 0; i < row.length; i++) {
            if(row[i]) 
                isEmpty = false;
        }
        if(isEmpty)
            continue;

        dbCols.forEach( colName => {
            console.log("Inside: ", row);
            if(mappedElements.hasOwnProperty(colName)) {
                let rowElement = row[colPositions[mappedElements[colName]]] || "";
                let tableCell = document.createElement( (rowIndex === 0? "th" : "td") );
                tableCell.innerHTML = rowElement;
                tableRow.appendChild(tableCell);
            }
        })
    }
}

const previewBtn = document.getElementById("previewButton");
previewBtn.onclick = showPreview; 



// ---------------------------------------------------HANDLING AUTO MAP--------------------------------------------------------
const mapColumnsByOrder = () => {

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