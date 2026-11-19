# TrueForm — Corrección de cargas que no terminan (Angular 22)

## Qué se corrigió
- Angular 22 funciona por defecto en modo zoneless. `subscribe()` modifica variables del componente, pero el template no necesariamente se actualiza solo.
- Se añadió `ChangeDetectorRef.markForCheck()` mediante `finalize()` a las consultas y operaciones HTTP en `panel.ts`, `ejercicios.ts`, `login.ts` y `registro.ts`. Esto solicita actualizar la vista cuando la petición completa o falla.
- Se añadió un tiempo máximo de espera de 20 segundos para evitar que las cargas queden indefinidas y mostrar un mensaje si el backend no responde.
- No se cambió ninguna ruta de la API, contraseña, DTO, CSS o archivo del backend. Se conservó el diseño por componentes.

## Instalación
1. Haz una copia de tu proyecto Angular anterior, por si necesitas volver atrás.
2. Descomprime este ZIP y en WebStorm abre la carpeta que contiene directamente `package.json`.
3. En la terminal ejecuta `npm install` si no están instaladas las dependencias y `npm start`.
4. Mantén Spring Boot y PostgreSQL encendidos en el equipo.
5. Ve a `http://localhost:4200/panel`, con un usuario ficticio ya autenticado mediante el login de demostración.

## Prueba específica para usuario 10
En otra pestaña, abre estas rutas para comprobar la API sin pasar por Angular:
- `http://127.0.0.1:8080/api/usuarios/10`
- `http://127.0.0.1:8080/api/rutinas/usuario/10`
Si devuelven JSON pronto y el frontend anterior no se actualizaba, esto apunta a change detection.
Si tardan o fallan también directamente, revisa la consola de IntelliJ y PostgreSQL: se trata de un problema real de la API o BD.

Puedes verificar en F12 > Red/Network (Fetch/XHR) los códigos HTTP. Un GET 200 con datos confirma que la API respondió; (pending), 500, 502, 404 requieren diagnosticar backend/red.

**IMPORTANTE:** Si un POST muestra tiempo de espera pero la BD ya almacenó el registro, NO repitas Guardar hasta comprobar la tabla o GET: podrías generar duplicados.

Esto es una corrección del frontend y no garantiza reparar un bloqueo real de Spring Boot. No se ejecutó conexión a tu PostgreSQL local desde este entorno.
