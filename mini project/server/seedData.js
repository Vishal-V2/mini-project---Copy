const mongoose = require('mongoose');
const Prisoner = require('./models/Prisoner');
const Staff = require('./models/Staff');
const Visit = require('./models/Visit');
const Prison = require('./models/Prison');

// Enhanced Indian names data
const firstNames = {
    male: ['Rajesh', 'Amit', 'Suresh', 'Rahul', 'Vikram', 'Arun', 'Deepak', 'Kumar', 'Manoj', 'Prakash', 
           'Sunil', 'Ravi', 'Naveen', 'Sanjay', 'Vijay', 'Dinesh', 'Harish', 'Ganesh', 'Mahesh', 'Ramesh',
           'Sachin', 'Vishal', 'Pankaj', 'Rajiv', 'Anil', 'Mukesh', 'Dilip', 'Rakesh', 'Vinod', 'Sandeep',
           'Ajay', 'Rohit', 'Vikas', 'Nitin', 'Ashok', 'Pradeep', 'Raj', 'Shiv', 'Mohan', 'Karan'],
    female: ['Priya', 'Anita', 'Meena', 'Sunita', 'Rekha', 'Neha', 'Pooja', 'Sangeeta', 'Kavita', 'Ritu',
             'Deepa', 'Shweta', 'Anjali', 'Manisha', 'Rashmi', 'Smita', 'Jyoti', 'Nisha', 'Seema', 'Lakshmi',
             'Aarti', 'Divya', 'Preeti', 'Swati', 'Sneha', 'Manju', 'Radha', 'Suman', 'Asha', 'Geeta']
};

const lastNames = ['Kumar', 'Singh', 'Sharma', 'Verma', 'Gupta', 'Yadav', 'Patel', 'Mishra', 'Chauhan', 'Kaur',
                  'Reddy', 'Nair', 'Iyer', 'Menon', 'Pillai', 'Nayak', 'Das', 'Bose', 'Banerjee', 'Mukherjee',
                  'Joshi', 'Malhotra', 'Kapoor', 'Saxena', 'Sinha', 'Chopra', 'Mehta', 'Shah', 'Trivedi', 'Desai'];

const crimes = [
    { type: 'Theft', severityLevel: 'Low' },
    { type: 'Robbery', severityLevel: 'Medium' },
    { type: 'Assault', severityLevel: 'Medium' },
    { type: 'Drug Trafficking', severityLevel: 'High' },
    { type: 'Fraud', severityLevel: 'Medium' },
    { type: 'Murder', severityLevel: 'High' },
    { type: 'Kidnapping', severityLevel: 'High' },
    { type: 'Extortion', severityLevel: 'Medium' },
    { type: 'Smuggling', severityLevel: 'High' },
    { type: 'Counterfeiting', severityLevel: 'Medium' },
    { type: 'Cyber Crime', severityLevel: 'Medium' },
    { type: 'Property Damage', severityLevel: 'Low' },
    { type: 'Public Disorder', severityLevel: 'Low' },
    { type: 'Arms Trafficking', severityLevel: 'High' },
    { type: 'Domestic Violence', severityLevel: 'Medium' },
    { type: 'Financial Fraud', severityLevel: 'Medium' },
    { type: 'Identity Theft', severityLevel: 'Medium' },
    { type: 'Tax Evasion', severityLevel: 'Medium' }
];

