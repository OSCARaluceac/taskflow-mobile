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

// Bug fix: Note ahora extiende BaseNote y usa number para fechas,
// consistente con el adaptador en api.ts (new Date().getTime())
export interface Note extends BaseNote {
  type: 'note';
  content: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface ChecklistNote extends BaseNote {
  type: 'checklist';
  items: ChecklistItem[];
}

export interface IdeaNote extends BaseNote {
  type: 'idea';
  tags: string[];
  color: string;
}

export type AnyNote = Note | ChecklistNote | IdeaNote;
