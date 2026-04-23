# Student Support Ticket System

A full-stack web application that allows students to submit support requests/complains and staff members to manage and resolve them. The system includes user authentication, ticket tracking, AI powered assistant and AI analysis engine .

## Overview

This project is a student support system that allows users to submit and manage support requests. In addition to standard ticketing functionality, the system includes AI-assisted tools that help students write clearer requests and assist staff in quickly analysing and prioritising issues.

The application consists of a Node.js and Express backend with a MongoDB database, and a React frontend for user interaction.

## Features

- User registration and login with secure password hashing
- Role-based access (student and staff)

Student functionality:
- Submit support tickets
- View personal ticket history
- Automatically format requests into a professional message using an AI-style helper

Staff functionality:
- View all submitted tickets
- Filter tickets by category
- Search tickets by student name or subject
- Mark tickets as resolved with note

AI-assisted features:
- Automatic formalization of student requests into structured, professional messages
- Basic issue analysis tool for staff that Assigns priority levels (e.g. urgent, medium, low)

- Ticket status tracking (Pending / Resolved)
- Categorization (General, Accommodation, Teaching, Facilities)

## Tech Stack

Backend:

* Node.js
* Express
* MongoDB with Mongoose
* bcryptjs for password hashing

Frontend:

* React
* Axios

## Project Structure

```
project-root/
├── backend/
 ├── models/
│   ├── User.js
│   └── Ticket.js
├── server.js
│
│
├── frontend
 ├── src/
│   ├── App.js
│   ├── Dashboard.js
│   ├── AdminDashboard.js
│   ├── Login.js
│   ├── Register.js
│   └── StaffLogin.js
│
├── package.json3
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```
git clone https://github.com/your-username/student-support-system.git
cd student-support-system
```

### 2. Install backend dependencies

```
npm install
```

### 3. Install frontend dependencies

install dependencies:

```

npm install
```

### 4. Start MongoDB

Ensure MongoDB is running locally at:

```
mongodb://127.0.0.1:27017/studentSupport
```

### 5. Run the backend server

```
node server.js
```

The backend runs on:

```
http://localhost:3001
```

### 6. Run the frontend


```
npm start
```

The frontend runs on:

```
http://localhost:3000
```

## API Endpoints

### Authentication

POST /register
Creates a new user account.

POST /login
Authenticates a user and returns user data.

### Tickets

POST /tickets
Creates a new support ticket.

GET /tickets
Retrieves all tickets.

GET /tickets/user/:userId
Retrieves tickets for a specific user.

PUT /tickets/:id/resolve
Marks a ticket as resolved and updates its status.

## User Roles

Student:

* Can register and log in
* Can create tickets
* Can view their own tickets

Staff:

* Can access the admin dashboard
* Can view all tickets
* Can filter and search tickets
* Can resolve tickets and add notes

## Notes

* Passwords are securely hashed using bcrypt before storage.
* Access to staff features is controlled on the frontend based on user role.

## Future Improvements

* Add backend authorization middleware
* Improve input validation and error handling
* Enhance UI/UX design
* Add email notifications for ticket updates
* Store and manage AI-generated summaries more robustly

