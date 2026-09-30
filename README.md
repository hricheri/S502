# Tattoo Swap — Cliente React

Cliente frontend en React que consume la API REST de Tattoo Swap del Sprint 5 ([Laravel_API_REST](https://github.com/hricheri/Laravel_API_REST)). Proyecto académico desarrollado con asistencia de IA, siguiendo el diseño visual original del proyecto Tattoo Swap del Sprint 4.

## Índice

- [Stack tecnológico](#stack-tecnológico)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Cómo probar la aplicación](#cómo-probar-la-aplicación)
- [Pantallas](#pantallas)
- [Conexión con la API](#conexión-con-la-api)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Decisiones de diseño y limitaciones](#decisiones-de-diseño-y-limitaciones)

## Stack tecnológico

- **React 19** con **Vite** (sin TypeScript)
- **react-router-dom** para el ruteo entre pantallas
- **ESLint** para el análisis estático del código
- CSS plano (sin librería de componentes), con variables de color y tipografía Nunito, siguiendo la paleta lavanda/lima del diseño original
- `fetch` nativo para consumir la API, sin librerías HTTP adicionales

## Requisitos previos

- Node.js >= 20
- La API de Tattoo Swap corriendo en `http://127.0.0.1:8000` (repo [Laravel_API_REST](https://github.com/hricheri/Laravel_API_REST))

## Instalación

```bash
git clone https://github.com/hricheri/S502.git
cd S502
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

> **Importante:** la URL de la API está fija en `src/api.js` (`API_BASE_URL = 'http://127.0.0.1:8000/api'`). Si la API corre en otro host o puerto, hay que ajustar esa constante.

## Cómo probar la aplicación

Este cliente no tiene pantalla de administración. Para probar el flujo completo (like, match, swap), hay que preparar los datos desde la API, tal como se explica en el README de [Laravel_API_REST](https://github.com/hricheri/Laravel_API_REST#cómo-probar-la-aplicación):

1. Levantar la API (`php artisan serve`, en la carpeta del backend).
2. Registrar al menos dos artistas desde `http://localhost:5173/register`.
3. Verificar los artistas con un admin (vía tinker, según el README del backend), para poder dar like, ver disponibilidad ajena y crear swaps.
4. Cada artista marca su disponibilidad en **Availability**, con fechas que se solapen.
5. Un artista le da like al otro desde **Explore**. Cuando el segundo le devuelve el like, ambos aparecen con el badge **Match** en **Favorites**.
6. Desde **Favorites**, "Start a swap" calcula las fechas en común.
7. Cada artista confirma en **Swaps**. Al confirmar los dos, el swap pasa a `confirmed`. Se puede rechazar (si está pendiente) o cancelar (si está confirmado).

## Pantallas

| Ruta | Descripción |
|---|---|
| `/login` | Inicio de sesión |
| `/register` | Registro (nombre, email, contraseña, ciudad, bio y foto opcionales) |
| `/profile` | Ver y editar el perfil propio |
| `/explore` | Explorar artistas de a uno, con filtro por ciudad, Discard y Like |
| `/favorites` | Artistas que likeaste, con badge de match y estado del swap |
| `/swaps` | Swaps propios, con fechas calculadas, confirmar y rechazar/cancelar |
| `/availability` | Calendario de disponibilidad, por rango de fechas o días sueltos |

Todas las rutas salvo login y registro están protegidas: si no hay sesión iniciada, redirigen a `/login`.

## Conexión con la API

- El token de Passport se guarda en `localStorage` tras el login o el registro (`src/api.js`, `src/AuthContext.jsx`).
- Todas las llamadas pasan por `apiGet`/`apiPost`/`apiPut`/`apiDelete` en `src/api.js`, que arman los headers, agregan el token y normalizan los errores de la API.
- El formulario de perfil sube archivos (`multipart/form-data`) usando `POST` con el campo `_method=PUT`, porque Laravel no procesa bien un `PUT` con archivos enviado directamente desde `fetch`.
- CORS no requirió configuración adicional: la API ya responde con `Access-Control-Allow-Origin: *`.

## Estructura del proyecto

```
src/
  api.js              → cliente HTTP, token y manejo de errores
  authState.js         → contexto de autenticación (solo el Context)
  useAuth.js            → hook para consumir el contexto
  AuthContext.jsx        → proveedor de sesión (login, logout)
  App.jsx                → rutas y layout protegido
  index.css               → sistema de diseño (colores, tipografía, componentes)
  components/
    Dock.jsx               → menú flotante lateral
  pages/
    Login.jsx
    Register.jsx
    Profile.jsx
    Explore.jsx
    Favorites.jsx
    Swaps.jsx
    Availability.jsx
```

## Decisiones de diseño y limitaciones

- El diseño sigue el mockup de Figma del Sprint 4 (tarjeta central en Explore, grilla en Favorites, calendario con lima/lavanda), adaptado a lo que la API de Sprint 5 ofrece: sin Studio ni Home, con la foto de perfil como imagen principal.
- El filtro "Liked me" y el de disponibilidad del diseño original no están, porque la API no los expone.
- "Discard" en Explore solo saltea al artista dentro de la sesión actual del navegador; no se guarda en el backend (la API no tiene ese concepto).
- No hay pantalla de administración: verificar artistas se hace desde tinker, como se documenta en el README del backend.
- El cálculo de fechas del swap es responsabilidad de la API (ver README de Laravel_API_REST); el cliente solo muestra el resultado.