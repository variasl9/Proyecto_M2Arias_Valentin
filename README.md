# MiniBlog API

API REST para **MiniBlog**, el servicio de contenidos de la startup ficticia *DevSpark*. Gestiona `authors`, `posts` (relación 1-N author→posts) y `comments` (extra credit), persistidos en PostgreSQL.

## Stack

- Node.js + Express 5
- PostgreSQL (driver `pg`, queries parametrizadas)
- Jest + Supertest (testing)
- Swagger UI (`swagger-ui-express` + `yamljs`) para documentación OpenAPI

## Estructura del proyecto

```
index.js                    → carga .env, inicializa la DB y levanta el server
src/
  server.js                 → configura Express, Swagger UI y middlewares
  config/
    dbConnect.js             → Pool de pg
    initDb.js                 → CREATE TABLE IF NOT EXISTS + seed inicial
  routes/                    → define endpoints y los conecta a los controllers
  controllers/               → reciben req/res, llaman al service, responden
  services/                  → queries a la DB con pool.query (parametrizadas)
  validators/                → validaciones de campos obligatorios y formatos
  middlewares/
    errorHandler.js           → manejo global de errores + 404
  utils/
    AppError.js                → error de aplicación con status code
    asyncHandler.js             → wrapper para propagar errores async
  docs/
    openapi.yaml                → especificación OpenAPI 3.0
sql/
  setup.sql                  → crea el schema completo (authors, posts, comments)
  seed.sql                   → datos de ejemplo
tests/                       → tests con Jest + Supertest
```

## Modelo de datos

- **authors**: `id`, `name`, `email` (único), `bio`, `created_at`
- **posts**: `id`, `author_id` (FK → authors, `ON DELETE CASCADE`), `title`, `content`, `published`, `created_at`
- **comments**: `id`, `post_id` (FK → posts, `ON DELETE CASCADE`), `author_id` (FK → authors, `ON DELETE SET NULL`), `content`, `created_at`

## Requisitos

- Node.js 20+ (usa `process.loadEnvFile`, nativo de Node)
- PostgreSQL 13+ corriendo (local o remoto)

## Instalación y ejecución local

1. Clonar el repositorio y entrar a la carpeta del proyecto.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Copiar `.env.example` a `.env` y completar los valores:
   ```bash
   cp .env.example .env
   ```
   Variables necesarias:
   ```
   PORT=3000

   DB_HOST=localhost
   DB_PORT=5432
   DB_DATABASE=miniblog_dev
   DB_USER=postgres
   DB_PASSWORD=tu_password
   DB_MAX=10
   DB_IDLETIMEOUT=30000
   DB_CONNECTIMEOUT=5000

   TEST_DB_HOST=localhost
   TEST_DB_PORT=5432
   TEST_DB_DATABASE=miniblog_test
   TEST_DB_USER=postgres
   TEST_DB_PASSWORD=tu_password
   ```
4. Crear las bases de datos (`miniblog_dev` y `miniblog_test`, o los nombres que hayas puesto) en Postgres. Las tablas se crean solas al levantar la app (`initDb.js`), pero también podés correr el script SQL a mano:
   ```bash
   psql -U postgres -d miniblog_dev -f sql/setup.sql
   psql -U postgres -d miniblog_dev -f sql/seed.sql
   ```
5. Levantar el servidor:
   ```bash
   npm run dev
   ```
   La API queda disponible en `http://localhost:3000` (o el puerto que hayas configurado).

## Documentación OpenAPI / Swagger

Con el servidor corriendo:

- Interfaz interactiva ("Try it out"): `http://localhost:3000/api-docs`
- Especificación cruda en JSON: `http://localhost:3000/api-docs.json`
- Archivo fuente: [`src/docs/openapi.yaml`](./src/docs/openapi.yaml)

## Endpoints principales

| Método | Ruta                     | Descripción                                |
|--------|--------------------------|---------------------------------------------|
| GET    | /authors                 | Listar authors                              |
| GET    | /authors/:id             | Detalle de un author                        |
| POST   | /authors                 | Crear author                                |
| PUT    | /authors/:id             | Actualizar author                           |
| DELETE | /authors/:id             | Eliminar author                             |
| GET    | /posts                   | Listar posts                                |
| GET    | /posts/:id               | Detalle de un post                          |
| GET    | /posts/author/:authorId  | Posts de un author, con detalle del author  |
| POST   | /posts                   | Crear post                                  |
| PUT    | /posts/:id               | Actualizar post                             |
| DELETE | /posts/:id               | Eliminar post                               |
| GET    | /comments                | Listar comments                             |
| GET    | /comments/post/:postId   | Comments de un post                         |
| POST   | /comments                | Crear comment                               |
| GET    | /health                  | Estado del servicio                         |

Detalle completo de request/response en Swagger.

## Tests

Los tests corren contra una base de datos de test **separada** de la de desarrollo (variables `TEST_DB_*` del `.env`), para no pisar datos reales.

```bash
npm test
```

Cubre operaciones CRUD y casos de error (validaciones, 404, FK inválida) en `authors`, `posts` y `comments` (16 tests en total).

## Deployment en Railway

1. Crear un nuevo proyecto en Railway y agregar un servicio **PostgreSQL** (plugin de base de datos) y otro servicio para esta API, apuntando al repositorio de GitHub.
2. En el servicio de la API, configurar las variables de entorno (pestaña *Variables*):
   - `PORT` (Railway suele inyectarlo automáticamente, pero está bien dejarlo explícito).
   - En vez de las variables `DB_*` sueltas, Railway expone la conexión a Postgres como `DATABASE_URL` — `dbConnect.js` ya está preparado para usarla automáticamente si existe.
   - Podés copiar el valor desde la pestaña *Variables* del servicio de Postgres.
3. **Internal URL vs Public URL**: si tu API y tu base de datos están en el mismo proyecto de Railway, usá la **Internal URL** (`postgres.railway.internal`) para conectarlos — es más rápida y no sale a internet. La **Public URL** solo hace falta si necesitás conectarte a la base desde afuera de Railway (por ejemplo, para inspeccionarla con pgAdmin desde tu PC).
4. Railway detecta automáticamente `npm start` como comando de arranque (definido en `package.json`).
5. Una vez deployado, la URL pública del servicio (algo como `https://tu-app.up.railway.app`) es la que hay que probar y documentar acá.

## Registro de uso de IA

Este proyecto fue desarrollado con asistencia de Claude (Anthropic) durante todo el proceso: diseño de la arquitectura en capas (routes → controllers → services → pg Pool), generación del código de controllers/services/validators/middlewares siguiendo ese patrón, redacción de la especificación OpenAPI (`openapi.yaml`), armado de los tests con Jest + Supertest, y este mismo README. Las decisiones de diseño, la revisión de la consigna y rúbrica, la configuración del entorno local (bases de datos, `.env`) y la verificación final (correr tests, levantar el server, revisar Swagger) fueron hechas y validadas por el autor del proyecto.