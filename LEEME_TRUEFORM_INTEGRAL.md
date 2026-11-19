# TrueForm Integral — IHC + Angular Material + Spring Boot

**Versión académica local, 11 de noviembre de 2026.** Preparado a partir del frontend `TrueForm_Angular_Cargas_Corregidas`, el parche de estilos `TrueForm_Parche_Visual_Seguro`, el diseño visual `IHC_TF` y los controladores de `TrueForm_API_Sin_Security`.

## Qué se conservó

- Pantallas de Inicio, Nosotros, Beneficios, Contacto, Registro, Login, catálogo Material (`/ejercicios`) y panel de registros (`/panel`).
- Los servicios `TrueformApiService`, `RutinaService`, `ProgresoService`, `RegistroEntrenamientoService`, `EjercicioService` y la configuración proxy `/api/** -> 127.0.0.1:8080`.
- Los cuatro CSS mejorados de panel, ejercicios, registro y login.
- Los HTML/CSS/JS originales de IHC como **referencia visual estática** en `/ihc-referencia/index.html` (los dashboards de referencia contienen ejemplos, no están conectados a la API).
- La API de Spring Boot original no se modifica.

## Qué se añadió

- Ruta `/espacio`: menú lateral de experiencia TrueForm integrado, con datos del nivel real del usuario y dashboard estilizado.
- Secciones de rutinas (ejercicios asignados, añadir/quitar ejercicio, rutina semanal y guía paso a paso), calendario con estados, progreso, volumen estimado por carga externa, historial, comparación entre meses, descarga CSV, catálogo y favoritos, alternativas, recomendaciones iniciales/avanzadas/ajuste, tips, glosario, chat IA, material de técnica y perfil con cambio de objetivo.
- Nuevos archivos: `src/app/paginas/espacio/{espacio.ts,espacio.html,espacio.css}`, `src/app/servicios/funciones-trueform.service.ts` y `src/app/model/funciones.model.ts`.
- Los enlaces de navegación muestran "Mi espacio". Tras iniciar sesión se abre `/espacio`. El **panel anterior `/panel` sigue disponible** para crear rutinas, registrar progreso y entrenamientos.

## Pasos seguros en Windows / WebStorm

1. **Haz una copia de la carpeta actual de TrueForm que ya funciona.** No sobrescribas tu proyecto ni la base de datos.
2. Extrae `TrueForm_Integral_IHC_Angular.zip` en una carpeta **distinta** de tu proyecto actual.
3. En WebStorm: **File → Open** y elige la carpeta que contiene `package.json`, `angular.json` y `src/`.
4. En IntelliJ, abre la API existente **TrueForm_API_Sin_Security**, configura JDK 21 y la variable de entorno `DB_PASSWORD` (contraseña de PostgreSQL). Comprueba que `application.properties` apunta a la base real (en pgAdmin posiblemente sea `DBTrueForm`, no `db_trueform`). Conserva las otras propiedades existentes.
5. Arranca PostgreSQL. Ejecuta `Grupo2Application` desde IntelliJ y confirma que `http://127.0.0.1:8080/api/objetivos` devuelve JSON.
6. En la terminal de WebStorm (`Alt+F12`), desde la carpeta raíz: `npm install` y después `npm start`.
7. Ve a `http://localhost:4200/login` e inicia sesión con un **usuario de prueba existente**. Al entrar se abre `/espacio`. Usa el menú para cambiar de sección.
8. Comprueba el enlace "Panel de registros" para confirmar que las cuatro funciones que ya usabas siguen disponibles en `/panel`.
9. Usa F12 → Network (Fetch/XHR) para comprobar los endpoints: las llamadas en navegador van a `/api/**` vía puerto 4200 y el proxy las reenvía al 8080.

### Opcional: evitar conflicto si el proyecto anterior sigue abierto

- Detén el Angular anterior con `Ctrl+C` en su terminal antes de iniciar este (ambos intentan usar `localhost:4200`). No detengas PostgreSQL ni Spring Boot.
- No hace falta instalar Angular CLI globalmente de nuevo. La instalación está declarada en `package.json`.
- No pegues las nuevas páginas HTML directamente en `public`: ya están convertidas a componentes Angular.

## Funcionalidad y endpoints realmente implementados

| Módulo | Operaciones de la API | Nota |
|---|---|---|
| Dashboard | `GET /api/usuarios/{id}`, rutinas/progresos/registros, `GET /api/progresos/usuario/{id}/resumen` | Todas las cifras proceden de datos existentes |
| Rutinas | `GET /api/rutinas/usuario/{id}`, `.../semanal`, `GET/POST/DELETE /api/rutina-ejercicios` y guía diaria | Crear rutina está conservado en `/panel` |
| Calendario | `GET /api/calendario/usuario/{id}`, `POST/PUT/DELETE /api/calendario`, resumen | Fechas y estados provienen de PostgreSQL |
| Progreso | Progreso semanal, resumen, historial, comparación mensual, CSV | Los botones para registrar datos están en `/panel` |
| Ejercicios y favoritos | Ejercicios, alternativas, favoritos por usuario, altas/bajas | No se simulan favoritos |
| Recomendaciones | Recomendación inicial, de progreso, avanzada y ajuste de rutina | Requieren registros suficientes; pueden comunicar insuficiencia de datos |
| Aprendizaje | Tips `/api/tips/hoy`, glosario `/api/glosario/buscar` | Datos propios de la API |
| Chat | `POST /api/ia/chat` | Depende de la configuración de Gemini; si falla, se muestra error |
| Perfil | Datos de usuario, objetivos, `PUT /api/usuarios/{id}/objetivo` | El usuario no queda autenticado mediante sesión |
| Técnica y videos | Enlaces externos educativos | La API **no** tiene corrección por cámara ni catálogo de videos |

## Lo que NO debes presentar como completo

- **No existe Security**: el login de demostración valida credenciales pero **no** protege los endpoints. Se almacena únicamente el ID del usuario seleccionado en el navegador. No publicar en internet ni trabajar con datos sensibles reales.
- Los datos de las secciones son reales y provienen de Spring Boot. Si no hay registros puede aparecer "No hay datos"; no deben rellenarse estadísticas falsas.
- El backend no implementa corrección automática de postura ni generación de nuevas rutinas mediante IA. El asistente de preguntas depende de un proveedor de IA externo correctamente configurado en IntelliJ.
- Las páginas antiguas de `/ihc-referencia` son referencia visual, no deben utilizarse como evidencia de conexión con la API.

## Cuando algo no aparece

- **404** en una recomendación/guía: puede faltar una rutina, un día con ejercicios o un usuario válido.
- **422** al exportar CSV: la API no tiene datos suficientes.
- **500/503** en el chat IA: revisar la configuración de Gemini en el backend.
- **502/ECONNREFUSED**: Spring Boot no responde en `127.0.0.1:8080`.
- **Error de base de datos**: revisa la base configurada en `application.properties` y `DB_PASSWORD`.
- **Esperas largas**: cada consulta nueva de `/espacio` tiene un límite de 18 segundos y muestra un error en pantalla.
- **El login funciona pero los datos no aparecen**: pulsa "Actualizar datos", revisa las peticiones en F12 y los logs de IntelliJ.

## Revisión efectuada

Se verificaron sintaxis TypeScript, contratos de las rutas de los controladores, estructura HTML básica, JSON y rutas de archivos. **No se pudo ejecutar `npm install` ni la compilación Angular completa porque no hubo acceso al registro npm en el entorno de preparación**, ni probar contra tu PostgreSQL local. Deberás hacer la primera compilación en WebStorm y revisar cualquier mensaje que aparezca allí.
