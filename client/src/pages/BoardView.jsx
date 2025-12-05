import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBoardStore } from '../store/boardStore';
import { useThemeStore } from '../store/themeStore';
import { useSocket } from '../hooks/useSocket';
import Board from '../components/Board';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function BoardView() {
  const { id } = useParams();
  const { currentBoard, fetchBoard, setCurrentBoard, loading } = useBoardStore();
  const darkMode = useThemeStore((state) => state.darkMode);
  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    fetchBoard(id).then((board) => {
      if (board && socket) {
        socket.emit('join-board', id);
      }
    });

    return () => {
      if (socket) {
        socket.emit('leave-board', id);
      }
    };
  }, [id, fetchBoard, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleBoardUpdate = (board) => {
      setCurrentBoard(board);
    };

    socket.on('board-updated', handleBoardUpdate);

    return () => {
      socket.off('board-updated', handleBoardUpdate);
    };
  }, [socket, setCurrentBoard]);

  if (loading && !currentBoard) {
    return (
      <div className={`flex items-center justify-center h-64 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Loading board...
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Board not found
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className={`flex items-center gap-2 mb-4 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition`}
      >
        <FiArrowLeft /> Back to Dashboard
      </button>
      <Board board={currentBoard} socket={socket} />
    </div>
  );
}

