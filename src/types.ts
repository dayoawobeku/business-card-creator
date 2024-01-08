import {XYCoord} from 'react-dnd';

export interface Canvas {
  id: string;
  name: string;
  createdAt: string;
  lastEdited?: number;
}

export type ItemType = 'text' | 'image';

export interface CanvasItem {
  id: string;
  coordinates: XYCoord;
  content: string;
  type: ItemType;
}
