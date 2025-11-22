/**
 * FULL INTEGRATION TESTS – Tailor Restaurants API
 */

import "reflect-metadata";
import request from "supertest";
import express from "express";

import authRoutes from "../routes/auth";
import restaurantsRoutes from "../routes/restaurants";
import restaurantsAdminRoutes from "../routes/restaurantsAdmin";
import meRoutes from "../routes/me";
import adminRoutes from "../routes/admin";

import db from "../db/db";
import { signToken } from "../utils/jwt";
import { errorHandler } from "../errors/errorHandler";

process.env.NODE_ENV = "test";

jest.mock("../middleware/rateLimit", () => ({
  authRateLimiter: (req: any, res: any, next: any) => next(),
  generalRateLimiter: (req: any, res: any, next: any) => next(),
}));

/**
 * Construimos la app sin rate-limiters
 */
function buildApp() {
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  app.use("/auth", authRoutes);
  app.use("/restaurants", restaurantsRoutes);
  app.use("/restaurants", restaurantsAdminRoutes);
  app.use("/me", meRoutes);
  app.use("/admin", adminRoutes);

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.use(errorHandler);
  return app;
}

const app = buildApp();

/* -----------------------------------------------------
   HELPERS
----------------------------------------------------- */

async function registerAndLogin() {
  const email = `user_${Date.now()}@mail.com`;
  const password = "hunter22";

  const reg = await request(app)
    .post("/auth/register")
    .send({ email, password, name: "Test User" });

  expect(reg.status).toBe(201);

  const login = await request(app)
    .post("/auth/login")
    .send({ email, password });

  expect(login.status).toBe(200);
  return login.body.token as string;
}

let adminToken: string;

/* -----------------------------------------------------
   DB RESET
----------------------------------------------------- */

beforeAll(() => {
  const email = `admin_${Date.now()}@mail.com`;

  const r = db
    .prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)")
    .run("Admin", email, "dummy", "ADMIN");

  adminToken = signToken({
    id: Number(r.lastInsertRowid),
    role: "ADMIN",
  });
});

beforeEach(() => {
  db.prepare("DELETE FROM reviews").run();
  db.prepare("DELETE FROM favorites").run();
  db.prepare("DELETE FROM users WHERE role != 'ADMIN'").run();
});

/* -----------------------------------------------------
   TESTS
----------------------------------------------------- */

describe("🟢 AUTH + ME", () => {
  it("register + login + /me", async () => {
    const token = await registerAndLogin();

    const me = await request(app)
      .get("/me")
      .set("Authorization", `Bearer ${token}`);

    expect(me.status).toBe(200);
    expect(me.body.email).toBeDefined();
    expect(me.body.role).toBe("USER");
  });
});

/* ----------------------------------------------------- */

describe("🟢 REVIEWS", () => {
  it("create and list reviews", async () => {
    const token = await registerAndLogin();

    const create = await request(app)
      .post("/restaurants/1/reviews")
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 5, comment: "Nice" });

    expect(create.status).toBe(201);
    expect(create.body.id).toBeDefined();

    const list = await request(app).get("/restaurants/1/reviews");
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
  });

  it("fails validation: missing rating", async () => {
    const token = await registerAndLogin();

    const bad = await request(app)
      .post("/restaurants/1/reviews")
      .set("Authorization", `Bearer ${token}`)
      .send({ comment: "Missing rating" });

    expect(bad.status).toBe(400);
    expect(bad.body.error).toBe("VALIDATION_ERROR");
  });
});

/* ----------------------------------------------------- */

describe("🟢 RESTAURANTS LIST", () => {
  it("pagination + filters + sort", async () => {
    const res = await request(app).get(
      "/restaurants?page=1&limit=5&sort=name:asc&rating=0"
    );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
  });

  it("filter by neighborhood", async () => {
    const res = await request(app).get("/restaurants?neighborhood=Manhattan");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("sort by rating desc", async () => {
    const res = await request(app).get("/restaurants?sort=rating:desc");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

/* ----------------------------------------------------- */

describe("🟢 FAVORITES", () => {
  it("add + list", async () => {
    const token = await registerAndLogin();

    const add = await request(app)
      .post("/me/favorites/1")
      .set("Authorization", `Bearer ${token}`);

    expect(add.status).toBe(201);

    const list = await request(app)
      .get("/me/favorites")
      .set("Authorization", `Bearer ${token}`);

    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
  });

  it("duplicate → 409", async () => {
    const token = await registerAndLogin();

    await request(app)
      .post("/me/favorites/1")
      .set("Authorization", `Bearer ${token}`);

    const dup = await request(app)
      .post("/me/favorites/1")
      .set("Authorization", `Bearer ${token}`);

    expect(dup.status).toBe(409);
    expect(dup.body.error).toBe("ALREADY_FAVORITE");
  });
});

/* ----------------------------------------------------- */

describe("🟢 ADMIN", () => {
  it("user forbidden /admin/stats", async () => {
    const token = await registerAndLogin();

    const res = await request(app)
      .get("/admin/stats")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it("admin allowed /admin/stats", async () => {
    const res = await request(app)
      .get("/admin/stats")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("usersCount");
    expect(res.body).toHaveProperty("reviewsCount");
    expect(res.body).toHaveProperty("restaurantsCount");
    expect(res.body).toHaveProperty("topRated");
    expect(res.body).toHaveProperty("mostReviewed");
  });
});