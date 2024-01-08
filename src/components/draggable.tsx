import {useDrag} from 'react-dnd';

type ItemType = 'text' | 'image';

interface DraggableProps {
  id: string;
  className: string;
  children: React.ReactNode;
  type: ItemType;
  onImageUpload?: (file: File) => void;
}

export default function Draggable({
  id,
  className,
  children,
  type,
}: DraggableProps) {
  const [, drag] = useDrag(() => ({
    type,
    item: {id, type},
    collect: monitor => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  return (
    <button id={id} ref={drag} className={className}>
      {children}
    </button>
  );
}
