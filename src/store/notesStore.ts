import { create } from 'zustand';
import {
  getNotes, createNote, deleteNoteApi, toggleItemApi,
  CreateNotePayload,
} from '../lib/api';
import { Note, ChecklistNote, IdeaNote, AnyNote } from '../types';

// AsyncStorage ya no se usa: la fuente de verdad es el servidor.
// El store mantiene una copia local en memoria solo mientras la app está abierta.

interface NotesState {
  notes: Note[];
  checklists: ChecklistNote[];
  ideas: IdeaNote[];
  isLoading: boolean;
  error: string | null;

  fetchNotes: () => Promise<void>;
  addNote: (title: string, content: string) => Promise<void>;
  addChecklist: (title: string, items: string[]) => Promise<void>;
  addIdea: (title: string, color: string, tags: string[]) => Promise<void>;
  deleteNote: (id: string, type: AnyNote['type']) => Promise<void>;
  toggleChecklistItem: (checklistId: string, itemId: string, currentValue: boolean) => Promise<void>;
}

export const useNotesStore = create<NotesState>()((set) => ({
  notes: [],
  checklists: [],
  ideas: [],
  isLoading: false,
  error: null,

  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const all = await getNotes();
      set({
        notes:      all.filter(n => n.type === 'note') as Note[], // Cambiado de 'text' a 'note'
        checklists: all.filter(n => n.type === 'checklist') as ChecklistNote[],
        ideas:      all.filter(n => n.type === 'idea') as IdeaNote[],
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error desconocido';
      set({ error: msg });
    } finally {
      set({ isLoading: false });
    }
  },

  addNote: async (title, content) => {
    const payload: CreateNotePayload = { title, type: 'note', content };
    const note = await createNote(payload);
    set(s => ({ notes: [note as Note, ...s.notes] }));
  },

  addChecklist: async (title, itemTexts) => {
    const payload: CreateNotePayload = {
      title,
      type: 'checklist',
      items: itemTexts.filter(t => t.trim()).map(text => ({ text })),
    };
    const checklist = await createNote(payload);
    set(s => ({ checklists: [checklist as ChecklistNote, ...s.checklists] }));
  },

  addIdea: async (title, color, tags) => {
    const payload: CreateNotePayload = { title, type: 'idea', color, tags };
    const idea = await createNote(payload);
    set(s => ({ ideas: [idea as IdeaNote, ...s.ideas] }));
  },

  deleteNote: async (id, type) => {
    // Actualización optimista: eliminamos del estado local de inmediato
    if (type === 'note') { // Cambiado de 'text' a 'note'
      set(s => ({ notes: s.notes.filter(n => n.id !== id) }));
    } else if (type === 'checklist') {
      set(s => ({ checklists: s.checklists.filter(n => n.id !== id) }));
    } else {
      set(s => ({ ideas: s.ideas.filter(n => n.id !== id) }));
    }
    await deleteNoteApi(id);
  },

  toggleChecklistItem: async (checklistId, itemId, currentValue) => {
    // Actualización optimista en local
    set(s => ({
      checklists: s.checklists.map(c =>
        c.id !== checklistId ? c : {
          ...c,
          items: c.items.map(i =>
            i.id === itemId ? { ...i, isCompleted: !i.isCompleted } : i
          ),
        }
      ),
    }));
    await toggleItemApi(itemId, !currentValue);
  },
}));
