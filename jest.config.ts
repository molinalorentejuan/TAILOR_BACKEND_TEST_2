import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",

  // Busca tests dentro de src/tests con extensión .ts
  testMatch: ["**/src/tests/**/*.ts"],

  // Para que Jest entienda TS
  moduleFileExtensions: ["ts", "js", "json"],

  // Evita que Jest ignore archivos fuera de rootDir
  roots: ["<rootDir>/src"],

  // Limpia mocks entre tests
  clearMocks: true,
};

export default config;