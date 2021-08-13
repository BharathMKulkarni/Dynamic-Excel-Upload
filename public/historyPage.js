const allDeleteButtons = document.querySelectorAll(".delete-btn");
const allDownloadButtons = document.querySelectorAll(".download-btn");


document.getElementById("deleteModalNoBtn").addEventListener('click', () => {
    $('#deleteConfirmationModal').modal('hide');
}, false);

const handleDeleteClick = (event) => {
    const fileId = event.target.id.substring(3);

    // Show confirmation modal
    $('#deleteConfirmationModal').modal('show');
    
    // HANDLING THE 'YES' BUTTON IN CONFIRMATION MODAL
    document.getElementById("deleteModalYesBtn").onclick = () => {
        window.location.href = `/userdata/history/${fileId}`;
    };
}

const handleDownloadClick = (event) => { 
    const fileId = event.target.id.substring(3);

    window.location.href = `/userdata/history/download/${fileId}`;
}

allDeleteButtons.forEach(delBtn => {
    delBtn.addEventListener('click', handleDeleteClick, false);
})
allDownloadButtons.forEach(downloadBtn => {
    downloadBtn.addEventListener('click', handleDownloadClick, false);
})