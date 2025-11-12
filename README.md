# E‑Commerce Grupo 03 — Monorepo

## Estructura

- `backend/` — Spring Boot (API REST, JWT, MySQL, Actuator)
- `frontend/` — React + Vite (SPA)

## Cómo correr

### Backend (MySQL con docker compose)

1. Ir a `backend/`
2. Levantar MySQL + app

```bash
./mvnw -DskipTests package
docker compose up --build
```

- API: http://localhost:8080
- Credenciales semilla (solo dev): `admin@example.com` / `admin123`
- Desactivar seed en prod: `admin.seed.enabled=false`

### Frontend (Vite)

1. Ir a `frontend/`
2. Configurar API base 
(por defecto backend real):

```bash
cp .env.example .env.development
# VITE_API_BASE_URL=http://localhost:8080
```

3. Ejecutar

```bash
npm install
npm run dev
```

- App: http://localhost:5173

### Full stack (producción con Nginx)

1) En la raíz:

```bash
docker compose -f docker-compose.prod.yml up --build
```

- Frontend: http://localhost (Nginx)
- Backend: http://localhost:8080
- MySQL: localhost:3307

Variables opcionales para JWT (prod):

```bash
export JWT_SECRET=... # Base64 (HS256)
export JWT_ACCESS=3600000
docker compose -f docker-compose.prod.yml up --build -d
```

## Notas

- CORS en backend permite `http://localhost:5173` y `http://localhost`.
- Endpoints públicos: `GET /api/categorias`, `GET /api/productos` y `GET /api/productos/{id}`.
- Mutaciones requieren rol ADMIN.
- Autenticación: `POST /api/auth/register`, `POST /api/auth/login`, perfil `GET/PUT /api/users/me`.

## Estandarización

- Frontend consume backend real con JWT; mock API removida para evitar duplicados.
- Se recomienda mantener `node_modules/` fuera del control de versiones.
