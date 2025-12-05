import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useThemeStore } from '../store/themeStore';
import { useBoardStore } from '../store/boardStore';
import { FiEdit2, FiX } from 'react-icons/fi';
import CardModal from './CardModal';

export default function Card({ card, columnId, boardId, socket }) {
  const darkMode = useThemeStore((state) => state.darkMode);
  const { currentBoard } = useBoardStore();
  const [showModal, setShowModal] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const completedChecklistItems = card.checklist?.filter((item) => item.completed).length || 0;
  const totalChecklistItems = card.checklist?.length || 0;
  const hasChecklist = totalChecklistItems > 0;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => setShowModal(true)}
        className={`p-3 rounded-lg cursor-pointer transition ${
          darkMode
            ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
            : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
        }`}
      >
        <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {card.title}
        </h4>
        {card.description && (
          <p className={`text-xs mb-2 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {card.description}
          </p>
        )}
        {hasChecklist && (
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {completedChecklistItems}/{totalChecklistItems} checklist items
          </div>
        )}
      </div>

      {showModal && (
        <CardModal
          card={card}
          columnId={columnId}
          boardId={boardId}
          socket={socket}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

