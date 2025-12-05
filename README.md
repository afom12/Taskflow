# 🧠 TaskFlow – Real-Time Task Management App

> A smart, collaborative, full-stack task management suite — like Trello meets Notion.

---

## 🚀 Features

- 🗂 Create task boards with columns & cards  
- ✍️ Write rich task descriptions and checklists  
- 🔄 Real-time updates using Socket.io  
- 👥 Team collaboration  
- 🌙 Light/Dark mode toggle  
- 🔐 JWT Auth (Login / Register)  
- 📱 Fully responsive design

---

## 🛠 Tech Stack

**Frontend**  
React • Zustand • Tailwind CSS • React DnD or DnD Kit

**Backend**  
Node.js • Express • MongoDB • Socket.io • JWT Auth

---

## 📸 Screenshots  
*(Add once you build the UI!)*  
![Board View](./screenshots/board.png)

---

## 🧪 Setup & Run Locally

```bash
### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)

### Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# Update MONGODB_URI and JWT_SECRET

# Run the server
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Run the development server
npm run dev
```

The client will run on `http://localhost:5173`

### Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Usage

1. Start MongoDB (if running locally)
2. Start the backend server (`cd server && npm run dev`)
3. Start the frontend (`cd client && npm run dev`)
4. Open `http://localhost:5173` in your browser
5. Register a new account or login
6. Create boards and start managing tasks!
