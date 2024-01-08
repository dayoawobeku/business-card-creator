import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import './index.css';
import {Canvas, Home} from './routes';
import CanvasProvider from './context/canvas-provider';
import UndoRedoProvider from './context/undoRedo-provider';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/canvas/:id',
    element: <Canvas />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UndoRedoProvider>
      <CanvasProvider>
        <RouterProvider router={router} />
      </CanvasProvider>
    </UndoRedoProvider>
  </React.StrictMode>,
);
