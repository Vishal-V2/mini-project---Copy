const mongoose = require('mongoose');
const Prison = require('./models/Prison');
const Prisoner = require('./models/Prisoner');
const Staff = require('./models/Staff');
const Visit = require('./models/Visit');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/prison_management', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
    console.log('Connected to MongoDB');
    
    try {
        // Clear existing data
        await Promise.all([
            Prison.deleteMany({}),
            Prisoner.deleteMany({}),
            Staff.deleteMany({}),
            Visit.deleteMany({})
        ]);
        
        // Create a test prison
        const prison = await Prison.create({
            name: 'Central Jail',
            location: 'Mumbai',
            capacity: 1000,
            type: 'Maximum Security',
            description: 'Main central prison facility'
        });
        
        // Create test prisoners
        const prisoners = await Prisoner.create([
            {
                prisonerId: 'P001',
                firstName: 'Rajesh',
                lastName: 'Kumar',
                dateOfBirth: new Date('1980-01-15'),
                gender: 'male',
                crime: 'Armed Robbery',
                severityLevel: 'High',
                sentence: 5,
                status: 'Incarcerated',
                prisonId: prison._id,
                cellNumber: 'A-101',
                admissionDate: new Date('2023-01-01'),
                releaseDate: new Date('2028-01-01'),
                notes: 'First-time offender'
            },
            {
                prisonerId: 'P002',
                firstName: 'Priya',
                lastName: 'Sharma',
                dateOfBirth: new Date('1990-05-20'),
                gender: 'female',
                crime: 'Financial Fraud',
                severityLevel: 'Medium',
                sentence: 3,
                status: 'Incarcerated',
                prisonId: prison._id,
                cellNumber: 'B-202',
                admissionDate: new Date('2023-03-15'),
                releaseDate: new Date('2026-03-15'),
                notes: 'Cooperative inmate'
            },
            {
                prisonerId: 'P003',
                firstName: 'Vikram',
                lastName: 'Singh',
                dateOfBirth: new Date('1975-08-10'),
                gender: 'male',
                crime: 'Drug Trafficking',
                severityLevel: 'Maximum',
                sentence: 10,
                status: 'Incarcerated',
                prisonId: prison._id,
                cellNumber: 'C-303',
                admissionDate: new Date('2022-06-01'),
                releaseDate: new Date('2032-06-01'),
                notes: 'High-risk inmate'
            },
            {
                prisonerId: 'P004',
                firstName: 'Meera',
                lastName: 'Patel',
                dateOfBirth: new Date('1988-12-25'),
                gender: 'female',
                crime: 'Identity Theft',
                severityLevel: 'Medium',
                sentence: 4,
                status: 'Incarcerated',
                prisonId: prison._id,
                cellNumber: 'B-204',
                admissionDate: new Date('2023-09-10'),
                releaseDate: new Date('2027-09-10'),
                notes: 'Participating in rehabilitation program'
            },
            {
                prisonerId: 'P005',
                firstName: 'Arjun',
                lastName: 'Reddy',
                dateOfBirth: new Date('1995-03-30'),
                gender: 'male',
                crime: 'Assault',
                severityLevel: 'Low',
                sentence: 2,
                status: 'Incarcerated',
                prisonId: prison._id,
                cellNumber: 'A-102',
                admissionDate: new Date('2024-01-15'),
                releaseDate: new Date('2026-01-15'),
                notes: 'Good behavior'
            },
            {
                prisonerId: 'P006',
                firstName: 'Sneha',
                lastName: 'Gupta',
                dateOfBirth: new Date('1992-07-18'),
                gender: 'female',
                crime: 'Cyber Crime',
                severityLevel: 'Medium',
                sentence: 3,
                status: 'Incarcerated',
                prisonId: prison._id,
                cellNumber: 'B-205',
                admissionDate: new Date('2023-11-20'),
                releaseDate: new Date('2026-11-20'),
                notes: 'Technical skills'
            }
        ]);
        
        // Create test staff
        await Staff.create([
            {
                firstName: 'John',
                lastName: 'Smith',
                role: 'Correctional Officer',
                email: 'john.smith@prison.gov',
                phone: '9876543210',
                hireDate: new Date('2020-01-01'),
                prisonId: prison._id,
                department: 'security',
                employeeId: 'ST-2023-001',
                employmentType: 'full_time',
                salary: 50000,
                education: 'bachelor',
                certifications: ['First Aid', 'CPR'],
                emergencyContact: { name: 'Jane Smith', relationship: 'Wife', phone: '9876543211', email: 'jane.smith@example.com' },
                notes: 'Senior officer',
                specialRequirements: 'None'
            },
            {
                firstName: 'Emily',
                lastName: 'Johnson',
                role: 'Medical Staff',
                email: 'emily.johnson@prison.gov',
                phone: '9876543212',
                hireDate: new Date('2021-03-15'),
                prisonId: prison._id,
                department: 'healthcare',
                employeeId: 'ST-2023-002',
                employmentType: 'part_time',
                salary: 35000,
                education: 'master',
                certifications: ['First Aid'],
                emergencyContact: { name: 'Robert Johnson', relationship: 'Brother', phone: '9876543213', email: 'robert.johnson@example.com' },
                notes: '',
                specialRequirements: 'Medical leave on Fridays'
            },
            {
                firstName: 'Michael',
                lastName: 'Williams',
                role: 'Psychologist',
                email: 'michael.williams@prison.gov',
                phone: '9876543214',
                hireDate: new Date('2019-07-10'),
                prisonId: prison._id,
                department: 'mental_health',
                employeeId: 'ST-2023-003',
                employmentType: 'full_time',
                salary: 60000,
                education: 'doctorate',
                certifications: ['Specialized Training'],
                emergencyContact: { name: 'Laura Williams', relationship: 'Wife', phone: '9876543215', email: 'laura.williams@example.com' },
                notes: 'Handles high-risk inmates',
                specialRequirements: ''
            },
            {
                firstName: 'Sarah',
                lastName: 'Brown',
                role: 'Social Worker',
                email: 'sarah.brown@prison.gov',
                phone: '9876543216',
                hireDate: new Date('2022-02-20'),
                prisonId: prison._id,
                department: 'rehabilitation',
                employeeId: 'ST-2023-004',
                employmentType: 'contract',
                salary: 30000,
                education: 'bachelor',
                certifications: ['CPR'],
                emergencyContact: { name: 'Tom Brown', relationship: 'Husband', phone: '9876543217', email: 'tom.brown@example.com' },
                notes: '',
                specialRequirements: 'Flexible hours'
            },
            {
                firstName: 'David',
                lastName: 'Jones',
                role: 'Administrator',
                email: 'david.jones@prison.gov',
                phone: '9876543218',
                hireDate: new Date('2018-11-05'),
                prisonId: prison._id,
                department: 'administration',
                employeeId: 'ST-2023-005',
                employmentType: 'full_time',
                salary: 55000,
                education: 'master',
                certifications: ['Security Clearance'],
                emergencyContact: { name: 'Anna Jones', relationship: 'Wife', phone: '9876543219', email: 'anna.jones@example.com' },
                notes: 'Manages staff schedules',
                specialRequirements: ''
            },
            {
                firstName: 'Jessica',
                lastName: 'Garcia',
                role: 'Security Officer',
                email: 'jessica.garcia@prison.gov',
                phone: '9876543220',
                hireDate: new Date('2021-09-12'),
                prisonId: prison._id,
                department: 'security',
                employeeId: 'ST-2023-006',
                employmentType: 'temporary',
                salary: 25000,
                education: 'associate',
                certifications: ['First Aid', 'Security Clearance'],
                emergencyContact: { name: 'Carlos Garcia', relationship: 'Father', phone: '9876543221', email: 'carlos.garcia@example.com' },
                notes: '',
                specialRequirements: 'Night shifts only'
            },
            {
                firstName: 'Daniel',
                lastName: 'Martinez',
                role: 'Counselor',
                email: 'daniel.martinez@prison.gov',
                phone: '9876543222',
                hireDate: new Date('2020-05-18'),
                prisonId: prison._id,
                department: 'mental_health',
                employeeId: 'ST-2023-007',
                employmentType: 'full_time',
                salary: 48000,
                education: 'master',
                certifications: ['Specialized Training', 'CPR'],
                emergencyContact: { name: 'Maria Martinez', relationship: 'Mother', phone: '9876543223', email: 'maria.martinez@example.com' },
                notes: '',
                specialRequirements: ''
            },
            {
                firstName: 'Ashley',
                lastName: 'Lopez',
                role: 'Correctional Officer',
                email: 'ashley.lopez@prison.gov',
                phone: '9876543224',
                hireDate: new Date('2022-06-30'),
                prisonId: prison._id,
                department: 'security',
                employeeId: 'ST-2023-008',
                employmentType: 'part_time',
                salary: 32000,
                education: 'bachelor',
                certifications: ['First Aid'],
                emergencyContact: { name: 'Samantha Lopez', relationship: 'Sister', phone: '9876543225', email: 'samantha.lopez@example.com' },
                notes: '',
                specialRequirements: 'Prefers morning shifts'
            },
            {
                firstName: 'Matthew',
                lastName: 'Clark',
                role: 'Security Officer',
                email: 'matthew.clark@prison.gov',
                phone: '9876543226',
                hireDate: new Date('2017-10-22'),
                prisonId: prison._id,
                department: 'security',
                employeeId: 'ST-2023-009',
                employmentType: 'full_time',
                salary: 47000,
                education: 'high_school',
                certifications: ['Security Clearance'],
                emergencyContact: { name: 'Linda Clark', relationship: 'Wife', phone: '9876543227', email: 'linda.clark@example.com' },
                notes: '',
                specialRequirements: ''
            },
            {
                firstName: 'Olivia',
                lastName: 'Lewis',
                role: 'Medical Staff',
                email: 'olivia.lewis@prison.gov',
                phone: '9876543228',
                hireDate: new Date('2023-01-10'),
                prisonId: prison._id,
                department: 'healthcare',
                employeeId: 'ST-2023-010',
                employmentType: 'contract',
                salary: 39000,
                education: 'bachelor',
                certifications: ['First Aid', 'CPR'],
                emergencyContact: { name: 'Henry Lewis', relationship: 'Father', phone: '9876543229', email: 'henry.lewis@example.com' },
                notes: '',
                specialRequirements: 'On-call weekends'
            }
        ]);
        
        // Create test visit with corrected fields
        await Visit.create({
            visitorName: 'Rahul Kumar',
            relationship: 'Brother',
            prisonerId: prisoners[0]._id,
            visitType: 'Regular',
            visitDate: new Date('2024-05-15'),
            visitTime: '14:00',
            duration: 30,
            status: 'Pending',  // Corrected enum value
            purpose: 'Family Visit',  // Added required field
            visitorId: 'visitor123',  // Added required field
            notes: 'Monthly visit'
        });
        
        console.log('Test data seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
});
