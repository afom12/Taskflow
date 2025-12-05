import jwt from 'jsonwebtoken';
import Board from '../models/Board.js';

export const setupSocketIO = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      socket.userId = decoded.userId;
      socket.username = decoded.username;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.username}`);

    // Join board room
    socket.on('join-board', async (boardId) => {
      try {
        const board = await Board.findOne({
          _id: boardId,
          $or: [
            { owner: socket.userId },
            { members: socket.userId }
          ]
        });

        if (board) {
          socket.join(`board-${boardId}`);
          socket.emit('joined-board', boardId);
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to join board' });
      }
    });

    // Leave board room
    socket.on('leave-board', (boardId) => {
      socket.leave(`board-${boardId}`);
    });

    // Handle board updates
    socket.on('board-update', async (data) => {
      try {
        const { boardId, updates } = data;
        const board = await Board.findByIdAndUpdate(
          boardId,
          updates,
          { new: true }
        ).populate('owner', 'username').populate('members', 'username');

        if (board) {
          io.to(`board-${boardId}`).emit('board-updated', board);
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to update board' });
      }
    });

    // Handle card move
    socket.on('card-moved', async (data) => {
      try {
        const { boardId, sourceColumnId, destColumnId, cardId, newPosition } = data;
        const board = await Board.findById(boardId);

        if (!board) return;

        // Find source column and card
        const sourceColumn = board.columns.id(sourceColumnId);
        const card = sourceColumn.cards.id(cardId);

        if (!card) return;

        // Remove card from source
        sourceColumn.cards.pull(cardId);

        // Add card to destination
        const destColumn = board.columns.id(destColumnId);
        if (destColumn) {
          destColumn.cards.splice(newPosition, 0, card);
        }

        await board.save();
        const updatedBoard = await Board.findById(boardId)
          .populate('owner', 'username')
          .populate('members', 'username');

        io.to(`board-${boardId}`).emit('board-updated', updatedBoard);
      } catch (error) {
        socket.emit('error', { message: 'Failed to move card' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.username}`);
    });
  });
};

