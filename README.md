# Angular Users & Posts App

Aplicación desarrollada con **Angular 18** que permite gestionar una lista de usuarios y sus publicaciones (posts) consumiendo la API pública de [JSONPlaceholder](https://jsonplaceholder.typicode.com/). Implementa arquitectura modular con **Lazy Loading**, **componentes standalone**, manejo de estado, formularios reactivos y modales dinámicos.

## 🚀 Características principales

- ✔️ Visualización de lista de usuarios con paginación
- ✔️ Visualización de publicaciones por usuario
- ✔️ CRUD de publicaciones (crear, editar, eliminar)
- ✔️ Lazy loading de rutas feature
- ✔️ Componentes modales reutilizables para formularios y confirmaciones
- ✔️ Uso de `ReactiveForms` para validaciones
- ✔️ Estilos con CSS nativo, sin librerías externas
- ✔️ Consumo de APIs REST públicas (`jsonplaceholder.typicode.com`)

## OJO: El core del proyecto es el módulo Post, cada usuario tiene post relacionados bajo el userId, al usar una API pública como jsonplaceholder los datos no se modificarán, solo se simula la petición http que devuelve una respuesta, más no se modifican los datos en el servidor.

## Pasos para ejecutar el proyecto

# Instalar dependencias
npm install

# Servidor de desarrollo
ng serve

# Ejecutar pruebas unitarias
ng test