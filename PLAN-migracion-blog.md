# Plan de migración del blog de mueblesfran.barcelona a Sanity

**Fuente**: https://mueblesfran.barcelona (WordPress).
**Destino**: dataset de Sanity `0g6vki0n/production`, tipo `noticia`.
**Volumen**: ~255 posts (desde 2018-02 hasta 2026-04). Cada uno con título, contenido, imagen destacada y fecha.

---

## 1. Qué tenemos a favor

- La web antigua expone **`/wp-json/wp/v2/posts`** sin autenticación. Podemos leer todos los posts programáticamente, sin scraping de HTML.
- Cada post trae: `id`, `slug`, `title`, `date`, `content.rendered` (HTML), `excerpt.rendered`, `featured_media` (ID), `categories`.
- La imagen destacada se resuelve vía `/wp-json/wp/v2/media/{id}` → campo `source_url` con la URL del JPG original.
- El schema `noticia` en Sanity ya existe (`sanity/schemas/noticia.ts`) con los campos que necesitamos: `titulo`, `slug`, `fecha`, `imagen`, `resumen`, `contenido`. Todo editable desde el dashboard.
- El frontend ya renderiza posts en `/novedades` y `/novedades/[slug]` (`src/pages/novedades/index.astro` y `[slug].astro`). No hace falta tocarlo.

---

## 2. Arquitectura del script de migración

Archivo a crear: `scripts/migrate-wp-blog.mjs`

Flujo:

```
┌─ 1. Fetch lista de posts (paginado, 100 x request)
│
├─ 2. Para cada post:
│    ├─ 2a. Fetch de /media/{featured_media} → source_url
│    ├─ 2b. Descarga imagen (stream binario)
│    ├─ 2c. Sube imagen a Sanity → asset reference
│    ├─ 2d. Convierte content HTML → Portable Text (bloque Sanity)
│    └─ 2e. Upsert del documento noticia
│
└─ 3. Resumen final: X creados, Y saltados, Z errores.
```

Dependencias a añadir (dev only):

```json
"@sanity/block-tools": "^3.x",
"jsdom": "^25.x"
```

`@sanity/block-tools` convierte HTML a Portable Text respetando cabeceras, negritas, listas, enlaces y bloques de imagen. Es el conversor oficial recomendado por Sanity.

`jsdom` da a `block-tools` el entorno DOM que necesita en Node.

---

## 3. Mapeo de campos

| WordPress                 | Sanity (`noticia`)            | Notas |
|---|---|---|
| `title.rendered`          | `titulo`                      | Decodificar entidades HTML (`&#8211;` → `–`). |
| `slug`                    | `slug.current`                | Reutilizar tal cual, así las URLs viejas y nuevas coinciden. |
| `date`                    | `fecha`                       | ISO string, compatible. |
| `excerpt.rendered`        | `resumen`                     | Strip HTML tags, truncar a 200 chars. |
| `content.rendered`        | `contenido`                   | Convertir HTML → Portable Text via `block-tools`. |
| `featured_media` → media  | `imagen`                      | Descargar, subir a Sanity, referenciar. Añadir `alt` = `alt_text` del medio. |
| `categories`              | *(ignorar por ahora)*         | El schema actual no tiene categorías. Podemos añadirlas luego si Santi las quiere. |

---

## 4. Decisiones que necesito que valides antes de ejecutar

### 4.1 Identificador del documento
- **Opción A (recomendada)**: el `_id` en Sanity = `"noticia-wp-{id}"` (ej. `noticia-wp-11902`). Fácil de identificar, permite re-correr el script de forma idempotente (upsert).
- **Opción B**: dejar que Sanity genere un ID aleatorio. Más limpio, pero si hay que re-migrar, duplica.

### 4.2 Slugs colisionando
Hay posts con slugs similares que podrían chocar con contenido que Santi ya haya creado en Sanity. Antes de ejecutar, el script hará `fetch` del listado de `noticia` ya existentes en Sanity y marcará conflictos para que tú decidas.

### 4.3 Contenido con shortcodes o bloques de WordPress raros
Algunos posts viejos (2018-2019) pueden tener shortcodes tipo `[gallery]`, tablas, o HTML de plugins. El conversor los dejará como bloque `html` preservando el texto. Habrá que revisar visualmente los 10-15 posts más antiguos tras la migración.

### 4.4 Imágenes
- **~255 imágenes destacadas**. Peso total estimado: 80-200 MB.
- El plan gratis de Sanity incluye 500 MB de assets y 200 MB de bandwidth/mes. Con este volumen estamos **dentro del límite gratis**, pero sin margen. Si en el futuro añadimos más media, habrá que pasar a plan Growth.
- Imágenes **dentro** del contenido del post (no la destacada): el script las dejará como `<img src="URL original en WordPress">` en el Portable Text. Si la web antigua se apaga, esas imágenes se rompen. **Opción**: rastrear y re-subir todas las imágenes embebidas a Sanity también (más trabajo y más peso).

