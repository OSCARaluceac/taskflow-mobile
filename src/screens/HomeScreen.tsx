import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, Pressable,
  StyleSheet, Alert, RefreshControl, Modal, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { TaskCard } from '../components/TaskCard';
import { EditModal } from '../components/EditModal';
import { useMisiones } from '../hooks/useMisiones';
import { Mision, Rango, Categoria } from '../types';
import { Colors, Spacing } from '../constants/colors';
import { useTheme } from '../hooks/ThemeContext';

const RANGOS: Rango[] = ['D', 'C', 'B', 'A', 'S'];
const CATEGORIAS: Categoria[] = ['Caza', 'Escolta', 'Exploración', 'Recolección', 'Captura',];
const FILTROS_ESTADO = ['todas', 'pendientes', 'completadas'] as const;

export default function HomeScreen() {
  const { isDark, toggleTheme } = useTheme();
  const { misiones, loading, toggle, eliminar, editar, cargarElite, stats, cargarMisiones } = useMisiones();

  useFocusEffect(
    useCallback(() => {
      if (cargarMisiones) cargarMisiones();
    }, [cargarMisiones])
  );

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<typeof FILTROS_ESTADO[number]>('todas');
  const [filtroRangos, setFiltroRangos] = useState<Set<Rango>>(new Set(RANGOS));
  const [filtroCategorias, setFiltroCategorias] = useState<Set<Categoria>>(new Set(CATEGORIAS));
  const [ordenPrioridad, setOrdenPrioridad] = useState(false);
  const [editMision, setEditMision] = useState<Mision | null>(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const misionesFiltradas = useMemo(() => {
    let lista = [...misiones];
    if (ordenPrioridad) {
      const p: Record<Rango, number> = { S: 5, A: 4, B: 3, C: 2, D: 1 };
      lista.sort((a, b) => p[b.rango] - p[a.rango]);
    }
    return lista.filter(m => {
      if (!filtroRangos.has(m.rango)) return false;
      if (!filtroCategorias.has(m.categoria)) return false;
      if (!m.title.toLowerCase().includes(busqueda.toLowerCase())) return false;
      if (filtroEstado === 'completadas' && !m.completed) return false;
      if (filtroEstado === 'pendientes' && m.completed) return false;
      return true;
    });
  }, [misiones, busqueda, filtroEstado, filtroRangos, filtroCategorias, ordenPrioridad]);

  const toggleFilter = <T,>(item: T, set: Set<T>, setter: React.Dispatch<React.SetStateAction<Set<T>>>) => {
    const next = new Set(set);
    next.has(item) ? next.delete(item) : next.add(item);
    setter(next);
  };

  const bg = isDark ? Colors.zinc950 : Colors.parchmentLight;
  const textColor = isDark ? Colors.stone200 : Colors.stone800;
  const borderColor = isDark ? Colors.stone700 : Colors.stone400;

  const headerContent = (
    <View style={{ marginTop: -Spacing.sm }}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? Colors.stone400 : Colors.stone500 }]}>BUSCADOR</Text>
        <TextInput
          style={[styles.searchInput, { backgroundColor: isDark ? Colors.zinc800 : '#fff', borderColor, color: textColor }]}
          placeholder="Filtrar misiones..."
          placeholderTextColor={Colors.stone400}
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      <View style={[styles.listHeader, { borderBottomColor: Colors.gold + '30' }]}>
        <Text style={[styles.listHeaderTitle, { color: textColor }]}>TABLÓN DE ENCARGOS</Text>
        <Pressable
          onPress={() => setOrdenPrioridad(p => !p)}
          style={[styles.sortBtn, { borderColor: Colors.gold, backgroundColor: ordenPrioridad ? Colors.gold : 'transparent' }]}
        >
          <Text style={[styles.sortBtnText, { color: ordenPrioridad ? '#fff' : Colors.gold }]}>
            {ordenPrioridad ? '★ S→D' : '↕ PRIORIDAD'}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.topHeader}>
        <Text style={[styles.topHeaderTitle, { color: Colors.gold }]}>GREMIO TASKFLOW</Text>
        <View style={styles.topHeaderButtons}>
          <Pressable onPress={() => setMostrarFiltros(true)} style={[styles.headerBtn, { borderColor: Colors.gold }]}>
            <Text style={[styles.headerBtnText, { color: textColor }]}>⚙️ FILTROS</Text>
          </Pressable>
          <Pressable onPress={toggleTheme} style={[styles.headerBtn, { borderColor: Colors.gold }]}>
            <Text style={[styles.headerBtnText, { color: textColor }]}>{isDark ? '☀️ LUZ' : '🌙 OSC.'}</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={misionesFiltradas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskCard mision={item} onToggle={toggle} onEdit={setEditMision} onDelete={eliminar} isDark={isDark} />
        )}
        ListHeaderComponent={headerContent}
        contentContainerStyle={[styles.listContent, { backgroundColor: bg }]}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => {}} tintColor={Colors.gold} />}
      />

      <Pressable onPress={() => router.push('/nueva-mision')} style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      {/* MODAL LATERAL - FILTROS COMPLETOS */}
      <Modal visible={mostrarFiltros} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setMostrarFiltros(false)} />
          <SafeAreaView style={[styles.sideMenu, { backgroundColor: bg, borderLeftColor: Colors.gold + '50' }]}>
            <ScrollView contentContainerStyle={{ padding: Spacing.lg }}>
              <Text style={[styles.sideMenuTitle, { color: textColor }]}>OPCIONES TÁCTICAS</Text>
              
              {/* ESTADO */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>ESTADO</Text>
                <View style={styles.filterRow}>
                  {FILTROS_ESTADO.map(f => (
                    <Pressable key={f} onPress={() => setFiltroEstado(f)} style={[styles.filterChip, { borderColor: filtroEstado === f ? Colors.gold : borderColor }, filtroEstado === f && { backgroundColor: Colors.gold + '15' }]}>
                      <Text style={[styles.filterChipText, { color: filtroEstado === f ? Colors.gold : Colors.stone500 }]}>{f.toUpperCase()}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* RANGOS */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>RANGOS</Text>
                <View style={styles.filterRow}>
                  {RANGOS.map(r => (
                    <Pressable key={r} onPress={() => toggleFilter(r, filtroRangos, setFiltroRangos)} style={[styles.rangoChip, { borderColor: filtroRangos.has(r) ? Colors.gold : borderColor }, filtroRangos.has(r) && { backgroundColor: Colors.gold + '22' }]}>
                      <Text style={[styles.rangoChipText, { color: filtroRangos.has(r) ? Colors.gold : Colors.stone500 }]}>{r}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* CATEGORÍAS */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>CATEGORÍAS</Text>
                <View style={styles.filterRow}>
                  {CATEGORIAS.map(c => (
                    <Pressable key={c} onPress={() => toggleFilter(c, filtroCategorias, setFiltroCategorias)} style={[styles.filterChip, { borderColor: filtroCategorias.has(c) ? Colors.gold : borderColor }, filtroCategorias.has(c) && { backgroundColor: Colors.gold + '15' }]}>
                      <Text style={[styles.filterChipText, { color: filtroCategorias.has(c) ? Colors.gold : Colors.stone500 }]}>{c.toUpperCase()}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Pressable onPress={() => { setMostrarFiltros(false); cargarElite(); }} style={styles.eliteBtn}>
                <Text style={styles.eliteBtnText}>⚔ AÑADIR ÉLITE</Text>
              </Pressable>

              <Pressable onPress={() => setMostrarFiltros(false)} style={[styles.closeBtn, { borderColor }]}>
                <Text style={[styles.closeBtnText, { color: textColor }]}>CERRAR</Text>
              </Pressable>
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>

      <EditModal visible={!!editMision} mision={editMision} onSave={editar} onClose={() => setEditMision(null)} isDark={isDark} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  topHeaderTitle: { fontFamily: 'PressStart2P_400Regular', fontSize: 9 },
  topHeaderButtons: { flexDirection: 'row', gap: 8 },
  headerBtn: { paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderRadius: 2 },
  headerBtnText: { fontFamily: 'PressStart2P_400Regular', fontSize: 7 },
  listContent: { padding: Spacing.lg, paddingTop: 0, paddingBottom: 100 },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { fontFamily: 'PressStart2P_400Regular', fontSize: 7, marginBottom: 8 },
  searchInput: { padding: 10, borderWidth: 1, fontFamily: 'Lora_400Regular' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterChip: { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 2 },
  filterChipText: { fontFamily: 'PressStart2P_400Regular', fontSize: 6 },
  rangoChip: { width: 34, height: 34, borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 2 },
  rangoChipText: { fontFamily: 'PressStart2P_400Regular', fontSize: 9 },
  eliteBtn: { borderWidth: 2, padding: 12, alignItems: 'center', marginBottom: 20, borderColor: Colors.gold },
  eliteBtnText: { fontFamily: 'PressStart2P_400Regular', fontSize: 8, color: Colors.gold },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottomWidth: 1, marginBottom: 12 },
  listHeaderTitle: { fontFamily: 'PressStart2P_400Regular', fontSize: 8 },
  sortBtn: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 2 },
  sortBtnText: { fontFamily: 'PressStart2P_400Regular', fontSize: 7 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, backgroundColor: Colors.gold, borderRadius: 2, alignItems: 'center', justifyContent: 'center', elevation: 8 },
  fabText: { fontSize: 28, color: '#fff' },
  modalOverlay: { flex: 1, flexDirection: 'row' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sideMenu: { width: '75%', borderLeftWidth: 1 },
  sideMenuTitle: { fontFamily: 'PressStart2P_400Regular', fontSize: 9, marginBottom: 20 },
  closeBtn: { borderWidth: 1, padding: 12, alignItems: 'center', borderRadius: 2 },
  closeBtnText: { fontFamily: 'PressStart2P_400Regular', fontSize: 7 },
});