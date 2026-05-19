import { Note, ChecklistNote, IdeaNote, AnyNote, ChecklistItem } from '../types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://noteflow-api-y6uh.vercel.app/api';

// ─── Gestión del token ────────────────────────────────────────────────────────
// En web usamos localStorage. En producción móvil se usaría expo-secure-store.

let _token: string | null = null;

export function setToken(token: string) {
  _token = token;
  try { localStorage.setItem('auth_token', token); } catch {}
}

export function getToken(): string | null {
  if (_token) return _token;
  try { _token = localStorage.getItem('auth_token'); } catch {}
  return _token;
}

export function clearToken() {
  _token = null;
  try { localStorage.removeItem('auth_token'); } catch {}
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

// ─── Tipos internos de la API (snake_case de Postgres) ───────────────────────

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

// ─── Adaptador snake_case → camelCase ────────────────────────────────────────

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

// ─── Tipos de payload ─────────────────────────────────────────────────────────

export type CreateNotePayload =
  | { title: string; type: 'note'; content?: string }
  | { title: string; type: 'checklist'; items: { text: string }[] }
  | { title: string; type: 'idea'; color?: string; tags?: string[] };

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function loginApi(username: string, password: string): Promise<{ token: string; user: { id: string; username: string } }> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? 'Credenciales incorrectas');
  }
  return res.json();
}

export async function registerApi(username: string, password: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? 'Error al registrarse');
  }
}

// ─── Notas ────────────────────────────────────────────────────────────────────

export async function getNotes(): Promise<AnyNote[]> {
  const res = await fetch(`${BASE_URL}/notes`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Error al cargar notas');
  const data: ApiNote[] = await res.json();
  return data.map(adaptNote);
}

export async function createNote(payload: CreateNotePayload): Promise<AnyNote> {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: 'POST',
    headers: authHeaders(),
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
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok && res.status !== 404) throw new Error('Error al eliminar nota');
}

export async function toggleItemApi(itemId: string, isCompleted: boolean): Promise<void> {
  const res = await fetch(`${BASE_URL}/checklist-items/${itemId}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ is_completed: isCompleted }),
  });
  if (!res.ok) throw new Error('Error al actualizar item');
}
