## 📋 TaskStack — Smart Project & Task Management

**TaskStack** is a production-ready MERN stack application designed to help teams efficiently manage projects, assign tasks, and track progress with role-based access control. Built with scalability and real-world workflows in mind, it provides a clean, responsive interface and secure authentication system for seamless collaboration.

---

## 🧠 What Makes TaskStack Powerful?

* 🔐 **Secure Authentication System**  
  Users can sign up, log in, and log out securely using **JWT-based authentication** stored in **HTTP-only cookies**, ensuring protection against common vulnerabilities.

* 👥 **Role-Based Access Control**  
  Two user roles:
  * **Admin** – Full control over projects and tasks  
  * **Member** – Limited access to assigned tasks and projects  

* 📁 **Project Management**  
  Create and manage multiple projects, assign team members, and organize workflows efficiently.

* ✅ **Task Management with Status Tracking**  
  Break projects into tasks, assign responsibilities, and update statuses to track progress in real time.

* 📊 **Interactive Dashboard**  
  A responsive UI that gives users a clear overview of:
  * Tasks
  * Progress
  * Assigned work

* 🍪 **Access & Refresh Token System**  
  Implements both access and refresh tokens for a smooth and secure user experience without frequent logins.

---

## 🔧 Tech Stack

| Category   | Technology Used                                      |
|------------|------------------------------------------------------|
| Frontend   | React (Vite), Tailwind CSS v4, React Router, Zustand |
| Backend    | Node.js, Express.js, MongoDB (Mongoose)              |
| Auth       | JWT (HTTP-only cookies), bcrypt                      |
| Utilities  | Lucide React, date-fns                               |

---

## ⚙️ Additional Features

* 🌐 **CORS Configuration**  
  Enables smooth communication between frontend and backend.

* ⚡ **State Management with Zustand**  
  Lightweight and efficient global state handling.

* 🎨 **Modern UI/UX**  
  Built with Tailwind CSS for a clean and responsive design.

---

## 📁 Project Structure

```
taskstack/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Auth, error handling middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── server.js        # Express app entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios API setup
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Zustand state management
│   │   └── App.jsx      # Main app component
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── .gitignore           # Git exclusion rules
```


---

## 🔐 .env Setup

### 📦 Backend (`/backend`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskstack
JWT_ACCESS_SECRET=your_access_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 📱 Frontend (`/frontend`)
```env
VITE_API_URL=http://localhost:5000/api
```
---
## 🧪 Getting Started

### Backend

```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

---