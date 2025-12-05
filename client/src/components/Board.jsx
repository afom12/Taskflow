import { useState } from 'react';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Column from './Column';
import { useBoardStore } from '../store/boardStore';
import { useThemeStore } from '../store/themeStore';
import { FiPlus } from 'react-icons/fi';

export default function Board({ board, socket }) {
  const { updateBoard } = useBoardStore();
  const darkMode = useThemeStore((state) => state.darkMode);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // Find source and destination
    let sourceColumnId = null;
    let destColumnId = null;
    let cardId = null;
    let newPosition = 0;

    // Check if dragging a card
    for (const column of board.columns) {
      const card = column.cards.find((c) => c._id.toString() === activeId);
      if (card) {
        sourceColumnId = column._id.toString();
        cardId = card._id.toString();
        break;
      }
    }

    // Check if dropping on a column
    const destColumn = board.columns.find((c) => c._id.toString() === overId);
    if (destColumn) {
      destColumnId = destColumn._id.toString();
      newPosition = destColumn.cards.length;
    } else {
      // Dropping on a card
      for (const column of board.columns) {
        const card = column.cards.find((c) => c._id.toString() === overId);
        if (card) {
          destColumnId = column._id.toString();
          newPosition = column.cards.findIndex((c) => c._id.toString() === overId);
          break;
        }
      }
    }

    if (sourceColumnId && destColumnId && cardId) {
      // Update via socket for real-time
      if (socket) {
        socket.emit('card-moved', {
          boardId: board._id,
          sourceColumnId,
          destColumnId,
          cardId,
          newPosition,
        });
      } else {
        // Fallback to API
        const updatedColumns = [...board.columns];
        const sourceColumn = updatedColumns.find((c) => c._id.toString() === sourceColumnId);
        const destColumn = updatedColumns.find((c) => c._id.toString() === destColumnId);
        const card = sourceColumn.cards.find((c) => c._id.toString() === cardId);

        sourceColumn.cards = sourceColumn.cards.filter((c) => c._id.toString() !== cardId);
        destColumn.cards.splice(newPosition, 0, card);

        await updateBoard(board._id, { columns: updatedColumns });
      }
    }
  };

  const handleAddColumn = async (e) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;

    const newColumn = {
      title: newColumnTitle,
      position: board.columns.length,
      cards: [],
    };

    const updatedColumns = [...board.columns, newColumn];
    await updateBoard(board._id, { columns: updatedColumns });
    setNewColumnTitle('');
    setShowAddColumn(false);
  };

  return (
    <div>
      <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {board.title}
        </h2>
        {board.description && (
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {board.description}
          </p>
        )}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {board.columns
            .sort((a, b) => a.position - b.position)
            .map((column) => (
              <Column key={column._id} column={column} boardId={board._id} socket={socket} />
            ))}

          {showAddColumn ? (
            <div className={`min-w-[300px] p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <form onSubmit={handleAddColumn} className="space-y-2">
                <input
                  type="text"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="Column title"
                  autoFocus
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddColumn(false);
                      setNewColumnTitle('');
                    }}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } transition`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button
              onClick={() => setShowAddColumn(true)}
              className={`min-w-[300px] p-4 rounded-lg border-2 border-dashed flex items-center justify-center gap-2 transition ${
                darkMode
                  ? 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700'
              }`}
            >
              <FiPlus /> Add Column
            </button>
          )}
        </div>
      </DndContext>
    </div>
  );
}

