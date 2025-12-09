-- Script para crear la tabla Incident en Turso
-- Ejecuta este script en tu base de datos de Turso

CREATE TABLE IF NOT EXISTS "Incident" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Abierto',
    "severity" TEXT NOT NULL DEFAULT 'Media',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Verificar que la tabla se creó correctamente
SELECT name FROM sqlite_master WHERE type='table' AND name='Incident';
