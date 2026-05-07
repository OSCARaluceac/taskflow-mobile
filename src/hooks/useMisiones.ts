import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mision, Rango, Categoria } from '../types';

const STORAGE_KEY = 'taskflow_misiones';

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

export function useMisiones() {
  const [misiones, setMisiones] = useState<Mision[]>([]);
  const [loading, setLoading] = useState(false);

  const persist = async (data: Mision[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const cargarMisiones = useCallback(async () => {
    setLoading(true);
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        setMisiones(JSON.parse(raw));
      } else {
        // PASO 3: Carga automática de 10 misiones si no hay datos
        const iniciales = MISIONES_ELITE.map((m, i) => ({
          ...m,
          id: `init-${i}`,
          completed: false,
          createdAt: Date.now() - i * 1000
        }));
        setMisiones(iniciales);
        persist(iniciales);
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarMisiones();
  }, [cargarMisiones]);

  const agregar = useCallback(async (title: string, categoria: Categoria, rango: Rango) => {
    const nueva: Mision = {
      id: Date.now().toString(),
      title,
      categoria,
      rango,
      completed: false,
      createdAt: Date.now(),
    };
    setMisiones(prev => {
      const next = [nueva, ...prev];
      persist(next);
      return next;
    });
    return nueva;
  }, []);

  const toggle = useCallback(async (id: string) => {
    setMisiones(prev => {
      const next = prev.map(m => m.id === id ? { ...m, completed: !m.completed } : m);
      persist(next);
      return next;
    });
  }, []);

  const eliminar = useCallback(async (id: string) => {
    setMisiones(prev => {
      const next = prev.filter(m => m.id !== id);
      persist(next);
      return next;
    });
  }, []);

  const editar = useCallback(async (id: string, data: Partial<Pick<Mision, 'title' | 'categoria' | 'rango'>>) => {
    setMisiones(prev => {
      const next = prev.map(m => m.id === id ? { ...m, ...data } : m);
      persist(next);
      return next;
    });
  }, []);

  const cargarElite = useCallback(async () => {
    const nuevas = MISIONES_ELITE.map(m => ({
      ...m,
      id: Date.now().toString() + Math.random(),
      completed: false,
      createdAt: Date.now(),
    }));
    setMisiones(prev => {
      const next = [...nuevas, ...prev];
      persist(next);
      return next;
    });
  }, []);

  const stats = {
    total: misiones.length,
    completadas: misiones.filter(m => m.completed).length,
    pendientes: misiones.filter(m => !m.completed).length,
    porcentaje: misiones.length > 0 ? Math.round((misiones.filter(m => m.completed).length / misiones.length) * 100) : 0,
  };

  return { misiones, loading, agregar, toggle, eliminar, editar, cargarElite, stats, cargarMisiones };
}