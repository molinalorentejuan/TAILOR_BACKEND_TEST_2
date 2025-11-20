# ---------- Etapa 1: Build ----------
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ---------- Etapa 2: Runtime ----------
FROM node:20-slim AS runner

WORKDIR /app

# Instalar curl para healthcheck
RUN apt-get update && apt-get install -y curl && apt-get clean

# Usuario seguro
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup

# Crear carpeta de datos (DB) y dar permisos
RUN mkdir -p /app/data && chown -R appuser:appgroup /app/data

# Copiar archivos necesarios
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY swagger ./swagger

# Copiar base de datos al directorio de datos WRITABLE
COPY src/db/restaurants.db /app/data/restaurants.db

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
USER appuser

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl --fail http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]