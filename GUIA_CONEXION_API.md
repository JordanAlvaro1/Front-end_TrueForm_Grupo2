# GUÍA DETALLADA — conectar TrueForm Angular/WebStorm con Spring Boot/IntelliJ y PostgreSQL

Esta guía se hizo usando exactamente la API **TrueForm_API_Sin_Security** y su frontend asociado. No se necesita implementar un nuevo Controller, modificar el DTO ni escribir un JWT.

## Paso 0 — Identificar las 3 aplicaciones

| Parte | Programa | Dirección |
|---|---|---|
| Base de datos PostgreSQL | pgAdmin/PostgreSQL | localhost:5432, base `db_trueform` |
| API Spring Boot | IntelliJ IDEA | `http://127.0.0.1:8080` |
| Frontend Angular 22 | WebStorm | `http://localhost:4200` |

Para demostrarlo en un solo equipo, ejecuta **primero PostgreSQL, luego la API y después Angular**. Mantén abiertas ambas terminales/IDEs.

## Paso 1 — Backend: preparar PostgreSQL y Spring Boot

1. Inicia el servicio PostgreSQL en Windows.
2. Comprueba que exista la base de datos `db_trueform`; no recrees una base que ya tenga información importante.
3. Abre `TrueForm_API_Sin_Security.zip` y extrae su contenido.
4. En IntelliJ IDEA, **File → Open**: elige la carpeta que contiene directamente `pom.xml`.
5. Comprueba que el proyecto utiliza JDK 21 y deja que Maven sincronice dependencias.
6. En **Run → Edit Configurations → Environment variables** escribe `DB_PASSWORD=TU_CONTRASEÑA_POSTGRESQL`. No guardes contraseñas reales en Git ni en capturas.
7. Ejecuta `Grupo2Application`.
8. En un navegador abre `http://localhost:8080/api/objetivos` y `http://localhost:8080/api/ejercicios`.

**Si responden `[]`, la API SÍ está conectada, pero no hay datos de esa entidad todavía.** Si necesitas registros de demostración, mira el Paso 5.

### ¿Qué código pongo en la API?

Con **la API sin Security entregada**: **NINGÚN código adicional para conectar con Angular**. Ya tiene los siguientes archivos. Solo debes verificar que coinciden con estas configuraciones.

**`src/main/resources/application.properties`** (líneas clave que ya existen):

```properties
server.address=127.0.0.1
# Opcional: 8080 ya es el puerto predeterminado de Spring Boot
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/db_trueform
spring.datasource.username=postgres
spring.datasource.password=${DB_PASSWORD:}
```

No reemplaces todas tus propiedades: conserva `spring.jpa...`, logging y otras configuraciones de la API. `server.port=8080` es **opcional** si la app usa el predeterminado.

**`src/main/java/com/trueform/backend/config/CorsConfig.java`** ya permite Angular; no lo dupliques. Sus partes relevantes son:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:4200", "http://127.0.0.1:4200")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(false);
    }
}
```

Estos ejemplos muestran únicamente las propiedades relevantes, no sustituyen los archivos existentes. **Con el proxy Angular, el navegador solicita `localhost:4200/api/...` y normalmente no necesita CORS**, aunque mantenerlo configurado es útil si haces llamadas directas desde otro origen. No agregues `@CrossOrigin` a todos los controladores sin necesidad.

Los controladores que ya están implementados incluyen:

```java
@RestController
@RequestMapping("/api/ejercicios")
public class EjercicioController {
    @GetMapping
    public List<EjercicioDTO> listar() { /* Ya implementado en la API */ }
}
```

Este es un esquema EXPLICATIVO. **No pegues el fragmento sobre tu controlador actual:** ya existe y funciona con Servicio y Repositorio.

## Paso 2 — Frontend: importar en WebStorm

1. Extrae **TrueForm_Angular_Conectado.zip**.
2. En **WebStorm → File → Open**, elige la carpeta **TrueForm_Angular_Conectado** que contiene directamente `package.json`, `angular.json` y `src/`.
3. Abre la terminal con `Alt + F12` y ejecuta:

```powershell
node -v
npm -v
dir package.json
npm install
npm start
```

4. Usa Node v26.12.1 si es el que ya tienes instalado. Angular 22 requiere una versión compatible.
5. Abre `http://localhost:4200` (Angular normalmente abre el navegador al ejecutar `npm start`).

**Si `npm install` muestra `ENOENT package.json`:** la terminal no está en la carpeta que contiene el archivo. Ejecuta `dir` y entra a la carpeta correcta con `cd NOMBRE_CARPETA`; no crees un `package.json` vacío ni instales todo otra vez.

Ya se instalarán Angular Material y CDK desde `package.json`; no ejecutes `ng add @angular/material` adicionalmente.

## Paso 3 — ¿Cómo viajan las solicitudes? (código REAL del frontend)

**A. `src/proxy.conf.json`:**

