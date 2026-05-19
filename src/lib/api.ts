import { Note, ChecklistNote, IdeaNote, AnyNote, ChecklistItem, Mision, Rango, Categoria } from '../types';

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://noteflow-api-y6uh.vercel.app/api';

// El token se inyecta desde el authStore antes de cada petición.
// Se guarda aquí para no tener que importar el store en cada función.
let _token: string | null = null;

export function setApiToken(token: string | null) {
  _token = token;
}

function authHeaders(): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (_token) h['Authorization'] = `Bearer ${_token}`;
  return h;
}

// ─── Tipos internos de la API (snake_case de Postgres) ──────────────────────

type ApiChecklistItem = {
  id: string; note_id: string; text: string; is_completed: boolean;
};

type ApiNote = {
  id: string; title: string; type: 'note' | 'checklist' | 'idea';
  content: string | null; color: string | null;
  items: ApiChecklistItem[] | null; tags: string[] | null;
  created_at: string; updated_at: string;
};

type ApiMision = {
  id: string; title: string; categoria: Categoria;
  rango: Rango; completed: boolean; created_at: string;
};

// ─── Adaptadores ─────────────────────────────────────────────────────────────

function adaptNote(api: ApiNote): AnyNote {
  const base = {
    id: api.id, title: api.title,
    createdAt: new Date(api.created_at).getTime(),
    updatedAt: new Date(api.updated_at).getTime(),
  };
  if (api.type === 'note') return { ...base, type: 'note', content: api.content ?? '' } as Note;
  if (api.type === 'checklist') {
    const items: ChecklistItem[] = (api.items ?? []).map(i => ({
      id: i.id, text: i.text, isCompleted: i.is_completed,
    }));
    return { ...base, type: 'checklist', items } as ChecklistNote;
  }
  return { ...base, type: 'idea', color: api.color ?? '#c5a028', tags: api.tags ?? [] } as IdeaNote;
}

function adaptMision(api: ApiMision): Mision {
  return {
    id: api.id, title: api.title, categoria: api.categoria,
    rango: api.rango, completed: api.completed,
    createdAt: new Date(api.created_at).getTime(),
  };
}

// ─── Tipos de payload ────────────────────────────────────────────────────────

export type CreateNotePayload =
  | { title: string; type: 'note'; content?: string }
  | { title: string; type: 'checklist'; items: { text: string }[] }
  | { title: string; type: 'idea'; color?: string; tags?: string[] };

// ─── Notas ───────────────────────────────────────────────────────────────────

export async function getNotes(): Promise<AnyNote[]> {
  const res = await fetch(`${BASE_URL}/notes`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Error al cargar notas');
  const data: ApiNote[] = await res.json();
  return data.map(adaptNote);
}

export async function createNote(payload: CreateNotePayload): Promise<AnyNote> {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? 'Error al crear nota');
  }
  return adaptNote(await res.json());
}

export async function deleteNoteApi(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: 'DELETE', headers: authHeaders(),
  });
  if (!res.ok && res.status !== 404) throw new Error('Error al eliminar nota');
}

export async function toggleItemApi(itemId: string, isCompleted: boolean): Promise<void> {
  const res = await fetch(`${BASE_URL}/checklist-items/${itemId}`, {
    method: 'PATCH', headers: authHeaders(),
    body: JSON.stringify({ is_completed: isCompleted }),
  });
  if (!res.ok) throw new Error('Error al actualizar item');
}

// ─── Misiones ────────────────────────────────────────────────────────────────

export async function getMisiones(): Promise<Mision[]> {
  const res = await fetch(`${BASE_URL}/misiones`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Error al cargar misiones');
  const data: ApiMision[] = await res.json();
  return data.map(adaptMision);
}

export async function createMision(title: string, categoria: Categoria, rango: Rango): Promise<Mision> {
  const res = await fetch(`${BASE_URL}/misiones`, {
    method: 'POST', headers: authHeaders(),
    body: JSON.stringify({ title, categoria, rango }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? 'Error al crear misión');
  }
  return adaptMision(await res.json());
}

export async function toggleMisionApi(id: string, completed: boolean): Promise<void> {
  const res = await fetch(`${BASE_URL}/misiones/${id}`, {
    method: 'PATCH', headers: authHeaders(),
    body: JSON.stringify({ completed }),
  });
  if (!res.ok) throw new Error('Error al actualizar misión');
}

export async function editMisionApi(id: string, data: Partial<Pick<Mision, 'title' | 'categoria' | 'rango'>>): Promise<void> {
  const res = await fetch(`${BASE_URL}/misiones/${id}`, {
    method: 'PATCH', headers: authHeaders(), body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al editar misión');
}

export async function deleteMisionApi(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/misiones/${id}`, {
    method: 'DELETE', headers: authHeaders(),
  });
  if (!res.ok && res.status !== 404) throw new Error('Error al eliminar misión');
}
