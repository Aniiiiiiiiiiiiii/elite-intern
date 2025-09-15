# Job Portal Application

A full-stack job portal application built with React (Frontend) and Node.js (Backend).

## Features

### Frontend
- Job listings with search and filters
- User authentication (register/login)
- Save/unsave jobs functionality
- Payment reminders management
- Responsive design with Tailwind CSS

### Backend
- RESTful API with Express.js
- MongoDB database with Mongoose ODM
- JWT authentication
- CORS enabled for cross-origin requests
- Protected routes for authenticated users

## Project Structure

```
/
├── client/          # React frontend (Vite)
├── server/          # Node.js backend (Express)
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally on port 27017)

### Frontend Setup
1. Navigate to client directory and install dependencies:
```bash
cd client
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup
1. Navigate to server directory and install dependencies:
```bash
cd server
npm install
```

2. Start the backend server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Jobs
- `GET /api/jobs` - Get all jobs (with pagination)
- `GET /api/jobs/search` - Search jobs by title/location
- `POST /api/jobs` - Create new job (protected)
- `PUT /api/jobs/:id` - Update job (protected)
- `DELETE /api/jobs/:id` - Delete job (protected)

### Saved Jobs
- `GET /api/saved-jobs` - Get user's saved jobs (protected)
- `POST /api/saved-jobs` - Save a job (protected)
- `DELETE /api/saved-jobs/:jobId` - Remove saved job (protected)

### Payment Reminders
- `GET /api/reminders` - Get user's reminders (protected)
- `POST /api/reminders` - Create reminder (protected)
- `PUT /api/reminders/:id` - Update reminder (protected)
- `DELETE /api/reminders/:id` - Delete reminder (protected)

## Default Users

The application comes with sample data. You can register new users or use the following test account:
- Email: test@example.com
- Password: password123

## Technologies Used

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router
- Custom components (no Radix UI)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests