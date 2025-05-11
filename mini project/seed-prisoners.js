const mongoose = require('mongoose');
require('dotenv').config();

const Prison = require('./models/Prison');
const Prisoner = require('./models/Prisoner');

const prisoners = [
    {
        firstName: 'John',
        lastName: 'Smith',
        dateOfBirth: '1985-06-15',
        gender: 'male',
        nationality: 'American',
        prisonerId: 'P001',
        crime: 'Armed Robbery',
        sentence: '10 years',
        sentenceStartDate: '2023-01-15',
        caseNumber: 'CR-2023-001',
        block: 'B',
        cellNumber: '101',
        securityLevel: 'maximum',
        specialRequirements: ['protection'],
        medicalConditions: 'Hypertension',
        notes: 'High-risk prisoner, requires constant monitoring'
    },
    {
        firstName: 'Maria',
        lastName: 'Garcia',
        dateOfBirth: '1990-03-22',
        gender: 'female',
        nationality: 'Mexican',
        prisonerId: 'P002',
        crime: 'Drug Trafficking',
        sentence: '15 years',
        sentenceStartDate: '2023-02-10',
        caseNumber: 'CR-2023-002',
        block: 'A',
        cellNumber: '205',
        securityLevel: 'maximum',
        specialRequirements: ['medical'],
        medicalConditions: 'Diabetes Type 2',
        notes: 'Participating in rehabilitation program'
    },
    {
        firstName: 'James',
        lastName: 'Wilson',
        dateOfBirth: '1978-11-30',
        gender: 'male',
        nationality: 'British',
        prisonerId: 'P003',
        crime: 'Fraud',
        sentence: '8 years',
        sentenceStartDate: '2023-03-05',
        caseNumber: 'CR-2023-003',
        block: 'C',
        cellNumber: '302',
        securityLevel: 'medium',
        specialRequirements: [],
        medicalConditions: '',
        notes: 'Cooperative prisoner, good behavior'
    },
    {
        firstName: 'Sarah',
        lastName: 'Johnson',
        dateOfBirth: '1992-08-14',
        gender: 'female',
        nationality: 'Canadian',
        prisonerId: 'P004',
        crime: 'Identity Theft',
        sentence: '5 years',
        sentenceStartDate: '2023-04-20',
        caseNumber: 'CR-2023-004',
        block: 'C',
        cellNumber: '401',
        securityLevel: 'medium',
        specialRequirements: ['psychiatric'],
        medicalConditions: 'Anxiety Disorder',
        notes: 'Receiving psychological counseling'
    },
    {
        firstName: 'Michael',
        lastName: 'Brown',
        dateOfBirth: '1982-04-18',
        gender: 'male',
        nationality: 'American',
        prisonerId: 'P005',
        crime: 'Assault',
        sentence: '12 years',
        sentenceStartDate: '2023-05-12',
        caseNumber: 'CR-2023-005',
        block: 'B',
        cellNumber: '503',
        securityLevel: 'maximum',
        specialRequirements: ['isolation'],
        medicalConditions: '',
        notes: 'Violent tendencies, requires isolation'
    },
    {
        firstName: 'Emma',
        lastName: 'Martinez',
        dateOfBirth: '1995-09-25',
        gender: 'female',
        nationality: 'Spanish',
        prisonerId: 'P006',
        crime: 'Embezzlement',
        sentence: '7 years',
        sentenceStartDate: '2023-06-01',
        caseNumber: 'CR-2023-006',
        block: 'A',
        cellNumber: '601',
        securityLevel: 'medium',
        specialRequirements: [],
        medicalConditions: '',
        notes: 'Former accountant, participating in vocational training'
    },
    {
        firstName: 'David',
        lastName: 'Lee',
        dateOfBirth: '1988-12-03',
        gender: 'male',
        nationality: 'Chinese',
        prisonerId: 'P007',
        crime: 'Cyber Crime',
        sentence: '6 years',
        sentenceStartDate: '2023-07-15',
        caseNumber: 'CR-2023-007',
        block: 'C',
        cellNumber: '702',
        securityLevel: 'medium',
        specialRequirements: [],
        medicalConditions: '',
        notes: 'Computer skills, assisting in prison IT department'
    },
    {
        firstName: 'Sophia',
        lastName: 'Anderson',
        dateOfBirth: '1993-07-19',
        gender: 'female',
        nationality: 'Swedish',
        prisonerId: 'P008',
        crime: 'Money Laundering',
        sentence: '9 years',
        sentenceStartDate: '2023-08-22',
        caseNumber: 'CR-2023-008',
        block: 'A',
        cellNumber: '803',
        securityLevel: 'maximum',
        specialRequirements: ['medical'],
        medicalConditions: 'Asthma',
        notes: 'Former banker, teaching financial literacy classes'
    },
    {
        firstName: 'Robert',
        lastName: 'Taylor',
        dateOfBirth: '1975-05-28',
        gender: 'male',
        nationality: 'Australian',
        prisonerId: 'P009',
        crime: 'Murder',
        sentence: '25 years',
        sentenceStartDate: '2023-09-10',
        caseNumber: 'CR-2023-009',
        block: 'B',
        cellNumber: '904',
        securityLevel: 'maximum',
        specialRequirements: ['isolation', 'psychiatric'],
        medicalConditions: 'Depression',
        notes: 'Life sentence, maximum security protocols'
    },
    {
        firstName: 'Olivia',
        lastName: 'Patel',
        dateOfBirth: '1991-01-07',
        gender: 'female',
        nationality: 'Indian',
        prisonerId: 'P010',
        crime: 'Human Trafficking',
        sentence: '20 years',
        sentenceStartDate: '2023-10-05',
        caseNumber: 'CR-2023-010',
        block: 'B',
        cellNumber: '1001',
        securityLevel: 'maximum',
        specialRequirements: ['protection'],
        medicalConditions: '',
        notes: 'High-profile case, requires special protection'
    }
];

async function seedPrisoners() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prison_management', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    try {
        const prison = await Prison.findOne();
        if (!prison) throw new Error('No prison found in the database. Please add a prison first.');
        const prisonId = prison._id;
        
        // Add prisonId to each prisoner
        const prisonersWithPrisonId = prisoners.map(p => ({
            ...p,
            prisonId
        }));
        
        await Prisoner.deleteMany({});
        console.log('Cleared existing prisoners');
        await Prisoner.insertMany(prisonersWithPrisonId);
        console.log('Successfully seeded 10 prisoners');
    } catch (error) {
        console.error('Error seeding prisoners:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

seedPrisoners(); 