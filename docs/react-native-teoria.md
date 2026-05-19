# React Native — Teoría técnica

## 1. React Native vs app nativa

Una app nativa se escribe en el lenguaje propio del sistema operativo: Swift/Objective-C para iOS, Kotlin/Java para Android. Cada plataforma tiene sus propios componentes de UI, sus propias APIs y su propio ciclo de compilación.

React Native no genera HTML que se renderiza en un WebView (eso sería una app híbrida como Cordova). En su lugar, el código JavaScript que escribes se traduce en llamadas al sistema operativo para crear **componentes nativos reales**. Cuando usas `<View>` obtienes un `UIView` en iOS o un `android.view.View` en Android. El aspecto y el rendimiento son los de una app nativa.

La arquitectura tiene dos hilos que se comunican:

- **JS Thread**: donde corre tu código React y la lógica de negocio.
- **UI Thread (nativo)**: donde se renderizan los componentes del sistema operativo.

Cuando el JS thread se bloquea (operaciones pesadas síncronas), la interfaz se congela porque los eventos de toque no pueden procesarse. Por eso las operaciones costosas deben hacerse de forma asíncrona.

---

## 2. Metro Bundler

Metro es el bundler de JavaScript que usa React Native (y Expo). Su función es parecida a la de Webpack en el mundo web: toma todos tus archivos TypeScript/JavaScript, los transforma (eliminando tipos, transpilando JSX) y los empaqueta en un único bundle que la app puede ejecutar.

Durante el desarrollo, Metro actúa como servidor y permite **Fast Refresh**: cuando guardas un archivo, Metro recalcula solo los módulos afectados y los envía a la app en ejecución sin necesidad de recargar toda la aplicación ni perder el estado.

Para producción web (`npx expo export --platform web`), Metro genera el bundle estático que se sirve desde `dist/`.

---

## 3. Expo Go vs Development Build

**Expo Go** es una app genérica disponible en las tiendas de Apple y Google que incluye un runtime de Expo precompilado. Escaneas el QR que genera Metro y tu app corre inmediatamente, sin compilar ningún binario. Es ideal para empezar rápido.

Su limitación es que solo puede ejecutar código que use las APIs incluidas en ese runtime. Si tu proyecto necesita un módulo nativo que Expo Go no incluye (cámara personalizada, notificaciones push con configuración avanzada, biometría, pagos nativos), Expo Go no puede ejecutarlo.

**Development Build** es un binario propio generado con EAS Build que incluye exactamente las dependencias nativas que tu proyecto necesita. Es más lento de configurar pero es el estándar en proyectos reales porque no impone restricciones sobre qué módulos nativos puedes usar.

En este proyecto usamos Expo Go para desarrollo y `expo export --platform web` para producción web.

---

## 4. Sistema de diseño

Antes de escribir componentes, es importante definir los **tokens visuales** del proyecto: colores, tipografía y espaciado. Esto garantiza consistencia visual y facilita los cambios globales.

En este proyecto los tokens están en `src/constants/colors.ts`:

- **Paleta**: zinc (oscuros), stone (neutros), gold (acento), colores de rango (S/A/B/C/D).
- **Tipografía**: PressStart2P para títulos y etiquetas de interfaz, Lora para contenido de lectura.
- **Espaciado**: escala fija (xs, sm, md, lg, xl) para padding y gap.

El modo oscuro y claro se gestiona con `useColorScheme` de React Native, expuesto globalmente a través de `ThemeContext`.

Se evaluaron dos librerías UI antes de decidir el sistema de diseño propio:

- **Gluestack UI**: filosofía similar a Tailwind, muy personalizable, ideal para identidades visuales únicas como la de este proyecto (estética RPG/gremio).
- **React Native Paper**: implementación de Material Design, lista para usar, mejor para apps corporativas estándar.

Se optó por **tokens propios sin librería UI** porque el diseño del proyecto requiere una estética muy específica que las librerías genéricas habrían complicado en lugar de simplificar.

---

## 5. Navegación con Expo Router

Expo Router mapea el sistema de archivos a rutas de navegación, igual que Next.js en web. Cada archivo en `app/` es una ruta.

### Tipos de navegación

**Stack**: navegación en pila. Al navegar a una pantalla nueva, la anterior queda debajo. El botón de atrás vuelve a la pantalla anterior. Se usa para el flujo de detalle (lista → detalle de item).

**Tabs**: barra de pestañas en la parte inferior. Todas las pantallas del grupo están montadas simultáneamente; cambiar de pestaña no destruye el estado. Se usa para la navegación principal del proyecto (Tareas, Stats, Listas, Perfil).

