# TaskFlow Server

Backend server for TaskFlow task management application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your MongoDB connection string and JWT secret.

4. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Boards
- `GET /api/boards` - Get all boards for authenticated user
- `GET /api/boards/:id` - Get a specific board
- `POST /api/boards` - Create a new board
- `PUT /api/boards/:id` - Update a board
- `DELETE /api/boards/:id` - Delete a board
- `POST /api/boards/:id/members` - Add member to board

## Socket.io Events

### Client → Server
- `join-board` - Join a board room
- `leave-board` - Leave a board room
- `board-update` - Update board data
- `card-moved` - Move a card between columns

### Server → Client
- `board-updated` - Board was updated
- `joined-board` - Successfully joined board room
- `error` - Error occurred

