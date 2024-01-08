import {createContext, useEffect, useState} from 'react';
import {nanoid} from 'nanoid';
import {Canvas, CanvasItem} from '../types';

type CanvasContextType = {
  canvasList: Canvas[];
  items: Map<string, CanvasItem[]>;
  createNewCanvas: () => void;
  deleteCanvas?: (id: string) => void;
  updateCanvas?: (id: string, name: string) => void;
  handleContentChange?: (content: string, id: string) => void;
  setItems: (items: Map<string, CanvasItem[]>) => void;
};

export const CanvasContext = createContext<CanvasContextType>({
  canvasList: [],
  items: new Map<string, CanvasItem[]>(),
  createNewCanvas: () => {},
  setItems: () => {},
});

const CanvasProvider = ({children}: {children: React.ReactNode}) => {
  const path = window.location.pathname;

  const routeId = path.split('/').pop();

  const generateCanvasId = () => nanoid();

  const [canvasList, setCanvasList] = useState(
    JSON.parse(localStorage.getItem('canvasList') || '[]'),
  );

  const [items, setItems] = useState<Map<string, CanvasItem[]>>(new Map());

  useEffect(() => {
    const storedCanvasList = JSON.parse(
      localStorage.getItem('canvasList') || '[]',
    );
    setCanvasList(storedCanvasList);
  }, []);

  useEffect(() => {
    const storedCanvasItems = JSON.parse(
      localStorage.getItem(`items_${routeId}`) || '{}',
    );
    setItems(new Map(Object.entries(storedCanvasItems)));
  }, [routeId]);

  const updateLocalStorage = (updatedCanvasList: Canvas[]) => {
    localStorage.setItem('canvasList', JSON.stringify(updatedCanvasList));
  };

  const createNewCanvas = () => {
    const canvasId = generateCanvasId();
    const canvasName = 'Untitled';

    const newCanvas = {
      id: canvasId,
      name: canvasName,
      createdAt: new Date().toISOString(),
    };

    const updatedCanvasList = [...canvasList, newCanvas];
    updateLocalStorage(updatedCanvasList);

    setCanvasList(updatedCanvasList);
    setItems(new Map());

    window.location.href = `/canvas/${canvasId}`;
  };

  const updateCanvas = (id: string, updatedName: string) => {
    const updatedCanvasList = canvasList.map((canvas: Canvas) => {
      if (canvas.id === id) {
        return {
          ...canvas,
          name: updatedName,
        };
      }
      return canvas;
    });

    localStorage.setItem('canvasList', JSON.stringify(updatedCanvasList));
    setCanvasList(updatedCanvasList);
  };

  const handleContentChange = (content: string, id: string) => {
    const updatedCanvasItems = new Map(items);

    if (updatedCanvasItems.has(id)) {
      const canvasItem = updatedCanvasItems.get(id);
      if (canvasItem) {
        const updatedItem = {...canvasItem, content: content};
        updatedCanvasItems.set(id, updatedItem);
      }
    }

    setItems(updatedCanvasItems);
    localStorage.setItem(
      `items_${id}`,
      JSON.stringify(Object.fromEntries(updatedCanvasItems.entries())),
    );
  };

  return (
    <CanvasContext.Provider
      value={{
        canvasList,
        createNewCanvas,
        updateCanvas,
        handleContentChange,
        items,
        setItems,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export default CanvasProvider;
