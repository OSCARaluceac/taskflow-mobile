// ─── Tipos de Misiones ────────────────────────────────────────────────────────
export type Rango = 'D' | 'C' | 'B' | 'A' | 'S';

export type Categoria =
  | 'Recolección'
  | 'Exploración'
  | 'Captura'
  | 'Escolta'
  | 'Caza';

export interface Mision {
  id: string;
  title: string;
  categoria: Categoria;
  rango: Rango;
  completed: boolean;
  createdAt: number;
}

// ─── Tipos de Notas ───────────────────────────────────────────────────────────

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