-- ============================================================================
-- Orbito Platform - MySQL Database Schema
-- Compatible with MySQL 8.0+
-- Run with: mysql -u root -p < database_schema.sql
-- ============================================================================

CREATE DATABASE IF NOT EXISTS orbito
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE orbito;

-- 1. Users Table with Role-Based Access Control
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role ENUM('participant', 'organizer', 'admin') NOT NULL DEFAULT 'participant',
  professional_title VARCHAR(255) NULL,
  avatar_url VARCHAR(500) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(50) NULL,
  color VARCHAR(50) NULL,
  description TEXT NULL,
  INDEX idx_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Topics Table (belonging to Categories)
CREATE TABLE IF NOT EXISTS topics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  popular BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  INDEX idx_topics_category (category_id),
  INDEX idx_topics_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Workshops Table with Organizer Relation and Review Workflow
CREATE TABLE IF NOT EXISTS workshops (
  id VARCHAR(100) PRIMARY KEY,
  organizer_id INT NULL,
  organizer_name VARCHAR(255) NOT NULL,
  organizer_title VARCHAR(255) NULL,
  organizer_email VARCHAR(255) NOT NULL,
  
  title VARCHAR(255) NOT NULL,
  skill_to_teach VARCHAR(255) NOT NULL,
  
  category_id VARCHAR(100) NOT NULL,
  category_name VARCHAR(255) NOT NULL,
  
  topic_id INT NOT NULL,
  topic_name VARCHAR(255) NOT NULL,
  
  description TEXT NOT NULL,
  learning_outcomes TEXT NULL,
  
  duration_value DECIMAL(4, 1) NOT NULL DEFAULT 2.0,
  duration_unit ENUM('hours', 'days', 'weeks') NOT NULL DEFAULT 'hours',
  duration_label VARCHAR(100) NULL,
  
  skill_level ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL DEFAULT 'Beginner',
  prerequisites TEXT NULL,
  
  pricing_type ENUM('Free', 'Paid') NOT NULL DEFAULT 'Free',
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  price_label VARCHAR(50) NOT NULL DEFAULT 'Free',
  
  format ENUM('Online', 'In person', 'Hybrid') NOT NULL DEFAULT 'Online',
  online_platform VARCHAR(100) NULL,
  online_meeting_link VARCHAR(500) NULL, -- Confidential, only revealed after registration
  venue_name VARCHAR(255) NULL,
  venue_address TEXT NULL,
  
  workshop_date VARCHAR(50) NOT NULL,
  start_time VARCHAR(50) NOT NULL,
  end_time VARCHAR(50) NOT NULL,
  registration_deadline VARCHAR(50) NULL,
  max_participants INT NULL DEFAULT 30,
  
  cover_image_url VARCHAR(500) NULL,
  
  -- Workflow Status: Draft, Pending Review, Published, Rejected
  status ENUM('Draft', 'Pending Review', 'Published', 'Rejected') NOT NULL DEFAULT 'Pending Review',
  admin_notes TEXT NULL,
  
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE RESTRICT,
  
  INDEX idx_workshops_status (status),
  INDEX idx_workshops_category (category_id),
  INDEX idx_workshops_topic (topic_id),
  INDEX idx_workshops_organizer (organizer_id),
  INDEX idx_workshops_date (workshop_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Certifications and Evidence Documents Table
CREATE TABLE IF NOT EXISTS certifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  workshop_id VARCHAR(100) NULL,
  organizer_id INT NOT NULL,
  
  skills_summary TEXT NULL,
  certification_name VARCHAR(255) NULL,
  issuing_organization VARCHAR(255) NULL,
  year_issued VARCHAR(50) NULL,
  
  file_url VARCHAR(500) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INT NULL,
  file_type VARCHAR(50) NULL,
  
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (workshop_id) REFERENCES workshops(id) ON DELETE CASCADE,
  FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
  
  INDEX idx_cert_workshop (workshop_id),
  INDEX idx_cert_organizer (organizer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registration_id VARCHAR(100) NOT NULL UNIQUE,
  workshop_id VARCHAR(100) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(100) NULL,
  learning_goal TEXT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Confirmed',
  registered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (workshop_id) REFERENCES workshops(id) ON DELETE CASCADE,
  INDEX idx_reg_workshop (workshop_id),
  INDEX idx_reg_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
