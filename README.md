# 🎫 Online Event Ticketing System

A full-stack web application designed to streamline the process of browsing, booking, and managing tickets for events. The system supports role-based access control with distinct functionalities for Standard Users, Event Organizers, and System Administrators.

## 🌟 Features

### For Standard Users
- 📅 Browse and search available events
- 🎟️ Book tickets for events
- 📜 View booking history
- 👤 Manage user profile
- 🔐 Secure authentication and authorization

### For Event Organizers
- ➕ Create and manage events
- ✏️ Edit and delete own events
- 📊 View analytics for their events
- 📈 Track ticket sales and attendance
- 🎯 Manage event capacity and pricing

### For System Administrators
- 👥 Full user management (create, edit, delete users)
- 🎭 Complete event management across all organizers
- 📊 System-wide analytics and reporting
- 🛡️ Role-based access control management

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19.1.0
- **Build Tool:** Vite 6.3.5
- **Routing:** React Router DOM 7.6.0
- **Styling:** Bootstrap 5.3.6
- **Charts:** Chart.js 4.4.9 & React-ChartJS-2 5.3.0
- **HTTP Client:** Axios 1.9.0
- **Notifications:** React-Toastify 11.0.5

### Backend
- **Runtime:** Node.js
- **Framework:** Express 5.1.0
- **Database:** MongoDB with Mongoose 8.13.2
- **Authentication:** JSON Web Tokens (JWT) 9.0.2
- **Password Encryption:** bcryptjs 3.0.2
- **Email Service:** Nodemailer 7.0.3
- **CORS:** CORS 2.8.5
- **Environment Variables:** dotenv 16.4.7

## 📁 Project Structure

```
SE-Project-1/
├── backend/
│   ├── Controllers/           # Business logic controllers
│   │   ├── bookingController.js
│   │   ├── eventController.js
│   │   └── userController.js
│   ├── Models/                # Database models
│   │   ├── Booking.js
│   │   ├── Event.js
│   │   ├── User.js
│   │   └── connection.js
│   ├── Routes/                # API routes
│   │   ├── booking.js
│   │   ├── event.js
│   │   └── user.js
│   ├── Middleware/            # Custom middleware
│   │   ├── authenticationMiddleware.js
│   │   └── authorizationMiddleware.js
│   ├── app.js                 # Express app configuration
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/        # Reusable components
    │   │   ├── auth/          # Authentication forms
    │   │   ├── common/        # Shared components
    │   │   ├── layout/        # Layout components
    │   │   └── routes/        # Route guards
    │   ├── pages/             # Page components
    │   │   ├── admin/         # Admin dashboard pages
    │   │   └── ...
    │   ├── context/           # React context providers
    │   ├── services/          # API service layer
    │   ├── CSSmodules/        # Component styles
    │   └── assets/            # Static assets
    ├── index.html
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Fatma1796/SE-Project.git
   cd SE-Project-1
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Set up Backend**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   ORIGIN=http://localhost:5173
   EMAIL_HOST=your_email_host
   EMAIL_PORT=your_email_port
   EMAIL_USER=your_email_address
   EMAIL_PASS=your_email_password
   ```

4. **Set up Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

   Create a `.env` file in the frontend directory (if needed):
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

### Running the Application

#### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
The backend server will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

#### Production Build

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Preview Production Build:**
```bash
npm run preview
```

## 📝 API Endpoints

### Authentication
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `POST /api/v1/users/forgot-password` - Password recovery

### Events
- `GET /api/v1/events` - Get all events
- `GET /api/v1/events/:id` - Get event by ID
- `POST /api/v1/events` - Create new event (Organizer/Admin)
- `PUT /api/v1/events/:id` - Update event (Organizer/Admin)
- `DELETE /api/v1/events/:id` - Delete event (Organizer/Admin)

### Bookings
- `GET /api/v1/bookings` - Get user bookings
- `GET /api/v1/bookings/:id` - Get booking by ID
- `POST /api/v1/bookings` - Create new booking
- `DELETE /api/v1/bookings/:id` - Cancel booking

### Users (Admin)
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

## 🔐 User Roles

| Role | Permissions |
|------|-------------|
| **User** | Browse events, book tickets, view own bookings, manage profile |
| **Organizer** | All User permissions + Create/manage events, view event analytics |
| **Admin** | Full system access, manage all users and events |

## 🎨 Key Features Implementation

### Authentication & Authorization
- JWT-based authentication with HTTP-only cookies
- Role-based access control middleware
- Protected routes on both frontend and backend
- Secure password hashing with bcryptjs

### Event Management
- Rich event creation with details, pricing, and capacity
- Image upload support
- Real-time availability tracking
- Event analytics with Chart.js visualizations

### Booking System
- Seamless ticket booking flow
- Real-time capacity validation
- Booking confirmation emails
- Booking history with detailed views

### Admin Dashboard
- User management interface
- Event management across all organizers
- System-wide analytics
- Comprehensive data tables

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Project Repository: [SE-Project](https://github.com/Fatma1796/SE-Project)

## 📧 Support

For support and queries, please open an issue in the GitHub repository.

## 🙏 Acknowledgments

- Built as part of Software Engineering coursework
- Thanks to all contributors and instructors
- Inspired by modern event ticketing platforms

---

⭐ If you find this project useful, please consider giving it a star on GitHub!
