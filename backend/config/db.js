const mongoose = require('mongoose');

const connectDB = async () => {
    const maxRetries = 5;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
        try {
            if (!process.env.MONGO_URI) {
                throw new Error('MONGO_URI environment variable is not defined');
            }
            
            console.log(`🔄 Attempting to connect to MongoDB... (Attempt ${retryCount + 1}/${maxRetries})`);
            console.log('🔗 Connection string format check...');
            
            // Add timeout and better error handling with retry logic
            const conn = await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 15000, // 15 seconds timeout
                socketTimeoutMS: 45000, // 45 seconds socket timeout
                connectTimeoutMS: 30000, // 30 seconds connection timeout
                maxPoolSize: 10, // Maintain up to 10 socket connections
                retryWrites: true
            });
            
            console.log(`✅ MongoDB connected successfully!`);
            console.log(`🌐 Host: ${conn.connection.host}`);
            console.log(`📊 Database: ${conn.connection.name}`);
            console.log(`🔌 Connection state: ${conn.connection.readyState}`);
            console.log(`⚡ Connection established on attempt ${retryCount + 1}`);
            
            // Connection successful, break out of retry loop
            break;
            
        } catch (err) {
            retryCount++;
            console.error(`❌ Connection attempt ${retryCount} failed:`);
            console.error('📋 Error type:', err.name);
            console.error('💬 Error message:', err.message);
            
            if (err.message.includes('ENOTFOUND')) {
                console.error('🌐 DNS Resolution Issue - Check your cluster URL');
            } else if (err.message.includes('bad auth')) {
                console.error('� Authentication Issue - Check username/password');
            }
            
            if (retryCount < maxRetries) {
                console.log(`⏳ Retrying in 3 seconds... (${maxRetries - retryCount} attempts remaining)`);
                await new Promise(resolve => setTimeout(resolve, 3000));
            } else {
                console.error('� Go to MongoDB Atlas → Databases → Connect → Connect your application');
                console.error('📝 Copy the exact connection string from there');
                console.log('🚫 Server cannot start without database connection');
                process.exit(1);
            }
        }
    }
};

module.exports = connectDB;
