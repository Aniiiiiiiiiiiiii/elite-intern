# Payment Reminder App

A full-stack payment reminder application built with React, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Secure JWT-based login and registration
- **Payment Reminders**: Add, view, and manage payment reminders
- **Smart Sorting**: Reminders are automatically sorted by due date
- **Visual Status Indicators**: Color-coded reminders based on urgency
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Clean UI**: Minimal, one-color design with excellent UX

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for development and building
- Tailwind CSS for styling
- React Router for navigation
- Axios for API communication
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## Project Structure

```
payment-reminder-app/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── pages/          # Page components
│   │   └── ...
│   └── ...
├── server/                 # Backend Express application
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── server.js       # Entry point
│   └── ...
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Install root dependencies:
```bash
npm run install:all
```

2. Set up environment variables:
```bash
# In server directory, copy .env.example to .env
cp server/.env.example server/.env
```

3. Update the `.env` file with your MongoDB connection string and JWT secret:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/payment-reminders
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

### Development

Start both client and server in development mode:
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Building for Production

Build the frontend for production:
```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Reminders
- `GET /api/reminders` - Get all reminders for authenticated user
- `POST /api/reminders` - Create a new reminder
- `PUT /api/reminders/:id` - Update a reminder
- `DELETE /api/reminders/:id` - Delete a reminder

## Features in Detail

### User Authentication
- Secure user registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes and API endpoints

### Payment Reminders
- Add reminders with title, amount, due date, and frequency
- Automatic sorting by due date (earliest first)
- Visual indicators for overdue, due today, and upcoming reminders
- Support for different frequencies: once, weekly, monthly, yearly

### User Experience
- Clean, minimal design with a consistent blue color scheme
- Responsive layout that works on all devices
- Loading states and error handling
- Intuitive navigation and form interactions

## Deployment

### Frontend (Vercel)
The frontend is configured for easy deployment to Vercel:
1. Build the client: `cd client && npm run build`
2. Deploy the `client/dist` folder to Vercel

### Backend
Deploy the backend to any Node.js hosting service:
1. Set up your MongoDB instance (MongoDB Atlas recommended)
2. Configure environment variables on your hosting platform
3. Deploy the `server` directory

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.