const prisons = [
    {
        name: 'Tihar Central Jail',
        location: 'New Delhi',
        capacity: 1000,
        type: 'Maximum Security',
        description: 'One of the largest prison complexes in South Asia',
        facilities: ['Medical Ward', 'Vocational Training Center', 'Library', 'Sports Ground']
    },
    {
        name: 'Arthur Road Jail',
        location: 'Mumbai, Maharashtra',
        capacity: 800,
        type: 'High Security',
        description: 'Historic prison in the heart of Mumbai',
        facilities: ['Hospital Wing', 'Workshop Area', 'Prayer Hall', 'Educational Center']
    },
    {
        name: 'Puzhal Central Prison',
        location: 'Chennai, Tamil Nadu',
        capacity: 600,
        type: 'Medium Security',
        description: 'Modern prison facility in Tamil Nadu',
        facilities: ['Rehabilitation Center', 'Skill Development Unit', 'Medical Facility', 'Recreation Area']
    },
    {
        name: 'Yerawada Central Prison',
        location: 'Pune, Maharashtra',
        capacity: 750,
        type: 'Maximum Security',
        description: 'One of the largest prisons in Maharashtra',
        facilities: ['Industrial Unit', 'Healthcare Center', 'Education Block', 'Agricultural Area']
    },
    {
        name: 'Bengaluru Central Prison',
        location: 'Bengaluru, Karnataka',
        capacity: 550,
        type: 'High Security',
        description: 'Modern correctional facility with focus on rehabilitation',
        facilities: ['Computer Training Center', 'Medical Wing', 'Counseling Center', 'Sports Facility']
    }
];

const staffRoles = [
    { 
        role: 'Warden', 
        count: 3,
        baseSalary: 75384,
        responsibilities: ['Overall Prison Management', 'Security Oversight', 'Staff Supervision']
    },
    { 
        role: 'Guard', 
        count: 12,
        baseSalary: 35384,
        responsibilities: ['Security Maintenance', 'Prisoner Supervision', 'Patrol Duties']
    },
    { 
        role: 'Medical Staff', 
        count: 4,
        baseSalary: 65384,
        responsibilities: ['Healthcare Services', 'Medical Emergencies', 'Health Records Management']
    },
    { 
        role: 'Counselor', 
        count: 4,
        baseSalary: 55384,
        responsibilities: ['Prisoner Counseling', 'Rehabilitation Programs', 'Mental Health Support']
    },
    { 
        role: 'Administrative', 
        count: 4,
        baseSalary: 45384,
        responsibilities: ['Record Keeping', 'Visitor Management', 'Administrative Tasks']
    }
];

const visitTypes = [
    { type: 'Regular Visit', maxDuration: '60' },
    { type: 'Legal Visit', maxDuration: '120' },
    { type: 'Family Visit', maxDuration: '90' },
    { type: 'Special Visit', maxDuration: '120' }
];

const relationships = [
    'Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Lawyer', 'Relative',
    'Guardian', 'Social Worker', 'Religious Counselor'
];

const states = [
    'Delhi', 'Maharashtra', 'Tamil Nadu', 'Karnataka', 'Gujarat', 'Uttar Pradesh',
    'West Bengal', 'Rajasthan', 'Bihar', 'Madhya Pradesh', 'Kerala', 'Punjab'
];

// Helper functions
const getRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

const generateAddress = () => {
    const state = getRandomElement(states);
    return `${Math.floor(Math.random() * 1000) + 1}, ${['Street', 'Colony', 'Nagar', 'Layout'][Math.floor(Math.random() * 4)]}, ${state}`;
};

const generatePrisoner = (prisonId) => {
    const gender = Math.random() > 0.9 ? 'female' : 'male';
    const firstName = getRandomElement(firstNames[gender]);
    const lastName = getRandomElement(lastNames);
    const age = Math.floor(Math.random() * 30) + 20; // 20-50 years
    const crimeDetails = getRandomElement(crimes);
    const sentence = Math.floor(Math.random() * 20) + 1; // 1-20 years
    const admissionDate = getRandomDate(new Date(2020, 0, 1), new Date(2024, 11, 31));
    const releaseDate = new Date(admissionDate);
    releaseDate.setFullYear(releaseDate.getFullYear() + sentence);

    return {
        firstName,
        lastName,
        dateOfBirth: new Date(new Date().getFullYear() - age, 0, 1),
        gender,
        crime: crimeDetails.type,
        severityLevel: crimeDetails.severityLevel,
        sentence,
        status: 'Incarcerated',
        prisonId,
        cellNumber: `C${Math.floor(Math.random() * 100) + 1}`,
        admissionDate,
        releaseDate,
        address: generateAddress(),
        emergencyContact: {
            name: `${getRandomElement(firstNames[Math.random() > 0.5 ? 'male' : 'female'])} ${lastName}`,
            relationship: getRandomElement(relationships),
            phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`
        },
        notes: `Admitted for ${crimeDetails.type}. Sentence: ${sentence} years. Severity: ${crimeDetails.severityLevel}`
    };
};

const generateStaff = (prisonId) => {
    const gender = Math.random() > 0.7 ? 'female' : 'male';
    const firstName = getRandomElement(firstNames[gender]);
    const lastName = getRandomElement(lastNames);
    const age = Math.floor(Math.random() * 25) + 25; // 25-50 years
    const roleInfo = getRandomElement(staffRoles);
    const experienceYears = Math.floor(Math.random() * 15) + 1;
    const salary = roleInfo.baseSalary + (experienceYears * 2000); // Increment based on experience
    const hireDate = getRandomDate(new Date(2015, 0, 1), new Date(2024, 11, 31));
    const timestamp = Date.now();

    return {
        firstName,
        lastName,
        dateOfBirth: new Date(new Date().getFullYear() - age, 0, 1),
        gender,
        role: roleInfo.role,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${timestamp}@prison.gov.in`,
        phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        salary,
        hireDate,
        prisonId,
        address: generateAddress(),
        qualifications: `${roleInfo.role} Certification, ${experienceYears} years experience`,
        responsibilities: roleInfo.responsibilities,
        emergencyContact: {
            name: `${getRandomElement(firstNames[gender])} ${lastName}`,
            relationship: 'Spouse',
            phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`
        }
    };
};

const generateVisit = (prisoners) => {
    const prisoner = getRandomElement(prisoners);
    const visitTypeInfo = getRandomElement(visitTypes);
    const visitorGender = Math.random() > 0.5 ? 'male' : 'female';
    const visitorName = `${getRandomElement(firstNames[visitorGender])} ${getRandomElement(lastNames)}`;
    const relationship = getRandomElement(relationships);
    const visitDate = getRandomDate(new Date(2025, 0, 1), new Date(2025, 11, 31));
    const duration = Math.min(parseInt(getRandomElement(['30', '60', '90', '120'])), parseInt(visitTypeInfo.maxDuration));
    const status = Math.random() > 0.2 ? 'Approved' : 'Pending';

    return {
        prisonerId: prisoner._id,
        visitorName,
        visitorId: `V${Math.floor(Math.random() * 10000) + 1000}`,
        relationship,
        visitType: visitTypeInfo.type,
        visitDate,
        visitTime: `${Math.floor(Math.random() * 8) + 9}:00`, // 9 AM to 5 PM
        duration: duration.toString(),
        status,
        address: generateAddress(),
        phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        purpose: `${visitTypeInfo.type} for ${relationship}`,
        notes: `Scheduled ${visitTypeInfo.type.toLowerCase()} for ${relationship.toLowerCase()}`
    };
};

// Main seeding function
const seedDatabase = async () => {
    try {
        // Clear existing data
        await Prisoner.deleteMany({});
        await Staff.deleteMany({});
        await Visit.deleteMany({});
        await Prison.deleteMany({});

        // Create prisons
        const createdPrisons = await Prison.insertMany(prisons);
        console.log('Prisons created');

        // Create prisoners
        const prisoners = [];
        for (const prison of createdPrisons) {
            const prisonerCount = Math.floor(Math.random() * 20) + 15; // 15-35 prisoners per prison
            for (let i = 0; i < prisonerCount; i++) {
                const prisoner = await Prisoner.create(generatePrisoner(prison._id));
                prisoners.push(prisoner);
            }
        }
        console.log('Prisoners created');

        // Create staff
        for (const prison of createdPrisons) {
            for (const roleInfo of staffRoles) {
                for (let i = 0; i < roleInfo.count; i++) {
                    await Staff.create(generateStaff(prison._id));
                }
            }
        }
        console.log('Staff created');

        // Create visits
        const visitCount = 50; // Increased number of visits
        for (let i = 0; i < visitCount; i++) {
            await Visit.create(generateVisit(prisoners));
        }
        console.log('Visits created');

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

module.exports = seedDatabase; 