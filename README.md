# Store Rating App

A web application for rating and reviewing stores.

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file by copying the example:

   ```bash
   cp env.example .env
   ```

4. Update the `.env` file with your JWT secret:

   ```
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`

## Features

- User registration and login
- Store rating and review system
- Admin dashboard for managing users
- Owner dashboard for store management
- User dashboard for viewing and managing reviews

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Authentication**: JWT
