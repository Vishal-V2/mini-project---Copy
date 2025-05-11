const mongoose = require('mongoose');
const User = require('./models/User');

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
        // Clear existing visitor data
        await User.deleteMany({});
        
        // Create test visitor accounts
        const visitors = await User.create([
            {
                name: 'Rahul Sharma',
                phoneNumber: '9876543210',
                aadhaarNumber: '123456789012',
                isVerified: true
            },
            {
                name: 'Priya Patel',
                phoneNumber: '8765432109',
                aadhaarNumber: '234567890123',
                isVerified: true
            },
            {
                name: 'Amit Kumar',
                phoneNumber: '7654321098',
                aadhaarNumber: '345678901234',
                isVerified: true
            }
        ]);
        
        console.log('Visitor data seeded successfully');
        console.log('Created visitors:', visitors.map(visitor => ({
            name: visitor.name,
            phoneNumber: visitor.phoneNumber,
            aadhaarNumber: visitor.aadhaarNumber,
            isVerified: visitor.isVerified
        })));
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding visitor data:', error);
        process.exit(1);
    }
}); 