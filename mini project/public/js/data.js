// Function to fetch prisoners data
async function fetchPrisoners() {
    try {
        console.log('Fetching prisoners...');
        const response = await fetch('/api/prisoners');
        if (!response.ok) {
            throw new Error('Failed to fetch prisoners');
        }
        const data = await response.json();
        console.log('Fetched prisoners:', data);
        return data;
    } catch (error) {
        console.error('Error fetching prisoners:', error);
        return [];
    }
}

// Function to display prisoners in the table
async function displayPrisoners() {
    const prisoners = await fetchPrisoners();
    const tableBody = document.querySelector('#prisonerTable tbody');
    
    if (!tableBody) {
        console.error('Table body not found!');
        return;
    }
    
    console.log('Displaying prisoners:', prisoners);
    tableBody.innerHTML = '';
    
    if (prisoners.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="8" class="text-center py-4">No prisoners found</td>';
        tableBody.appendChild(row);
        return;
    }
    
    prisoners.forEach(prisoner => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${prisoner.prisonerId || ''}</td>
            <td>${prisoner.firstName} ${prisoner.lastName}</td>
            <td>${calculateAge(prisoner.dateOfBirth)}</td>
            <td>${prisoner.gender || ''}</td>
            <td>${prisoner.cellNumber || ''}</td>
            <td>${prisoner.crime || ''}</td>
            <td>${prisoner.sentence || ''} years</td>
            <td>
                <button onclick="editPrisoner('${prisoner._id}')" class="btn btn-sm btn-primary">Edit</button>
                <button onclick="deletePrisoner('${prisoner._id}')" class="btn btn-sm btn-danger">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Helper function to calculate age
function calculateAge(dateOfBirth) {
    if (!dateOfBirth) return '';
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing...');
    displayPrisoners();
}); 