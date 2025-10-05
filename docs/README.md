# E‑Commerce Grupo 03 — Frontend + Mock API

Guía única de setup, scripts y prácticas del equipo.

## Requisitos
- Versiones unificadas (fijadas desde este repo):
	- Node.js: 22.13.1
	- npm: 10.9.2
- Lockfile commiteado. En clones limpios preferimos `npm ci`.

Archivos de control en la raíz:
```
.nvmrc            # 22.13.1
.npmrc            # engine-strict=true, save-exact=true
```
Y en `frontend/package.json`:
```
"engines": { "node": "22.13.1", "npm": "10.9.2" },
"packageManager": "npm@10.9.2"
```

## Estructura
- api/db.json: mock API (json-server) con /products, /categories, /users
- frontend/: React + Vite (SPA)
	- src/pages: Home, ProductDetail, Cart, Login, Register, MyProducts
	- src/contexts: CartContext, AuthContext, FiltersContext
	- src/services/api.js: axios con baseURL configurable
	- public/img: assets (logo en `/img/EcommerceLogoHeader.png`)

## Scripts (estándar de arranque)
Levantar todo desde frontend con un único comando:
```bash
cd frontend
npm run dev:all
```
Esto abre:
- Frontend (Vite): http://localhost:5173
- API (json-server): http://localhost:3000

Scripts esperados en `frontend/package.json`:
```json
{
	"scripts": {
		"dev": "vite",
		"api": "json-server --watch ../api/db.json --port 3000",
		"dev:all": "concurrently -n api,web -c green,cyan \"npm run api\" \"npm run dev\""
	}
}
```

## Configuración de API (entorno)
Usar variable de entorno para la base URL:
```
frontend/.env.development
VITE_API_BASE_URL=http://localhost:3000
```
Y en `src/services/api.js` leer `import.meta.env.VITE_API_BASE_URL`.

## Buenas prácticas del equipo
- Versiones fijas: todos usan `nvm use` (carga 22.13.1) antes de instalar/levantar; lockfile commiteado.
- Instalar dependencias: `npm ci` en clones limpios.
- Íconos: preferimos SVG inline/locale para evitar dependencias (si se usa `react-icons`, debe declararse y usarse de forma consistente en todo el proyecto).
- Nombres de archivos: evitar espacios (ej. `Iphone 17pro.jpg` → `Iphone17pro.jpg`).
- Datos: mantener shape/IDs consistentes en `db.json` (strings o numbers, no mezclar sin consenso).
- Código: Prettier + ESLint; .editorconfig y .gitattributes con `* text=auto eol=lf`.

### Cómo usar nvm (pasos rápidos)
1) Instalar nvm si no lo tienes.
2) En la raíz del repo: `nvm use` (cargará 22.13.1). Si no está instalada: `nvm install` y luego `nvm use`.
3) Instalar deps en frontend: `cd frontend && npm ci`.
4) Levantar: `npm run dev:all`.

## Flujo Git
- Ramas protegidas: `main` (estable), `pre-main` (integración).
- Features desde `pre-main`: `funcionalidad/xxx`, `chore/xxx`, `fix/xxx`.
- PRs chicos y temáticos, usando Conventional Commits (feat/fix/chore/docs/test/refactor).
- Revisiones cruzadas; no merges directos a `main`.

## Checklist de verificación local
1. `npm run dev:all` (desde frontend) sin errores.
2. API responde: http://localhost:3000/products (chequear id=3 e ids 5–7).
3. Home carga y la búsqueda funciona (insensible a mayúsculas/acentos/espacios).
4. CTA de Home agrega id=3 al carrito y redirige a /cart.
5. Login/Register sin solapamiento de inputs; toggles de contraseña funcionales.

## Troubleshooting
- Puerto ocupado (3000 o 5173):
	- macOS: `lsof -i :3000 | awk 'NR>1{print $2}' | xargs kill -9`
- `react-icons` not found:
	- O instalarlo: `npm i react-icons`
	- O reemplazar por SVG inline/emoji y quitar importaciones.
- Imágenes que no cargan:
	- Confirmar rutas bajo `frontend/public` (usar `/img/...`). Evitar espacios.

## Créditos
Proyecto educativo UADE — Grupo 03.
