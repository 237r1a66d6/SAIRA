const { Sequelize } = require('sequelize');
const path = require('path');

// Database setup - supports both MySQL (for production) and SQLite (for development)
let sequelize;

if (process.env.DB_TYPE === 'mysql') {
    // MySQL configuration for Hostinger
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 3306,
            dialect: 'mysql',
            logging: process.env.NODE_ENV === 'development' ? console.log : false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            dialectOptions: {
                connectTimeout: 60000
            }
        }
    );
} else {
    // SQLite for local development
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: process.env.DATABASE_PATH || path.join(__dirname, '..', 'saira-acad.db'),
        logging: process.env.NODE_ENV === 'development' ? console.log : false
    });
}

const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        const dbType = process.env.DB_TYPE === 'mysql' ? 'MySQL' : 'SQLite';
        console.log(`✅ ${dbType} database connected successfully`);
        if (process.env.DB_TYPE === 'mysql') {
            console.log(`   Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}`);
        }
        
        // Sync all models
        await sequelize.sync({ alter: true });
        console.log('✅ Database tables synchronized');
        
        // Initialize default admin
        const bcrypt = require('bcryptjs');
        const Admin = require('../models/Admin');
        
        const adminCount = await Admin.count();
        if (adminCount === 0) {
            const hashedPassword = await bcrypt.hash(
                process.env.DEFAULT_ADMIN_PASSWORD || '1234567@_a', 
                10
            );
            await Admin.create({
                username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
                password: hashedPassword,
                role: 'super-admin',
                status: 'active'
            });
            console.log(`✅ Default admin created (username: ${process.env.DEFAULT_ADMIN_USERNAME || 'admin'})`);
        }
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDatabase };
