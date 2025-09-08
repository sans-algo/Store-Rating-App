# Store Rating Management System

## Overview

A full-stack web application for managing and rating retail stores. The system provides role-based functionality where users can search and rate stores, store owners can manage their store information and view ratings, and administrators can manage users and oversee the entire system. Built with a React frontend and Node.js backend, using MySQL for data persistence and JWT for authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with Vite for fast development and building
- **Styling**: Bootstrap 5.3 for responsive UI components and Bootstrap Icons for iconography
- **Routing**: React Router DOM for client-side navigation and multi-page functionality
- **State Management**: Built-in React state management (no external state library)
- **HTTP Client**: Axios for API communication with request interceptors for automatic JWT token attachment
- **Development Server**: Configured to run on port 5000 with host binding for container compatibility

### Backend Architecture
- **Framework**: Express.js 5 with ES modules for modern JavaScript syntax
- **Authentication**: JWT-based authentication with bcryptjs for password hashing
- **Authorization**: Role-based access control with middleware for route protection
- **Database Layer**: MySQL 2 with connection pooling for efficient database connections
- **API Structure**: RESTful API design with modular route organization
- **Environment Configuration**: dotenv for secure environment variable management
- **CORS**: Configured for cross-origin requests from frontend

### Database Design
- **Primary Database**: MySQL with connection pooling
- **User Roles**: Three-tier role system (Admin, Owner, User) with role-based permissions
- **Core Entities**: Users, Stores, Ratings, and Roles with proper foreign key relationships
- **Data Integrity**: Proper indexing and constraints to maintain referential integrity
- **Seeding**: Automatic admin user creation on server startup for initial system setup

### Authentication & Authorization
- **Token-Based Auth**: JWT tokens with 8-hour expiration for session management
- **Password Security**: bcryptjs hashing with salt for secure password storage
- **Role-Based Access**: Middleware-enforced permissions for different user types
- **Protected Routes**: Frontend and backend route protection based on user roles
- **Token Storage**: Client-side localStorage with automatic API request attachment

### API Endpoints Organization
- **Auth Routes**: User registration, login, and authentication management
- **Admin Routes**: User management, system statistics, and administrative functions
- **Store Routes**: Store listing, search functionality, and store creation
- **Rating Routes**: Rating submission and management
- **Owner Routes**: Store owner specific functionality for viewing their store's ratings

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 19 with React DOM for modern component architecture
- **Build Tools**: Vite for fast development server and optimized production builds
- **UI Framework**: Bootstrap 5.3 for responsive design and pre-built components
- **HTTP Client**: Axios for API communication with interceptor support
- **Routing**: React Router DOM for single-page application navigation
- **Development Tools**: ESLint for code quality with React-specific rules

### Backend Dependencies
- **Web Framework**: Express.js 5 for HTTP server and middleware support
- **Database**: MySQL 2 driver with promise-based connection pooling
- **Security**: bcryptjs for password hashing and JWT for token generation
- **Cross-Origin**: CORS middleware for frontend-backend communication
- **Environment**: dotenv for configuration management
- **Development**: nodemon for automatic server restart during development

### Database Requirements
- **MySQL Server**: Requires MySQL database instance with proper user permissions
- **Connection Pool**: Configured for up to 10 concurrent connections
- **Schema Requirements**: Needs tables for users, roles, stores, and ratings with proper relationships
- **Environment Variables**: Database connection details (host, user, password, database name)

### Security Considerations
- **JWT Secret**: Requires secure JWT_SECRET environment variable for token signing
- **Password Policy**: Enforced through bcryptjs hashing with salt rounds
- **CORS Configuration**: Properly configured for production deployment
- **Environment Variables**: Sensitive configuration data stored securely outside codebase