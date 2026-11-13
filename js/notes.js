// Author: Tajae Jacobs 
console.log("notes.js is connected!");
document.addEventListener("DOMContentLoaded", function() {
    const notesList = document.getElementById("notes-list");
    const comment = document.getElementById("note-content");
    const addNoteButton = document.getElementById("add-note");
    // Get contactId 
    const contactDetails = document.getElementById("contact-details");
    const contactId = contactDetails.dataset.contactId || null;

    //request notes from get_notes.php 
    function loadNotes(contactId) {
        fetch(`get_notes.php?contact_id=${contactId}`)
            .then(response => response.json())
            .then(data => {
                if(data.success){
                   notesList.innerHTML = "";
                   data.notes.forEach(note => {
                       const notediv = document.createElement("div");
                       const author = document.createElement("p");
                       const comment = document.createElement("p");
                       const date = document.createElement("p");
                      
                       author.textContent = note.author_name;
                       comment.textContent = note.comment;
                       date.textContent = note.created_at;
                      
                       notediv.appendChild(author);
                       notediv.appendChild(comment);
                       notediv.appendChild(date);
                       notesList.appendChild(notediv);
                   });
                }
                else{
                    console.error(data.message);
                }
            })
            .catch(error => {
                console.error("Error fetching notes:", error);
            });
    }
    if(contactId){
        loadNotes(contactId);
    }

    //Add notes
    addNoteButton.addEventListener("click", function() {
        const commentValue = comment.value.trim();
        if (commentValue === "") {
            alert("Please enter a comment.");
            return;
        }
        // Send notes to this php file 
        fetch("add_note.php", {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'contact_id': contactId,
                'comment': commentValue
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                comment.value = "";
                loadNotes(contactId);
                alert("Note added successfully.");
            }
            else{
                console.error(data.message);
            }
        })
        .catch(error => {
            console.error("Error adding note:", error);
        });
    });
}); 
