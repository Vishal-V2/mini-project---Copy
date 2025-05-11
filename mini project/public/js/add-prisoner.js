// Function to handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();

    // Get form data
    const formData = {
        firstName: document.querySelector('input[name="firstName"]')?.value || '',
        lastName: document.querySelector('input[name="lastName"]')?.value || '',
        dateOfBirth: document.querySelector('input[name="dateOfBirth"]')?.value || '',
        gender: document.querySelector('select[name="gender"]')?.value || '',
        nationality: document.querySelector('input[name="nationality"]')?.value || '',
        prisonerId: document.querySelector('input[name="prisonerId"]')?.value || '',
        crime: document.querySelector('input[name="crime"]')?.value || '',
        sentence: document.querySelector('input[name="sentence"]')?.value || '',
        sentenceStartDate: document.querySelector('input[name="sentenceStartDate"]')?.value || '',
        caseNumber: document.querySelector('input[name="caseNumber"]')?.value || '',
        block: document.querySelector('select[name="block"]')?.value || '',
        cellNumber: document.querySelector('input[name="cellNumber"]')?.value || '',
        securityLevel: document.querySelector('select[name="securityLevel"]')?.value || '',
        specialRequirements: Array.from(document.querySelector('select[name="specialRequirements"]')?.selectedOptions || []).map(option => option.value),
        medicalConditions: document.querySelector('textarea[name="medicalConditions"]')?.value || '',
        notes: document.querySelector('textarea[name="notes"]')?.value || ''
    };

    // Validate required fields
    const requiredFields = [
        'firstName', 'lastName', 'dateOfBirth', 'gender', 'nationality', 'prisonerId',
        'crime', 'sentence', 'sentenceStartDate', 'caseNumber', 'block', 'cellNumber', 'securityLevel'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
    }

    // Validate dates
    try {
        new Date(formData.dateOfBirth);
        new Date(formData.sentenceStartDate);
    } catch (error) {
        alert('Please enter valid dates for all date fields');
        return;
    }

    try {
        // Send data to server
        const response = await fetch('/api/prisoners', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error response:', errorText);
            let errorMessage = 'Failed to add prisoner';
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                errorMessage = errorText || errorMessage;
            }
            throw new Error(errorMessage);
        }

        // Show success message
        alert('Prisoner added successfully!');
        
        // Redirect to prisoners list
        window.location.href = '/prisoners.html';
    } catch (error) {
        console.error('Error adding prisoner:', error);
        alert('Failed to add prisoner: ' + error.message);
    }
}

// Add event listener when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Add name attributes to form inputs
    const inputs = {
        'First Name': 'firstName',
        'Last Name': 'lastName',
        'Date of Birth': 'dateOfBirth',
        'Gender': 'gender',
        'Nationality': 'nationality',
        'Prisoner ID': 'prisonerId',
        'Crime Committed': 'crime',
        'Sentence Duration': 'sentence',
        'Sentence Start Date': 'sentenceStartDate',
        'Case Number': 'caseNumber',
        'Block Assignment': 'block',
        'Cell Number': 'cellNumber',
        'Security Level': 'securityLevel',
        'Special Requirements': 'specialRequirements',
        'Medical Conditions': 'medicalConditions',
        'Notes': 'notes'
    };

    // Add name attributes to all form inputs
    Object.entries(inputs).forEach(([label, name]) => {
        // Find the label element
        const labels = Array.from(document.getElementsByTagName('label'));
        const labelElement = labels.find(l => l.textContent.trim() === label);
        
        if (labelElement) {
            // Find the next input, select, or textarea element
            const inputElement = labelElement.nextElementSibling;
            if (inputElement && (inputElement.tagName === 'INPUT' || 
                               inputElement.tagName === 'SELECT' || 
                               inputElement.tagName === 'TEXTAREA')) {
                inputElement.setAttribute('name', name);
            }
        }
    });
}); 