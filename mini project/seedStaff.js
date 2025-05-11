const mongoose = require('mongoose');
const Staff = require('./models/Staff');
const Prison = require('./models/Prison');

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
        // Find a prison to associate staff with
        const prison = await Prison.findOne();
        if (!prison) {
            console.error('No prison found in database. Please seed prisons first.');
            process.exit(1);
        }

        // Create new staff data
const newStaff = [
            {
                firstName: 'Alice',
                lastName: 'Walker',
                role: 'Correctional Officer',
                email: 'alice.walker2024@prison.gov',
                phone: '9123456780',
                hireDate: new Date('2022-04-01'),
                prisonId: prison._id,
                department: 'security',
                employeeId: 'ST-2024-101',
                employmentType: 'full_time',
                salary: 52000,
                education: 'bachelor',
                certifications: ['First Aid', 'CPR'],
                emergencyContact: { name: 'Mark Walker', relationship: 'Husband', phone: '9123456781', email: 'mark.walker2024@example.com' },
                notes: 'Experienced officer',
                specialRequirements: 'None'
            },
            {
                firstName: 'Brian',
                lastName: 'Adams',
                role: 'Medical Staff',
                email: 'brian.adams2024@prison.gov',
                phone: '9123456782',
                hireDate: new Date('2023-01-15'),
                prisonId: prison._id,
                department: 'healthcare',
                employeeId: 'ST-2024-102',
                employmentType: 'part_time',
                salary: 36000,
                education: 'master',
                certifications: ['First Aid'],
                emergencyContact: { name: 'Laura Adams', relationship: 'Wife', phone: '9123456783', email: 'laura.adams2024@example.com' },
                notes: '',
                specialRequirements: 'Medical leave on Mondays'
            },
            {
                firstName: 'Catherine',
                lastName: 'Lee',
                role: 'Psychologist',
                email: 'catherine.lee2024@prison.gov',
                phone: '9123456784',
                hireDate: new Date('2021-07-20'),
                prisonId: prison._id,
                department: 'mental_health',
                employeeId: 'ST-2024-103',
                employmentType: 'full_time',
                salary: 61000,
                education: 'doctorate',
                certifications: ['Specialized Training'],
                emergencyContact: { name: 'James Lee', relationship: 'Husband', phone: '9123456785', email: 'james.lee2024@example.com' },
                notes: 'Handles high-risk inmates',
                specialRequirements: ''
            },
            {
                firstName: 'David',
                lastName: 'Nguyen',
                role: 'Social Worker',
                email: 'david.nguyen2024@prison.gov',
                phone: '9123456786',
                hireDate: new Date('2023-03-10'),
                prisonId: prison._id,
                department: 'rehabilitation',
                employeeId: 'ST-2024-104',
                employmentType: 'contract',
                salary: 31000,
                education: 'bachelor',
                certifications: ['CPR'],
                emergencyContact: { name: 'Anna Nguyen', relationship: 'Wife', phone: '9123456787', email: 'anna.nguyen2024@example.com' },
                notes: '',
                specialRequirements: 'Flexible hours'
            },
            {
                firstName: 'Emma',
                lastName: 'Patel',
                role: 'Administrator',
                email: 'emma.patel2024@prison.gov',
                phone: '9123456788',
                hireDate: new Date('2020-11-05'),
                prisonId: prison._id,
                department: 'administration',
                employeeId: 'ST-2024-105',
                employmentType: 'full_time',
                salary: 56000,
                education: 'master',
                certifications: ['Security Clearance'],
                emergencyContact: { name: 'Raj Patel', relationship: 'Husband', phone: '9123456789', email: 'raj.patel2024@example.com' },
                notes: 'Manages staff schedules',
                specialRequirements: ''
            },
            {
                firstName: 'Frank',
                lastName: 'Garcia',
                role: 'Security Officer',
                email: 'frank.garcia2024@prison.gov',
                phone: '9123456790',
                hireDate: new Date('2022-09-12'),
                prisonId: prison._id,
                department: 'security',
                employeeId: 'ST-2024-106',
                employmentType: 'temporary',
                salary: 26000,
                education: 'associate',
                certifications: ['First Aid', 'Security Clearance'],
                emergencyContact: { name: 'Maria Garcia', relationship: 'Mother', phone: '9123456791', email: 'maria.garcia2024@example.com' },
                notes: '',
                specialRequirements: 'Night shifts only'
            },
            {
                firstName: 'Grace',
                lastName: 'Martinez',
                role: 'Counselor',
                email: 'grace.martinez2024@prison.gov',
                phone: '9123456792',
                hireDate: new Date('2021-05-18'),
                prisonId: prison._id,
                department: 'mental_health',
                employeeId: 'ST-2024-107',
                employmentType: 'full_time',
                salary: 49000,
                education: 'master',
                certifications: ['Specialized Training', 'CPR'],
                emergencyContact: { name: 'Luis Martinez', relationship: 'Husband', phone: '9123456793', email: 'luis.martinez2024@example.com' },
                notes: '',
                specialRequirements: ''
            },
            {
                firstName: 'Hannah',
                lastName: 'Lopez',
                role: 'Correctional Officer',
                email: 'hannah.lopez2024@prison.gov',
                phone: '9123456794',
                hireDate: new Date('2023-06-30'),
                prisonId: prison._id,
                department: 'security',
                employeeId: 'ST-2024-108',
                employmentType: 'part_time',
                salary: 33000,
                education: 'bachelor',
                certifications: ['First Aid'],
                emergencyContact: { name: 'Sophia Lopez', relationship: 'Sister', phone: '9123456795', email: 'sophia.lopez2024@example.com' },
                notes: '',
                specialRequirements: 'Prefers morning shifts'
            },
            {
                firstName: 'Ian',
                lastName: 'Clark',
                role: 'Security Officer',
                email: 'ian.clark2024@prison.gov',
                phone: '9123456796',
                hireDate: new Date('2018-10-22'),
                prisonId: prison._id,
                department: 'security',
                employeeId: 'ST-2024-109',
                employmentType: 'full_time',
                salary: 48000,
                education: 'high_school',
                certifications: ['Security Clearance'],
                emergencyContact: { name: 'Linda Clark', relationship: 'Wife', phone: '9123456797', email: 'linda.clark2024@example.com' },
                notes: '',
                specialRequirements: ''
            }
        ];

        // Insert new staff data
        await Staff.insertMany(newStaff);
        console.log('New staff data seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding new staff data:', error);
        process.exit(1);
    }
});
