#!/bin/bash

# Start MySQL if not running
if ! pgrep -x mysqld > /dev/null; then
    echo "Starting MySQL..."
    mkdir -p /tmp/mysql-data
    
    # Initialize MySQL if not already done
    if [ ! -d "/tmp/mysql-data/mysql" ]; then
        mysqld --initialize-insecure --datadir=/tmp/mysql-data
    fi
    
    # Start MySQL daemon
    mysqld_safe --datadir=/tmp/mysql-data --socket=/tmp/mysql.sock --pid-file=/tmp/mysql.pid --log-error=/tmp/mysql.log &
    
    # Wait for MySQL to start
    sleep 5
    
    # Create database and tables
    mysql --socket=/tmp/mysql.sock -u root -e "
    CREATE DATABASE IF NOT EXISTS store_ratings;
    USE store_ratings;
    
    CREATE TABLE IF NOT EXISTS roles (
        id INT PRIMARY KEY,
        name VARCHAR(20) NOT NULL UNIQUE
    );
    
    CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        address TEXT,
        password VARCHAR(255) NOT NULL,
        role_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id)
    );
    
    CREATE TABLE IF NOT EXISTS stores (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(100),
        address TEXT NOT NULL,
        owner_user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_user_id) REFERENCES users(id)
    );
    
    CREATE TABLE IF NOT EXISTS ratings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        store_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (store_id) REFERENCES stores(id),
        UNIQUE KEY unique_user_store (user_id, store_id)
    );
    
    INSERT IGNORE INTO roles (id, name) VALUES 
    (1, 'ADMIN'),
    (2, 'USER'), 
    (3, 'OWNER');
    "
    echo "Database initialized"
fi

# Set environment variables for local MySQL
export DB_HOST=localhost
export DB_USER=root
export DB_PASS=
export DB_NAME=store_ratings

# Start the backend server
echo "Starting backend server..."
node src/server.js