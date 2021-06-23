console.log('in public now!!');
// import readXlsxFile from 'read-excel-file';  
let columns = [];
let dataFromExcel = [];
const input = document.getElementById('input');
input.addEventListener('change',()=>{
    let count = 0;
    readXlsxFile(input.files[0])
    .then((rows)=>{
        // console.log(rows);
        rows.forEach(row => {
            dataFromExcel.push(row);
        });
        dataFromExcel.forEach(eachRow =>{

            if(count===0){
                // do something
                columns.push(eachRow);
                
                console.log(typeof(eachRow));
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
    })
})

