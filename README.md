![React Native](https://img.shields.io/badge/-React_Native-05122A?style=for-the-badge&logo=react)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=FFF)
![Next.js](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

# ⚔ TaskFlow Mobile
> App de gestión de misiones de gremio con sistema de notas sincronizado en la nube

TaskFlow es una aplicación móvil construida con Expo y React Native que combina un tablón de misiones estilo RPG con un sistema completo de notas, listas e ideas. Los datos se sincronizan en tiempo real con un backend propio desplegado en Vercel y una base de datos PostgreSQL en Neon.

| Despliegue | URL |
|------------|-----|
| App (web) | [taskflow-mobile.vercel.app](https://taskflow-mobile-nine.vercel.app) |
| API | [noteflow-api.vercel.app](https://noteflow-api-y6uh.vercel.app) |

---

## Características

- Sistema de misiones con rangos (D / C / B / A / S) y categorías
- Tres tipos de notas: texto libre, listas de tareas con progreso e ideas con etiquetas
- Autenticación con JWT — registro, login y logout
- Sincronización en la nube — los datos persisten entre dispositivos y sesiones
- Tema oscuro y claro con sistema de diseño propio
- Navegación por pestañas con Expo Router

---

## Tecnologías

| Frontend | Uso |
|----------|-----|
| React Native + Expo | Framework móvil — componentes nativos en iOS, Android y web |
| Expo Router | Navegación basada en sistema de archivos (tabs, stack, rutas dinámicas) |
| Zustand | Gestión de estado global sin providers ni re-renders innecesarios |
| Zod | Validación de esquemas en formularios antes de enviar a la API |
| TypeScript | Tipado estático con interfaces heredadas (Note, ChecklistNote, IdeaNote) |

| Backend (noteflow-api) | Uso |
|------------------------|-----|
| Next.js App Router | API REST serverless con Route Handlers |
| PostgreSQL (Neon) | Base de datos relacional con tablas notes, checklist_items, users |
| Zod | Validación de datos entrantes en cada endpoint |
| Web Crypto API | Hashing de contraseñas (SHA-256) y firma de tokens JWT (HMAC-SHA256) |

| Auxiliares | Uso |
|------------|-----|
| Vercel | Despliegue del frontend (dist estático) y del backend (serverless) |
| Neon DB | PostgreSQL serverless — escala a cero sin coste en inactividad |
| Metro Bundler | Empaquetador de Expo para web (`expo export --platform web`) |

---

## Estructura del proyecto

```
taskflow-mobile/
├── app/                        # Rutas de Expo Router
│   ├── _layout.tsx             # Layout raíz: fuentes, navegación, AppInit
│   ├── login.tsx               # Pantalla de login / registro
│   ├── (tabs)/                 # Grupo de pestañas
│   │   ├── _layout.tsx         # Barra de navegación inferior (4 tabs)
│   │   ├── index.tsx           # Pestaña Tareas → HomeScreen
│   │   ├── checklists.tsx      # Pestaña Listas
│   │   ├── estadisticas.tsx    # Pestaña Estadísticas
│   │   └── perfil.tsx          # Pestaña Perfil + logout
│   ├── tareas/[id].tsx         # Detalle de misión (ruta dinámica)
│   └── notas/[id].tsx          # Detalle de nota (ruta dinámica)
├── src/
│   ├── components/             # TaskCard, ChecklistCard, EditModal...
│   ├── constants/colors.ts     # Tokens de diseño: paleta, espaciado
│   ├── hooks/
│   │   ├── useMisiones.ts      # Store de misiones con persistencia localStorage
│   │   └── ThemeContext.tsx    # Contexto de tema oscuro/claro
│   ├── lib/api.ts              # Funciones tipadas para cada endpoint de la API
│   ├── schemas/                # Schemas Zod de validación
│   ├── screens/                # HomeScreen, LoginScreen, AddTaskScreen
│   ├── store/notesStore.ts     # Store Zustand de notas, listas e ideas
│   └── types/index.ts          # Interfaces TypeScript (AnyNote, Mision...)
├── dist/                       # Build web generado con expo export
├── assets/                     # Fuentes e imágenes
├── docs/
│   ├── idea.md                 # Definición del producto
│   ├── react-native-teoria.md  # Teoría técnica de React Native
│   ├── ai-setup.md             # Configuración de herramientas de IA
│   └── project-management.md  # Gestión del proyecto
├── sql/                        # Schema y queries (en noteflow-api)
├── vercel.json                 # Configuración de despliegue
└── app.json                    # Configuración de Expo
```

---

## Descargar y ejecutar

```bash
git clone https://github.com/OSCARaluceac/taskflow-mobile.git
cd taskflow-mobile
npm install
```

Crea un archivo `.env.local` en la raíz:

```
EXPO_PUBLIC_API_URL=https://noteflow-api-y6uh.vercel.app/api
```

Arranca el servidor de desarrollo:

```bash
npx expo start --offline
```

Escanea el QR con Expo Go (iOS/Android) o pulsa `w` para abrir en el navegador.

---

## Generar build web

```bash
npx expo export --platform web
```

El resultado se genera en `dist/`. Sube esa carpeta a Vercel como Output Directory.

## Desplegar en Vercel

1. Conecta el repositorio en [vercel.com](https://vercel.com)
2. En **Settings → Build & Deployment**:
   - Build Command: `echo "Manual build"`
   - Output Directory: `dist`
3. Añade la variable de entorno `EXPO_PUBLIC_API_URL` con la URL de tu API
4. Haz push — Vercel despliega automáticamente

---

## API — noteflow-api

El backend es un proyecto independiente en [`noteflow-api`](https://github.com/OSCARaluceac/noteflow-api). Consulta su README para el setup completo.

Endpoints principales:

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Registrar usuario |
| `POST` | `/api/auth/login` | Login — devuelve JWT |
| `GET` | `/api/notes` | Todas las notas con items |
| `POST` | `/api/notes` | Crear nota / lista / idea |
| `DELETE` | `/api/notes/:id` | Eliminar nota (cascade) |
| `PATCH` | `/api/checklist-items/:id` | Marcar/desmarcar item |

---

*Desarrollado durante las prácticas en [Corner Estudios](https://www.corner-estudios.com) — Óscar — 2026*
