let columns;
let dataFromExcel = [];
let inputFileName;
let dbCols = [];
let mappedElements = {};

const cols = document.querySelectorAll(".columns");
cols.forEach(col => {
    dbCols.push(col.innerHTML.trim());
})
console.log(dbCols);    

const input = document.getElementById('input');
input.addEventListener('change',()=>{
    inputFileName = input.files[0];
})


// HANDLING UPLOAD BUTTON CLICK:
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
        $('#exampleModalCenter').modal('show')
        let modalBody = document.getElementById("upload-status");
        if(!data.line)
            modalBody.innerHTML = `<p class="alert alert-success" role="alert">${data.message}</p>`
        else 
            modalBody.innerHTML = `<p class="alert alert-danger" role="alert">At line ${data.line}: <br> ${data.message}`;
    })
    .catch(err => console.log(`ERROR>>> ${err}`))
}

// HANDLING .CSV FILES:
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

// HANDLE DONE BUTTON CLICK:
const handleDoneButton = async () => {

    console.log("PRESSED DONE BUTTON!");
    let count = 0;
    
    if(inputFileName.name.endsWith(".xlsx")==true){
        await readXlsxFile(inputFileName)
        .then( rows => { 
            rows.forEach( row => dataFromExcel.push(row) );
        })
        console.log(dataFromExcel);
    }

    if(inputFileName.name.endsWith(".csv")==true){
        // do something
        await handleCsvFiles().then(results =>{
            results.forEach(row => dataFromExcel.push(row))
        })
        console.log(dataFromExcel);
    }
   
    
    const uploadButton = document.getElementById('uploadButton');
    uploadButton.style.display = "inline";
    uploadButton.addEventListener("click",handleUpload,false);
    
     dataFromExcel.forEach(eachRow => {
        // console.log("inside dataFromExcel.forEach()")
        if(count===0){
            columns = eachRow;
            // console.log(columns);
            // console.log(eachRow);
            // eachRow.forEach(eachElement => {
            //     let eachColumnName = eachElement;
            //     let tableHeadElement = document.createElement("th");
            //     tableHeadElement.setAttribute('scope','col');
            //     tableHeadElement.innerHTML = eachColumnName;
            //     document.getElementById('tableHead').appendChild(tableHeadElement);
            // })
            count=count+1;
        }
        else if(eachRow!==null && count<6 ){

            // let tableRow = document.createElement("tr");
            // tableRow.setAttribute('id',`tableRow${count}`);
            // document.getElementById("tableBody").appendChild(tableRow);

            // // let rowHeader = document.createElement("th");
            // // rowHeader.setAttribute('scope','row');
            // // document.getElementById(`tableRow${count}`).appendChild(rowHeader);

            // eachRow.forEach(rowElement => {

            //     let listElement = document.createElement("td");
            //     listElement.innerHTML = rowElement;
            //     // listElement.setAttribute('colspan','2')
            //     document.getElementById(`tableRow${count}`).appendChild(listElement);
            // })
            
            count=count+1;
        }
        
    })

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
                console.log(mappedElements);
            },false);
        } else {
            selectedElement.attachEvent('onChange',()=>{
                mappedElements[dbCols[i]] = columns[parseInt(selectedElement.selectedIndex)-1];
                console.log(`${dbCols[i]} mapped to ${columns[parseInt(selectedElement.selectedIndex)-1]}`);
                console.log(mappedElements);
            },false);
        }
    }


}

const doneButton = document.getElementById("doneButton");
doneButton.onclick = handleDoneButton; 