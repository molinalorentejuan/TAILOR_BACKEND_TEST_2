# Tailor Restaurants API

Implementación completa del challenge técnico de Tailor.

✔ TypeScript  
✔ Express  
✔ Raw SQLite (better-sqlite3)  
✔ Auth + Roles (USER/ADMIN)  
✔ CRUD Restaurants  
✔ CRUD Reviews  
✔ CRUD Favorites  
✔ Paginación, filtros y sorting  
✔ Admin + Stats  
✔ Rate limiting  
✔ Cache en memoria  
✔ Swagger básico  
✔ Tests con Jest + Supertest  
✔ Dockerfile multistage  
✔ Railway listo (Procfile)

---

## Instalación

```bash
npm install
```

---

## Ejecutar en desarrollo

```bash
npm run dev
```

API disponible en:

- http://localhost:3000
- http://localhost:3000/docs
- http://localhost:3000/health

---

##  Autenticación y roles

- JWT firmado con `JWT_SECRET`
- Expiración 7 días
- Middlewares `authMiddleware` + `roleMiddleware`

Roles:

- **USER** → Reviews + favoritos
- **ADMIN** → CRUD restaurantes + estadísticas

---

## Endpoints

### Públicos
- GET /restaurants
- GET /restaurants/:id
- GET /restaurants/:id/reviews
- POST /auth/login
- POST /auth/register

### USER autenticado
- GET /me
- GET /me/reviews
- POST /restaurants/:id/reviews
- PUT /me/reviews/:id
- DELETE /me/reviews/:id
- POST /me/favorites/:restaurantId
- DELETE /me/favorites/:restaurantId
- GET /me/favorites

### ADMIN
- POST /restaurants
- PUT /restaurants/:id
- DELETE /restaurants/:id
- GET /admin/stats

---

## Base de datos

Se usa tu `restaurants.db` original y se extiende con:

- users
- reviews
- favorites

---

## Tests

```bash
npm test
```

Incluye:

- test básico de auth
- test de flujo auth → me → reviews

---

## Docker

```bash
docker build -t tailor-restaurants-api .
docker run -p 3000:3000 tailor-restaurants-api
```

---

## Railway

Archivo `Procfile` incluido:

```
web: node dist/index.js
```

Build:

```bash
npm install && npm run build
```

Start:

```bash
npm start
```

---

## Seed ADMIN

```bash
npm run seed:admin
```

Crea:

- email: admin@admin.com
- password: admin123

---

## Variables de entorno

Crear archivo `.env`:

```
PORT=3000
JWT_SECRET=change_me
```

---

## Escalabilidad

- Migrar SQLite → Postgres
- Redis para cache y rate limiting distribuido
- Varias instancias Docker tras Load Balancer
- Logging centralizado
- CDN + Reverse caching

---

## Estructura

```
src/
 ├── container.ts
 ├── i18n.ts
 ├── index.ts
 ├── db.ts
 ├── dto/
 ├── middleware/
 ├── repositories/
 ├── routes/
 ├── script/
 ├── services/
 ├── test/
 ├── types/
 └── utils/
swagger/
Dockerfile
Procfile
package.json
tsconfig.json
README.md
