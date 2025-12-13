# Focusly - AI-Powered Productivity App

<div align="center">

![Focusly](https://img.shields.io/badge/Focusly-AI%20Productivity-blue?style=for-the-badge)
![Angular](https://img.shields.io/badge/Angular-20.3.0-red?style=flat-square&logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange?style=flat-square&logo=mysql)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-purple?style=flat-square)

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
- **Dashboard Analytics** - Visual productivity charts and completion statistics
- **Calendar Integration** - View tasks and deadlines in an interactive calendar
- **Account Settings** - Customize your profile and preferences

### 🤖 AI Assistant Capabilities
- Productivity & time management guidance
- Scientific question answering
- Study techniques & organization tips
- Work planning & optimization
- Lifestyle habits for productivity

### 📊 Dashboard Features
- Weekly productivity charts (Chart.js)
- Task completion statistics
- Progress tracking
- Upcoming work overview
- Calendar view with deadline indicators

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
2. **Navigate to Dashboard** to see your productivity overview
3. **Create tasks** in the Tasks section with priorities and deadlines
4. **Interact with AI Assistant** for productivity tips and study help
5. **View analytics** on the Dashboard to track your progress

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

- Password hashing with bcryptjs
- JWT-based authentication
- Express rate limiting
- Input validation with express-validator
- Secure cookie handling
- CORS configuration

## 🎨 UI/UX Features

- Modern, responsive design
- Interactive charts and visualizations
- Calendar integration
- Real-time task updates
- Clean, intuitive navigation

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
- `PUT /accountSettings` - Update user settings

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Mohamed Tarek**

## 🙏 Acknowledgments

- Google Gemini AI for intelligent assistance
- Angular team for the amazing framework
- Chart.js for beautiful data visualizations
- All open-source contributors

---

<div align="center">

**Built with ❤️ using Angular & Node.js**

⭐ Star this repo if you find it helpful!

</div>
