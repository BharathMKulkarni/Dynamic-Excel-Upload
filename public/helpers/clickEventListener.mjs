export var inputFileName;

export const clickEventListener = () => {
    // WHEN NO FILE IS SELECTED
    if(inputFileName === undefined){
        nameOfFileChosen.innerText = 'no file chosen';
        document.getElementById("choseFileInstruction").innerHTML = `choose a file or drag and drop a file here`;
        document.getElementById("chooseFileText").innerText = "Choose File";
        document.getElementById("doneButton").style = "cursor: auto";
        $("#doneButton").attr("disabled",true);
    }
}
