const allDeleteButtons = document.querySelectorAll(".delete-btn");

document.getElementById("deleteModalNoBtn").addEventListener('click', () => {
    $('#deleteConfirmationModal').modal('hide');
}, false);

const handleDeleteClick = (event) => {
    const fileId = event.target.id;

    // Show confirmation modal
    $('#deleteConfirmationModal').modal('show');
    
    // HANDLING THE 'YES' BUTTON IN CONFIRMATION MODAL
    document.getElementById("deleteModalYesBtn").onclick = () => {
        window.location.href = `/userdata/history/${fileId}`;
    };
}

allDeleteButtons.forEach(delBtn => {
    delBtn.addEventListener('click', handleDeleteClick, false);
})