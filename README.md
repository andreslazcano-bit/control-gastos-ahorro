# Control de gastos y ahorro

Aplicación web personal para llevar el control de ingresos, gastos por
categoría (con presupuesto mensual) y metas de ahorro. Es de uso individual
(sin login de usuarios) y **toda la información se guarda únicamente en el
`localStorage` del navegador** — no hay backend ni base de datos.

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
- Exportar/Importar datos como archivo `.json` (respaldo manual, ya que todo
  vive en el navegador).
- Pantalla de bloqueo con PIN de 4 dígitos. **Esto es solo un filtro visual
  básico, no seguridad real**: el PIN vive en el código del lado del
  cliente, así que cualquiera con acceso al código fuente puede verlo. No lo
  uses para proteger información sensible.

## Stack técnico

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- Persistencia 100% client-side vía `localStorage` (`src/lib/storage.ts`)
- Sin variables de entorno ni servicios externos requeridos

## Correr localmente

Requisitos: Node.js 20+ y npm.

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador. Te va a
pedir un PIN de 4 dígitos para entrar; el valor está definido en la constante
`CORRECT_PIN` de `src/components/PinGate.tsx` y se puede cambiar ahí
directamente.

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
4. Vercel detecta automáticamente que es un proyecto Next.js — no hace falta
   configurar variables de entorno ni build command personalizado. Solo haz
   clic en **"Deploy"**.
5. En un par de minutos tendrás una URL pública (`*.vercel.app`) con la app
   funcionando.

Cada vez que hagas `git push` a la rama principal, Vercel vuelve a desplegar
automáticamente.

## Respaldo de tus datos

Como los datos viven solo en el navegador (un dispositivo, un navegador),
usa el botón **"Exportar datos"** (visible en la barra superior y en
Configuración) periódicamente para descargar un `.json` de respaldo. Si
necesitas restaurarlos —por ejemplo, en otro navegador o dispositivo— usa
**"Importar datos"** y selecciona ese archivo. Importar reemplaza todos los
datos actuales.

## Estructura del proyecto

```
src/
  app/                 páginas (App Router): dashboard, metas, transacciones, configuración
  components/          componentes de UI reutilizables
  context/DataContext.tsx  estado global + operaciones CRUD sobre los datos
  lib/
    storage.ts         carga/guarda en localStorage, datos por defecto, export/import
    calculations.ts    agregaciones mensuales (gasto por categoría, capacidad de ahorro, etc.)
    format.ts          formato de moneda (CLP) y fechas
  types/index.ts        tipos de TypeScript: Ingreso, Categoría, Gasto, Meta
```
