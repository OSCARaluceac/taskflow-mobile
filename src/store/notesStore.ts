import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, ChecklistNote, IdeaNote, AnyNote } from '../types';

interface NotesState {
  notes: Note[];
  checklists: ChecklistNote[];
  ideas: IdeaNote[];
  addNote: (note: Note) => void;
  addChecklist: (checklist: ChecklistNote) => void;
  addIdea: (idea: IdeaNote) => void;
  deleteNote: (id: string, type: AnyNote['type']) => void;
  toggleChecklistItem: (checklistId: string, itemId: string) => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      notes: [], checklists: [], ideas: [],
      addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
      addChecklist: (checklist) => set((state) => ({ checklists: [checklist, ...state.checklists] })),
      addIdea: (idea) => set((state) => ({ ideas: [idea, ...state.ideas] })),
      deleteNote: (id, type) => set((state) => {
        if (type === 'text') return { notes: state.notes.filter(n => n.id !== id) };
        if (type === 'checklist') return { checklists: state.checklists.filter(n => n.id !== id) };
        return { ideas: state.ideas.filter(n => n.id !== id) };
      }),
      toggleChecklistItem: (checklistId, itemId) => set((state) => ({
        checklists: state.checklists.map(c => 
          c.id !== checklistId ? c : {
            ...c,
            items: c.items.map(i => i.id === itemId ? { ...i, isCompleted: !i.isCompleted } : i)
          }
        ),
      })),
    }),
    { name: 'noteflow-storage', storage: createJSONStorage(() => AsyncStorage) }
  )
);