### 4.5 Fechas de publicación
Las fechas se copian tal cual. Algunos posts tienen fecha en el futuro (2026-04-21). Se respeta — si Santi quiere reordenar, lo hace desde Sanity.

---

## 5. Decisiones abiertas (voy a preguntarte)

1. ¿Migramos **todas las imágenes inline** (re-subir a Sanity) o dejamos las URLs apuntando al WordPress viejo (riesgo si se apaga)?
2. ¿Quieres que añada el campo **categorías** al schema de noticia antes de migrar, o lo dejamos plano (sin categorías)?
3. ¿Hay posts que **no quieres migrar** (spam viejo, pruebas, etc.)? Si me pasas un listado de IDs a excluir, los salto.
4. Tras migrar, ¿quieres **redirecciones 301** de las URLs viejas (`mueblesfran.barcelona/...`) a las nuevas? Esto afecta a la antigua web, no a la nueva.

---

## 6. Plan de ejecución (pasos concretos)

### Fase 1 — Preparación (30 min)
1. Añadir `@sanity/block-tools` y `jsdom` a `devDependencies` en `package.json`.
2. `npm install`.
3. Crear `scripts/migrate-wp-blog.mjs` con el flujo descrito.
4. Crear `scripts/dry-run-wp-blog.mjs` — igual pero NO escribe en Sanity. Solo lista qué va a hacer y saca un reporte en JSON.

### Fase 2 — Dry run (10 min)
5. Conseguir un `SANITY_TOKEN` de tipo **Editor** (lo obtienes en https://www.sanity.io/manage/project/0g6vki0n → API → Tokens → Add API token).
6. `SANITY_TOKEN=xxx node scripts/dry-run-wp-blog.mjs`
7. Te paso el reporte → revisamos juntos los posts raros / conflictos de slug.

### Fase 3 — Migración real (15-30 min de ejecución)
8. `SANITY_TOKEN=xxx node scripts/migrate-wp-blog.mjs`
9. El script tarda unos 15-30 min porque descarga+sube 255 imágenes.
10. Al terminar muestra resumen: `253 creados, 0 errores` (ejemplo).

### Fase 4 — Verificación (20 min)
11. Abrir https://mueblesfran.sanity.studio/ → listado de Novedades → comprobar que están las ~255 entradas.
12. Abrir la web en el preview → `/novedades` → verificar que se ven las imágenes, títulos, resúmenes.
13. Abrir 3-4 posts al azar (uno nuevo, uno medio, uno de 2018) → revisar que el contenido se ve bien.
14. Si algo está mal: arreglo manual en el Studio o re-correr script sobre ese `_id` concreto.

### Fase 5 — Redirecciones 301 (opcional, si decides hacerlo)
15. Añadir en la web antigua (WordPress → plugin "Redirection" o .htaccess) reglas del estilo:
    ```
    /blog/cocinas-de-diseno-en-barcelona-... → https://mueblesfran.com/novedades/cocinas-de-diseno-en-barcelona-...
    ```
    Para evitar perder SEO.

---

## 7. Backup / seguridad

- Antes de la migración real: el script hará un `export` completo del dataset actual de Sanity como backup, por si algo va muy mal. Comando: `npx sanity dataset export production backup-antes-migracion.tar.gz`.
- Si algo sale mal: `npx sanity dataset import backup-antes-migracion.tar.gz production` revierte todo.
- La migración **no afecta al schema** (que ya existe), solo crea/actualiza documentos tipo `noticia`.

---

## 8. Estimación de trabajo

| Fase | Mío (código) | Tuyo (ejecución y revisión) |
|---|---|---|
| 1. Preparación + script | 1-1.5 h | 5 min (revisar diff) |
| 2. Dry run + análisis | 15 min | 10 min |
| 3. Ejecución | 0 | 30 min (lanza y espera) |
| 4. Verificación | 15 min | 20 min |
| **Total** | **~2h** | **~1h** |

---

## 9. Siguiente paso

Respondes las 4 decisiones abiertas de §5 y te creo la rama `feat/migrate-wp-blog`, escribo los scripts, y te paso los comandos exactos para ejecutar. Igual que hicimos con el rediseño.

Mi recomendación por defecto (si no tienes preferencia): **todas las imágenes inline a Sanity (para no depender del WP viejo), sin categorías, migrar todos los posts, sin redirecciones 301 de momento** (las añadimos si queremos cerrar el WP viejo algún día).
