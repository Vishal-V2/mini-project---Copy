const mongoose = require('mongoose');
const Admin = require('./models/Admin');

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
        // Find all admins
        const admins = await Admin.find({});
        
        if (admins.length === 0) {
            console.log('No admin data found in the database.');
        } else {
            console.log('Found', admins.length, 'admin accounts:');
            admins.forEach(admin => {
                console.log('\nAdmin Details:');
                console.log('Admin ID:', admin.adminId);
                console.log('Name:', admin.name);
                console.log('Email:', admin.email);
                console.log('Role:', admin.role);
                console.log('Created at:', admin.createdAt);
                console.log('------------------------');
            });
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error checking admin data:', error);
        process.exit(1);
    }
}); 