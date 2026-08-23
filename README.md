# Control de gastos y ahorro

Aplicación web personal para llevar el control de ingresos, gastos por
categoría (con presupuesto mensual) y metas de ahorro. Es de uso individual
(un solo usuario, autenticado con Google) e instalable como app en el
celular (PWA). Los datos se guardan en **Firestore** y se sincronizan en
tiempo real entre todos los dispositivos donde inicies sesión.

Incluye:

- Dashboard mensual con ingreso, gasto, capacidad de ahorro teórica y ahorro
  real, más el avance de cada categoría de gasto contra su presupuesto.
- Metas de ahorro con barra de progreso, aportes/retiros y protección
  especial para metas marcadas como "protegidas" (pide confirmación antes de
  reducir el acumulado).
- Registro rápido de transacciones (gastos e ingresos) e historial filtrable
  por mes y categoría, con edición y eliminación.
- Gráficos de tendencia de gasto mensual y distribución de gasto por
  categoría.
- Exportar/Importar datos como archivo `.json` (respaldo manual adicional a
  la sincronización automática).
- Login con Google (Firebase Authentication) — es lo que te identifica como
  dueño de los datos y permite que se sincronicen entre dispositivos.
- Instalable en el iPhone: abre la URL en Safari → compartir → "Agregar a
  pantalla de inicio". Queda como un ícono normal, en pantalla completa.

## Stack técnico

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase](https://firebase.google.com): Authentication (Google Sign-In) +
  Firestore (base de datos, con persistencia offline)
- PWA: manifest + íconos generados + service worker básico para uso offline

## Configurar Firebase (una sola vez)

1. Crea un proyecto en la [consola de Firebase](https://console.firebase.google.com).
2. **Build → Firestore Database → Crear base de datos** (modo producción).
   Pega las reglas de seguridad de [`firestore.rules`](./firestore.rules) en
   la pestaña "Reglas" de Firestore — restringen cada documento a su propio
   dueño.
3. **Build → Authentication → Sign-in method → Google** → habilitar.
4. **Authentication → Settings → Authorized domains** → agrega el dominio
   donde vayas a desplegar (ej. `tu-proyecto.vercel.app`).
5. En la página principal del proyecto, agrega una app Web (ícono `</>`) y
   copia el objeto `firebaseConfig` que te muestra.

## Correr localmente

Requisitos: Node.js 20+ y npm.

```bash
cp .env.example .env.local   # y completa con los valores de tu firebaseConfig
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) e inicia sesión con
Google.

Otros comandos útiles:

```bash
npm run build   # build de producción
npm run start   # sirve el build de producción
npm run lint    # linter
```

## Desplegar en Vercel

1. Sube este repositorio a GitHub (o usa el que ya está creado).
2. Entra a [vercel.com](https://vercel.com), inicia sesión y elige
   **"Add New… → Project"**.
3. Selecciona **"Import Git Repository"** y elige este repositorio.
4. Antes de desplegar, agrega las variables de entorno de `.env.example`
   (con los valores reales de tu `firebaseConfig`) en la sección
   **"Environment Variables"** del import.
5. Deploy. En un par de minutos tendrás una URL pública (`*.vercel.app`) con
   la app funcionando.

Cada vez que hagas `git push` a la rama principal, Vercel vuelve a desplegar
automáticamente.

## Respaldo de tus datos

Aunque los datos ya se sincronizan solos vía Firestore, el botón
**"Exportar datos"** (barra superior y Configuración) sigue disponible para
descargar un `.json` de respaldo manual. **"Importar datos"** reemplaza
todos los datos actuales por el contenido de ese archivo.

## Estructura del proyecto

```
src/
  app/                  páginas (App Router): dashboard, metas, transacciones, configuración
  components/           componentes de UI reutilizables
  context/
    AuthContext.tsx      estado de sesión (Firebase Auth, Google Sign-In)
    DataContext.tsx       estado global + operaciones CRUD, sincronizadas con Firestore
  lib/
    firebase.ts          inicialización del SDK de Firebase (auth + Firestore)
    storage.ts            datos por defecto, export/import, migración de datos legacy en localStorage
    calculations.ts      agregaciones mensuales (gasto por categoría, capacidad de ahorro, etc.)
    format.ts             formato de moneda (CLP) y fechas
  types/index.ts          tipos de TypeScript: Ingreso, Categoría, Gasto, Meta
firestore.rules           reglas de seguridad de Firestore (cada usuario solo ve sus datos)
```
