import { useState, useCallback } from 'react';
import { Mision, Rango, Categoria } from '../types';

// Las misiones son datos de juego locales — no se sincronizan con la API
// de la Fase 7 (que es solo para notas). Se guardan en memoria mientras
// la app está abierta. En una fase futura se podría añadir persistencia
// con expo-file-system o una tabla separada en el backend.

const MISIONES_ELITE: Omit<Mision, 'id' | 'completed' | 'createdAt'>[] = [
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
  }));
}

// Estado global en módulo — persiste mientras la app esté en memoria
// (sobrevive a navegación entre pantallas, pero no a un cierre completo)
let estadoGlobal: Mision[] = crearMisionesIniciales();
const suscriptores: Set<() => void> = new Set();

function notificar() {
  suscriptores.forEach(fn => fn());
}

export function useMisiones() {
  const [, forceUpdate] = useState(0);

  // Suscribirse a cambios del estado global
  const suscribirse = useCallback(() => {
    const actualizar = () => forceUpdate(n => n + 1);
    suscriptores.add(actualizar);
    return () => suscriptores.delete(actualizar);
  }, []);

  // Ejecutar suscripción al montar
  useState(() => {
    const unsub = suscribirse();
    return unsub;
  });

  const misiones = estadoGlobal;

  const agregar = useCallback((title: string, categoria: Categoria, rango: Rango) => {
    const nueva: Mision = {
      id: Date.now().toString(),
      title,
      categoria,
      rango,
      completed: false,
      createdAt: Date.now(),
    };
    estadoGlobal = [nueva, ...estadoGlobal];
    notificar();
    return nueva;
  }, []);

  const toggle = useCallback((id: string) => {
    estadoGlobal = estadoGlobal.map(m =>
      m.id === id ? { ...m, completed: !m.completed } : m
    );
    notificar();
  }, []);

  const eliminar = useCallback((id: string) => {
    estadoGlobal = estadoGlobal.filter(m => m.id !== id);
    notificar();
  }, []);

  const editar = useCallback((id: string, data: Partial<Pick<Mision, 'title' | 'categoria' | 'rango'>>) => {
    estadoGlobal = estadoGlobal.map(m =>
      m.id === id ? { ...m, ...data } : m
    );
    notificar();
  }, []);

  const cargarElite = useCallback(() => {
    const nuevas = MISIONES_ELITE.map(m => ({
      ...m,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      completed: false,
      createdAt: Date.now(),
    }));
    estadoGlobal = [...nuevas, ...estadoGlobal];
    notificar();
  }, []);

  // cargarMisiones existe por compatibilidad con HomeScreen (que lo llama en useFocusEffect)
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
