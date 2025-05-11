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
        // Clear existing admin data
        await Admin.deleteMany({});
        
        // Create test admin accounts
        const admins = await Admin.create([
            {
                adminId: 'ADMIN001',
                password: 'admin123',
                name: 'John Smith',
                email: 'john.smith@prison.gov',
                role: 'super_admin'
            },
            {
                adminId: 'ADMIN002',
                password: 'admin456',
                name: 'Sarah Johnson',
                email: 'sarah.johnson@prison.gov',
                role: 'admin'
            },
            {
                adminId: 'ADMIN003',
                password: 'admin789',
                name: 'Michael Brown',
                email: 'michael.brown@prison.gov',
                role: 'admin'
            }
        ]);
        
        console.log('Admin data seeded successfully');
        console.log('Created admins:', admins.map(admin => ({
            adminId: admin.adminId,
            name: admin.name,
            email: admin.email,
            role: admin.role
        })));
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin data:', error);
        process.exit(1);
    }
}); 