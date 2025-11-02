# Tienda Virtual - Aplicación Node.js con Docker

Aplicación web de tienda virtual con API REST usando Node.js, Express y Docker.

## Estructura del Proyecto

```
tienda/
├── index.html          # Frontend de la tienda
├── style.css           # Estilos CSS
├── app.js              # JavaScript del cliente
├── api.js              # API REST con Express
├── package.json        # Dependencias Node.js
├── Dockerfile          # Configuración Docker
└── docker-compose.yml  # Orquestación de contenedores
```

## Requisitos

- Docker Desktop instalado
- Node.js 18+ (opcional, para desarrollo local)

## Instalación y Ejecución

### Opción 1: Con Docker (Recomendado)

1. **Construir y ejecutar con Docker Compose:**
   ```bash
   docker-compose up --build
   ```

2. **La API estará disponible en:** `http://localhost:3000`

3. **Abrir el archivo `index.html`** en tu navegador para usar la aplicación.

### Opción 2: Sin Docker (Desarrollo local)

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar la API:**
   ```bash
   npm start
   ```

3. **Abrir `index.html`** en tu navegador.

## Endpoints de la API

- `POST /api/pedidos` - Crear un nuevo pedido
- `GET /api/pedidos` - Obtener todos los pedidos

## Detener la Aplicación

```bash
docker-compose down
```

## Tecnologías Utilizadas

- **Backend:** Node.js, Express, CORS
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Contenedores:** Docker, Docker Compose
