import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoardStore } from '../store/boardStore';
import { useThemeStore } from '../store/themeStore';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';

export default function Dashboard() {
  const { boards, fetchBoards, createBoard, deleteBoard, loading } = useBoardStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [boardTitle, setBoardTitle] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const navigate = useNavigate();
  const darkMode = useThemeStore((state) => state.darkMode);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    try {
      const board = await createBoard(boardTitle, boardDescription);
      setShowCreateModal(false);
      setBoardTitle('');
      setBoardDescription('');
      navigate(`/board/${board._id}`);
    } catch (error) {
      console.error('Failed to create board:', error);
    }
  };

  const handleDeleteBoard = async (e, boardId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this board?')) {
      await deleteBoard(boardId);
    }
  };

  if (loading && boards.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Loading boards...
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          My Boards
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FiPlus /> Create Board
        </button>
      </div>

      {boards.length === 0 ? (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className="text-lg mb-4">No boards yet. Create your first board!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <div
              key={board._id}
              onClick={() => navigate(`/board/${board._id}`)}
              className={`p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition ${
                darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {board.title}
                </h3>
                <button
                  onClick={(e) => handleDeleteBoard(e, board._id)}
                  className={`p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
              {board.description && (
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {board.description}
                </p>
              )}
              <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {board.columns?.length || 0} columns
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-md w-full p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Create New Board
            </h3>
            <form onSubmit={handleCreateBoard} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Title
                </label>
                <input
                  type="text"
                  value={boardTitle}
                  onChange={(e) => setBoardTitle(e.target.value)}
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description (optional)
                </label>
                <textarea
                  value={boardDescription}
                  onChange={(e) => setBoardDescription(e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setBoardTitle('');
                    setBoardDescription('');
                  }}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

