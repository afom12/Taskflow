import { useState, useEffect } from 'react';
import { useBoardStore } from '../store/boardStore';
import { useThemeStore } from '../store/themeStore';
import { FiX, FiCheck } from 'react-icons/fi';

export default function CardModal({ card, columnId, boardId, socket, onClose }) {
  const { currentBoard, updateBoard } = useBoardStore();
  const darkMode = useThemeStore((state) => state.darkMode);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [checklist, setChecklist] = useState(card.checklist || []);
  const [newChecklistItem, setNewChecklistItem] = useState('');

  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description || '');
    setChecklist(card.checklist || []);
  }, [card]);

  const handleSave = async () => {
    const updatedColumns = currentBoard.columns.map((col) => {
      if (col._id.toString() === columnId) {
        return {
          ...col,
          cards: col.cards.map((c) =>
            c._id.toString() === card._id.toString()
              ? { ...c, title, description, checklist }
              : c
          ),
        };
      }
      return col;
    });

    if (socket) {
      socket.emit('board-update', {
        boardId,
        updates: { columns: updatedColumns },
      });
    } else {
      await updateBoard(boardId, { columns: updatedColumns });
    }
    onClose();
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    setChecklist([...checklist, { text: newChecklistItem, completed: false }]);
    setNewChecklistItem('');
  };

  const handleToggleChecklistItem = (index) => {
    const updated = [...checklist];
    updated[index].completed = !updated[index].completed;
    setChecklist(updated);
  };

  const handleDeleteChecklistItem = (index) => {
    setChecklist(checklist.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-start mb-4">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Edit Card
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
                placeholder="Add a description..."
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Checklist
              </label>
              <div className="space-y-2 mb-2">
                {checklist.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <button
                      onClick={() => handleToggleChecklistItem(index)}
                      className={`p-1 rounded ${
                        item.completed
                          ? 'bg-blue-600 text-white'
                          : darkMode
                          ? 'border border-gray-600 text-gray-400'
                          : 'border border-gray-300 text-gray-400'
                      }`}
                    >
                      {item.completed && <FiCheck size={14} />}
                    </button>
                    <span
                      className={`flex-1 ${
                        item.completed
                          ? 'line-through text-gray-500'
                          : darkMode
                          ? 'text-gray-300'
                          : 'text-gray-700'
                      }`}
                    >
                      {item.text}
                    </span>
                    <button
                      onClick={() => handleDeleteChecklistItem(index)}
                      className={`p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                  placeholder="Add checklist item"
                  className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                />
                <button
                  onClick={handleAddChecklistItem}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-6 flex justify-end gap-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition ${
              darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

