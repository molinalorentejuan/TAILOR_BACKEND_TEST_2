import request from 'supertest';
import express from 'express';

import authRoutes from '../routes/auth';
import restaurantsRoutes from '../routes/restaurants';
import restaurantsAdminRoutes from '../routes/restaurantsAdmin';
import meRoutes from '../routes/me';
import adminRoutes from '../routes/admin';

import db from '../db';
import { signToken } from '../utils/jwt';

const app = express();
app.use(express.json());

// Montamos las rutas igual que en index.ts
app.use('/auth', authRoutes);
app.use('/restaurants', restaurantsRoutes);
app.use('/restaurants', restaurantsAdminRoutes);
app.use('/me', meRoutes);
app.use('/admin', adminRoutes);

async function registerAndLogin() {
  const email = `test_${Date.now()}@mail.com`;
  const password = 'password123';

  await request(app).post('/auth/register').send({ email, password });
  const loginRes = await request(app).post('/auth/login').send({ email, password });

  return loginRes.body.token as string;
}

let adminToken: string;

beforeAll(() => {
  // Creamos un usuario ADMIN directo en la base de datos y le generamos un JWT
  const email = `admin_${Date.now()}@mail.com`;
  const result = db
    .prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)')
    .run(email, 'dummy', 'ADMIN');

  const id = Number(result.lastInsertRowid);
  adminToken = signToken({ id, role: 'ADMIN' });
});

beforeEach(() => {
  // Limpiamos datos de tests entre pruebas
  db.prepare('DELETE FROM reviews').run();
  db.prepare('DELETE FROM favorites').run();
  db.prepare("DELETE FROM users WHERE role != 'ADMIN'").run();
});

describe('Auth + Reviews flow', () => {
  it('registers, logs in and hits /me', async () => {
    const token = await registerAndLogin();

    const res = await request(app)
      .get('/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBeDefined();
    expect(res.body.id).toBeDefined();
    expect(res.body.role).toBe('USER');
  });

  it('creates a review and lists it for restaurant 1', async () => {
    const token = await registerAndLogin();

    const create = await request(app)
      .post('/restaurants/1/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 5, comment: 'Great!' });

    expect(create.status).toBe(201);
    expect(create.body.id).toBeDefined();

    const list = await request(app).get('/restaurants/1/reviews');
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
  });
});

describe('Restaurants listing & pagination', () => {
  it('returns paginated restaurants list with filters and sort', async () => {
    const res = await request(app).get(
      '/restaurants?page=1&limit=5&sort=name:asc&rating=0'
    );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.limit).toBe(5);
    // total puede variar según la base de datos original, no lo comprobamos estrictamente
  });
});

describe('Favorites flow', () => {
  it('adds a restaurant to favorites and lists it', async () => {
    const token = await registerAndLogin();

    const add = await request(app)
      .post('/me/favorites/1')
      .set('Authorization', `Bearer ${token}`);

    expect(add.status).toBe(201);

    const list = await request(app)
      .get('/me/favorites')
      .set('Authorization', `Bearer ${token}`);

    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    // No asumimos tamaño concreto, pero debería poder listar sin error
  });
});

describe('Admin stats & role protection', () => {
  it('forbids /admin/stats for normal USER', async () => {
    const userToken = await registerAndLogin();

    const res = await request(app)
      .get('/admin/stats')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403); // roleMiddleware
  });

  it('allows /admin/stats for ADMIN and returns stats shape', async () => {
    const res = await request(app)
      .get('/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('usersCount');
    expect(res.body).toHaveProperty('reviewsCount');
    expect(res.body).toHaveProperty('restaurantsCount');
    expect(res.body).toHaveProperty('topRated');
    expect(res.body).toHaveProperty('mostReviewed');
  });
});