export type Rango = 'D' | 'C' | 'B' | 'A' | 'S';

export interface BaseNote {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

export interface Note extends BaseNote {
  content: string;
  type: 'text';
}

export interface ChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface ChecklistNote extends BaseNote {
  items: ChecklistItem[];
  type: 'checklist';
}

export interface IdeaNote extends BaseNote {
  tags: string[];
  color: string;
  type: 'idea';
}

export type AnyNote = Note | ChecklistNote | IdeaNote;