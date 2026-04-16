# Muebles Fran — Web en Astro + Sanity

Web de Muebles Fran migrada a Astro con Sanity.io como CMS.

---

## Stack

| Herramienta | Para qué |
|---|---|
| **Astro** | Framework web (genera HTML estático) |
| **Sanity.io** | CMS headless (el cliente edita aquí) |
| **Vercel** | Hosting y despliegue automático |
| **GitHub** | Repositorio del código |

---

## Primeros pasos — instalación

### 1. Instala las dependencias del proyecto Astro

```bash
npm install
```

### 2. Instala las dependencias del Sanity Studio

```bash
cd sanity && npm install && cd ..
```

### 3. Copia el archivo de variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con los datos de tu proyecto Sanity (los encuentras en sanity.io → tu proyecto → Settings → API).

---

## Configurar Sanity

### 1. Crea el proyecto en sanity.io

- Ve a [sanity.io/manage](https://sanity.io/manage) → Create new project
- Nombre: `muebles-fran`
- Dataset: `production`
- Plan: Free (más que suficiente)

### 2. Rellena tu `sanity/sanity.config.ts`

Sustituye `TU_PROJECT_ID` por el ID real (lo ves en sanity.io → tu proyecto → Settings).

### 3. Arranca el Sanity Studio en local

```bash
cd sanity && npm run dev
```

El studio se abre en `http://localhost:3333`. Desde aquí el cliente editará el contenido.

### 4. Publicar el Studio online (el cliente accede desde su navegador)

```bash
cd sanity && npm run deploy
```

El Studio quedará publicado en `https://muebles-fran.sanity.studio`. Comparte esa URL con el cliente.

---

## Variables de entorno en Vercel

En Vercel → tu proyecto → Settings → Environment Variables, añade:

```
PUBLIC_SANITY_PROJECT_ID    → tu project ID de Sanity
PUBLIC_SANITY_DATASET       → production
PUBLIC_SANITY_API_VERSION   → 2024-01-01
```

---

## Redeploy automático al publicar en Sanity

Para que Vercel regenere la web cuando el cliente guarde cambios:

1. En Vercel → Settings → Git → **Deploy Hooks** → crea uno llamado `sanity-publish` → copia la URL
2. En Sanity Studio → sanity.io/manage → tu proyecto → **API** → **Webhooks** → Add webhook:
   - Name: `Vercel redeploy`
   - URL: la URL del Deploy Hook que copiaste
   - Trigger on: `publish`
   - Filter: `_type == "noticia" || _type == "paginaCategoria" || _type == "configuracion"`

Ahora cada vez que el cliente pulsa **Publicar** en Sanity, Vercel lanza un nuevo build (~1 minuto) y la web se actualiza.

---

## Desarrollo en local

```bash
# Arrancar Astro en modo dev
npm run dev
# → http://localhost:4321

# Arrancar Sanity Studio en modo dev (en otra terminal)
cd sanity && npm run dev
# → http://localhost:3333
```

---

## Copiar imágenes al proyecto

Las imágenes están en la carpeta original `img/`. Copia toda la carpeta a `public/`:

```bash
cp -r ../Muebles\ Fran\ WEB/img public/img
cp ../Muebles\ Fran\ WEB/style.css public/style.css
cp ../Muebles\ Fran\ WEB/wa-btn.js public/wa-btn.js
```

---

## Estructura del proyecto

```
├── src/
│   ├── layouts/
│   │   └── Layout.astro          ← Nav + Footer + Lightbox (compartido)
│   ├── components/
│   │   └── GaleriaCategoria.astro ← Componente reutilizable de galería
│   ├── data/
│   │   └── galerias.ts           ← Listado de todas las imágenes por carpeta
│   ├── lib/
│   │   └── sanityClient.ts       ← Cliente y queries de Sanity
│   ├── styles/
│   │   └── additions.css         ← Estilos nuevos (category-hub, blog)
│   └── pages/
│       ├── index.astro           ← Inicio
│       ├── nosotros.astro
│       ├── presupuesto.astro
│       ├── banos.astro
│       ├── cocinas.astro
│       ├── salones.astro         ← Hub con subcategorías
│       ├── salones/
│       │   ├── ambientes.astro
│       │   ├── sofas.astro
│       │   ├── mesas.astro
│       │   ├── sillas.astro
│       │   ├── butacas.astro
│       │   ├── buffets.astro
│       │   └── muebles-tv.astro
│       ├── dormitorios.astro
│       ├── dormitorios/
│       │   ├── ambientes.astro
│       │   ├── armarios.astro
│       │   ├── armarios-medida.astro
│       │   ├── vestidores.astro
│       │   └── arlex.astro
│       ├── juvenil.astro
│       ├── juvenil/
│       │   ├── ambientes.astro
│       │   ├── camas.astro
│       │   ├── armarios.astro
│       │   ├── escritorios.astro
│       │   └── literas.astro
│       └── novedades/
│           ├── index.astro       ← Listado del blog (desde Sanity)
│           └── [slug].astro      ← Artículo individual (desde Sanity)
├── public/
│   ├── img/                      ← Copia aquí las imágenes del original
│   ├── style.css                 ← Copia aquí el CSS del original
│   ├── wa-btn.js                 ← Copia aquí el JS del original
│   └── additions.css             ← Estilos nuevos (generado automáticamente)
├── sanity/
│   ├── schemas/
│   │   ├── noticia.ts
│   │   ├── configuracion.ts
│   │   └── paginaCategoria.ts
│   ├── sanity.config.ts
│   └── package.json
├── astro.config.mjs
├── vercel.json
├── .env.example
└── package.json
```

---

## Qué puede editar el cliente desde Sanity

| Sección | Qué puede cambiar |
|---|---|
| **Novedades / Blog** | Crear, editar y borrar artículos con imagen, texto y fecha |
| **Páginas de Categoría** | Título, subtítulo, descripción, características e imagen principal de cada categoría |
| **Datos de la Empresa** | Teléfono, WhatsApp, email, dirección, horario y logo |

Las galerías de fotos se gestionan subiendo imágenes a la carpeta `public/img/` del repositorio (a través de GitHub o directamente con Cursor).
