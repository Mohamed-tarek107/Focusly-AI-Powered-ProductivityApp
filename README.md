# Focusly - AI-Powered Productivity App

<div align="center">

![Focusly](https://img.shields.io/badge/Focusly-AI%20Productivity-blue?style=for-the-badge)
![Angular](https://img.shields.io/badge/Angular-20.3.0-red?style=flat-square&logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange?style=flat-square&logo=mysql)
![Gemini AI API](https://img.shields.io/badge/Gemini-AI-purple?style=flat-square)

**A modern, intelligent productivity application powered by Google Gemini AI**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Project Structure](#-project-structure)

</div>

---

## 📋 Overview

**Focusly** is a comprehensive productivity application that combines task management, intelligent AI assistance, and data-driven insights to help users maximize their efficiency. Built with a modern Angular frontend and Node.js backend, it features an AI-powered assistant that helps with productivity planning, study techniques, and work organization.

## ✨ Features

### 🎯 Core Functionality
- **User Authentication** - Secure registration, login, and password recovery with JWT tokens
- **Task Management** - Create, update, delete, and organize tasks with priorities and deadlines
- **AI Assistant** - Powered by Google Gemini AI for productivity guidance and study support
- **Dashboard Analytics** - Real-time visual productivity charts and completion statistics
- **Calendar Integration** - View tasks and deadlines in an interactive calendar
- **Account Settings** - Customize your profile and preferences
- **Help Desk & Feedback** - Submit feedback and rate the application
- **Email Notifications** - Password reset and account verification via email

### 🤖 AI Assistant Capabilities
- Productivity & time management guidance
- Scientific question answering
- Study techniques & organization tips
- Work planning & optimization
- Lifestyle habits for productivity

### 📊 Dashboard Features
- **Real-time Charts** - Live updating productivity and completion charts using Chart.js
- Weekly productivity bar charts with automatic data refresh
- Task completion pie charts with real-time statistics
- Progress tracking with dynamic percentage calculations
- Upcoming work overview with priority indicators
- Interactive calendar view with deadline indicators
- Weekly activity statistics (Total, Completed, In Progress tasks)

## 🛠 Tech Stack

### Frontend
- **Angular 20.3.0** - Modern TypeScript framework
- **Chart.js** - Data visualization
- **RxJS** - Reactive programming
- **TypeScript** - Type-safe development

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Relational database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Nodemailer** - Email functionality

### AI & Services
- **Google Gemini AI (gemini-2.5-flash)** - Intelligent assistant
- **Express Rate Limiting** - API protection
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MySQL Server
- npm or yarn
- Google Gemini API Key

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the `backend` directory:
   ```env
   DBPass=your_mysql_password
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

4. **Set up MySQL database**
   ```sql
   CREATE DATABASE productivity_app;
   ```
   (You'll need to create the tables based on your schema)

5. **Start the backend server**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend/Angular
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   Application runs on `http://localhost:4200`

## 🚀 Usage

### Getting Started

1. **Register a new account** or **login** with existing credentials
2. **Navigate to Dashboard** to see your productivity overview with real-time charts
3. **Create tasks** in the Tasks section with priorities and deadlines
4. **Watch charts update automatically** as you complete tasks - no page refresh needed!
5. **Interact with AI Assistant** for productivity tips and study help
6. **View analytics** on the Dashboard to track your progress
7. **Use the calendar** to see upcoming deadlines at a glance
8. **Submit feedback** in the Help Desk section to help improve the app

### AI Assistant Commands

- **Create Task**: "Create a task called 'Study Math' due on 25-12-2024"
- **View Today's Tasks**: "What do I have today?" or "Show today's tasks"
- **Productivity Help**: Ask questions about time management, study techniques, or work planning

## 📁 Project Structure

```
AI-Powered-ProductivityApp/
├── backend/
│   ├── Auth/              # Authentication routes & controllers
│   ├── Tasks/             # Task management API
│   ├── Ai/                # AI assistant integration
│   ├── accountsettings/   # User settings API
│   ├── db.js              # Database connection
│   └── index.js           # Express server setup
│
├── frontend/
│   └── Angular/
│       └── src/
│           └── app/
│               ├── components/
│               │   ├── Auth/           # Login, Register, Forgot Password
│               │   ├── dashboard/       # Main dashboard with charts
│               │   ├── tasks-component/ # Task management UI
│               │   ├── AiAssistant/     # AI chat interface
│               │   ├── account-settings/# User settings
│               │   └── help-desk/      # Help & support
│               └── services/           # Angular services
│
└── README.md
```

## 🔐 Security Features

### Authentication & Authorization
- **Password Security**
  - bcryptjs hashing with salt rounds (12)
  - Password strength requirements (min 8 chars, uppercase, numbers)
  - Password confirmation validation
- **JWT Tokens**
  - Access tokens for API authentication
  - Refresh tokens stored in httpOnly cookies
  - Token expiration and refresh mechanism
  - Secure token generation and validation

### API Protection
- **Rate Limiting**
  - Login attempts: 5 requests per 15 minutes
  - Password reset: Rate-limited to prevent abuse
  - Email verification: Protected against spam
- **Input Validation**
  - express-validator for all user inputs
  - Email format validation
  - Phone number format validation
  - Name validation (letters only, length constraints)
  - SQL injection prevention through parameterized queries

### Cookie & Session Security
- HttpOnly cookies (prevents XSS attacks)
- SameSite: strict (prevents CSRF attacks)
- Secure cookie flags (configurable for production)
- Cookie expiration management

### Network Security
- CORS configuration with specific origin whitelist
- Credentials support for authenticated requests
- Allowed methods and headers restriction

### Data Protection
- MySQL parameterized queries (SQL injection prevention)
- Environment variables for sensitive data
- No sensitive data in client-side code
- Secure password reset flow with email verification

## 🎨 UI/UX Features

- **Modern, Responsive Design** - Works seamlessly on desktop and mobile devices
- **Real-time Chart Updates** - Charts automatically refresh when tasks are created or completed
- **Interactive Visualizations** - Click and hover interactions on Chart.js graphs
- **Calendar Integration** - Visual calendar with task deadline indicators
- **Real-time Task Updates** - Instant UI updates when tasks are modified
- **Clean, Intuitive Navigation** - Easy-to-use navigation bar and routing
- **Progress Indicators** - Visual progress bars and completion percentages
- **User Feedback System** - Rating and feedback collection in Help Desk
- **Email Integration** - Seamless email notifications for account management
- **Markdown Support** - Rich text rendering in AI assistant responses (DOMPurify sanitization)

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forget` - Password recovery
- `GET /api/auth/current` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### AI Assistant
- `POST /api/ai/chat` - Send message to AI assistant
- `POST /api/ai/command` - Execute AI commands (CreateTask, GetTodaysTasks)

### Account Settings
- `GET /accountSettings` - Get user settings
- `PATCH /accountSettings/editAccount` - Update user account information
- `POST /accountSettings/rating` - Submit user feedback and rating

### Authentication 
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/verify-reset` - Verify password reset token
- `POST /api/auth/reset-password` - Reset password after verification


## 👤 Author
**Mohamed Tarek**

---

<div align="center">

**Built with ❤️ using Angular & Node.js**

⭐ Star this repo if you find it helpful!

</div>
