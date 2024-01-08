import {useContext} from 'react';
import {CanvasContext} from '../../context/canvas-provider';
import {Canvas} from '../../types';

export default function Home() {
  const {canvasList, createNewCanvas} = useContext(CanvasContext);

  return (
    <div className="bg-[#F7F7F7]">
      <div className="pt-12 flex flex-col h-screen max-w-[1280px] px-4 mx-auto">
        <h1 className="text-4xl font-bold">Welcome to Business Card Creator</h1>
        <p className="mt-8 text-lg">
          Start by creating a new canvas or pick up from where you left
        </p>
        <div className="flex flex-col gap-6">
          <div className="mt-4 w-full h-[1px] bg-gray-300" />
          <div className="grid grid-cols-4 gap-6">
            <button
              onClick={createNewCanvas}
              className="h-36 flex flex-col gap-4 items-center justify-center outline-[0.5px] outline-dashed outline-gray-400 rounded"
            >
              <img src="/plus.svg" alt="" width={20} height={20} />
              <p className="font-bold text-xl text-gray-700">
                Create new canvas
              </p>
            </button>
            {canvasList.map((canvas: Canvas) => (
              <div
                key={canvas.id}
                className="h-36 p-5 flex flex-col gap-4 items-start justify-start outline outline-[0.5px] outline-gray-400 rounded"
              >
                <div>
                  <p className="font-semibold text-2xl text-gray-700">
                    {canvas.name}
                  </p>
                </div>
                <a
                  href={`/canvas/${canvas.id}`}
                  className="flex items-center justify-center mt-auto text-white w-full bg-gray-600 py-2 px-4 rounded hover:bg-gray-700 transition-all duration-300 text-sm"
                >
                  Edit
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
