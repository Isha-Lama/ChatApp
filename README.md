# 💬 Palm Chat Application

A real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO for real-time communication.

## 🛠️ Tech Stack

### Backend
* **Node.js** & **Express** (Server & API)
* **MongoDB** & **Mongoose** (Database & ORM)
* **Socket.IO** (Real-time communication)
* **JWT** & **Bcrypt** (Authentication & Hashing)
* **dotenv** (Environment variables)

### Frontend
* **React** (UI Library)
* **Socket.IO Client** (Real-time connection)
* **Tailwind CSS** (Styling)

---

## 🚀 Project Setup and Installation

### Prerequisites

* Node.js (v14+)
* MongoDB Atlas Account and Connection String

### 1. Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install backend dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory and add your configuration based on the `.env.example` file:
    ```
    # .env
    MONGO_URI=your_mongodb_atlas_connection_string_here
    JWT_SECRET=a_very_secret_key_for_jwt
    PORT=5000
    ```
4.  Run the backend server:
    ```bash
    npm run dev
    ```

### 2. Frontend Setup

1.  Navigate to the `frontend` directory (from the root `palm-chat` folder):
    ```bash
    cd ../frontend
    ```
2.  Install frontend dependencies:
    ```bash
    npm install
    ```
3.  Run the React application:
    ```bash
    npm start
    ```
    The application should open in your browser at `http://localhost:3000`.

## ✨ Core Features

* **User CRUD:** Basic user registration and login (Register/Login routes).
* **Authentication & Authorization:** Secure routes using JWT (JSON Web Tokens).
* **Real-time Messaging:** Live message sending and receiving using **Socket.IO**.
* **Chat History:** Loads the last 50 messages from MongoDB upon login.
* **Stats:** Displays total registered users and total chat messages.