import {useContext, useEffect, useRef, useState} from 'react';
import {nanoid} from 'nanoid';
import {useDrag, useDrop} from 'react-dnd';
import {CanvasContext} from '../context/canvas-provider';
import {UndoRedoContext} from '../context/undoRedo-provider';

function CustomDraggable({
  coordinates,
  id,
  type,
  onImageUpload,
  content: initialContent,
  updateContent,
  cloudinaryUpload,
  onDeleteItem,
}) {
  const [, drag] = useDrag(() => ({
    type: 'text',
    item: {id, type},
    collect: monitor => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const [content, setContent] = useState(initialContent || '');
  const [imageSrc, setImageSrc] = useState('');
  const {currentState} = useContext(UndoRedoContext);

  useEffect(() => {
    if (type === 'image' && initialContent) {
      setImageSrc(initialContent);
    }
  }, [type, initialContent]);

  const handleContentChange = newContent => {
    setContent(newContent);
    updateContent(newContent);
  };

  useEffect(() => {
    if (currentState) {
      const currentItem = currentState.get(id);
      if (currentItem && currentItem.content !== content) {
        setContent(currentItem.content || '');
      }
    }
  }, [currentState, id, content]);

  const handleFileChange = async event => {
    const file = event.target.files?.[0];
    if (file && type === 'image' && onImageUpload && cloudinaryUpload) {
      try {
        const imageUrl = await cloudinaryUpload(file);
        setImageSrc(imageUrl);
        onImageUpload(imageUrl);
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
      }
    }
  };

  const handleDelete = () => {
    onDeleteItem(id);
  };

  return (
    <div
      key={id}
      className="absolute w-fit block text-black text-lg"
      style={{top: coordinates?.y, left: coordinates?.x}}
    >
      <p
        ref={drag}
        className="absolute -top-4 -left-4 text-lg hover:cursor-move hide-item"
      >
        ↔
      </p>
      {type === 'text' ? (
        <p
          key={id}
          contentEditable
          onBlur={e => handleContentChange(e.target.textContent || '')}
          className="relative text-sm"
        >
          {content || 'Type something'}
        </p>
      ) : type === 'image' ? (
        <div>
          <img
            src={imageSrc || ''}
            alt=""
            style={{
              width: imageSrc ? '50px' : undefined,
              height: imageSrc ? '50px' : undefined,
            }}
            crossOrigin="anonymous"
          />
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="text-sm max-w-52 hide-item"
          />
        </div>
      ) : (
        <p key={id} className="relative">
          😂
        </p>
      )}
      <button
        onClick={handleDelete}
        className="text-xs absolute -top-4 right-0 hide-item"
      >
        ❌
      </button>
    </div>
  );
}

export default function Canvas({routeId, backgroundColor}) {
  const canvas = useRef();

  const {items, setItems} = useContext(CanvasContext);
  const {addToHistory, currentState} = useContext(UndoRedoContext);

  const [, drop] = useDrop(() => ({
    accept: ['text', 'image'],
    drop: (item, monitor) => {
      const coordCanvas = monitor.getClientOffset();
      const id = nanoid();
      const type = item?.type || 'text';

      setItems(prevItems => {
        const existingItemId = item?.id;
        if (prevItems.has(existingItemId)) {
          const existingItem = prevItems.get(existingItemId);
          if (existingItem) {
            const updatedItems = new Map(prevItems);
            updatedItems.set(existingItemId, {
              ...existingItem,
              coordinates: {
                x: coordCanvas?.x || 0,
                y: coordCanvas?.y || 0,
              },
              type,
              content: existingItem?.content,
            });

            addToHistory(updatedItems);
            return updatedItems;
          }
        } else {
          const updatedItems = new Map(prevItems);
          updatedItems.set(id, {
            coordinates: {
              x: coordCanvas?.x || 0,
              y: coordCanvas?.y || 0,
            },
            type,
            content: '',
          });

          addToHistory(updatedItems);
          return updatedItems;
        }
      });
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  useEffect(() => {
    if (items.size) {
      const itemsKey = `items_${routeId}`;
      localStorage.setItem(
        itemsKey,
        JSON.stringify(Object.fromEntries(items.entries())),
      );
    }
  }, [items, routeId]);

  useEffect(() => {
    const storedItems = JSON.parse(
      localStorage.getItem(`items_${routeId}`) || '{}',
    );
    if (currentState) {
      // Update the canvas items whenever the currentState changes
      setItems(currentState);
    } else {
      setItems(
        new Map(
          Object.entries(storedItems || {}).filter(
            ([, item]) => item.routeId === routeId,
          ),
        ),
      );
    }
  }, [currentState, routeId, setItems]);

  const updateItemContent = (itemId, newContent, routeId) => {
    setItems(prevItems => {
      const updatedItems = new Map(prevItems);

      const currentItem = {...updatedItems.get(itemId)};
      if (currentItem) {
        currentItem.content = newContent;
        currentItem.routeId = routeId;
        updatedItems.set(itemId, currentItem);
      }

      addToHistory(updatedItems);
      const itemsKey = `items_${routeId}`;
      localStorage.setItem(
        itemsKey,
        JSON.stringify(Object.fromEntries(updatedItems.entries())),
      );

      return updatedItems;
    });
  };

  useEffect(() => {
    const backgroundColorKey = `background_color_${routeId}`;
    const storedBackgroundColor = localStorage.getItem(backgroundColorKey);

    if (storedBackgroundColor) {
      if (!canvas.current) return;
      canvas.current.style.backgroundColor = storedBackgroundColor;
    }
  }, [routeId]);

  const deleteItem = itemId => {
    setItems(prevItems => {
      const updatedItems = new Map(prevItems);
      updatedItems.delete(itemId);
      const itemsKey = `items_${routeId}`;
      localStorage.setItem(
        itemsKey,
        JSON.stringify(Object.fromEntries(updatedItems.entries())),
      );
      return updatedItems;
    });
  };

  return (
    <div
      ref={r => {
        drop(r);
        canvas.current = r;
      }}
      id="canvas"
      className="w-[640px] h-[360px]"
      style={{
        backgroundColor: backgroundColor || 'white',
      }}
    >
      {Array.from(items.entries()).map(([id, {coordinates, type}]) => (
        <CustomDraggable
          key={id}
          coordinates={coordinates}
          id={id}
          type={type}
          content={items.get(id)?.content}
          updateContent={newContent =>
            updateItemContent(id, newContent, routeId)
          }
          onImageUpload={
            type === 'image'
              ? file => {
                  const reader = new FileReader();
                  reader.onload = e => {
                    const imageSrc = e.target?.result;
                    updateItemContent(id, imageSrc, routeId);
                  };
                  reader.readAsDataURL(file);
                }
              : undefined
          }
          cloudinaryUpload={async file => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append(
              'upload_preset',
              import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET,
            );

            try {
              const response = await fetch(
                `https://api.cloudinary.com/v1_1/${
                  import.meta.env.VITE_APP_CLOUDINARY_CLOUD_ID
                }/image/upload`,
                {
                  method: 'POST',
                  body: formData,
                },
              );
              const data = await response.json();
              const secureUrl = data.secure_url;
              updateItemContent(id, secureUrl, routeId);
              return secureUrl;
            } catch (error) {
              console.error('Error uploading image to Cloudinary:', error);
              throw error;
            }
          }}
          onDeleteItem={deleteItem}
        />
      ))}
    </div>
  );
}
