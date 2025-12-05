import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Card from './Card';
import { useThemeStore } from '../store/themeStore';
import { useBoardStore } from '../store/boardStore';
import { FiPlus } from 'react-icons/fi';
import { useState } from 'react';

export default function Column({ column, boardId, socket }) {
  const darkMode = useThemeStore((state) => state.darkMode);
  const { currentBoard, updateBoard } = useBoardStore();
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;

    const updatedColumns = currentBoard.columns.map((col) => {
      if (col._id.toString() === column._id.toString()) {
        return {
          ...col,
          cards: [
            ...col.cards,
            {
              title: newCardTitle,
              description: '',
              checklist: [],
              position: col.cards.length,
            },
          ],
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

    setNewCardTitle('');
    setShowAddCard(false);
  };

  return (
    <div
      className={`min-w-[300px] rounded-lg shadow-md ${
        darkMode ? 'bg-gray-800' : 'bg-gray-100'
      }`}
    >
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {column.title}
        </h3>
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {column.cards.length} cards
        </span>
      </div>

      <div className="p-4 space-y-3 min-h-[200px]">
        {column.cards
          .sort((a, b) => a.position - b.position)
          .map((card) => (
            <Card key={card._id} card={card} columnId={column._id} boardId={boardId} socket={socket} />
          ))}

        {showAddCard ? (
          <form onSubmit={handleAddCard} className="space-y-2">
            <input
              type="text"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Card title"
              autoFocus
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddCard(false);
                  setNewCardTitle('');
                }}
                className={`px-3 py-1 rounded-lg text-sm ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition`}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowAddCard(true)}
            className={`w-full p-2 rounded-lg flex items-center gap-2 text-sm transition ${
              darkMode
                ? 'text-gray-400 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FiPlus /> Add Card
          </button>
        )}
      </div>
    </div>
  );
}

