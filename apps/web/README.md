# ImpulsAR Web

## Requisitos
- Node.js >= 20 y npm >= 10
- Docker Desktop (opcional, solo si usas docker-compose para backend)

## Configuracion inicial (despues de clonar)
Todos los comandos se corren desde la raiz del monorepo `impulsar/` salvo que se indique.

```bash
npm install
```

### Variables de entorno
```bash
# Backend (servicios en modo local)
cp services/transfer-service/.env.example services/transfer-service/.env
cp services/auth-service/.env.example services/auth-service/.env

# Frontend
cp apps/web/.env.example apps/web/.env.local

# Backend con Docker (docker-compose)
cp .env.example .env
```

Edita los valores en los .env/.env.local con tus credenciales reales.

## Correr en desarrollo

### Opcion A: Todo sin Docker (frontend + servicios)
```bash
npm run dev
```

### Opcion B: Backend con Docker + frontend local
```bash
docker-compose build
docker-compose up -d
npm run dev -w @impulsar/web
```

Para apagar Docker:
```bash
docker-compose down
```

## URLs utiles
- http://localhost:3000
- http://localhost:3001/health
- http://localhost:3002/health

## Vercel (build command)
Si necesitas el comando de build para Vercel (monorepo), desde la raiz del repo (directorio impulsar):

```bash
 npx turbo run build --filter=@impulsar/web
```
