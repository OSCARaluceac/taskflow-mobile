import { useState, useCallback, useEffect } from 'react';
import { Mision, Rango, Categoria } from '../types';

const STORAGE_KEY = 'taskflow-misiones';

const MISIONES_ELITE: Omit<Mision, 'id' | 'completed' | 'createdAt' | 'imageUrl'>[] = [
  { title: 'Cazar al Dragón Escarlata del Pico Eterno', categoria: 'Caza', rango: 'S' },
  { title: 'Escoltar a la Embajadora al Reino del Norte', categoria: 'Escolta', rango: 'A' },
  { title: 'Explorar las Ruinas Sumergidas de Valdris', categoria: 'Exploración', rango: 'B' },
  { title: 'Recolectar Hongos de la Cueva Sombría', categoria: 'Recolección', rango: 'C' },
  { title: 'Capturar al Bandido "La Sombra"', categoria: 'Captura', rango: 'D' },
  { title: 'Descubrir el Puesto de Avanzada de los Trasgos', categoria: 'Exploración', rango: 'A' },
  { title: 'Recuperar el Amuleto de los Antiguos', categoria: 'Exploración', rango: 'S' },
  { title: 'Limpiar la Plaga de las Alcantarillas', categoria: 'Caza', rango: 'C' },
  { title: 'Entregar Documentos Confidenciales al Rey', categoria: 'Escolta', rango: 'B' },
  { title: 'Mantenimiento del Jardín de la Academia', categoria: 'Recolección', rango: 'D' },
];

function crearMisionesIniciales(): Mision[] {
  return MISIONES_ELITE.map((m, i) => ({
    ...m,
    id: `init-${i}`,
    completed: false,
    createdAt: Date.now() - i * 1000,
    imageUrl: null,
  }));
}

// ─── Persistencia en localStorage ────────────────────────────────────────────

function cargarDesdeStorage(): Mision[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Mision[];
  } catch {}
  return crearMisionesIniciales();
}

function guardarEnStorage(misiones: Mision[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(misiones));
  } catch {}
}

// ─── Estado global en módulo ──────────────────────────────────────────────────

let estadoGlobal: Mision[] = cargarDesdeStorage();
const suscriptores: Set<() => void> = new Set();

function notificar() {
  suscriptores.forEach(fn => fn());
}

function actualizarEstado(nuevas: Mision[]) {
  estadoGlobal = nuevas;
  guardarEnStorage(nuevas);
  notificar();
}

export function useMisiones() {
  const [, forceUpdate] = useState(0);

  // Suscribirse a cambios del estado global al montar, limpiar al desmontar
  useEffect(() => {
    const actualizar = () => forceUpdate(n => n + 1);
    suscriptores.add(actualizar);
    
    // El retorno ahora está encapsulado en llaves, cumpliendo la norma de React
    return () => {
      suscriptores.delete(actualizar);
    };
  }, []);

  const misiones = estadoGlobal;

  const agregar = useCallback((title: string, categoria: Categoria, rango: Rango, imageUrl?: string | null) => {
    const nueva: Mision = {
      id: Date.now().toString(),
      title,
      categoria,
      rango,
      completed: false,
      createdAt: Date.now(),
      imageUrl: imageUrl || null,
    };
    actualizarEstado([nueva, ...estadoGlobal]);
    return nueva;
  }, []);

  const toggle = useCallback((id: string) => {
    actualizarEstado(
      estadoGlobal.map(m => m.id === id ? { ...m, completed: !m.completed } : m)
    );
  }, []);

  const eliminar = useCallback((id: string) => {
    actualizarEstado(estadoGlobal.filter(m => m.id !== id));
  }, []);

  const editar = useCallback((id: string, data: Partial<Pick<Mision, 'title' | 'categoria' | 'rango' | 'imageUrl'>>) => {
    actualizarEstado(
      estadoGlobal.map(m => m.id === id ? { ...m, ...data } : m)
    );
  }, []);

  const cargarElite = useCallback(() => {
    const nuevas = MISIONES_ELITE.map(m => ({
      ...m,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      completed: false,
      createdAt: Date.now(),
      imageUrl: null,
    }));
    actualizarEstado([...nuevas, ...estadoGlobal]);
  }, []);

  const cargarMisiones = useCallback(() => {}, []);

  const stats = {
    total: misiones.length,
    completadas: misiones.filter(m => m.completed).length,
    pendientes: misiones.filter(m => !m.completed).length,
    porcentaje: misiones.length > 0
      ? Math.round((misiones.filter(m => m.completed).length / misiones.length) * 100)
      : 0,
  };

  return {
    misiones,
    loading: false,
    agregar,
    toggle,
    eliminar,
    editar,
    cargarElite,
    cargarMisiones,
    stats,
  };
}