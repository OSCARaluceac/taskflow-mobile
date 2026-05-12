import { Note, ChecklistNote, IdeaNote, AnyNote, ChecklistItem } from '../types';

// EXPO_PUBLIC_API_URL se lee del archivo .env.local en la raíz del proyecto.
// El prefijo EXPO_PUBLIC_ es obligatorio para que Expo lo exponga en el bundle.
// En el emulador Android usa 10.0.2.2 para apuntar al localhost de tu máquina.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';

// ─── Tipos de entrada ─────────────────────────────────────────────────────────

export type CreateNoteInput = {
  title: string;
  type: 'note';
  content?: string;
};

export type CreateChecklistInput = {
  title: string;
  type: 'checklist';
  items: { text: string }[];
};

export type CreateIdeaInput = {
  title: string;
  type: 'idea';
  color?: string;
  tags?: string[];
};

export type CreateNotePayload = CreateNoteInput | CreateChecklistInput | CreateIdeaInput;

// ─── Tipos de respuesta de la API ─────────────────────────────────────────────
// La API devuelve snake_case (is_completed, created_at).
// Los adaptamos a camelCase para que el resto de la app no cambie.

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

// ─── Adaptadores snake_case → camelCase ───────────────────────────────────────

function adaptNote(api: ApiNote): AnyNote {
  const base = {
    id: api.id,
    title: api.title,
    createdAt: new Date(api.created_at).getTime(),
    updatedAt: new Date(api.updated_at).getTime(),
  };

  if (api.type === 'note') {
    return { ...base, type: 'text', content: api.content ?? '' } as Note;
  }

  if (api.type === 'checklist') {
    const items: ChecklistItem[] = (api.items ?? []).map(i => ({
      id: i.id,
      text: i.text,
      isCompleted: i.is_completed,
    }));
    return { ...base, type: 'checklist', items } as ChecklistNote;
  }

  // idea
  return {
    ...base,
    type: 'idea',
    color: api.color ?? '#c5a028',
    tags: api.tags ?? [],
  } as IdeaNote;
}

// ─── Funciones de API ─────────────────────────────────────────────────────────

/** Obtiene todas las notas del servidor */
export async function getNotes(): Promise<AnyNote[]> {
  const res = await fetch(`${BASE_URL}/notes`);
  if (!res.ok) throw new Error('Error al cargar notas');
  const data: ApiNote[] = await res.json();
  return data.map(adaptNote);
}

/** Crea una nota, checklist o idea en el servidor */
export async function createNote(payload: CreateNotePayload): Promise<AnyNote> {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? 'Error al crear nota');
  }
  const data: ApiNote = await res.json();
  return adaptNote(data);
}

/** Elimina una nota (y sus items/tags por CASCADE en la BD) */
export async function deleteNoteApi(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/notes/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error('Error al eliminar nota');
}

/** Marca o desmarca un checklist item */
export async function toggleItemApi(itemId: string, isCompleted: boolean): Promise<void> {
  const res = await fetch(`${BASE_URL}/checklist-items/${itemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_completed: isCompleted }),
  });
  if (!res.ok) throw new Error('Error al actualizar item');
}

/** Elimina un item concreto de un checklist */
export async function deleteItemApi(itemId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/checklist-items/${itemId}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error('Error al eliminar item');
}
