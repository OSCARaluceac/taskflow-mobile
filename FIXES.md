# TaskFlow Mobile — Correcciones aplicadas

## Errores corregidos (6 bugs críticos)

### 1. `src/types/index.ts` — Tipos `Mision` y `Categoria` faltantes
**Problema:** El archivo solo tenía tipos de notas. `useMisiones`, `TaskCard`, `EditModal`, `HomeScreen` y `AddTaskScreen` importaban `Mision` y `Categoria` que no existían → crash de TypeScript en build.  
**Solución:** Añadidos `interface Mision` y `type Categoria` al inicio del archivo.

---

### 2. `app/(tabs)/index.tsx` — Pantalla de notas en lugar de misiones
**Problema:** Este archivo importaba `NotesScreen` y `useNotesStore`/`NoteCard`. La pestaña principal mostraba notas, no el tablón de misiones.  
**Solución:** Reemplazado completamente para reexportar `HomeScreen`.

---

### 3. `app/_layout.tsx` — Sin carga de fuentes (pantalla en blanco en iOS)
**Problema:** Las fuentes `PressStart2P` y `Lora` se usaban en `fontFamily` de StyleSheet pero **nunca se cargaban** con `useFonts`. En iOS esto causa pantalla en blanco; en Android usa la fuente del sistema silenciosamente.  
**Solución:** Añadidos `useFonts` + `@expo-google-fonts/press-start-2p` + `@expo-google-fonts/lora` + `SplashScreen.preventAutoHideAsync()`. Spinner de carga mientras las fuentes no estén listas.

---

### 4. `src/components/StatsPanel.tsx` — Props interface desincronizada
**Problema:** La interfaz solo declaraba `{ total, pendientes, porcentaje }`. Todos los sitios que lo usan pasan `{ ...stats }` que incluye también `completadas` → error de tipos + valor silenciosamente ignorado.  
**Solución:** Añadida `completadas: number` a la interfaz. Añadida barra de progreso que faltaba.

---

### 5. `app/(tabs)/checklists.tsx` — Archivo vacío sin `export default`
**Problema:** El archivo existía pero estaba completamente vacío. Expo Router lo detecta como ruta, intenta renderizarlo y crashea al no encontrar ningún componente exportado.  
**Solución:** Añadida pantalla placeholder con `export default ChecklistsScreen`. También registrada en `_layout.tsx` de tabs con su icono.

---

### 6. `app/tareas/[id].tsx` — `useMisiones` sin estado compartido (siempre vacío)
**Problema:** `useMisiones` es un hook local con `useState` propio, no un store global. Cada pantalla que lo llama tiene su **propia instancia vacía** hasta que AsyncStorage carga. La pantalla de detalle nunca encontraba la misión.  
**Solución:** La pantalla de detalle ahora lee directamente de `AsyncStorage` con el `id` de la ruta, sin depender de otra instancia del hook.

---

### 7. `app/(tabs)/perfil.tsx` — Imagen de `via.placeholder.com` da 404
**Problema:** `via.placeholder.com` está caído/bloqueado en muchos entornos. La imagen fallaba silenciosamente o rompía el layout.  
**Solución:** Reemplazado `<Image>` por un avatar emoji generado con `<View>` + `<Text>`. Añadidas estadísticas reales del hook.

---

## Dependencias añadidas a `package.json`

```
@expo-google-fonts/press-start-2p  ^0.3.0
@expo-google-fonts/lora            ^0.3.0
expo-font                          ~14.0.0
expo-splash-screen                 ~0.29.22
```

Instalar con:
```bash
npx expo install @expo-google-fonts/press-start-2p @expo-google-fonts/lora expo-font expo-splash-screen
```
