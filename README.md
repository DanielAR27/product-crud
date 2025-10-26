# CRUD de Productos

Aplicación web para gestionar productos con operaciones CRUD (Crear, Leer, Actualizar, Eliminar).

## Stack Tecnológico

### Backend
- Node.js + Express
- PostgreSQL
- pg (node-postgres)

### Frontend
- React + Vite
- CSS modular

### DevOps
- Docker + Docker Compose
- pgAdmin

## Requisitos Previos

- Docker
- Docker Compose

## Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd product-crud
```

### 2. Configurar variables de entorno

Copiar el archivo de ejemplo y ajustar los valores si es necesario:
```bash
cp .env.example .env
```

### 3. Levantar los contenedores
```bash
docker-compose up --build -d
```

### 4. Acceder a la aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **pgAdmin**: http://localhost:5050
  - Email: admin@admin.com
  - Password: admin

## Comandos Útiles

### Levantar contenedores
```bash
docker-compose up --build -d
```

### Detener contenedores
```bash
docker-compose down
```

### Detener y eliminar volúmenes (borra la base de datos)
```bash
docker-compose down -v
```

### Ver logs
```bash
docker-compose logs -f
```

## Estructura del Proyecto
```
product-crud/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuración de DB
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── models/         # Modelos de datos
│   │   └── routes/         # Rutas de la API
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── services/       # Servicios API
│   │   └── styles/         # Estilos CSS
│   └── Dockerfile
├── init.sql                # Script de inicialización de DB
├── docker-compose.yml
└── .env
```

## API Endpoints

### Productos

- `GET /api/products` - Listar todos los productos
- `GET /api/products/:id` - Obtener un producto por ID
- `POST /api/products` - Crear un nuevo producto
- `PUT /api/products/:id` - Actualizar un producto
- `DELETE /api/products/:id` - Eliminar un producto

### Ejemplo de body (POST/PUT)
```json
{
  "name": "Producto ejemplo",
  "description": "Descripción del producto",
  "price": 99.99,
  "stock": 10
}
```

## Proceso de Desarrollo

### Fase 1: Estructura Base
1. Creación del esqueleto de carpetas
2. Configuración de Docker Compose
3. Variables de entorno (.env)
4. Dockerfiles para backend y frontend

### Fase 2: Base de Datos
5. Script SQL de inicialización (init.sql)
6. Configuración de PostgreSQL
7. Integración con pgAdmin

### Fase 3: Backend
8. Configuración de conexión a DB
9. Modelos (CRUD en PostgreSQL)
10. Controladores (lógica de negocio)
11. Rutas (endpoints REST)
12. Servidor Express con CORS

### Fase 4: Frontend
13. Configuración de Vite
14. Servicio API (fetch)
15. Componentes React:
    - ProductForm (crear/editar)
    - ProductList (listar)
    - ProductItem (item individual)
16. Estilos CSS modulares
17. App principal (orquestación)

### Fase 5: Testing
18. Pruebas de endpoints
19. Validación de interfaz
20. Ajustes finales

## Características

- CRUD completo de productos
- Interfaz responsive y moderna
- Validación de formularios
- Confirmación antes de eliminar
- Manejo de errores
- Estados de carga
- Hot reload en desarrollo

## Mejoras Futuras (v2)

- Soft delete (campo `deleted_at`)
- Búsqueda y filtros
- Paginación
- Autenticación
- Categorías de productos
- Imágenes de productos