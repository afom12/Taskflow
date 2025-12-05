import express from 'express';
import Board from '../models/Board.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all boards for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [
        { owner: req.user.userId },
        { members: req.user.userId }
      ]
    }).populate('owner', 'username').populate('members', 'username').sort({ updatedAt: -1 });

    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single board
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user.userId },
        { members: req.user.userId }
      ]
    }).populate('owner', 'username').populate('members', 'username');

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    res.json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create board
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, columns } = req.body;

    const defaultColumns = columns || [
      { title: 'To Do', position: 0, cards: [] },
      { title: 'In Progress', position: 1, cards: [] },
      { title: 'Done', position: 2, cards: [] }
    ];

    const board = new Board({
      title: title || 'New Board',
      description: description || '',
      owner: req.user.userId,
      columns: defaultColumns
    });

    await board.save();
    await board.populate('owner', 'username');

    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update board
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user.userId },
        { members: req.user.userId }
      ]
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    Object.assign(board, req.body);
    await board.save();
    await board.populate('owner', 'username').populate('members', 'username');

    res.json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete board
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found or unauthorized' });
    }

    await Board.deleteOne({ _id: req.params.id });
    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add member to board
router.post('/:id/members', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.body;
    const board = await Board.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found or unauthorized' });
    }

    if (!board.members.includes(userId)) {
      board.members.push(userId);
      await board.save();
    }

    await board.populate('owner', 'username').populate('members', 'username');
    res.json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

