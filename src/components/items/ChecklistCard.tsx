export const ChecklistCard = ({ checklist, isDark }: { checklist: ChecklistNote; isDark: boolean }) => {
    const completed = checklist.items.filter(i => i.isCompleted).length;
    const total = checklist.items.length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
  
    return (
      <View style={[styles.card, { backgroundColor: isDark ? Colors.zinc900 : '#fff' }]}>
        <Text style={[styles.title, { color: Colors.gold }]}>{checklist.title}</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{completed}/{total} TAREAS COMPLETADAS</Text>
      </View>
    );
  };
  // Estilos similares, añadiendo el diseño de la barra de progreso...