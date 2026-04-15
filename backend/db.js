require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');

// Use SQLite in production (Render), PostgreSQL in development
const isProduction = process.env.NODE_ENV === 'production' || !process.env.DB_HOST;

let sequelize;

if (isProduction) {
  // SQLite configuration for production
  sequelize = new Sequelize(
    'sqlite::memory:',
    {
      dialect: 'sqlite',
      storage: path.join(__dirname, 'amazon_clone.db'),
      logging: false,
    }
  );
} else {
  // PostgreSQL configuration for development
  sequelize = new Sequelize(
    process.env.DB_NAME || 'amazonclone',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
    }
  );
}

module.exports = sequelize;
