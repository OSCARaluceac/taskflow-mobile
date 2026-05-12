import { z } from 'zod';

// Estos schemas validan los inputs del formulario en la app
// ANTES de enviarlos a la API. La API tiene su propia validación con Zod
// como segunda capa de defensa.

export const noteSchema = z.object({
  title: z.string().min(3, 'El título requiere al menos 3 caracteres'),
  content: z.string().optional(),
});

export const checklistSchema = z.object({
  title: z.string().min(3, 'El título requiere al menos 3 caracteres'),
  items: z.array(z.string().min(1)).min(1, 'Añade al menos un item'),
});

export const ideaSchema = z.object({
  title: z.string().min(3, 'El título requiere al menos 3 caracteres'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  tags: z.array(z.string()).optional(),
});

export type NoteInput = z.infer<typeof noteSchema>;
export type ChecklistInput = z.infer<typeof checklistSchema>;
export type IdeaInput = z.infer<typeof ideaSchema>;
