import {createContext, useState} from 'react';
import {CanvasItem} from '../types';

type UndoRedoContextType = {
  currentState: Map<string, CanvasItem[]> | null;
  addToHistory: (state: CanvasItem) => void;
  undo: () => void;
  redo: () => void;
};

export const UndoRedoContext = createContext<UndoRedoContextType>({
  currentState: null,
  addToHistory: () => {},
  undo: () => {},
  redo: () => {},
});

const UndoRedoProvider = ({children}: {children: React.ReactNode}) => {
  const [history, setHistory] = useState<Map<string, CanvasItem[]>[]>([]);
  const [currentStateIndex, setCurrentStateIndex] = useState(-1);

  const addToHistory = (state: CanvasItem) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setHistory((prevHistory: any) => {
      const newHistory = prevHistory.slice(0, currentStateIndex + 1);
      const updatedHistory = [...newHistory, state];
      setCurrentStateIndex(updatedHistory.length - 1);
      return updatedHistory;
    });
  };

  const undo = () => {
    if (currentStateIndex > 0) {
      setCurrentStateIndex(currentStateIndex - 1);
    }
  };

  const redo = () => {
    if (currentStateIndex < history.length - 1) {
      setCurrentStateIndex(currentStateIndex + 1);
    }
  };

  const currentState = history[currentStateIndex];

  return (
    <UndoRedoContext.Provider value={{currentState, addToHistory, undo, redo}}>
      {children}
    </UndoRedoContext.Provider>
  );
};

export default UndoRedoProvider;
