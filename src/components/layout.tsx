import {useContext, useEffect, useState} from 'react';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {DndProvider} from 'react-dnd';
import {Link, useParams} from 'react-router-dom';
import html2canvas from 'html2canvas';
import {addImage, back} from '../assets/images';
import Draggable from './draggable';
import {CanvasContext} from '../context/canvas-provider';
import {UndoRedoContext} from '../context/undoRedo-provider';
import Canvas from './canvas';

export default function Layout() {
  const {id} = useParams();
  const {canvasList, setItems, updateCanvas} = useContext(CanvasContext);
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState('white');

  const currentCanvas = canvasList.find(canvas => canvas.id === id);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem(`items_${id}`) || '{}');
    setItems(new Map(Object.entries(storedItems)));

    const storedBackgroundColor = localStorage.getItem(
      `background_color_${id}`,
    );
    if (storedBackgroundColor) {
      setCanvasBackgroundColor(storedBackgroundColor);
    }
  }, [id, setItems]);

  const handleCanvasBackgroundColorChange = (color: string) => {
    setCanvasBackgroundColor(color);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Header>
        <p
          className="text-white cursor-pointer"
          contentEditable={true}
          suppressContentEditableWarning={true}
          onBlur={e => {
            updateCanvas?.(id as string, e.target.textContent as string);
          }}
        >
          {currentCanvas?.name}
        </p>
      </Header>
      <div className="bg-[#EAEAEA] min-h-screen flex basis-full items-start">
        <Aside
          routeId={id as string}
          onBackgroundColorChange={handleCanvasBackgroundColorChange}
        />
        <div className="basis-[73%]">
          <Main>
            <Canvas
              routeId={id as string}
              backgroundColor={canvasBackgroundColor}
            />
          </Main>
        </div>
      </div>
    </DndProvider>
  );
}

function Main({children}: {children: React.ReactNode}) {
  return (
    <main className="flex items-center justify-center min-h-screen h-full px-10">
      {children}
    </main>
  );
}

function Aside({
  routeId,
  onBackgroundColorChange,
}: {
  routeId: string;
  onBackgroundColorChange: (color: string) => void;
}) {
  const colors = [
    'white',
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple',
  ];

  const [, setBackgroundColor] = useState('white');

  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color);

    onBackgroundColorChange(color);

    const backgroundColorKey = `background_color_${routeId}`;
    localStorage.setItem(backgroundColorKey, color);
  };

  return (
    <aside className="basis-[27%] bg-white min-h-screen h-full p-10 flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-gray-600">
          Drag and drop onto the canvas
        </p>
        <div className="mt-3 flex items-start gap-6">
          <Draggable
            id="text"
            type="text"
            className="group flex flex-col items-center justify-center gap-2 bg-gray-50 px-5 pt-1 pb-2 rounded-lg w-20 h-20 outline outline-transparent hover:bg-gray-100 hover:outline hover:outline-2 hover:outline-gray-300 transition-all duration-300"
          >
            <div className="font-serif text-[2rem] font-medium leading-none">
              T
            </div>
            <p className="text-xs font-medium text-gray-800">Text</p>
          </Draggable>

          <Draggable
            id="image"
            className="flex flex-col items-center justify-center gap-2 bg-gray-50 px-5 pt-1 pb-2 rounded-lg w-20 h-20 outline outline-transparent hover:bg-gray-100 hover:outline hover:outline-2 hover:outline-gray-300 transition-all duration-300"
            type="image"
          >
            <img src={addImage} alt="" width={32} height={32} />
            <p className="text-xs font-medium text-gray-800">Media</p>
          </Draggable>
        </div>
      </div>

      <div className="w-full h-[1px] bg-gray-300" />

      <div>
        <p className="text-sm font-medium text-gray-600">
          Choose background color
        </p>
        <div className="mt-3 flex items-center gap-3">
          {colors.map(color => (
            <div
              key={color}
              style={{
                backgroundColor: color,
                border: color === 'white' ? '1px solid black' : 'none',
              }}
              className="w-6 h-6 rounded-full"
              onClick={() => handleBackgroundColorChange(color)}
              title={color}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

function Header({children}: {children: React.ReactNode}) {
  const {undo, redo} = useContext(UndoRedoContext);

  const handleDownload = () => {
    const canvasElement = document.getElementById(
      'canvas',
    ) as HTMLDivElement | null;

    const nonDownloadableElements = document.querySelectorAll(
      '.hide-item',
    ) as NodeListOf<HTMLElement>;

    nonDownloadableElements.forEach(element => {
      element.style.visibility = 'hidden';
    });

    if (canvasElement) {
      html2canvas(canvasElement, {
        useCORS: true,
      }).then((canvas: HTMLCanvasElement) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'canvas.png';
        link.click();
      });
    }

    nonDownloadableElements.forEach(element => {
      element.style.visibility = 'visible';
    });
  };

  return (
    <header className="bg-[#222222] w-full h-16 flex items-center px-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center justify-center p-2 w-auto hover:bg-gray-700 rounded-lg"
          >
            <img src={back} alt="" width={8} height={8} />
          </Link>
          {children}
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <div className="flex items-center gap-4 mr-10">
          <button
            className="flex items-center justify-center text-sm font-medium py-2 text-white"
            onClick={undo}
          >
            Undo
          </button>
          <button
            className="flex items-center justify-center text-sm font-medium py-2 text-white"
            onClick={redo}
          >
            Redo
          </button>
        </div>
        <button
          className="flex items-center justify-center text-sm font-semibold bg-[#555be7] text-white py-2 px-5 rounded-full h-10"
          onClick={handleDownload}
        >
          Download
        </button>
        <div className="flex items-center gap-4">
          <button className="text-xs font-medium text-white bg-slate-600 rounded-full p-1 w-7 h-7 hover:outline hover:outline-offset-2 hover:outline-slate-600">
            DA
          </button>
        </div>
      </div>
    </header>
  );
}
