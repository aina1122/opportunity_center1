-- Database Schema for OpportunityCenter Blog

-- Create database
CREATE DATABASE IF NOT EXISTS opportunity_center;
USE opportunity_center;

-- Users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  role ENUM('admin', 'editor', 'author') NOT NULL DEFAULT 'author',
  profile_image VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL
);

-- Categories for blog posts
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(60) NOT NULL UNIQUE,
  description TEXT,
  meta_title VARCHAR(100),
  meta_description VARCHAR(160),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  excerpt TEXT,
  content LONGTEXT NOT NULL,
  featured_image VARCHAR(255),
  author_id INT NOT NULL,
  category_id INT,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  published_at TIMESTAMP NULL,
  meta_title VARCHAR(100),
  meta_description VARCHAR(160),
  canonical_url VARCHAR(255),
  featured BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,
  reading_time INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Tags for blog posts
CREATE TABLE IF NOT EXISTS tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(60) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Post tags relationship (many-to-many)
CREATE TABLE IF NOT EXISTS post_tags (
  post_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- SEO schema data for blog posts
CREATE TABLE IF NOT EXISTS post_schema (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL UNIQUE,
  schema_type VARCHAR(50) NOT NULL DEFAULT 'Article',
  schema_data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Media library
CREATE TABLE IF NOT EXISTS media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size INT NOT NULL,
  alt_text VARCHAR(255),
  title VARCHAR(255),
  caption TEXT,
  uploaded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Settings table for global site configuration
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Page content for static pages (about, contact, privacy policy, etc.)
CREATE TABLE IF NOT EXISTS pages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  content LONGTEXT NOT NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  meta_title VARCHAR(100),
  meta_description VARCHAR(160),
  featured_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
('Scholarships', 'scholarships', 'Educational funding opportunities in USA and Europe'),
('Jobs', 'jobs', 'Career opportunities in USA and Europe'),
('Internships', 'internships', 'Internship programs in USA and Europe'),
('Loan Schemes', 'loan-schemes', 'Educational and business loan opportunities'),
('Earning Methods', 'earning-methods', 'Ways to earn money online and offline');

-- Insert initial admin user (password: admin123 - change this immediately)
INSERT INTO users (username, email, password, full_name, role) VALUES
('admin', 'admin@opportunitycenter.site', '$2b$10$rIC/WGUzf47LSy1wFRUVZuN30fgQTUJVbBqLLMwDsLnFOoHIcxOAC', 'Site Administrator', 'admin');

-- Insert initial settings
INSERT INTO settings (setting_key, setting_value) VALUES
('site_title', 'OpportunityCenter - Scholarships, Jobs, and Internships in USA & Europe'),
('site_description', 'Discover scholarships, jobs, internships, loan schemes, and earning methods in USA and Europe.'),
('logo_url', '/images/logo.png'),
('favicon_url', '/favicon.svg'),
('social_twitter', 'https://twitter.com/opportunitycenter'),
('social_facebook', 'https://facebook.com/opportunitycenter'),
('social_instagram', 'https://instagram.com/opportunitycenter'),
('contact_email', 'contact@opportunitycenter.site'),
('adsense_client_id', ''),
('adsense_slot_header', ''),
('adsense_slot_sidebar', ''),
('adsense_slot_in_article', '');