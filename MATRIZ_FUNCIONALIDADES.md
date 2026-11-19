# TrueForm — alcance funcional para presentar en clase

| Función | Situación del frontend | Endpoint / fuente |
|---|---|---|
| Landing page TrueForm | Visual y navegable | Angular HTML/CSS del equipo |
| Registro / login de demostración | Conectados a API | `POST /api/usuarios` · `POST /api/auth/login` |
| Panel por nivel | Funcional, identifica nivel desde BD | `GET /api/usuarios/{id}` |
| Rutinas y ejercicios asignados | Consultar y añadir/quitar | `GET /api/rutinas/usuario/{id}` · `/api/rutina-ejercicios` |
| Guía del ejercicio del día | Consulta paso a paso | `GET /api/rutina-ejercicios/rutina/{id}/dia/{dia}/guiada` |
| Finalización de rutina | Crea progreso al confirmar | `POST /api/progresos/finalizar` |
| Calendario | CRUD parcial desde frontend | `/api/calendario` y resumen semanal |
| Seguimiento y reportes | Consultas, comparación, CSV | `/api/progresos/usuario/{id}/...` |
| Volumen (cálculo visual) | Suma de series × repeticiones × peso externo registrado | `GET /api/registros-entrenamiento/usuario/{id}` |
| Ejercicios, alternativas, favoritos | Consultas y alta/baja de favoritos | `/api/ejercicios` · `/api/favoritos` |
| Recomendación inicial / de progreso / avanzada / ajuste | Consultas a reglas backend | Rutas de recomendaciones y ajuste |
| Tips y glosario | Consultas API | `/api/tips/hoy` · `/api/glosario/buscar` |
| Chat IA | Conexión a backend, condicionado a Gemini | `POST /api/ia/chat` |
| Técnica / videos | Enlaces externos educativos, sin API | No existe API para video o cámara |
| Creación de rutinas, registro manual de progreso y entrenamiento | Conservados en panel existente | `/panel`, servicios originales |

**No implementados:** corrección automática de postura por cámara; generación completa automática de rutinas por IA; Security/roles/autorización; publicación segura a internet; catálogo propio de videos almacenados. No presentarlos como funcionalidades operativas.

**Puntos de prueba:** `http://localhost:4200/login` → `/espacio` → Mis rutinas, Recomendaciones y Progreso → `/panel` para grabar registros. Confirmar en F12 Network solicitudes `/api/...` con `200` y en pgAdmin los datos insertados.
