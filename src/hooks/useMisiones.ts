import { useState, useCallback, useEffect } from 'react';
import { Mision, Rango, Categoria } from '../types';
import {
  getMisiones,
  createMision,
  toggleMisionApi,
  editMisionApi,
  deleteMisionApi,
} from '../lib/api';

// Estado global en módulo — compartido entre todas las instancias del hook.
// La fuente de verdad es ahora el servidor (Neon/PostgreSQL).
// Este estado es solo la caché local mientras la app está abierta.
let estadoGlobal: Mision[] = [];
let loadingGlobal = false;
let cargadoUnaVez = false;
const suscriptores: Set<() => void> = new Set();

function notificar() {
  suscriptores.forEach(fn => fn());
}

export function useMisiones() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const actualizar = () => forceUpdate(n => n + 1);
    suscriptores.add(actualizar);
    return () => suscriptores.delete(actualizar);
  }, []);

  // Carga las misiones desde el servidor. Solo hace fetch si no se han
  // cargado ya en esta sesión (evita llamadas repetidas en useFocusEffect).
  const cargarMisiones = useCallback(async () => {
    if (loadingGlobal) return;
    loadingGlobal = true;
    notificar();
    try {
      const data = await getMisiones();
      estadoGlobal = data;
      cargadoUnaVez = true;
    } catch (e) {
      console.error('useMisiones — cargarMisiones error:', e);
    } finally {
      loadingGlobal = false;
      notificar();
    }
  }, []);

  // Carga automática al primer montaje si no se han cargado todavía
  useEffect(() => {
    if (!cargadoUnaVez) {
      cargarMisiones();
    }
  }, [cargarMisiones]);

  const agregar = useCallback(async (title: string, categoria: Categoria, rango: Rango) => {
    const nueva = await createMision(title, categoria, rango);
    // Actualización optimista: añadir al principio sin esperar al servidor
    estadoGlobal = [nueva, ...estadoGlobal];
    notificar();
    return nueva;
  }, []);

  const toggle = useCallback(async (id: string) => {
    const mision = estadoGlobal.find(m => m.id === id);
    if (!mision) return;
    const nuevoCompleted = !mision.completed;
    // Actualización optimista
    estadoGlobal = estadoGlobal.map(m =>
      m.id === id ? { ...m, completed: nuevoCompleted } : m
    );
    notificar();
    // Sincronizar con el servidor
    await toggleMisionApi(id, nuevoCompleted);
  }, []);

  const eliminar = useCallback(async (id: string) => {
    // Actualización optimista
    estadoGlobal = estadoGlobal.filter(m => m.id !== id);
    notificar();
    await deleteMisionApi(id);
  }, []);

  const editar = useCallback(async (
    id: string,
    data: Partial<Pick<Mision, 'title' | 'categoria' | 'rango'>>
  ) => {
    // Actualización optimista
    estadoGlobal = estadoGlobal.map(m =>
      m.id === id ? { ...m, ...data } : m
    );
    notificar();
    await editMisionApi(id, data);
  }, []);

  // cargarElite: carga 10 misiones de ejemplo directamente en la BD
  const cargarElite = useCallback(async () => {
    const MISIONES_ELITE: { title: string; categoria: Categoria; rango: Rango }[] = [
      { title: 'Cazar al Dragón Escarlata del Pico Eterno',       categoria: 'Caza',        rango: 'S' },
      { title: 'Escoltar a la Embajadora al Reino del Norte',     categoria: 'Escolta',     rango: 'A' },
      { title: 'Explorar las Ruinas Sumergidas de Valdris',       categoria: 'Exploración', rango: 'B' },
      { title: 'Recolectar Hongos de la Cueva Sombría',           categoria: 'Recolección', rango: 'C' },
      { title: 'Capturar al Bandido "La Sombra"',                 categoria: 'Captura',     rango: 'D' },
      { title: 'Descubrir el Puesto de Avanzada de los Trasgos',  categoria: 'Exploración', rango: 'A' },
      { title: 'Recuperar el Amuleto de los Antiguos',            categoria: 'Exploración', rango: 'S' },
      { title: 'Limpiar la Plaga de las Alcantarillas',           categoria: 'Caza',        rango: 'C' },
      { title: 'Entregar Documentos Confidenciales al Rey',       categoria: 'Escolta',     rango: 'B' },
      { title: 'Mantenimiento del Jardín de la Academia',         categoria: 'Recolección', rango: 'D' },
    ];
    // Insertar todas en paralelo
    const nuevas = await Promise.all(
      MISIONES_ELITE.map(m => createMision(m.title, m.categoria, m.rango))
    );
    estadoGlobal = [...nuevas, ...estadoGlobal];
    notificar();
  }, []);

  const stats = {
    total:       estadoGlobal.length,
    completadas: estadoGlobal.filter(m => m.completed).length,
    pendientes:  estadoGlobal.filter(m => !m.completed).length,
    porcentaje:  estadoGlobal.length > 0
      ? Math.round((estadoGlobal.filter(m => m.completed).length / estadoGlobal.length) * 100)
      : 0,
  };

  return {
    misiones:       estadoGlobal,
    loading:        loadingGlobal,
    agregar,
    toggle,
    eliminar,
    editar,
    cargarElite,
    cargarMisiones,
    stats,
  };
}
