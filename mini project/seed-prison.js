const mongoose = require('mongoose');
require('dotenv').config();

const Prison = require('./models/Prison');

const prison = {
    name: 'Central State Penitentiary',
    location: '123 Prison Road, State City, ST 12345',
    capacity: 1000,
    securityLevel: 'Maximum',
    type: 'State',
    establishedYear: 1980,
    warden: 'John Smith',
    contactNumber: '555-0123',
    email: 'csp@state.gov',
    facilities: ['Medical Wing', 'Library', 'Recreation Area', 'Visitation Center'],
    status: 'Active'
};

async function seedPrison() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prison_management', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    try {
        await Prison.deleteMany({});
        console.log('Cleared existing prisons');
        await Prison.create(prison);
        console.log('Successfully seeded prison');
    } catch (error) {
        console.error('Error seeding prison:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

seedPrison();
