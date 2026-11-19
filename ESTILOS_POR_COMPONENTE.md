# TrueForm — CSS separado por componentes Angular

Esta es la misma versión de TrueForm Angular, con los estilos reorganizados.

## Archivos CSS de cada página

- `src/app/paginas/inicio/inicio.css`: portada, secciones, equipo, CTA y pie de página ampliado del inicio.
- `src/app/paginas/beneficios/beneficios.css`: tarjetas de beneficios.
- `src/app/paginas/nosotros/nosotros.css`: presentación del proyecto.
- `src/app/paginas/contacto/contacto.css`: información de contacto.
- `src/app/paginas/login/login.css`: mensajes del inicio de sesión.
- `src/app/paginas/registro/registro.css`: equipo disponible, mensajes y ayudas del registro.

Cada archivo `.ts` tiene ahora `styleUrl: './nombre.css'` en el decorador `@Component`.

## Estilos globales

`src/styles.css` conserva solo estilos que usan varias páginas: variables, reseteo, navbar, botones, paneles, formularios compartidos, footer sencillo y adaptación móvil del menú.

## Dashboards originales

`public/legacy/css/styles.css` **no se modificó**; sigue dando estilos a los dashboards HTML originales aún no migrados a Angular. No se importa como estilo global de Angular.

## Para abrir en WebStorm

Abre la carpeta interior que contiene `package.json` y `angular.json`. Luego ejecuta:

```powershell
npm install
npm start
```

Para la funcionalidad de login y registro debe estar ejecutándose también la API Spring Boot, como en la versión anterior.