**Modal**: pantalla que se superpone parcialmente sobre la actual, indicando que es una acción temporal. Se usa para crear nuevas notas o misiones sin abandonar la pantalla actual.

### Rutas dinámicas

`app/tareas/[id].tsx` captura cualquier ruta `/tareas/algo` y expone el segmento `id` como parámetro via `useLocalSearchParams()`. Permite reutilizar la misma pantalla para cualquier misión sin duplicar código.

### Grupos de rutas

`app/(tabs)/` es un grupo de rutas (los paréntesis indican que el nombre del directorio no forma parte de la URL). Agrupa las pantallas de las pestañas y les aplica el `_layout.tsx` común sin añadir un segmento extra a la ruta.

---

## 6. Modelado de datos con TypeScript

Los tipos del proyecto están en `src/types/index.ts`. Se usa herencia de interfaces para evitar repetición:

```typescript
interface BaseNote {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

interface Note extends BaseNote { content: string; }
interface ChecklistNote extends BaseNote { items: ChecklistItem[]; }
interface IdeaNote extends BaseNote { tags: string[]; color: string; }

type AnyNote = Note | ChecklistNote | IdeaNote;
```

El tipo de unión `AnyNote` permite funciones que aceptan cualquier tipo de nota. Para distinguirlos en tiempo de ejecución se usan **type guards**: `'items' in note` devuelve `true` solo si `note` es un `ChecklistNote`, porque es la única interfaz que tiene esa propiedad.

---

## 7. Rendimiento en listas — FlashList

`FlatList` (la lista estándar de React Native) tiene un problema conocido con listas largas: recicla componentes de forma poco agresiva y puede mostrar pantallas en blanco al hacer scroll rápido porque los componentes se están montando.

**FlashList** de Shopify resuelve esto manteniendo un pool de componentes reciclados y reasignándolos a nuevos items sin destruir y recrear el DOM nativo. El resultado es un scroll más fluido y sin flashes blancos.

La propiedad `estimatedItemSize` le indica a FlashList cuánto espacio ocupará cada elemento antes de renderizarlo. Cuanto más preciso sea el valor, mejor calculará FlashList el número de componentes que necesita en el pool y más eficiente será el reciclaje.

---

## 8. Gestión de estado — useState vs Context API vs Zustand

### useState

Estado local de un componente. Solo accesible desde ese componente y sus hijos directos via props. Adecuado para estado de UI efímero: si un modal está abierto, el texto de un input.

### Context API

Permite compartir estado entre componentes sin pasar props manualmente por cada nivel. El problema es que cualquier cambio en el valor del contexto provoca el re-render de **todos** los componentes suscritos, aunque el cambio no les afecte. En apps grandes esto genera re-renders innecesarios que degradan el rendimiento.

### Zustand

Store global sin providers. Los componentes se suscriben a selectores específicos y solo se re-renderizan cuando cambia exactamente el trozo de estado que les interesa. La API es más simple que Redux y no requiere boilerplate.

```typescript
// Solo se re-renderiza cuando cambia `notes`, no cuando cambia `checklists`
const notes = useNotesStore(s => s.notes);
```

En este proyecto Zustand gestiona las notas, listas e ideas. Las misiones usan un store manual con módulo en memoria + localStorage porque son datos de juego local que no van a la API.

---

## 9. Persistencia

### AsyncStorage (Fase 6)

AsyncStorage es el equivalente de localStorage en React Native: almacenamiento clave-valor asíncrono en el dispositivo. Se integra con Zustand mediante el middleware `persist`, que serializa el estado a JSON y lo guarda automáticamente en cada cambio.

Limitaciones: sin cifrado, límite de tamaño (~6MB), datos solo en ese dispositivo.

Durante el arranque de la app, Zustand necesita leer AsyncStorage antes de tener el estado disponible. Este proceso se llama **rehidratación**. Mientras ocurre, `useNotesStore.persist.hasHydrated()` devuelve `false` y se puede mostrar un indicador de carga.

### API REST + PostgreSQL (Fase 7)

En la Fase 7 AsyncStorage se eliminó para las notas. La fuente de verdad es ahora el servidor. Los datos se cargan con `fetchNotes()` al montar la app y cada operación (crear, borrar, marcar) llama a la API y actualiza el store en memoria.

Las misiones siguen usando localStorage (web) porque son datos de juego local que no necesitan sincronizarse entre dispositivos.
