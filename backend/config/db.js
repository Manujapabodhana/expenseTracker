const mongoose = require('mongoose');

const connectDB = async () => {
    const maxRetries = 3;
    let retryCount = 0;
    
    // Define connection options
    const connectionOptions = {
        serverSelectionTimeoutMS: 10000, // 10 seconds timeout
        socketTimeoutMS: 30000, // 30 seconds socket timeout
        connectTimeoutMS: 20000, // 20 seconds connection timeout
        maxPoolSize: 10, // Maintain up to 10 socket connections
        retryWrites: true
    };

    // Try Atlas first, then local fallback
    const connectionStrings = [
        process.env.MONGO_URI, // Atlas connection
        'mongodb://localhost:27017/expenseTracker' // Local fallback
    ];

    for (const mongoUri of connectionStrings) {
        if (!mongoUri) continue;
        
        retryCount = 0;
        const isAtlas = mongoUri.includes('mongodb+srv') || mongoUri.includes('mongodb.net');
        const dbType = isAtlas ? 'MongoDB Atlas' : 'Local MongoDB';
        
        while (retryCount < maxRetries) {
            try {
                console.log(`🔄 Attempting to connect to ${dbType}... (Attempt ${retryCount + 1}/${maxRetries})`);
                console.log(`🔗 Connection: ${isAtlas ? 'Atlas Cloud' : 'localhost:27017'}`);
                
                const conn = await mongoose.connect(mongoUri, connectionOptions);
                
                console.log(`✅ ${dbType} connected successfully!`);
                console.log(`🌐 Host: ${conn.connection.host}`);
                console.log(`📊 Database: ${conn.connection.name}`);
                console.log(`🔌 Connection state: ${conn.connection.readyState}`);
                console.log(`⚡ Using ${dbType} on attempt ${retryCount + 1}`);
                
                return; // Success - exit function
                
            } catch (err) {
                retryCount++;
                console.error(`❌ ${dbType} connection attempt ${retryCount} failed:`);
                console.error('📋 Error type:', err.name);
                console.error('💬 Error message:', err.message);
                
                if (err.message.includes('ENOTFOUND')) {
                    console.error('🌐 DNS Resolution Issue - Network or Atlas access problem');
                } else if (err.message.includes('bad auth')) {
                    console.error('🔐 Authentication Issue - Check username/password');
                } else if (err.message.includes('ECONNREFUSED')) {
                    console.error('🚫 Connection refused - MongoDB server not running');
                }
                
                if (retryCount < maxRetries) {
                    console.log(`⏳ Retrying ${dbType} in 2 seconds... (${maxRetries - retryCount} attempts remaining)`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    console.log(`⚠️ Failed to connect to ${dbType} after ${maxRetries} attempts`);
                    if (isAtlas) {
                        console.log('💡 Tip: Check your IP is whitelisted in Atlas Network Access');
                        console.log('🔗 Your public IP: Run "curl ipinfo.io/ip" to get it');
                    }
                }
            }
        }
    }
    
    // If we reach here, all connections failed
    console.error('🚫 Failed to connect to any MongoDB instance');
    console.error('💡 Options to fix:');
    console.error('   1. Whitelist your IP in MongoDB Atlas');
    console.error('   2. Install local MongoDB: https://www.mongodb.com/try/download/community');
    console.error('   3. Check your internet connection');
    console.log('⚠️ Server will continue without database (limited functionality)');
};

module.exports = connectDB;