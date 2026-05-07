import { z } from 'zod';

export const noteSchema = z.object({
  title: z.string().min(3, 'El título requiere al menos 3 caracteres'),
  content: z.string().min(1, 'El contenido no puede estar vacío').optional(),
});

// Esquema específico para Checklists e Ideas según sea necesario