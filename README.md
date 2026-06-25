# PhonePe Clone - Full Stack Wallet Application

A modern, full-stack clone of the PhonePe application featuring user authentication, secure wallet money transfers, transaction history, MPIN security, utility bill payments, and interactive API documentation.

[![Live Demo](https://img.shields.io/badge/Live-Demo-purple?style=for-the-badge)]() 

---

## 🚀 Try Live 
- https://phonepay-clone-frontend.vercel.app/
---

## ✨ Features

### 📱 Frontend (Client)
- **User Authentication**: Secure Sign Up & Log In with interactive validation.
- **MPIN Security**: Setup and verification of a 4-digit MPIN for secure wallet transfers.
- **Interactive Dashboard**: View real-time wallet balance, quick actions (Send, Add, History), and recent transactions.
- **Send Money**: Transfer money securely to other registered users via their Phone Number or UPI ID.
- **Add Money**: Fund the wallet with ease.
- **Utility Bill Payments**: Simulate payments for Mobile Recharge, DTH, Electricity, and Credit Card bills.
- **Transaction History**: Filter and view all past debit/credit transactions with detailed status.
- **Responsive Design**: Mobile-first premium user interface built using Tailwind CSS.

### ⚙️ Backend (Server)
- **RESTful API**: Clean Express.js routing structures.
- **Database Integration**: MongoDB Atlas with robust Mongoose schemas for Users and Transactions.
- **JWT Authorization**: Secure token-based authentication and route protection middleware.
- **API Documentation**: Automated Interactive API Docs using Swagger (`swagger-ui-express` & `swagger-autogen`).
- **Database Seeder**: Run utility script to pre-populate dummy users for testing.

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS & PostCSS
- React Router DOM (v6)
- Axios (with automatic JWT header injection interceptors)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & BcryptJS
- Swagger Autogen

---

## 📁 Directory Structure

```
PhonePay Clone/
├── client/                 # React Frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── api/            # Axios API config
│   │   ├── components/     # Reusable components (BottomNav, ProtectedRoute, Toast)
│   │   ├── context/        # Authentication context state
│   │   └── pages/          # Login, Register, Dashboard, SendMoney, etc.
│   └── vercel.json         # Vercel client-side routing config
└── server/                 # Express Backend (Node.js + MongoDB)
    ├── src/
    │   ├── config/         # Database connection settings
    │   ├── controllers/    # Route controllers handling business logic
    │   ├── middlewares/    # Authentication and security middleware
    │   ├── models/         # Mongoose User and Transaction schemas
    │   └── routes/         # Express router endpoints
    ├── swagger.js          # Swagger documentation generator
    └── server.js           # Server startup script
```

---

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js installed (v18.x or above recommended)
- MongoDB account (local instance or MongoDB Atlas cluster)

### Backend Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` folder with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```
4. Generate API docs (Swagger):
   ```bash
   npm run swagger
   ```
5. *(Optional)* Seed dummy data for testing:
   ```bash
   npm run seed
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client folder:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` folder:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## ✍️ Author & Credits

- **App Development & Documentation**: Sanyogita Singh
- **Design Inspiration**: PhonePe Application Layout & Modern Glassmorphism Themes.

---

## 📄 License

This project is licensed under the **MIT License**.
