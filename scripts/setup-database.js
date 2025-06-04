import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function setupDatabase() {
  console.log('Setting up database...');
  
  try {
    // First connect without database to create it if it doesn't exist
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    console.log('Connected to MySQL server');
    
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'opportunity_center'}`);
    console.log(`Database '${process.env.DB_NAME || 'opportunity_center'}' created or already exists`);
    
    // Close initial connection
    await connection.end();
    
    // Connect with database selected
    const dbConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'opportunity_center',
      port: process.env.DB_PORT || 3306
    });
    
    console.log('Connected to database');
    
    // Create tables
    await createTables(dbConnection);
    
    // Create admin user if it doesn't exist
    await createAdminUser(dbConnection);
    
    // Create sample categories if they don't exist
    await createSampleCategories(dbConnection);
    
    // Setup default settings
    await setupDefaultSettings(dbConnection);
    
    // Close connection
    await dbConnection.end();
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

async function createTables(connection) {
  console.log('Creating tables...');
  
  // Create users table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'editor') NOT NULL DEFAULT 'editor',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  
  // Create categories table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  
  // Create posts table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      excerpt TEXT,
      content TEXT NOT NULL,
      featured_image VARCHAR(255),
      author_id INT NOT NULL,
      category_id INT NOT NULL,
      status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
      meta_title VARCHAR(255),
      meta_description TEXT,
      canonical_url VARCHAR(255),
      schema_json TEXT,
      published_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )
  `);
  
  // Create tags table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS tags (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      slug VARCHAR(50) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create post_tags (junction table)
  await connection.query(`
    CREATE TABLE IF NOT EXISTS post_tags (
      post_id INT NOT NULL,
      tag_id INT NOT NULL,
      PRIMARY KEY (post_id, tag_id),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    )
  `);
  
  // Create settings table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      key_name VARCHAR(100) NOT NULL UNIQUE,
      value TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  
  console.log('Tables created successfully');
}

async function createAdminUser(connection) {
  console.log('Setting up admin user...');
  
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'securepassword';
  
  // Check if admin user already exists
  const [existingUsers] = await connection.query(
    'SELECT * FROM users WHERE email = ?', 
    [adminEmail]
  );
  
  if (existingUsers.length === 0) {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    // Create admin user
    await connection.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin User', adminEmail, hashedPassword, 'admin']
    );
    
    console.log(`Admin user created with email: ${adminEmail}`);
  } else {
    console.log('Admin user already exists, skipping creation');
  }
}

async function createSampleCategories(connection) {
  console.log('Setting up sample categories...');
  
  const categories = [
    { name: 'Scholarships', slug: 'scholarships', description: 'Educational funding opportunities in the USA and Europe' },
    { name: 'Jobs', slug: 'jobs', description: 'Career opportunities and job openings in the USA and Europe' },
    { name: 'Internships', slug: 'internships', description: 'Internship programs and opportunities for students and graduates' },
    { name: 'Loans & Funding', slug: 'loans-funding', description: 'Educational and business loan opportunities and funding schemes' },
    { name: 'Online Earning', slug: 'online-earning', description: 'Ways to earn money online and remote work opportunities' },
  ];
  
  for (const category of categories) {
    // Check if category already exists
    const [existingCategories] = await connection.query(
      'SELECT * FROM categories WHERE slug = ?',
      [category.slug]
    );
    
    if (existingCategories.length === 0) {
      // Create category
      await connection.query(
        'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
        [category.name, category.slug, category.description]
      );
      
      console.log(`Category created: ${category.name}`);
    } else {
      console.log(`Category '${category.name}' already exists, skipping creation`);
    }
  }
}

// Default site settings
async function setupDefaultSettings(connection) {
  const settings = [
    { key: 'site_title', value: 'OpportunityCenter' },
    { key: 'site_description', value: 'Your gateway to scholarships, jobs, internships, and funding opportunities in the USA and Europe' },
    { key: 'site_keywords', value: 'scholarships, jobs, internships, funding, loans, online earning, USA, Europe' },
    { key: 'posts_per_page', value: '10' },
    { key: 'google_analytics', value: '' },
    { key: 'adsense_client', value: '' },
    { key: 'logo_url', value: '/images/logo.png' },
    { key: 'favicon_url', value: '/favicon.svg' },
  ];
  
  for (const setting of settings) {
    // Check if setting already exists
    const [existingSettings] = await connection.query(
      'SELECT * FROM settings WHERE key_name = ?',
      [setting.key]
    );
    
    if (existingSettings.length === 0) {
      // Create setting
      await connection.query(
        'INSERT INTO settings (key_name, value) VALUES (?, ?)',
        [setting.key, setting.value]
      );
    }
  }
}

// Run the setup
setupDatabase();