-- Create the database
CREATE DATABASE IF NOT EXISTS auroradb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create the user and grant privileges
CREATE USER IF NOT EXISTS 'aurora'@'localhost' IDENTIFIED BY 'Dja1ng@o12';
GRANT ALL PRIVILEGES ON auroradb.* TO 'aurora'@'localhost';
FLUSH PRIVILEGES;

-- Use the database
USE auroradb;

-- Create tables (Django will handle this, but we can create them manually if needed)
-- The tables will be created by Django migrations 