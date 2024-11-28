# Documentacion para levantar el proyecto

## Requisitos

- Node.js
- pnpm
- Docker

## Levantar el proyecto

1. Clonar el repositorio

```bash
git clone #url
```

Devemos ir luego al archivo .env.example y copiar el contenido en un archivo .env que debe ser creado en la raiz del proyecto

_**Nota:**_ Verificar que coincida la IP relacionada con la base de datos en el archivo .env, si usan docker pueden verificar con un `docker inspect [nombre del contenedor] | grep IPAddress`

2. Levantar docker-compose

```bash
docker compose up -d
```

3. Instalar dependencias

```bash
pnpm install
```

4. Correr las migraciones de prisma (Cada vez que traigamos nuevos cambios correr este comando)

```bash
pnpm prisma migrate dev
```

5. Correr el proyecto

```bash
pnpm run start:dev
```
