# Sistema de Gestión de Incidentes

Aplicación web moderna para el seguimiento y gestión de incidentes técnicos, construida con Next.js y Prisma.

![Dashboard de Incidentes](src/img/incidentes.png)

## 🚀 Características

- **Dashboard de Incidentes**: Vista dual (Cuadrícula y Tabla) para visualizar todos los reportes.
- **Gestión Completa**: Crear, visualizar detalles, actualizar estado y eliminar incidentes.
- **Filtrado Avanzado**: Búsqueda por texto, filtrado por prioridad y fecha.
- **UI Moderna**: Interfaz diseñada con estilo Glassmorphism, animaciones fluidas y diseño responsivo.
- **Actualizaciones en Tiempo Real**: Feedback inmediato al usuario mediante notificaciones toast.

## 🛠️ Tecnologías Utilizadas

- **Framework Principal**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Server Actions)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Base de Datos**: SQLite (entorno local)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Estilos**: CSS Modules / Vanilla CSS con diseño Glassmorphism
- **Iconos**: SVG nativos

## 📋 Requisitos Previos

- Node.js 18.17.0 o superior
- npm (o yarn/pnpm)

## 🔧 Instalación y Configuración

1. **Clonar el repositorio** (si aplica) o navegar a la carpeta del proyecto.

2. **Instalar dependencias**:

   ```bash
   npm install
   ```

3. **Configurar la base de datos**:
   Como el proyecto utiliza SQLite, no necesitas configurar credenciales externas. Simplemente inicializa la base de datos con Prisma:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

   Esto creará el archivo `dev.db` dentro de la carpeta `/prisma`.

4. **Variables de Entorno**:
   Asegúrate de que el archivo `.env` exista en la raíz con la siguiente configuración (se crea automáticamente en la mayoría de los casos para SQLite):
   ```
   DATABASE_URL="file:./dev.db"
   ```

## ▶️ Ejecución

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000/incidentes](http://localhost:3000/incidentes).

## 📂 Estructura del Proyecto

- `src/app/incidentes`: Rutas principales de la aplicación.
  - `page.tsx`: Componente principal que obtiene los datos (Server Component).
  - `incident-list.tsx`: Componente cliente con la lógica de UI, filtros y modales.
  - `actions.ts`: Server Actions para operaciones CRUD (Create, Update, Delete).
  - `nuevo/page.tsx`: Formulario para registrar nuevos incidentes.
- `prisma/schema.prisma`: Definición del modelo de datos.

## 🤝 Contribuir

1. Haz un Fork del proyecto.
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`).
3. Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`).
4. Push a la rama (`git push origin feature/AmazingFeature`).
5. Abre un Pull Request.

## 📄 Licencia

Distribuido bajo la licencia MIT.
