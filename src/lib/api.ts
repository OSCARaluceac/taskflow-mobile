import { Note, ChecklistNote, IdeaNote, AnyNote, ChecklistItem } from '../types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';

// ─── Tipos internos de la API (snake_case de Postgres) ──────────────────────

type ApiChecklistItem = {
  id: string;
  note_id: string;
  text: string;
  is_completed: boolean;
};

type ApiNote = {
  id: string;
  title: string;
  type: 'note' | 'checklist' | 'idea';
  content: string | null;
  color: string | null;
  items: ApiChecklistItem[] | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
};

// ─── Adaptador snake_case (DB) → camelCase (App) ───────────────────────────

function adaptNote(api: ApiNote): AnyNote {
  const base = {
    id: api.id,
    title: api.title,
    createdAt: new Date(api.created_at).getTime(),
    updatedAt: new Date(api.updated_at).getTime(),
  };

  if (api.type === 'note') {
    return { ...base, type: 'note', content: api.content ?? '' } as Note;
  }

  if (api.type === 'checklist') {
    const items: ChecklistItem[] = (api.items ?? []).map(i => ({
      id: i.id,
      text: i.text,
      isCompleted: i.is_completed,
    }));
    return { ...base, type: 'checklist', items } as ChecklistNote;
  }

  return {
    ...base,
    type: 'idea',
    color: api.color ?? '#c5a028',
    tags: api.tags ?? [],
  } as IdeaNote;
}

// ─── Tipos de payload para crear notas ──────────────────────────────────────

export type CreateNotePayload =
  | { title: string; type: 'note'; content?: string }
  | { title: string; type: 'checklist'; items: { text: string }[] }
  | { title: string; type: 'idea'; color?: string; tags?: string[] };

// ─── Funciones de API ────────────────────────────────────────────────────────

export async function getNotes(): Promise<AnyNote[]> {
  const res = await fetch(`${BASE_URL}/notes`);
  if (!res.ok) throw new Error('Error al cargar notas');
  const data: ApiNote[] = await res.json();
  return data.map(adaptNote);
}

export async function createNote(payload: CreateNotePayload): Promise<AnyNote> {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? 'Error al crear nota');
  }
  const data: ApiNote = await res.json();
  return adaptNote(data);
}

export async function deleteNoteApi(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/notes/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 404) {
    throw new Error('Error al eliminar nota');
  }
}

export async function toggleItemApi(itemId: string, isCompleted: boolean): Promise<void> {
  const res = await fetch(`${BASE_URL}/checklist-items/${itemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_completed: isCompleted }),
  });
  if (!res.ok) throw new Error('Error al actualizar item');
}
