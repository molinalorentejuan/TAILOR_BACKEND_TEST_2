FROM node:20-slim AS runner

WORKDIR /app

RUN apt-get update && apt-get install -y curl && apt-get clean
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup

# Crear la carpeta para la DB y dar permisos al usuario
RUN mkdir -p /app/data && chown -R appuser:appgroup /app/data

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY swagger ./swagger
COPY src/db/restaurants.db ./data/restaurants.db

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
USER appuser

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl --fail http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]