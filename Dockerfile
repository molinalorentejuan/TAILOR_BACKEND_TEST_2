# ----------- Build -----------
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build   # esto crea dist/ + copia la DB en dist/db/

# ----------- Runtime -----------
FROM node:20-slim AS runner

WORKDIR /app

RUN apt-get update && apt-get install -y curl && apt-get clean
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup

# Carpeta writable
RUN mkdir -p /app/data && chown -R appuser:appgroup /app/data

# Copiamos dist completo
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY swagger ./swagger

# COPIAMOS TAMBIÉN LA BASE DE DATOS YA BUILDADA
COPY --from=builder /app/dist/db/restaurants.db /app/data/restaurants.db

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
USER appuser

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl --fail http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]