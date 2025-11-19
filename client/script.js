const API_URL = 'https://my-notes-app-0rz9.onrender.com/api/notes';
// 1. Fetch and Display Notes on Load
async function fetchNotes() {
    const response = await fetch(API_URL);
    const notes = await response.json();
    
    const list = document.getElementById('notes-list');
    list.innerHTML = ''; // Clear current list

    notes.forEach(note => {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note-item';
        noteDiv.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <button class="delete-btn" onclick="deleteNote(${note.id})">Delete</button>
        `;
        list.appendChild(noteDiv);
    });
}

// 2. Handle Form Submission (Create Note)
document.getElementById('note-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop page from reloading
    
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    });

    // Clear form and refresh list
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    fetchNotes(); 
});

// 3. Handle Deletion
async function deleteNote(id) {
    if(confirm('Are you sure?')) {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        fetchNotes(); // Refresh list
    }
}

// Initial load
fetchNotes();