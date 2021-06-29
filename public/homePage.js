console.log('in public (homePage.js) now!!');
let columns = [];
let dataFromExcel = [];
let inputFileName;
let dbCols = [];
let mappedElements = {};

const cols = document.querySelectorAll(".columns");
cols.forEach(col => {
    dbCols.push(col.innerHTML.trim());
})
console.log(dbCols)

const input = document.getElementById('input');
input.addEventListener('change',()=>{
    inputFileName = input.files[0];
})


const handleUpload = () => {
    let dataToPost = new FormData();
    console.log("PRESSED UPLOAD BUTTON!");
    dataToPost.append("file",inputFileName);
    Object.entries(mappedElements).forEach(pair => {
        let [key,value] = pair;
        dataToPost.append(key,value);
    })

    const params = {
        method : 'POST',
        header : {
            'Content-Type' : 'multipart/form-data'
        },
        body : dataToPost
    }

    fetch('/userdata/upload/',params)
    .then(res => res.json())
    .then(data => {
        console.log(`THE DATA THAT WAS SENT:\n ${data}`);

        $('#exampleModalCenter').modal()
    })
    .catch(err => console.log(`ERROR>>> ${err}`))
    // console.log(dataToPost);
}

const doneButton = document.getElementById("doneButton");
doneButton.onclick = () => {
    console.log("PRESSED DONE BUTTON!")
    let count = 0;
    readXlsxFile(inputFileName)
    .then((rows)=>{
        // console.log(rows);
        rows.forEach(row => {
            dataFromExcel.push(row);
        });

        const uploadButton = document.getElementById('uploadButton');
        uploadButton.style.display = "inline";
        uploadButton.addEventListener("click",handleUpload,false);
        
        dataFromExcel.forEach(eachRow =>{
            
            if(count===0){
                // do something
                console.log(eachRow)
                if(columns.length===0){
                    columns.push(eachRow);
                }
                
                // console.log(typeof(eachRow));
                eachRow.forEach(eachElement => {
                    // console.log(eachElement);
                    let eachColumnName = eachElement;
                    let tableHeadElement = document.createElement("th");
                    tableHeadElement.setAttribute('scope','col');
                    tableHeadElement.innerHTML = eachColumnName;
                    document.getElementById('tableHead').appendChild(tableHeadElement);
                })
                count=count+1;
            }
            else if(eachRow!==null && count<6 ){

                let tableRow = document.createElement("tr");
                tableRow.setAttribute('id',`tableRow${count}`);
                document.getElementById("tableBody").appendChild(tableRow);

                // let rowHeader = document.createElement("th");
                // rowHeader.setAttribute('scope','row');
                // document.getElementById(`tableRow${count}`).appendChild(rowHeader);

                eachRow.forEach(rowElement => {

                    let listElement = document.createElement("td");
                    listElement.innerHTML = rowElement;
                    // listElement.setAttribute('colspan','2')
                    document.getElementById(`tableRow${count}`).appendChild(listElement);
                })
                
                count=count+1;
            }
            
        })
        document.querySelectorAll(".dropDownMenus").forEach(menuButton => {
            menuButton.setAttribute("style","display:inline;");
        })
        
        let dropDownItems = document.querySelectorAll(".dropDownMenuItems");
        dropDownItems.forEach(individualdropDown => {
            // console.log(columns)
            columns[0].forEach(col => {
                individualdropDown.innerHTML += `<option>${col}</option>`;
            })
        })
        
        for(let i=0; i<dbCols.length; i++){
            let selectedElement = document.getElementById(`selectedFor${dbCols[i]}`);
            if(selectedElement.addEventListener){
                selectedElement.addEventListener('change',()=>{
                    mappedElements[dbCols[i]] = columns[0][parseInt(selectedElement.selectedIndex)-1];
                    console.log(`${dbCols[i]} mapped to ${columns[0][parseInt(selectedElement.selectedIndex)-1]}`);
                    console.log(mappedElements);
                },false);
            } else {
                selectedElement.attachEvent('onChange',()=>{
                    mappedElements[dbCols[i]] = columns[0][parseInt(selectedElement.selectedIndex)-1];
                    console.log(`${dbCols[i]} mapped to ${columns[0][parseInt(selectedElement.selectedIndex)-1]}`);
                    console.log(mappedElements);
                },false);
            }
        }
    })

}

