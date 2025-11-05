# E‑commerce Backend (Spring Boot)

Backend en Spring Boot con JWT para autenticación, gestión de usuarios y direcciones, y catálogo público.

## Requisitos
- Java 17
- Maven 3.9+
- MySQL 8 (local)

## Configuración
- Perfil activo por defecto: `mysql` (archivo `src/main/resources/application-mysql.properties`).
- Base de datos (variables con fallback por defecto):
  - `DB_PORT` (default 3307)
  - `DB_USERNAME` (default root)
  - `DB_PASSWORD` (default root)
- JWT (archivo `src/main/resources/application.properties`):
  - `jwt.secret`: clave HS256 base64
  - `jwt.access`: duración en ms del access token (por ej. 3600000)
- Usuario ADMIN seed (sólo dev):
  - `admin.email=admin@example.com`
  - `admin.password=admin123`

## Build y ejecución
```bash
# Compilar sin tests
./mvnw -DskipTests clean package

# Ejecutar (puerto 8080)
java -jar target/e_commerce-0.0.1-SNAPSHOT.jar
```

## Seguridad (resumen)
- Stateless JWT; se inyecta por header `Authorization: Bearer <token>`.
- Roles en claim `roles` (valores: `USER`, `ADMIN`).
- Público:
  - `POST /api/auth/register`, `POST /api/auth/login`
  - `GET /api/categorias/**`, `GET /api/productos/**`
- Protegido (requiere JWT):
  - `GET/PUT /api/users/me`
  - `GET/POST/PUT/DELETE /api/users/me/addresses`
- ADMIN requerido:
  - `POST/PUT/DELETE /api/categorias/**`
  - `POST/PUT/DELETE /api/productos/**`

## Endpoints principales

### Auth (públicos)
- POST `/api/auth/register`
  - Body: `{ "email": "user1@example.com", "nombre": "UsuarioPrueba", "password": "UsuarioPrueba1234" }`
  - 201 + `{ token }` (si ya existe → 409)
- POST `/api/auth/login`
  - Body: `{ "email": "user1@example.com", "password": "UsuarioPrueba1234" }`
  - 200 + `{ token }` (credenciales inválidas → 400)

### Usuario actual (JWT)
- GET `/api/users/me` → 200 `{ idUsuario, nombre, email }`
- PUT `/api/users/me` → 200
  - Body JSON: `{ "nombre": "Usuario Actualizado" }`
  - Alternativa: `?nombre=Usuario%20Actualizado`

### Direcciones del usuario (JWT)
- GET `/api/users/me/addresses` → 200 `[] | [...]`
- POST `/api/users/me/addresses` → 201
  - Body:
  ```json
  {
    "calle": "Av. Siempre Viva",
    "altura": 742,
    "ciudad": "Springfield",
    "codigoPostal": "12345",
    "pais": "AR",
    "provincia": "BA"
  }
  ```
- PUT `/api/users/me/addresses/{id}` → 200 (mismo body que POST)
- DELETE `/api/users/me/addresses/{id}` → 204

### Catálogo (público GET, ADMIN mutaciones)
- GET `/api/categorias`, `/api/productos` (filtros y paginación en productos)
- POST/PUT/DELETE `/api/categorias/**`, `/api/productos/**` (ADMIN)

## Ejemplos rápidos (curl)
```bash
# Register
curl -i -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user1@example.com","nombre":"UsuarioPrueba","password":"UsuarioPrueba1234"}'

# Login → exportar token a variable
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user1@example.com","password":"UsuarioPrueba1234"}' | jq -r '.token // .accessToken')

# Perfil
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/users/me

# Crear dirección
curl -i -X POST http://localhost:8080/api/users/me/addresses \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"calle":"Av. Siempre Viva","altura":742,"ciudad":"Springfield","codigoPostal":"12345","pais":"AR","provincia":"BA"}'
```

## Postman (sugerido)
- Environment vars: `baseUrl=http://localhost:8080`, `accessToken` (vacío).
- Tras login, en Tests:
```javascript
const r = pm.response.json();
const t = r.accessToken || r.token; if (t) pm.environment.set('accessToken', t);
```
- En requests protegidas: Authorization → Bearer Token → `{{accessToken}}`.

## Contraseñas: ¿están hasheadas?
Sí. Se usa BCrypt:
- Bean en `SecurityConfig`: `new BCryptPasswordEncoder()`.
- Registro en `AuthService`: `passwordEncoder.encode(req.getPassword())`.
- Seeder ADMIN en `ECommercebackApplication`: también usa `PasswordEncoder` para guardar hash.

Cómo verificar en la DB: la columna `password` comienza con `$2a$`/`$2b$` y no coincide con el texto plano.

## Errores comunes
- 405 Method Not Allowed: método incorrecto (por ejemplo GET en `/api/auth/register`).
- 401/403: sin token o sin rol requerido.
- 409: email duplicado / conflictos de integridad.
- 400: validaciones (body inválido o campos faltantes).

## Notas
- Puerto por defecto: 8080.
- JPA `ddl-auto=update` para desarrollo.
- Open-in-View warning: se puede desactivar con `spring.jpa.open-in-view=false` (opcional).