```json
{
  "/api/**": {
    "target": "http://127.0.0.1:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

**B. `angular.json`** ya conecta el proxy al servidor de desarrollo con `serve.options.proxyConfig: "src/proxy.conf.json"`.

**C. `src/app/app.config.ts`** ya incorpora `provideHttpClient()`.

**D. `src/app/servicios/ejercicio.service.ts`:**

```typescript
@Injectable({ providedIn: 'root' })
export class EjercicioService {
  private http = inject(HttpClient);
  listar(): Observable<EjercicioDTO[]> {
    return this.http.get<EjercicioDTO[]>('/api/ejercicios');
  }
}
```

**E. `src/app/paginas/ejercicios/ejercicios.ts`:**

```typescript
this.api.listar().subscribe({
    next: ejercicios => { this.datos.data = ejercicios; this.cargando = false; },
    error: e => { /* Se informa del error HTTP */ }
});
```

Esto equivale a: **Componente Angular → Servicio HttpClient → proxy → Controller Spring → Servicio Spring → Repository → PostgreSQL**. Al regresar los datos, Angular Material los presenta en la tabla.

No uses `http://localhost:8080/api/...` en los servicios mientras utilices el proxy, sino la ruta relativa `/api/...`. No se necesita JWT, token CSRF, cabeceras Authorization ni `withCredentials`.

## Paso 4 — Verificar la conexión de principio a fin

1. API en `8080`: comprueba `http://localhost:8080/api/objetivos` → JSON (idealmente con objetivos de prueba).
2. Angular en `4200`: visita `http://localhost:4200/ejercicios`. Debe aparecer una tabla `mat-table` con los registros de `GET /api/ejercicios`.
3. En Chrome/Edge pulsa `F12 → Network (Red)`, filtra `Fetch/XHR`. Actualiza `/ejercicios` y busca una solicitud `GET /api/ejercicios` con estado **200**.
4. Visita `http://localhost:4200/registro` y comprueba que se carguen los objetivos en el `<select>`.
5. Registra un **usuario ficticio** y luego prueba `http://localhost:4200/login` con sus credenciales.
6. Se abrirá `http://localhost:4200/panel`; el frontend consultará usuario, rutinas, progresos y sesiones desde la API.
7. Crea una rutina con el formulario. Actualiza el panel; la rutina debe aparecer al volver a consultar PostgreSQL.
8. Registra un progreso vinculado a la rutina y un entrenamiento vinculado a la rutina y un ejercicio existente.

## Paso 5 — Datos de prueba: ¿por qué veo tablas vacías?

La API **NO crea automáticamente objetivos o ejercicios**. Si `GET /api/objetivos` o `GET /api/ejercicios` responde `[]`, introduce datos ficticios en Swagger:

1. Abre `http://localhost:8080/swagger-ui/index.html`.
2. Busca **ObjetivoController** → `POST /api/objetivos` → Try it out → coloca:

```json
{
  "nombreObjetivo": "Ganar masa muscular",
  "descripcion": "Objetivo de demostración académica"
}
```

3. Luego busca **EjercicioController** → `POST /api/ejercicios` → coloca:

```json
{
  "nombreEjercicio": "Remo con mancuerna",
  "grupoMuscular": "Espalda",
  "descripcion": "Ejercicio de prueba",
  "tipo": "Fuerza",
  "equipoNecesario": "Mancuerna"
}
```

4. Vuelve a consultar los endpoints GET. Verás registros y los formularios podrán utilizarlos.

También puedes emplear `DATOS_PRUEBA_API.http` desde el cliente HTTP de IntelliJ / WebStorm. Los IDs de los datos creados son generados por PostgreSQL: no supongas que siempre serán 1.

## Paso 6 — Errores frecuentes y qué significan

| Síntoma | Causa probable | Solución |
|---|---|---|
| `npm ERR! ENOENT package.json` | Carpeta incorrecta | Abre la carpeta interior con `package.json` |
| `'ng' no se reconoce` | Dependencias no instaladas | `npm install`; después `npm start` (CLI local) |
| `ECONNREFUSED 127.0.0.1:8080`, `502` | API apagada o puerto distinto | Arranca IntelliJ, comprueba el puerto 8080 y la URL directa |
| `500` desde el backend | Error Spring/PostgreSQL | Revisa terminal de IntelliJ, base, JDK y `DB_PASSWORD` |
| `401` en `/api/auth/login` | Correo o contraseña incorrectos | Usa las credenciales de un usuario registrado de prueba |
| `404` en `/api/...` | Ruta o ID no encontrado | Comprueba la ruta exacta en `@RequestMapping` y `@GetMapping` |
| Se ve `[]` o el mensaje «sin datos» | BD sin registros | Inserta datos de prueba usando Swagger |
| CORS en navegador | Llamaste directamente al puerto 8080 sin proxy | Usa servicios con `/api/...` y el proxy, o revisa CorsConfig |
| Cambiaste proxy y no funciona | Angular no recargó config del proxy | Detén `npm start` con `Ctrl+C` y vuelve a ejecutarlo |
| `MatTable` o `MatFormField` no se encuentran | Angular Material sin instalar | `npm install` en la carpeta raíz y recarga el proyecto de WebStorm |

## Paso 7 — Seguridad y alcance

Este backend **no exige autenticación**: `POST /api/auth/login` solo comprueba credenciales, no crea una sesión autenticada. Un `idUsuario` guardado en el navegador es un selector de demostración, **no es garantía de identidad**. No lo publiques en Wix, servidores remotos o servicios abiertos; usa localhost y usuarios ficticios. Antes de publicar debes reinstaurar autenticación y controles de permisos, CORS apropiado y protección de datos.

Este frontend implementa las pantallas públicas existentes, registro/login, catálogo de ejercicios, panel con consultas y formularios para crear rutinas/progresos/entrenamientos. **No implementa todas las funcionalidades del backend**, como IA o generación automática de rutinas; los dashboards legacy se conservan como archivos estáticos.
