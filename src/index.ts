import "reflect-metadata";
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { generalRateLimiter } from './middleware/rateLimit';
import { requestIdMiddleware } from './middleware/requestId';
import { requestLogger } from './middleware/requestLogger';

import authRoutes from './routes/auth';
import restaurantsRoutes from './routes/restaurants';
import meRoutes from './routes/me';
import adminRoutes from './routes/admin';
import restaurantsAdminRoutes from './routes/restaurantsAdmin';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import fs from 'fs';
import path from 'path';
import db from "./db/db";

import { errorHandler } from "./errors/errorHandler";

const app = express();
app.set("trust proxy", 1);
app.use(requestIdMiddleware);
app.use(requestLogger);

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json({ limit: "1mb" }));
app.use(morgan('dev'));
app.use(generalRateLimiter);

// Swagger
const spec = swaggerJsdoc({
  definition:{
    openapi:"3.0.0",
    info:{ title:"Tailor Restaurants API", version:"1.0.0" }
  },
  apis: ["./swagger/swagger.yaml"]
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));

// Routes
app.use('/auth', authRoutes);
app.use('/restaurants', restaurantsRoutes);
app.use('/restaurants', restaurantsAdminRoutes);
app.use('/me', meRoutes);
app.use('/admin', adminRoutes);

app.get('/health', (_req,res)=>res.json({status:"ok"}));

// Load indexes
const indexesPath = path.join(__dirname, 'db', 'indexes.sql');
if (fs.existsSync(indexesPath)) {
  const sql = fs.readFileSync(indexesPath, 'utf8');
  db.exec(sql);
  console.log('Indexes loaded');
}

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, "0.0.0.0", () => console.log('API running on ' + PORT));