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
                firstName: 'Rajesh',
                lastName: 'Kumar',
                dateOfBirth: new Date('1980-01-15'),
                gender: 'male',
                crime: 'Robbery',
                severityLevel: 'Medium',
                sentence: 5,
                status: 'Incarcerated',
                prisonId: prison._id,
                cellNumber: 'A-101',
                admissionDate: new Date('2023-01-01'),
                releaseDate: new Date('2028-01-01'),
                notes: 'First-time offender'
            },
            {
                firstName: 'Priya',
                lastName: 'Sharma',
                dateOfBirth: new Date('1990-05-20'),
                gender: 'female',
                crime: 'Fraud',
                severityLevel: 'Low',
                sentence: 3,
                status: 'Incarcerated',
                prisonId: prison._id,
                cellNumber: 'B-202',
                admissionDate: new Date('2023-03-15'),
                releaseDate: new Date('2026-03-15'),
                notes: 'Cooperative inmate'
            }
        ]);
        
        // Update prison population
        await Prison.findByIdAndUpdate(prison._id, {
            currentPopulation: prisoners.length
        });
        
        console.log('Test data seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}); 