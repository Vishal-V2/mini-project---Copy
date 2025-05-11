// Function to handle staff form submission
async function handleStaffFormSubmit(event) {
    event.preventDefault();

    // Get form data
    const formData = {
        staffId: document.querySelector('input[name="staffId"]')?.value || '',
        firstName: document.querySelector('input[name="firstName"]')?.value || '',
        lastName: document.querySelector('input[name="lastName"]')?.value || '',
        role: document.querySelector('select[name="role"]')?.value || '',
        email: document.querySelector('input[name="email"]')?.value || '',
        phone: document.querySelector('input[name="phone"]')?.value || '',
        joiningDate: document.querySelector('input[name="joiningDate"]')?.value || '',
        department: document.querySelector('select[name="department"]')?.value || '',
        shift: document.querySelector('select[name="shift"]')?.value || '',
        employmentType: document.querySelector('select[name="employmentType"]')?.value || '',
        salary: document.querySelector('input[name="salary"]')?.value || '',
        education: document.querySelector('select[name="education"]')?.value || '',
        qualifications: Array.from(document.querySelectorAll('input[name="certifications"]:checked')).map(cb => {
            return { degree: cb.nextElementSibling.textContent.trim(), institution: '', year: null };
        }),
        emergencyContact: {
            name: document.querySelector('input[name="emergencyContactName"]')?.value || '',
            relationship: document.querySelector('input[name="emergencyContactRelationship"]')?.value || '',
            phone: document.querySelector('input[name="emergencyContactPhone"]')?.value || '',
            email: document.querySelector('input[name="emergencyContactEmail"]')?.value || ''
        },
        notes: document.querySelector('textarea[name="notes"]')?.value || '',
        specialRequirements: document.querySelector('textarea[name="specialRequirements"]')?.value || ''
    };

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'role', 'email', 'phone', 'joiningDate', 'department', 'shift', 'staffId'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
    }

    try {
        // Send data to server
        const response = await fetch('/api/staff', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error response:', errorText);
            let errorMessage = 'Failed to add staff member';
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || (errorData.errors && errorData.errors.map(e => e.msg).join(', ')) || errorMessage;
            } catch (e) {
                errorMessage = errorText || errorMessage;
            }
            throw new Error(errorMessage);
        }

        // Show success message
        alert('Staff member added successfully!');
        // Redirect or reset form as needed
        window.location.href = '/staff.html';
    } catch (error) {
        console.error('Error adding staff member:', error);
        alert('Failed to add staff member: ' + error.message);
    }
}

// Add event listener when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', handleStaffFormSubmit);
    }

    // Add name attributes to form inputs for easier JS selection
    const inputs = {
        'First Name': 'firstName',
        'Last Name': 'lastName',
        'Email': 'email',
        'Phone Number': 'phone',
        'Hire Date': 'joiningDate',
        'Position': 'role',
        'Department': 'department',
        'Employee ID': 'staffId',
        'Employment Type': 'employmentType',
        'Salary': 'salary',
        'Education': 'education',
        'Notes': 'notes',
        'Special Requirements': 'specialRequirements',
        'Contact Name': 'emergencyContactName',
        'Relationship': 'emergencyContactRelationship',
        'Contact Phone': 'emergencyContactPhone',
        'Contact Email': 'emergencyContactEmail',
        'Shift': 'shift'
    };
    Object.entries(inputs).forEach(([label, name]) => {
        const labels = Array.from(document.getElementsByTagName('label'));
        const labelElement = labels.find(l => l.textContent.trim() === label);
        if (labelElement) {
            const inputElement = labelElement.nextElementSibling;
            if (inputElement && (inputElement.tagName === 'INPUT' || inputElement.tagName === 'SELECT' || inputElement.tagName === 'TEXTAREA')) {
                inputElement.setAttribute('name', name);
            }
        }
    });
    // Set name for certifications checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.setAttribute('name', 'certifications');
    });
});
