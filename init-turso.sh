#!/bin/bash

# Script para inicializar la base de datos de Turso
# Asegúrate de tener el CLI de Turso instalado: npm install -g @turso/cli

DB_NAME="mi-incidentes-db"

echo "Ejecutando script de inicialización en Turso..."
turso db shell $DB_NAME < init-turso.sql

echo "¡Listo! La tabla Incident ha sido creada en Turso."
