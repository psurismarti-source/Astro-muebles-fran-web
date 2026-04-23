# Migración del blog de mueblesfran.barcelona a Sanity

Scripts para traer los ~255 posts de WordPress al CMS Sanity como documentos tipo `noticia`.

## 1. Pre-requisitos

- Node ≥ 18 (tu Mac ya lo tiene).
- `npm install` en la raíz del repo (instala las nuevas deps: `@sanity/block-tools` y `jsdom`).
- Un **token de Sanity con permisos Editor**. Lo sacas en:
  https://www.sanity.io/manage/project/0g6vki0n → API → Tokens → "Add API token" → Permissions: **Editor**.
  Copia el token (solo se muestra una vez).

## 2. Dry run (sin tocar Sanity)

```bash
SANITY_TOKEN=pegatokenaqui npm run migrate:blog:dry
```

Tarda ~2-3 min (pide info de todos los posts y las imágenes, sin subir nada). Al terminar genera `scripts/reports/dry-run-wp-blog.json` con:

- Lista de los 255 posts y sus slugs.
- Qué posts tienen conflicto con noticias ya creadas en Sanity.
- Cuántos posts tienen contenido raro (shortcodes, tablas, iframes).
- Cuántas imágenes inline hay en total.

Revísalo antes de la migración real. Si hay conflictos o cosas raras, avisa.

## 3. Prueba con pocos posts primero

Para no migrar los 255 a la primera, haz una prueba con 3:

```bash
SANITY_TOKEN=pegatokenaqui npm run migrate:blog -- --limit=3
```

Los `_id` serán `noticia-wp-11902`, `noticia-wp-11900`, `noticia-wp-11740`. Míralos en el Studio: https://mueblesfran.sanity.studio/ → 📰 Novedades.

Si algo no te convence, **borra esos 3 desde el Studio** o re-ejecuta con `--force` después de ajustar el script.

## 4. Migración completa

```bash
SANITY_TOKEN=pegatokenaqui npm run migrate:blog
```

Tarda ~20-40 min (descarga+sube cada imagen destacada y las inline). Puedes ir haciendo otras cosas, deja el terminal corriendo.

Al terminar: `scripts/reports/migrate-wp-blog.log.json` con el resumen de creados/actualizados/errores.

## 5. Re-correr tras un error

Los documentos tienen `_id` determinista (`noticia-wp-{wpId}`), así que si re-ejecutas:
- Los que ya existen los salta (log `skipped`).
- Si quieres sobrescribirlos (p. ej. tras corregir el script): añade `--force`.

```bash
SANITY_TOKEN=pegatokenaqui npm run migrate:blog -- --force
```

## 6. Migrar solo un post concreto

Si un post específico sale raro y lo quieres re-migrar después de arreglarlo:

```bash
SANITY_TOKEN=pegatokenaqui npm run migrate:blog -- --only=11902 --force
```

## 7. Qué hace exactamente el script

Por cada post de WP:

1. Lee los campos `id, slug, title, date, content, excerpt, featured_media`.
2. Descarga la imagen destacada → la sube a Sanity → guarda la referencia al asset.
3. Recorre el HTML buscando `<img>` → descarga cada uno → sube a Sanity → guarda las referencias.
4. Convierte el HTML a Portable Text (formato rico de Sanity) respetando H2, H3, negritas, cursivas, listas, enlaces e imágenes embebidas en el orden correcto.
5. Crea el documento con `_id = noticia-wp-{wpId}`.

Los slugs de la nueva web serán iguales a los de WordPress, así que las URLs `mueblesfran.com/novedades/{slug}` coincidirán con las antiguas `mueblesfran.barcelona/{slug}`.

## 8. Backup previo (recomendado)

Antes de ejecutar la migración completa, guarda un export del dataset por si acaso:

```bash
cd sanity
npx sanity dataset export production ../backup-antes-migracion.tar.gz
cd ..
```

Si algo va mal:

```bash
cd sanity
npx sanity dataset import ../backup-antes-migracion.tar.gz production
```

## 9. Limpieza tras la migración

- Los reportes en `scripts/reports/` están gitignoreados, no se suben al repo.
- El `backup-antes-migracion.tar.gz` lo puedes borrar o guardar fuera del repo (no subirlo nunca a git).
- Una vez los 255 posts estén en producción y Santi confirme que se ven bien, puedes cerrar/apagar la web antigua de mueblesfran.barcelona.
