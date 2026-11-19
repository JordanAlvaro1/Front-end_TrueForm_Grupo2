/* ===== TrueForm - Scripts ===== */

function toggleMenu() {
  const links = document.getElementById("navLinks");
  if (links) links.classList.toggle("open");
}

function togglePassword(checkbox, inputId) {
  const input = document.getElementById(inputId);
  if (input) input.type = checkbox.checked ? "text" : "password";
}

function handleForm(event, mensaje) {
  event.preventDefault();
  const form = event.target;

  const pass = form.querySelector('[name="password"]');
  const pass2 = form.querySelector('[name="password2"]');

  if (pass && pass2 && pass.value !== pass2.value) {
    alert("Las contraseñas no coinciden.");
    return false;
  }

  alert(mensaje || "¡Enviado con éxito!");
  form.reset();
  return false;
}
function mostrarPasswordRegistro() {
    const pass1 = document.getElementById("rPass");
    const pass2 = document.getElementById("rPass2");

    if (pass1.type === "password") {
        pass1.type = "text";
        pass2.type = "text";
    } else {
        pass1.type = "password";
        pass2.type = "password";
    }
}

function registrarUsuario(event) {
  event.preventDefault();

  const nombres = document.getElementById("rNombres").value.trim();
  const apellidos = document.getElementById("rApellidos").value.trim();
  const email = document.getElementById("rEmail").value.trim();
  const nivel = document.getElementById("rNivel").value;

  const edad = document.getElementById("rEdad").value;
  const peso = document.getElementById("rPeso").value;
  const altura = document.getElementById("rAltura").value;

  const objetivoElemento =
    document.getElementById("objetivo") ||
    document.getElementById("rObjetivo");

  const objetivo = objetivoElemento ? objetivoElemento.value : "";

  const equipoElemento = document.getElementById("equipo");
  const equipo = equipoElemento ? equipoElemento.value : "";

  const password = document.getElementById("rPass").value;
  const password2 = document.getElementById("rPass2").value;

  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!patron.test(email)) {
    alert("Ingrese un correo electrónico válido.");
    return false;
  }

  if (password !== password2) {
    alert("Las contraseñas no coinciden.");
    return false;
  }

  if (!nivel) {
    alert("Selecciona un nivel.");
    return false;
  }

  if (!objetivo) {
    alert("Selecciona un objetivo.");
    return false;
  }

  // Usuario SIMULADO
  const usuario = {
    idUsuario: Date.now(),
    nombres: nombres,
    apellidos: apellidos,
    email: email,
    password: password,
    edad: Number(edad),
    peso: Number(peso),
    altura: Number(altura),
    nivel: nivel,
    objetivo: objetivo,
    equipo: equipo
  };

  // Guardamos únicamente en el navegador
  localStorage.setItem(
    "usuarioRegistrado",
    JSON.stringify(usuario)
  );

  console.log("Usuario simulado registrado:", usuario);

  alert("Registro exitoso. Ahora inicia sesión.");

  window.location.href = "login.html";

  return false;
}

function cargarObjetivosRegistro() {

  const selectObjetivo =
    document.getElementById("rObjetivo") ||
    document.getElementById("objetivo");

  if (!selectObjetivo) {
    return;
  }

  // Evitar duplicar opciones si el HTML ya las tiene
  if (selectObjetivo.options.length > 1) {
    return;
  }

  const objetivos = [
    {
      id: "1",
      nombre: "Ganar fuerza"
    },
    {
      id: "2",
      nombre: "Ganar masa muscular"
    },
    {
      id: "3",
      nombre: "Bajar de peso"
    },
    {
      id: "4",
      nombre: "Mejorar resistencia"
    }
  ];

  objetivos.forEach(objetivo => {

    const opcion = document.createElement("option");

    opcion.value = objetivo.id;
    opcion.textContent = objetivo.nombre;

    selectObjetivo.appendChild(opcion);
  });
}


document.addEventListener(
  "DOMContentLoaded",
  cargarObjetivosRegistro
);

function iniciarSesion(event) {
  event.preventDefault();

  const email = document.getElementById("lEmail").value.trim();
  const password = document.getElementById("lPass").value;

  // Obtener usuario registrado en la simulación
  const usuarioGuardado = localStorage.getItem("usuarioRegistrado");

  if (!usuarioGuardado) {
    alert("No existe un usuario registrado. Regístrate primero.");
    return false;
  }

  const usuario = JSON.parse(usuarioGuardado);

  // Validar correo y contraseña
  if (
    email.toLowerCase() !== usuario.email.toLowerCase() ||
    password !== usuario.password
  ) {
    alert("Correo o contraseña incorrectos.");
    return false;
  }

  // Guardar datos de la sesión simulada
  localStorage.setItem("idUsuario", usuario.idUsuario);

  localStorage.setItem(
    "nombreUsuario",
    usuario.nombres + " " + usuario.apellidos
  );

  localStorage.setItem("nivelUsuario", usuario.nivel);

  localStorage.setItem(
    "usuarioActual",
    JSON.stringify(usuario)
  );

  // Redirigir según nivel
  const nivel = usuario.nivel.toLowerCase();

  if (nivel === "principiante") {

    window.location.href = "dashboard-principiante.html";

  } else if (nivel === "intermedio") {

    window.location.href = "dashboard-intermedio.html";

  } else if (nivel === "avanzado") {

    window.location.href = "dashboard-avanzado.html";

  } else {

    alert("El usuario no tiene un nivel válido.");
  }

  return false;
}

/* Nombre de segmento avanzado*/
window.addEventListener("load", () => {

    const nombre = localStorage.getItem("nombreUsuario");
    const nivel = localStorage.getItem("nivelUsuario");

    if(document.getElementById("nombreUsuario")){
        document.getElementById("nombreUsuario").textContent = nombre || "Usuario";
    }

    if(document.getElementById("nivelUsuario")){
        document.getElementById("nivelUsuario").textContent =
            "Nivel: " + (nivel || "Sin nivel");
    }

});


let mesActual = 6;

const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
];
/* ===== Dashboards ===== */

function mostrarPanel(panel, elemento) {
  const contenedor = document.getElementById("panelContenido");
  if (!contenedor) return;

  document.querySelectorAll(".side-link").forEach(link => {
    link.classList.remove("active");
  });

  if (elemento) {
    elemento.classList.add("active");
  }

  const nivel = document.body.dataset.dashboard;

  if (nivel === "principiante") {
    mostrarPrincipiante(panel, contenedor);
  }

  if (nivel === "intermedio") {
    mostrarIntermedio(panel, contenedor);
  }

  if (nivel === "avanzado") {
    mostrarAvanzado(panel, contenedor);
  }
}
/* Cambio de titulo */
function cambiarTitulo(titulo, subtitulo){

    document.getElementById("tituloPanel").textContent = titulo;

    document.getElementById("subtituloPanel").textContent = subtitulo;

}
function mostrarPrincipiante(panel, contenedor) {
  if (panel === "inicio") {
    contenedor.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card"><i class="fa-solid fa-calendar-check"></i><h3>3/7</h3><p>Días completados</p></div>
        <div class="stat-card"><i class="fa-solid fa-chart-line"></i><h3>45%</h3><p>Progreso semanal</p></div>
        <div class="stat-card"><i class="fa-solid fa-fire"></i><h3>5</h3><p>Días de racha</p></div>
        <div class="stat-card"><i class="fa-solid fa-robot"></i><h3>8</h3><p>Consultas IA</p></div>
      </div>

      <div class="dashboard-main-grid">
        <div class="big-card">
          <h2>Rutina del día</h2>
          <p>Entrenamiento básico para iniciar con seguridad.</p>
          <div class="routine-item">✅ Calentamiento - 5 minutos</div>
          <div class="routine-item">⬜ Sentadillas - 3 series de 12</div>
          <div class="routine-item">⬜ Flexiones apoyadas - 3 series de 8</div>
          <div class="routine-item">⬜ Plancha - 3 series de 20 segundos</div>
          <button class="btn btn-primary" onclick="comenzarRutina()">Comenzar rutina</button>
        </div>

        <div class="big-card">
          <h2>Tu progreso</h2>
          <p>Visualiza tu avance semanal.</p>
          <div class="progress-bar"><div class="progress-fill" style="width:45%;"></div></div>
          <h3 class="progress-text">45%</h3>
          <p>Vas avanzando muy bien. Sigue constante.</p>
        </div>
      </div>

      <div class="big-card motivation-card">
        <h2>Consejo de hoy</h2>
        <p>“No necesitas entrenar perfecto, solo ser constante. Cada sesión cuenta.”</p>
      </div>
    `;
  }

  if (panel === "rutina") {
  cambiarTitulo(
    "Mi rutina semanal",
    "Consulta tu entrenamiento organizado por días según tu nivel y objetivo."
  );

  contenedor.innerHTML = `
    <div class="big-card">
      <h2>Rutina semanal - Principiante</h2>
      <p>
        Plan de entrenamiento orientado a mejorar tu condición física
        de forma progresiva y segura.
      </p>

      <!-- LUNES -->
      <div class="routine-item">
        <strong>Lunes - Piernas</strong><br><br>
        Sentadillas — 3 series de 12 repeticiones<br>
        Zancadas — 3 series de 10 repeticiones<br><br>

        <button class="btn btn-primary" onclick="comenzarRutina()">
          Comenzar rutina
        </button>
      </div>

      <!-- MARTES -->
      <div class="routine-item">
        <strong>Martes - Recuperación</strong><br>
        Día de recuperación. Mantente hidratado y realiza movilidad ligera.
      </div>

      <!-- MIÉRCOLES -->
      <div class="routine-item">
        <strong>Miércoles - Tren superior</strong><br><br>
        Flexiones apoyadas — 3 series de 8 repeticiones<br>
        Remo — 3 series de 10 repeticiones<br><br>

        <button class="btn btn-primary" onclick="comenzarRutina()">
          Comenzar rutina
        </button>
      </div>

      <!-- JUEVES -->
      <div class="routine-item">
        <strong>Jueves - Recuperación</strong><br>
        Día de recuperación. Mantente hidratado y realiza movilidad ligera.
      </div>

      <!-- VIERNES -->
      <div class="routine-item">
        <strong>Viernes - Cuerpo completo</strong><br><br>
        Sentadillas — 3 series de 12 repeticiones<br>
        Flexiones apoyadas — 3 series de 8 repeticiones<br>
        Plancha abdominal — 3 series de 20 segundos<br><br>

        <button class="btn btn-primary" onclick="comenzarRutina()">
          Comenzar rutina
        </button>
      </div>

      <!-- SÁBADO -->
      <div class="routine-item">
        <strong>Sábado - Recuperación activa</strong><br>
        Realiza movilidad ligera, estiramientos y mantente hidratado.
      </div>

      <!-- DOMINGO -->
      <div class="routine-item">
        <strong>Domingo - Descanso</strong><br>
        Día de descanso para favorecer la recuperación muscular.
      </div>

    </div>
  `;
}
  if (panel === "progreso") {
  cambiarTitulo(
    "Mi progreso",
    "Consulta tus estadísticas y observa tu evolución semanal."
  );

  contenedor.innerHTML = `
    <div class="big-card">
      <h2>Mi progreso semanal</h2>
      <p>Resumen visual del cumplimiento de tus entrenamientos durante la semana.</p>

      <div class="chart-box">
        <div class="bar-chart">

          <div class="bar-item">
            <span>Lun</span>
            <div class="bar">
              <div style="height:100%;"></div>
            </div>
            <small>100%</small>
          </div>

          <div class="bar-item">
            <span>Mar</span>
            <div class="bar">
              <div style="height:0%;"></div>
            </div>
            <small>Descanso</small>
          </div>

          <div class="bar-item">
            <span>Mié</span>
            <div class="bar">
              <div style="height:50%;"></div>
            </div>
            <small>50%</small>
          </div>

          <div class="bar-item">
            <span>Jue</span>
            <div class="bar">
              <div style="height:0%;"></div>
            </div>
            <small>Descanso</small>
          </div>

          <div class="bar-item">
            <span>Vie</span>
            <div class="bar">
              <div style="height:80%;"></div>
            </div>
            <small>80%</small>
          </div>

          <div class="bar-item">
            <span>Sáb</span>
            <div class="bar">
              <div style="height:0%;"></div>
            </div>
            <small>Recuperación</small>
          </div>

          <div class="bar-item">
            <span>Dom</span>
            <div class="bar">
              <div style="height:0%;"></div>
            </div>
            <small>Descanso</small>
          </div>

        </div>
      </div>

      <div class="stats-grid" style="margin-top:25px;">

        <div class="stat-card">
          <i class="fa-solid fa-calendar-check"></i>
          <h3>3</h3>
          <p>Sesiones registradas</p>
        </div>

        <div class="stat-card">
          <i class="fa-solid fa-check-double"></i>
          <h3>2</h3>
          <p>Rutinas completadas</p>
        </div>

        <div class="stat-card">
          <i class="fa-solid fa-dumbbell"></i>
          <h3>7</h3>
          <p>Ejercicios realizados</p>
        </div>

        <div class="stat-card">
          <i class="fa-solid fa-chart-line"></i>
          <h3>77%</h3>
          <p>Cumplimiento promedio</p>
        </div>

      </div>

      <div class="motivation-card" style="margin-top:25px;">
        <h3>Resumen semanal</h3>
        <p>
          Has mantenido un buen nivel de cumplimiento esta semana.
          Continúa con tus entrenamientos y respeta tus días de recuperación.
        </p>
      </div>

    </div>
  `;
}

if (panel === "tips") {
  cambiarTitulo(
    "Tips básicos",
    "Consulta recomendaciones sencillas para entrenar de forma segura y mejorar tus hábitos."
  );

  contenedor.innerHTML = `
    <div class="big-card">
      <h2>Consejos de hoy</h2>
      <p>Ten en cuenta estas recomendaciones durante tu entrenamiento.</p>

      <div class="tips-grid" style="margin-top:20px;">

        <div class="tip-card">
          💧 <strong>Hidratación</strong><br>
          Toma agua antes, durante y después de entrenar.
        </div>

        <div class="tip-card">
          🧍 <strong>Técnica</strong><br>
          Mantén una postura correcta y realiza los movimientos de forma controlada.
        </div>

        <div class="tip-card">
          😴 <strong>Recuperación</strong><br>
          Descansa adecuadamente para favorecer la recuperación muscular.
        </div>

        <div class="tip-card">
          🔥 <strong>Progresión</strong><br>
          Empieza con una intensidad adecuada y aumenta progresivamente.
        </div>

      </div>

      <p style="margin-top:20px;">
        <i class="fa-solid fa-circle-info"></i>
        Los consejos pueden actualizarse según tu entrenamiento.
      </p>
    </div>
  `;
}


if (panel === "glosario") {

  cambiarTitulo(
    "Glosario Fitness para Principiantes",
    "Aprende ejercicios, músculos y conceptos básicos antes de entrenar."
  );

  contenedor.innerHTML = `
    <div class="big-card">

      <!-- BUSCADOR DEL GLOSARIO -->
      <h2>🔎 Buscar en el glosario</h2>
      <p>Escribe un término fitness para consultar su significado.</p>

      <div style="display:flex; gap:10px; margin:20px 0;">
        <input
          type="text"
          id="buscarTermino"
          placeholder="Ejemplo: serie, repetición, core..."
          class="line-input"
          style="flex:1;"
        >

        <button
          class="btn btn-primary"
          onclick="buscarTerminoGlosario()">
          Buscar
        </button>
      </div>

      <div id="resultadoGlosario"></div>


      <!-- CONTENIDO DEL GLOSARIO -->
      <h2 style="margin-top:30px;">📚 Aprende los conceptos básicos</h2>

      <p class="glosario-texto">
        Antes de comenzar tu entrenamiento, conoce los ejercicios y términos más importantes.
      </p>


      <!-- EJERCICIOS -->
      <h3>🏋 Ejercicios</h3>

      <div class="routine-item">
        <strong>Sentadilla</strong>
        <span class="tag-easy">Fácil</span>

        <p>Fortalece piernas y glúteos.</p>

        <small>
          <strong>Trabaja:</strong>
          cuádriceps, glúteos y femorales.
        </small>

        <p>
          💡 Mantén la espalda recta y baja de forma controlada.
        </p>
      </div>


      <div class="routine-item">
        <strong>Plancha</strong>
        <span class="tag-easy">Fácil</span>

        <p>Fortalece abdomen y zona media.</p>

        <small>
          <strong>Trabaja:</strong>
          abdomen, espalda baja y core.
        </small>

        <p>
          💡 No bajes la cadera durante el ejercicio.
        </p>
      </div>


      <div class="routine-item">
        <strong>Flexiones</strong>
        <span class="tag-easy">Fácil</span>

        <p>Trabajan pecho, hombros y tríceps.</p>

        <small>
          <strong>Trabaja:</strong>
          pecho, tríceps y hombros.
        </small>

        <p>
          💡 Si eres principiante, puedes apoyar las rodillas.
        </p>
      </div>


      <!-- CONCEPTOS BÁSICOS -->
      <h3 style="margin-top:25px;">📖 Conceptos básicos</h3>

      <div class="routine-item">
        <strong>Serie:</strong>
        grupo de repeticiones de un ejercicio.
      </div>

      <div class="routine-item">
        <strong>Repetición:</strong>
        cada vez que realizas un movimiento completo.
      </div>

      <div class="routine-item">
        <strong>Descanso:</strong>
        pausa entre series para recuperar energía.
      </div>


      <!-- MÚSCULOS -->
      <h3 style="margin-top:25px;">💪 Músculos</h3>

      <div class="routine-item">
        <strong>Cuádriceps:</strong>
        músculo ubicado en la parte frontal del muslo.
      </div>

      <div class="routine-item">
        <strong>Glúteos:</strong>
        músculos importantes para fuerza, estabilidad y postura.
      </div>

      <div class="routine-item">
        <strong>Core:</strong>
        zona media del cuerpo que ayuda a mantener equilibrio y estabilidad.
      </div>

    </div>
  `;
}


  if (panel === "videos") {
  cambiarTitulo(
    "Videos recomendados",
    "Aprende la técnica correcta observando ejemplos prácticos."
  );

  contenedor.innerHTML = `
<div class="big-card">
  <h2>Videos recomendados</h2>
  <p>Aprende viendo la técnica correcta de ejercicios básicos para principiantes.</p>

  <div class="video-grid">

    <div class="video-card">
      <iframe
        src="https://www.youtube.com/embed/IIBeY0IyyCU"
        allowfullscreen>
      </iframe>
      <h4>Sentadilla correcta</h4>
    </div>

    <div class="video-card">
      <iframe
        src="https://www.youtube.com/embed/yZmxX1ypJbE"
        allowfullscreen>
      </iframe>
      <h4>Rutina de TRÍCEPS</h4>
    </div>

    <div class="video-card">
      <iframe
        src="https://www.youtube.com/embed/4VuCF75s6jE"
        allowfullscreen>
      </iframe>
      <h4>Rutina de pecho</h4>
    </div>

    <div class="video-card">
      <iframe
        src="https://www.youtube.com/embed/p37Lt-v4XUU"
        allowfullscreen>
      </iframe>
      <h4>Rutina de piernas</h4>
    </div>

  </div>
</div>
`;
}

  if (panel === "chat") {
    cambiarTitulo(
    "Asistente IA TrueForm",
    "Haz preguntas sobre ejercicios, alimentación, descanso o técnica."
    );
  contenedor.innerHTML = `
    <div class="big-card chat-card">
      <h2>Chat IA TrueForm</h2>
      <p>Hazme preguntas sobre ejercicios, técnica, rutinas, descanso o alimentación.</p>

      <div class="chat-suggestions">
        <button onclick="preguntaRapida('¿Cómo hago una sentadilla?')">Sentadilla</button>
        <button onclick="preguntaRapida('¿Cuánto debo descansar?')">Descanso</button>
        <button onclick="preguntaRapida('¿Qué comer después de entrenar?')">Alimentación</button>
        <button onclick="preguntaRapida('Me duele la rodilla')">Dolor de rodilla</button>
      </div>

      <div class="chat-area" id="chatArea">
        <div class="bot-message">
          Hola 👋 Soy tu asistente TrueForm. Puedes preguntarme sobre ejercicios, técnica o rutinas.
        </div>
      </div>

      <div class="chat-input-row">
        <input id="chatInput" class="search-input" type="text" placeholder="Escribe tu pregunta...">
        <button class="btn btn-primary" onclick="enviarPreguntaIA()">Enviar</button>
      </div>
    </div>
  `;
}
}


/* ===== Cargar rutina simulada en el Dashboard ===== */
function cargarRutinaDashboard() {

  const rutinaGuardada = localStorage.getItem("rutinaIntermedia");

  const nombre = document.getElementById("nombreRutinaDashboard");
  const descripcion = document.getElementById("descripcionRutinaDashboard");
  const lista = document.getElementById("listaEjerciciosDashboard");

  // Si estos elementos no existen en la página, no hacemos nada
  if (!nombre || !descripcion || !lista) {
    return;
  }

  // Si todavía no se creó una rutina
  if (!rutinaGuardada) {

    nombre.textContent = "Sin rutina asignada";

    descripcion.textContent =
      "Actualmente no tienes una rutina registrada.";

    lista.innerHTML = "";

    return;
  }

  // Recuperar rutina creada anteriormente
  const rutina = JSON.parse(rutinaGuardada);

  nombre.textContent = rutina.nombre;

  descripcion.textContent =
    `${rutina.objetivo} - ${rutina.grupoMuscular}`;

  lista.innerHTML = "";

  rutina.ejercicios.forEach(item => {

    lista.innerHTML += `
      <div class="routine-item">
        ⬜ ${item.ejercicio} - ${item.series}
      </div>
    `;
  });
  
}
/* ===== Cargar progreso simulado ===== */
function cargarProgresoDashboard() {

  const progresoGuardado =
    localStorage.getItem("progresoTrueForm");

  const porcentaje =
    progresoGuardado !== null
      ? Number(progresoGuardado)
      : 0;

  const barra =
    document.getElementById("barraProgresoDashboard");

  const texto =
    document.getElementById("porcentajeProgresoDashboard");

  const porcentajeSemanal =
    document.getElementById("progresoSemanalDashboard");

  const avanceSemanal =
    document.getElementById("avanceSemanalProgreso");

  if (barra) {
    barra.style.width = porcentaje + "%";
  }

  if (texto) {
    texto.textContent = porcentaje + "%";
  }

  if (porcentajeSemanal) {
    porcentajeSemanal.textContent = porcentaje + "%";
  }

  if (avanceSemanal) {
    avanceSemanal.textContent = porcentaje + "%";
  }

  console.log("Progreso cargado:", porcentaje + "%");
}




function buscarTerminoGlosario() {

  const input = document.getElementById("buscarTermino");
  const resultado = document.getElementById("resultadoGlosario");

  const termino = input.value.trim().toLowerCase();

  if (termino === "") {
    resultado.innerHTML = `
      <div class="routine-item">
        ⚠️ Debes ingresar un término para realizar la búsqueda.
      </div>
    `;
    return;
  }

  const glosario = {
    "sentadilla": "Ejercicio que fortalece principalmente piernas y glúteos.",

    "plancha": "Ejercicio isométrico que fortalece el abdomen y la zona media del cuerpo.",

    "flexiones": "Ejercicio que trabaja principalmente pecho, hombros y tríceps.",

    "serie": "Grupo de repeticiones realizadas de manera consecutiva.",

    "repetición": "Cada vez que se realiza completamente el movimiento de un ejercicio.",

    "repeticion": "Cada vez que se realiza completamente el movimiento de un ejercicio.",

    "descanso": "Pausa entre series o ejercicios que permite recuperar energía.",

    "cuádriceps": "Músculo ubicado en la parte frontal del muslo.",

    "cuadriceps": "Músculo ubicado en la parte frontal del muslo.",

    "glúteos": "Grupo muscular importante para la fuerza, estabilidad y postura.",

    "gluteos": "Grupo muscular importante para la fuerza, estabilidad y postura.",

    "core": "Conjunto de músculos de la zona media del cuerpo que ayudan a mantener estabilidad y equilibrio."
  };

  if (glosario[termino]) {

    resultado.innerHTML = `
      <div class="routine-item">
        <strong>${input.value.trim()}</strong>
        <p>${glosario[termino]}</p>
      </div>
    `;

  } else {

    resultado.innerHTML = `
      <div class="routine-item">
        <strong>Término no encontrado</strong>
        <p>
          No encontramos "${input.value.trim()}" en el glosario.
          Puedes consultar al asistente virtual de TrueForm.
        </p>

        <button
          class="btn btn-primary"
          onclick="abrirChatDesdeGlosario()">
          Consultar al asistente IA
        </button>
      </div>
    `;
  }
}

function abrirChatDesdeGlosario() {

  const enlaceChat = [...document.querySelectorAll(".side-link")]
    .find(link => link.textContent.includes("Chat IA"));

  if (enlaceChat) {
    mostrarPanel("chat", enlaceChat);
  }
}



function mostrarIntermedio(panel, contenedor) {

  if (panel === "inicio") {
    cambiarTitulo(
      "Panel Intermedio",
      "Mejora tu rendimiento, evita el estancamiento y controla tu progreso."
    );

    contenedor.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card"><i class="fa-solid fa-calendar-check"></i><h3>5/7</h3><p>Días completados</p></div>
        <div class="stat-card">
            <i class="fa-solid fa-chart-line"></i>
              <h3 id="progresoSemanalDashboard">0%</h3>
              <p>Progreso semanal</p>
        </div>

        <div class="stat-card"><i class="fa-solid fa-fire"></i><h3>9</h3><p>Días de racha</p></div>
        <div class="stat-card"><i class="fa-solid fa-repeat"></i><h3>4</h3><p>Ejercicios cambiados</p></div>
      </div>

      <div class="dashboard-main-grid">
          <div class="big-card">

            <h2 id="nombreRutinaDashboard">
              Rutina personalizada
            </h2>

            <p id="descripcionRutinaDashboard">
              Cargando rutina...
            </p>

            <div id="listaEjerciciosDashboard">
              <div class="routine-item">
                Cargando ejercicios...
              </div>
            </div>

            <button
              class="btn btn-primary"
              onclick="comenzarRutinaIntermedia()">
              Comenzar rutina
            </button>
          </div>

        <div class="big-card">
          <h2>Progreso actual</h2>
          <p>Tu avance semanal va mejorando.</p>
          <div class="progress-bar">
            <div
              class="progress-fill"
              id="barraProgresoDashboard"
              style="width:0%;">
            </div>
          </div>

          <h3
            class="progress-text"
            id="porcentajeProgresoDashboard">
            0%
          </h3>
          <p>Buen ritmo. Mantén la intensidad.</p>
        </div>
      </div>

      <div class="big-card motivation-card">
        <h2>Recomendación</h2>
        <p>“Para evitar el estancamiento, aumenta poco a poco la carga o las repeticiones.”</p>
      </div>
    `;
    cargarRutinaDashboard();
    cargarProgresoDashboard();
  }


  if (panel === "rutina") {
    cambiarTitulo(
      "Rutina personalizada",
      "Sigue una rutina de nivel intermedio enfocada en fuerza y resistencia."
    );

    contenedor.innerHTML = `
      <div class="big-card">
        <h2>Rutina personalizada intermedia</h2>
        <p>Rutina diseñada para mejorar fuerza, técnica y resistencia.</p>
        <div class="routine-item"><strong>1.</strong> Calentamiento dinámico - 8 minutos</div>
        <div class="routine-item"><strong>2.</strong> Sentadilla con peso - 4 series de 10</div>
        <div class="routine-item"><strong>3.</strong> Press de pecho - 4 series de 10</div>
        <div class="routine-item"><strong>4.</strong> Remo con mancuerna - 3 series de 12</div>
        <div class="routine-item"><strong>5.</strong> Plancha lateral - 3 series de 30 segundos</div>
        <button class="btn btn-primary" onclick="comenzarRutinaIntermedia()">Comenzar rutina</button>
      </div>
    `;
  }

if (panel === "crearRutina") {
  cambiarTitulo(
    "Crear / Modificar rutina",
    "Planifica tus entrenamientos usando un calendario y guarda tu rutina."
  );

  contenedor.innerHTML = `
    <div class="big-card">
      <h2>Calendario de entrenamiento</h2>
      <p>Selecciona un día y crea una rutina personalizada.</p>

      <div class="calendar-box">
        <div class="calendar-header">
          <button class="calendar-btn" onclick="mesAnterior()">
            <i class="fa-solid fa-chevron-left"></i>
          </button>

          <h3 id="mesActual">Julio 2026</h3>

          <button class="calendar-btn" onclick="mesSiguiente()">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
    </div>

        <div class="calendar-grid">
          <strong>L</strong><strong>M</strong><strong>X</strong><strong>J</strong><strong>V</strong><strong>S</strong><strong>D</strong>

          <button></button>
          <button></button>
          <button onclick="seleccionarDiaRutina(1)">1</button>
          <button onclick="seleccionarDiaRutina(2)">2</button>
          <button onclick="seleccionarDiaRutina(3)">3</button>
          <button onclick="seleccionarDiaRutina(4)">4</button>
          <button onclick="seleccionarDiaRutina(5)">5</button>
          <button onclick="seleccionarDiaRutina(6)">6</button>
          <button onclick="seleccionarDiaRutina(7)">7</button>
          <button onclick="seleccionarDiaRutina(8)">8</button>
          <button onclick="seleccionarDiaRutina(9)">9</button>
          <button onclick="seleccionarDiaRutina(10)">10</button>
          <button onclick="seleccionarDiaRutina(11)">11</button>
          <button onclick="seleccionarDiaRutina(12)">12</button>
          <button onclick="seleccionarDiaRutina(13)">13</button>
          <button onclick="seleccionarDiaRutina(14)">14</button>
          <button onclick="seleccionarDiaRutina(15)">15</button>
          <button onclick="seleccionarDiaRutina(16)">16</button>
          <button onclick="seleccionarDiaRutina(17)">17</button>
          <button onclick="seleccionarDiaRutina(18)">18</button>
          <button onclick="seleccionarDiaRutina(19)">19</button>
          <button onclick="seleccionarDiaRutina(20)">20</button>
          <button onclick="seleccionarDiaRutina(21)">21</button>
          <button onclick="seleccionarDiaRutina(22)">22</button>
          <button onclick="seleccionarDiaRutina(23)">23</button>
          <button onclick="seleccionarDiaRutina(24)">24</button>
          <button onclick="seleccionarDiaRutina(25)">25</button>
          <button onclick="seleccionarDiaRutina(26)">26</button>
          <button onclick="seleccionarDiaRutina(27)">27</button>
          <button onclick="seleccionarDiaRutina(28)">28</button>
          <button onclick="seleccionarDiaRutina(29)">29</button>
          <button onclick="seleccionarDiaRutina(30)">30</button>
          <button onclick="seleccionarDiaRutina(31)">31</button>
          <button></button>
          <button></button>
        </div>

        <p id="diaSeleccionado" class="selected-day">Día seleccionado: ninguno</p>
      </div>

      <div class="field">
        <label>Nombre de la rutina</label>
        <input class="line-input" id="nombreRutina" placeholder="Ejemplo: Piernas y abdomen">
      </div>

      <div class="field-row">
        <div class="field">
          <label>Objetivo</label>
          <select class="line-select" id="objetivoRutina">
            <option>Ganar masa muscular</option>
            <option>Ganar fuerza</option>
            <option>Bajar grasa</option>
            <option>Mejorar resistencia</option>
          </select>
        </div>

        <div class="field">
          <label>Grupo muscular</label>
          <select class="line-select" id="grupoRutina">
            <option>Pecho</option>
            <option>Espalda</option>
            <option>Piernas</option>
            <option>Hombros</option>
            <option>Brazos</option>
            <option>Full body</option>
          </select>
        </div>
      </div>

      <div class="field-row">
        <div class="field">
          <label>Ejercicio</label>
          <input class="line-input" id="ejercicioRutina" placeholder="Ejemplo: Sentadilla">
        </div>

        <div class="field">
          <label>Series y repeticiones</label>
          <input class="line-input" id="seriesRutina" placeholder="Ejemplo: 4x10">
        </div>
      </div>

      <button class="btn btn-primary" onclick="agregarEjercicioIntermedio()">Agregar ejercicio</button>

      <div id="listaEjercicios" class="routine-list-box">
        <h3>Ejercicios agregados</h3>
        <p class="muted-text">Aún no agregaste ejercicios.</p>
      </div>

      <button class="btn btn-primary" onclick="guardarRutinaCalendario()">Guardar rutina</button>
    </div>

    <div id="resultadoRutinaCalendario" style="margin-top:25px;"></div>
  `;
}

  if (panel === "progreso") {
    cambiarTitulo(
      "Mi progreso",
      "Visualiza tu evolución con métricas y gráficos motivadores."
    );

    contenedor.innerHTML = `
      <div class="big-card">
        <h2>Progreso semanal</h2>
        <p>Resumen de tu rendimiento durante la semana.</p>

        <div class="chart-box">
          <div class="bar-chart">
            <div class="bar-item"><span>Lun</span><div class="bar"><div style="height:75%;"></div></div><small>75%</small></div>
            <div class="bar-item"><span>Mar</span><div class="bar"><div style="height:55%;"></div></div><small>55%</small></div>
            <div class="bar-item"><span>Mié</span><div class="bar"><div style="height:70%;"></div></div><small>70%</small></div>
            <div class="bar-item"><span>Jue</span><div class="bar"><div style="height:62%;"></div></div><small>62%</small></div>
            <div class="bar-item"><span>Vie</span><div class="bar"><div style="height:85%;"></div></div><small>85%</small></div>
            <div class="bar-item"><span>Sáb</span><div class="bar"><div style="height:50%;"></div></div><small>50%</small></div>
            <div class="bar-item"><span>Dom</span><div class="bar"><div style="height:40%;"></div></div><small>40%</small></div>
          </div>
        </div>

        <div class="stats-grid" style="margin-top:25px;">
          <div class="stat-card"><i class="fa-solid fa-dumbbell"></i><h3>28</h3><p>Ejercicios realizados</p></div>
          <div class="stat-card"><i class="fa-solid fa-clock"></i><h3>5h</h3><p>Tiempo entrenado</p></div>
          <div class="stat-card"><i class="fa-solid fa-fire"></i><h3>9</h3><p>Días de racha</p></div>
          <div class="stat-card">
            <i class="fa-solid fa-chart-line"></i>
            <h3 id="avanceSemanalProgreso">0%</h3>
            <p>Avance semanal</p>
          </div>
        </div>
      </div>
      <div class="dashboard-main-grid" style="margin-top:25px;">

    <div class="big-card">
      <h2>Objetivos semanales</h2>

      <div class="goal-item">
        <div>
          <strong>Entrenar 5 días</strong>
          <span>4/5 completados</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:80%;"></div>
        </div>
      </div>

      <div class="goal-item">
        <div>
          <strong>Realizar 35 ejercicios</strong>
          <span>28/35 realizados</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:80%;"></div>
        </div>
      </div>

      <div class="goal-item">
        <div>
          <strong>Entrenar 6 horas</strong>
          <span>5/6 horas</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:83%;"></div>
        </div>
        </div>
      </div>

  <div class="big-card">
    <h2>Músculos trabajados</h2>

    <div class="muscle-row">
      <span>Piernas</span>
      <div class="muscle-bar"><div style="width:40%;"></div></div>
      <strong>40%</strong>
    </div>

    <div class="muscle-row">
      <span>Pecho</span>
      <div class="muscle-bar"><div style="width:25%;"></div></div>
      <strong>25%</strong>
    </div>

    <div class="muscle-row">
      <span>Espalda</span>
      <div class="muscle-bar"><div style="width:18%;"></div></div>
      <strong>18%</strong>
    </div>

    <div class="muscle-row">
      <span>Hombros</span>
      <div class="muscle-bar"><div style="width:10%;"></div></div>
      <strong>10%</strong>
    </div>

    <div class="muscle-row">
      <span>Brazos</span>
      <div class="muscle-bar"><div style="width:7%;"></div></div>
      <strong>7%</strong>
    </div>
  </div>

</div>

  <div class="dashboard-main-grid" style="margin-top:25px;">

    <div class="big-card">
      <h2>Logros desbloqueados</h2>

      <div class="routine-item">🏅 Primera semana completa</div>
      <div class="routine-item">🔥 5 días seguidos</div>
      <div class="routine-item">💪 20 ejercicios realizados</div>
      <div class="routine-item">🔒 Completar 50 rutinas</div>
    </div>

    <div class="big-card">
      <h2>Récords personales</h2>

      <div class="routine-item"><strong>Sentadilla:</strong> 80 kg</div>
      <div class="routine-item"><strong>Press banca:</strong> 65 kg</div>
      <div class="routine-item"><strong>Peso muerto:</strong> 100 kg</div>
      <div class="routine-item"><strong>Dominadas:</strong> 8 repeticiones</div>
    </div>

  </div>
    `;
    cargarProgresoDashboard();
  }


if (panel === "cambios") {

  cambiarTitulo(
    "Cambiar ejercicios",
    "Encuentra alternativas según tu equipo, nivel o dificultad."
  );

  contenedor.innerHTML = `
    <div class="big-card">
      <h2>Cambio de ejercicios</h2>
      <p>Selecciona una alternativa para adaptar tu rutina sin perder el objetivo del entrenamiento.</p>

      <div class="change-grid">

        <div class="change-card">
          <h3>Press de pecho</h3>
          <p>Alternativas recomendadas:</p>

          <select class="line-select" id="cambioPecho">
            <option>Flexiones inclinadas</option>
            <option>Press con mancuernas</option>
           <option>Press en máquina</option>
          </select>
        </div>

        <div class="change-card">
          <h3>Sentadilla con peso</h3>
          <p>Alternativas recomendadas:</p>

          <select class="line-select" id="cambioPierna">
            <option>Sentadilla búlgara</option>
            <option>Prensa</option>
            <option>Sentadilla goblet</option>
          </select>
        </div>

        <div class="change-card">
          <h3>Remo con mancuerna</h3>
          <p>Alternativas recomendadas:</p>

          <select class="line-select" id="cambioRemo">
            <option>Remo con banda elástica</option>
            <option>Jalón al pecho</option>
            <option>Remo en máquina</option>
          </select>
        </div>

        <div class="change-card">
          <h3>Plancha lateral</h3>
          <p>Alternativas recomendadas:</p>

          <select class="line-select" id="cambioPlancha">
            <option>Dead bug</option>
            <option>Hollow hold</option>
            <option>Plancha frontal</option>
          </select>
        </div>

      </div>

      <button class="btn btn-primary" onclick="aplicarCambiosEjercicios()">
        Aplicar cambios
      </button>

      <div id="resultadoCambios"></div>
    </div>
  `;
}

  if (panel === "tips") {
    cambiarTitulo(
      "Tips intermedios",
      "Consejos para seguir progresando sin estancarte."
    );

    contenedor.innerHTML = `
      <div class="tips-grid">
        <div class="tip-card">📈 Aumenta la carga progresivamente, no de golpe.</div>
        <div class="tip-card">🧠 Prioriza la técnica antes que levantar más peso.</div>
        <div class="tip-card">⏱️ Descansa entre 60 y 120 segundos según el ejercicio.</div>
        <div class="tip-card">🔄 Cambia algunos ejercicios cada 4 a 6 semanas.</div>
        <div class="tip-card">🍗 Consume suficiente proteína para recuperar músculo.</div>
        <div class="tip-card">😴 Duerme bien para evitar fatiga acumulada.</div>
      </div>
    `;
  }

  if (panel === "videos") {
    cambiarTitulo(
      "Videos intermedios",
      "Refuerza tu técnica con videos de ejercicios más completos."
    );

    contenedor.innerHTML = `
      <div class="big-card">
        <h2>Videos recomendados</h2>
        <p>Aprende la técnica correcta para ejercicios de nivel intermedio.</p>

        <div class="video-grid">
          <div class="video-card">
            <iframe src="https://www.youtube.com/embed/nSD9g3n0xf0" allowfullscreen></iframe>
            <h4>Consejos para la sobrecarga para el estancamiento</h4>
          </div>

          <div class="video-card">
            <iframe src="https://www.youtube.com/embed/aclHkVaku9U" allowfullscreen></iframe>
            <h4>Rtuina de Sentadillas correctamente</h4>
          </div>

          <div class="video-card">
            <iframe src="https://www.youtube.com/embed/pSHjTRCQxIw" allowfullscreen></iframe>
            <h4>Entrenamiento de como hacer correctamente un tablon</h4>
          </div>

          <div class="video-card">
            <iframe src="https://www.youtube.com/embed/g_tea8ZNk5A" allowfullscreen></iframe>
            <h4>Flexivilidad,movilidad y relajación </h4>
          </div>
        </div>
      </div>
    `;
  }

  if (panel === "chat") {
    cambiarTitulo(
      "Chat IA Intermedio",
      "Consulta dudas sobre técnica, cargas, estancamiento o cambios de ejercicios."
    );

    contenedor.innerHTML = `
      <div class="big-card chat-card">
        <h2>Chat IA TrueForm</h2>
        <p>Haz preguntas sobre técnica, cargas, cambios de ejercicios o progreso.</p>

        <div class="chat-suggestions">
          <button onclick="preguntaRapida('Estoy estancado')">Estancamiento</button>
          <button onclick="preguntaRapida('¿Cuánto peso debo subir?')">Subir peso</button>
          <button onclick="preguntaRapida('¿Qué reemplaza el press banca?')">Reemplazo</button>
          <button onclick="preguntaRapida('Rutina de hipertrofia')">Hipertrofia</button>
        </div>

        <div class="chat-area" id="chatArea">
          <div class="bot-message">
            Hola 👋 Soy tu asistente TrueForm. Puedo ayudarte a mejorar tu rutina intermedia.
          </div>
        </div>

        <div class="chat-input-row">
          <input id="chatInput" class="search-input" type="text" placeholder="Escribe tu pregunta...">
          <button class="btn btn-primary" onclick="enviarPreguntaIA()">Enviar</button>
        </div>
      </div>
    `;
  }
}

function mostrarAvanzado(panel, contenedor) {
  if (panel === "inicio") {

  cambiarTitulo(
    "Panel Avanzado",
    "Optimiza tu rendimiento con progresiones, métricas e historial detallado."
  );
    contenedor.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card"><i class="fa-solid fa-dumbbell"></i><h3>18</h3><p>Sesiones completadas</p></div>
        <div class="stat-card"><i class="fa-solid fa-arrow-trend-up"></i><h3>78%</h3><p>Progresión mensual</p></div>
        <div class="stat-card"><i class="fa-solid fa-fire"></i><h3>14</h3><p>Días de racha</p></div>
        <div class="stat-card"><i class="fa-solid fa-chart-column"></i><h3>6</h3><p>Métricas activas</p></div>
      </div>

      <div class="dashboard-main-grid">
        <div class="big-card">
          <h2>Plan de progresión</h2>
          <p>Aumenta cargas, repeticiones e intensidad de forma controlada.</p>
          ${obtenerPlanProgresion()}

          <button class="btn btn-primary" onclick="mostrarPanel('progresion', document.querySelector('[onclick*=progresion]'))">
            Ver progresión
          </button>
        </div>

        <div class="big-card">
          <h2>Rendimiento</h2>
          <p>Resumen de evolución mensual.</p>
          <div class="progress-bar"><div class="progress-fill" style="width:78%;"></div></div>
          <h3 class="progress-text">78%</h3>
          <p>Excelente avance. Ajusta la intensidad con cuidado.</p>
        </div>
      </div>

      <div class="big-card motivation-card">
        <h2>Consejo avanzado</h2>
        <p>“Controla el volumen y la recuperación. Más entrenamiento no siempre significa mejor progreso.”</p>
      </div>
    `;
  }

if (panel === "progresion") {

  cambiarTitulo(
    "Plan de progresión",
    "Crea y guarda tu progresión semanal."
  );

  contenedor.innerHTML = `
    <div class="big-card">
      <h2>Crear plan de progresión</h2>

      <div class="field">
        <label>Ejercicio principal</label>
        <input class="line-input" id="progEjercicio" placeholder="Ejemplo: Peso muerto">
      </div>

      <div class="field-row">
        <div class="field">
          <label>Carga actual</label>
          <input class="line-input" id="progCarga" placeholder="Ejemplo: 100 kg">
        </div>

        <div class="field">
          <label>Meta</label>
          <input class="line-input" id="progMeta" placeholder="Ejemplo: 120 kg">
        </div>
      </div>

      <div class="field">
        <label>Semana 1</label>
        <input class="line-input" id="progSemana1" placeholder="Técnica y control">
      </div>

      <div class="field">
        <label>Semana 2</label>
        <input class="line-input" id="progSemana2" placeholder="Aumento de carga">
      </div>

      <div class="field">
        <label>Semana 3</label>
        <input class="line-input" id="progSemana3" placeholder="Mayor volumen">
      </div>

      <div class="field">
        <label>Semana 4</label>
        <input class="line-input" id="progSemana4" placeholder="Descarga activa">
      </div>

      <button class="btn btn-primary" onclick="guardarPlanProgresion()">
        Guardar progresión
      </button>

      <div id="resultadoProgresion" style="margin-top:25px;"></div>
    </div>
  `;
}
  if (panel === "volumen") {

  cambiarTitulo(
    "Ajustar volumen",
    "Personaliza el volumen de entrenamiento según tus prioridades."
  );

  contenedor.innerHTML = `
    <div class="big-card">

      <h2>Volumen por grupo muscular</h2>
      <p>Ajusta las series semanales para cada grupo muscular.</p>

      <div class="field">
        <label>Pecho:
          <strong id="valorPecho">16</strong> series
        </label>
        <input type="range" min="8" max="24" value="16"
        oninput="document.getElementById('valorPecho').innerHTML=this.value">
      </div>

      <div class="field">
        <label>Espalda:
          <strong id="valorEspalda">18</strong> series
        </label>
        <input type="range" min="8" max="24" value="18"
        oninput="document.getElementById('valorEspalda').innerHTML=this.value">
      </div>

      <div class="field">
        <label>Piernas:
          <strong id="valorPiernas">20</strong> series
        </label>
        <input type="range" min="8" max="24" value="20"
        oninput="document.getElementById('valorPiernas').innerHTML=this.value">
      </div>

      <div class="field">
        <label>Hombros:
          <strong id="valorHombros">12</strong> series
        </label>
        <input type="range" min="8" max="24" value="12"
        oninput="document.getElementById('valorHombros').innerHTML=this.value">
      </div>

      <button class="btn btn-primary"
      onclick="alert('Volumen actualizado correctamente.')">
      Guardar cambios
      </button>

    </div>
  `;
}
  if (panel === "tecnica") {

  cambiarTitulo(
    "Optimizar técnica",
    "Consulta recomendaciones avanzadas y respaldo científico."
  );

  contenedor.innerHTML = `
    <div class="big-card">
      <h2>Optimización técnica avanzada</h2>
      <p>Selecciona un ejercicio para revisar activación, errores comunes y variantes.</p>

      <div class="field">
        <label>Ejercicio</label>
        <select class="line-select" id="ejercicioTecnica" onchange="cambiarTecnicaAvanzada()">
          <option value="pesoMuerto">Peso muerto convencional</option>
          <option value="pressBanca">Press banca</option>
          <option value="sentadilla">Sentadilla profunda</option>
          <option value="dominadas">Dominadas</option>
        </select>
      </div>

        <div id="contenidoTecnica">
      <div class="dashboard-main-grid">
        <div class="big-card">
          <h3>Activación muscular</h3>
          <div class="routine-item"> Glúteos</div>
          <div class="routine-item"> Femorales</div>
          <div class="routine-item"> Espalda baja</div>
        </div>

        <div class="big-card">
          <h3>Errores comunes</h3>
          <div class="routine-item"> Redondear la espalda</div>
            <div class="routine-item"> Separar la barra del cuerpo</div>
            <div class="routine-item"> Subir con la cadera primero</div>
           </div>
        </div>

      <div class="dashboard-main-grid" style="margin-top:20px;">
        <div class="big-card">
          <h3>Variantes eficientes</h3>
          <div class="routine-item">Peso muerto rumano</div>
          <div class="routine-item">Peso muerto sumo</div>
          <div class="routine-item">Rack pull</div>
        </div>

        <div class="big-card">
          <h3>Sugerencias para una mejor tecnica</h3>

          <div class="routine-item">
            <label><input type="checkbox"> Espalda neutra</label>
          </div>

          <div class="routine-item">
            <label><input type="checkbox"> Barra cerca del cuerpo</label>
          </div>

          <div class="routine-item">
            <label><input type="checkbox"> Activar abdomen antes de levantar</label>
          </div>
    </div>
  </div>

  <button class="btn btn-primary" onclick="mostrarRespaldoTecnico()">
     Ver respaldo científico
  </button>

<div id="respaldoTecnico"></div>
  </div>
  `;
}
  if (panel === "videos") {

  cambiarTitulo(
    "Videos avanzados",
    "Aprende la técnica correcta de ejercicios avanzados."
  );

  contenedor.innerHTML = `
    <div class="big-card">

      <h2>Videos recomendados</h2>

      <div class="video-grid">

        <div class="video-card">
          <iframe src="https://www.youtube.com/embed/ytGaGIn3SjE"
          allowfullscreen></iframe>
          <h4>Peso muerto</h4>
        </div>

        <div class="video-card">
          <iframe src="https://www.youtube.com/embed/rT7DgCr-3pg"
          allowfullscreen></iframe>
          <h4>Press banca</h4>
        </div>

        <div class="video-card">
          <iframe src="https://www.youtube.com/embed/bEv6CCg2BC8"
          allowfullscreen></iframe>
          <h4>Mejorar su tecnica</h4>
        </div>

        <div class="video-card">
          <iframe src="https://www.youtube.com/embed/eGo4IYlbE5g"
          allowfullscreen></iframe>
          <h4>Ejercicios de barras</h4>
        </div>

      </div>

    </div>
  `;
}

if (panel === "comparar") {

  cambiarTitulo(
    "Comparar rendimiento",
    "Compara tu desempeño entre distintos meses de entrenamiento."
  );

  contenedor.innerHTML = `
    <div class="big-card">
      <h2>Comparación mensual</h2>
      <p>Selecciona dos meses para visualizar diferencias de rendimiento.</p>

      <div class="field-row">
        <div class="field">
          <label>Mes 1</label>
          <select class="line-select" id="mesComparar1">
            <option value="mayo">Mayo 2026</option>
            <option value="junio" selected>Junio 2026</option>
            <option value="julio">Julio 2026</option>
          </select>
        </div>

      <div class="field">
        <label>Mes 2</label>
        <select class="line-select" id="mesComparar2">
          <option value="mayo">Mayo 2026</option>
          <option value="junio">Junio 2026</option>
          <option value="julio" selected>Julio 2026</option>
        </select>
      </div>
</div>

      <button class="btn btn-primary" onclick="mostrarComparacionMensual()">
        Comparar
      </button>

      <div id="resultadoComparacion" style="margin-top:25px;"></div>
    </div>
  `;
}

  if (panel === "historial") {

  cambiarTitulo(
    "Historial físico",
    "Consulta todas tus sesiones y métricas registradas."
  );

  contenedor.innerHTML = `
    <div class="big-card">
      <h2>Historial detallado de entrenamiento</h2>
      <p>Revisa fechas, rutinas, duración, carga y estado.</p>

      <table class="table-history">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Rutina</th>
            <th>Duración</th>
            <th>Carga total</th>
            <th>Estado</th>
            
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>01/07/2026</td>
            <td>Pierna y glúteos</td>
            <td>75 min</td>
            <td>850 kg</td>
            <td><span class="estado completado">Completado</span></td>
          </tr>

          <tr>
            <td>03/07/2026</td>
            <td>Pecho y tríceps</td>
            <td>65 min</td>
            <td>750 kg</td>
            <td><span class="estado completado">Completado</span></td>
          </tr>

          <tr>
            <td>05/07/2026</td>
            <td>Espalda y bíceps</td>
            <td>70 min</td>
            <td>500 kg</td>
            <td><span class="estado completado">Completado</span></td>
          </tr>

          <tr>
            <td>07/07/2026</td>
            <td>Full body</td>
            <td>60 min</td>
            <td>450 kg</td>
            <td>
              <span id="estadoSesion4" class="estado pendiente">
                  Pendiente
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}
if (panel === "exportar") {

  cambiarTitulo(
    "Exportar progreso",
    "Genera un resumen visual de tus principales métricas."
  );

  contenedor.innerHTML = `
    <div class="big-card export-card">
      <h2>Resumen avanzado de progreso</h2>
      <p>Vista previa del reporte mensual antes de exportarlo.</p>

      <div class="stats-grid">
        <div class="stat-card">
          <i class="fa-solid fa-dumbbell"></i>
          <h3>18</h3>
          <p>Sesiones completadas</p>
        </div>

        <div class="stat-card">
          <i class="fa-solid fa-weight-hanging"></i>
          <h3>145 kg</h3>
          <p>Peso máximo</p>
        </div>

        <div class="stat-card">
          <i class="fa-solid fa-clock"></i>
          <h3>24 h</h3>
          <p>Tiempo entrenado</p>
        </div>

        <div class="stat-card">
          <i class="fa-solid fa-chart-line"></i>
          <h3>78%</h3>
          <p>Progreso mensual</p>
        </div>
      </div>

      <div class="dashboard-main-grid" style="margin-top:25px;">
        <div class="big-card">
          <h3>Análisis del mes</h3>
          <div class="routine-item">✔ Mayor progreso en ejercicios de fuerza.</div>
          <div class="routine-item">✔ Buen control de volumen semanal.</div>
          <div class="routine-item">⚠ Revisar recuperación en semanas de alta intensidad.</div>
        </div>

        <div class="big-card">
          <h3>Estado del reporte</h3>
          <div class="routine-item"><strong>Mes:</strong> Julio 2026</div>
          <div class="routine-item"><strong>Formato:</strong> Resumen visual</div>
          <div class="routine-item"><strong>Estado:</strong> Listo para exportar</div>
        </div>
      </div>

      <button class="btn btn-primary" onclick="alert('Resumen exportado correctamente.')">
        Descargar resumen
      </button>
    </div>
  `;
}
  if (panel === "chat") {

  cambiarTitulo(
    "Asistente IA Avanzado",
    "Consulta estrategias de entrenamiento, fuerza, recuperación y planificación."
  );

  contenedor.innerHTML = `
    <div class="big-card chat-card">

      <h2>TrueForm IA Pro</h2>
      <p>Analiza tu entrenamiento y recibe recomendaciones avanzadas.</p>

      <div class="chat-suggestions">
        <button onclick="preguntaRapida('¿Cómo mejorar mi peso muerto?')">
          Peso muerto
        </button>

        <button onclick="preguntaRapida('Analiza mi volumen semanal')">
          Volumen
        </button>

        <button onclick="preguntaRapida('¿Necesito una semana de descarga?')">
          Descarga
        </button>

        <button onclick="preguntaRapida('Compara mi progreso')">
          Comparar progreso
        </button>
      </div>

      <div class="chat-area" id="chatArea">

      <div class="bot-message">
          Hola, soy <strong>TrueForm IA </strong>.
        <br><br>
          Puedo ayudarte con:
        <br><br>

        ✅ Analizar tu volumen semanal.<br>
        ✅ Optimizar la técnica de tus ejercicios.<br>
        ✅ Sugerir semanas de descarga.<br>
        ✅ Interpretar tu progreso mensual.
      </div>
        </div>

      </div>

      <div class="chat-input-row">
        <input
          id="chatInput"
          class="search-input"
          type="text"
          placeholder="Pregunta sobre fuerza, hipertrofia, técnica..."
        >

        <button class="btn btn-primary" onclick="enviarPreguntaIA()">
          Enviar
        </button>
      </div>

    </div>
  `;
}
}

/* Cargar el panel inicial automáticamente */
document.addEventListener("DOMContentLoaded", function () {
  const contenedor = document.getElementById("panelContenido");

  if (contenedor) {
    const primerLink = document.querySelector(".side-link.active");
    mostrarPanel("inicio", primerLink);
  }
});



/* CBotones principales del dashboard principiante*/



/* ===== HU8: Rutina guiada paso a paso ===== */

const rutinasPorDia = {
  lunes: [
    {
      nombre: "Sentadillas",
      descripcion: "Flexiona las rodillas manteniendo la espalda recta y los pies apoyados.",
      series: 3,
      repeticiones: "12",
      descanso: 60
    },
    {
      nombre: "Zancadas",
      descripcion: "Da un paso hacia adelante y flexiona ambas rodillas de forma controlada.",
      series: 3,
      repeticiones: "10",
      descanso: 60
    }
  ],

  miercoles: [
    {
      nombre: "Flexiones apoyadas",
      descripcion: "Realiza flexiones apoyando las rodillas y manteniendo la espalda recta.",
      series: 3,
      repeticiones: "8",
      descanso: 60
    },
    {
      nombre: "Remo",
      descripcion: "Lleva los brazos hacia el torso manteniendo la espalda estable.",
      series: 3,
      repeticiones: "10",
      descanso: 60
    }
  ],

  viernes: [
    {
      nombre: "Sentadillas",
      descripcion: "Realiza sentadillas de forma controlada.",
      series: 3,
      repeticiones: "12",
      descanso: 60
    },
    {
      nombre: "Flexiones apoyadas",
      descripcion: "Mantén el abdomen firme durante cada repetición.",
      series: 3,
      repeticiones: "8",
      descanso: 60
    },
    {
      nombre: "Plancha abdominal",
      descripcion: "Mantén el cuerpo alineado y el abdomen contraído.",
      series: 3,
      repeticiones: "20 segundos",
      descanso: 60
    }
  ]
};

let diaRutinaActual = "";
let posicionEjercicio = 0;
let ejerciciosCompletados = 0;

function comenzarRutina(dia = "lunes") {
  if (!rutinasPorDia[dia]) {
    alert("No existe una rutina para el día seleccionado.");
    return;
  }

  diaRutinaActual = dia;
  posicionEjercicio = 0;
  ejerciciosCompletados = 0;

  mostrarEjercicioGuiado();
}

function mostrarEjercicioGuiado() {
  const contenedor = document.getElementById("panelContenido");
  const ejercicios = rutinasPorDia[diaRutinaActual];
  const ejercicio = ejercicios[posicionEjercicio];

  if (!contenedor || !ejercicio) return;

  cambiarTitulo(
    "Rutina guiada - " + diaRutinaActual.toUpperCase(),
    "Sigue las instrucciones y completa cada ejercicio."
  );

  const porcentaje = Math.round(
    (ejerciciosCompletados / ejercicios.length) * 100
  );

  const ultimo = posicionEjercicio === ejercicios.length - 1;

  contenedor.innerHTML = `
    <div class="big-card">
      <h2>Ejercicio ${posicionEjercicio + 1} de ${ejercicios.length}</h2>

      <h3>${ejercicio.nombre}</h3>

      <p>${ejercicio.descripcion}</p>

      <div class="routine-item">
        <strong>Series:</strong> ${ejercicio.series}
      </div>

      <div class="routine-item">
        <strong>Repeticiones:</strong> ${ejercicio.repeticiones}
      </div>

      <div class="routine-item">
        <strong>Descanso:</strong> ${ejercicio.descanso} segundos
      </div>

      <p>Progreso de la rutina: ${porcentaje}%</p>

      <div class="progress-bar">
        <div class="progress-fill" style="width:${porcentaje}%"></div>
      </div>

      <br>

      <button
        class="btn btn-primary"
        onclick="siguienteEjercicio()"
      >
        ${ultimo ? "Completar ejercicio" : "Siguiente ejercicio"}
      </button>

      <button
        class="btn"
        onclick="terminarRutinaParcial()"
      >
        Terminar entrenamiento
      </button>
    </div>
  `;
}

function siguienteEjercicio() {
  const ejercicios = rutinasPorDia[diaRutinaActual];

  ejerciciosCompletados++;

  if (posicionEjercicio < ejercicios.length - 1) {
    posicionEjercicio++;
    mostrarEjercicioGuiado();
  } else {
    mostrarResultadoRutina();
  }
}

function terminarRutinaParcial() {
  mostrarResultadoRutina();
}

/* ===== HU9: Mensaje al finalizar ===== */

function mostrarResultadoRutina() {
  const contenedor = document.getElementById("panelContenido");
  const total = rutinasPorDia[diaRutinaActual].length;

  const porcentaje = Math.round(
    (ejerciciosCompletados / total) * 100
  );

  const completada = porcentaje === 100;

  cambiarTitulo(
    "Resultado del entrenamiento",
    "Resumen de tu sesión."
  );

  contenedor.innerHTML = `
    <div class="big-card">
      <h2>
        ${completada
          ? "¡Excelente trabajo! 💪"
          : "¡Buen esfuerzo! Sigue adelante 💪"}
      </h2>

      <p>
        ${completada
          ? "Has completado todos los ejercicios de tu rutina."
          : "Has realizado parte de tu entrenamiento. Cada avance cuenta."}
      </p>

      <h3>Ejercicios completados: ${ejerciciosCompletados}/${total}</h3>

      <h3>Cumplimiento: ${porcentaje}%</h3>

      <p>Tu progreso ha sido actualizado correctamente.</p>

      <button
        class="btn btn-primary"
        onclick="mostrarPanel('rutina')"
      >
        Volver a rutina semanal
      </button>
    </div>
  `;
}


function actualizarProgresoRutina() {

  const ejercicios =
    document.querySelectorAll(".ejercicio");

  const completados =
    document.querySelectorAll(".ejercicio:checked").length;

  const total = ejercicios.length;

  if (total === 0) {
    return;
  }

  const porcentaje = Math.round(
    (completados / total) * 100
  );

  const barra =
    document.getElementById("barraProgresoRutina");

  const texto =
    document.getElementById("textoProgresoRutina");

  if (barra) {
    barra.style.width = porcentaje + "%";
  }

  if (texto) {
    texto.textContent = porcentaje + "%";
  }
}

function finalizarRutina() {

  const ejercicios =
    document.querySelectorAll(".ejercicio");

  const completados =
    document.querySelectorAll(".ejercicio:checked").length;

  const total = ejercicios.length;

  if (total === 0) {
    alert("No hay ejercicios en la rutina.");
    return;
  }

  if (completados < total) {

    const confirmar = confirm(
      `Solo completaste ${completados}/${total} ejercicios. ¿Deseas finalizar de todas formas?`
    );

    if (!confirmar) {
      return;
    }
  }

  const porcentaje = Math.round(
    (completados / total) * 100
  );

  // GUARDAR AUTOMÁTICAMENTE
  localStorage.setItem(
    "progresoTrueForm",
    porcentaje.toString()
  );

  console.log(
    "PROGRESO GUARDADO:",
    localStorage.getItem("progresoTrueForm")
  );

  const contenedor =
    document.getElementById("panelContenido");

  contenedor.innerHTML = `
    <div class="big-card motivation-card">

      <h2>Rutina finalizada ✅</h2>

      <p>
        Has completado
        <strong>${completados}/${total}</strong>
        ejercicios.
      </p>

      <div class="progress-bar">
        <div
          class="progress-fill"
          style="width:${porcentaje}%;">
        </div>
      </div>

      <h3 class="progress-text">
        ${porcentaje}%
      </h3>

      <p>
        Tu progreso fue guardado correctamente.
      </p>

      <button
        class="btn btn-primary"
        onclick="mostrarPanel(
          'inicio',
          document.querySelector('.side-link')
        )">
        Volver al Dashboard
      </button>

    </div>
  `;
}

function guardarProgreso(completados, total) {

  const porcentaje = Math.round(
    (completados / total) * 100
  );

  // GUARDAR PROGRESO EN LOCALSTORAGE
  localStorage.setItem(
    "progresoTrueForm",
    porcentaje.toString()
  );

  console.log("Progreso guardado:", porcentaje + "%");

  const contenedor =
    document.getElementById("panelContenido");

  contenedor.innerHTML = `
    <div class="big-card motivation-card">

      <h2>Progreso guardado 🎉</h2>

      <p>Tu rutina fue registrada correctamente.</p>

      <div class="routine-item">
        Completaste
        <strong>${completados}/${total}</strong>
        ejercicios.
      </div>

      <div class="progress-bar">
        <div
          class="progress-fill"
          style="width:${porcentaje}%;">
        </div>
      </div>

      <h3 class="progress-text">
        ${porcentaje}%
      </h3>

      <button
        class="btn btn-primary"
        onclick="mostrarPanel(
          'inicio',
          document.querySelector('.side-link')
        )">
        Volver al Dashboard
      </button>

    </div>
  `;
}
 /* Chat IA */
 function preguntaRapida(texto) {
  const input = document.getElementById("chatInput");
  if (!input) return;

  input.value = texto;
  enviarPreguntaIA();
}

function enviarPreguntaIA() {
  const input = document.getElementById("chatInput");
  const chatArea = document.getElementById("chatArea");

  if (!input || !chatArea) return;

  const pregunta = input.value.trim();

  if (pregunta === "") {
    alert("Escribe una pregunta primero.");
    return;
  }

  chatArea.innerHTML += `
    <div class="user-message">${pregunta}</div>
  `;

  input.value = "";

  setTimeout(() => {
    const respuesta = generarRespuestaIA(pregunta);

    chatArea.innerHTML += `
      <div class="bot-message">${respuesta}</div>
    `;

    chatArea.scrollTop = chatArea.scrollHeight;
  }, 500);
}

function generarRespuestaIA(pregunta) {
  const texto = pregunta.toLowerCase();

  if (texto.includes("sentadilla")) {
    return `
      <strong>Sentadilla:</strong><br><br>
      La sentadilla trabaja principalmente cuádriceps, glúteos y femorales. También ayuda a fortalecer el abdomen porque debes mantener estabilidad durante todo el movimiento.<br><br>
      <strong>Consejos:</strong><br>
      ✅ Coloca los pies al ancho de los hombros.<br>
      ✅ Mantén la espalda recta y el pecho elevado.<br>
      ✅ Baja de forma controlada como si fueras a sentarte.<br>
      ✅ No levantes los talones.<br>
      ✅ Evita que las rodillas se vayan hacia adentro.<br><br>
      Si estás empezando, hazla primero sin peso para aprender la técnica.
    `;
  }

  if (texto.includes("plancha")) {
    return `
      <strong>Plancha abdominal:</strong><br><br>
      La plancha fortalece el abdomen, la espalda baja y la zona media. Es útil para mejorar la postura y la estabilidad corporal.<br><br>
      <strong>Consejos:</strong><br>
      ✅ Mantén el cuerpo recto desde la cabeza hasta los pies.<br>
      ✅ Contrae el abdomen durante todo el ejercicio.<br>
      ✅ No bajes ni eleves demasiado la cadera.<br>
      ✅ Respira de forma controlada.<br><br>
      Si eres principiante, empieza con 15 a 20 segundos y aumenta poco a poco.
    `;
  }

  if (texto.includes("flexion") || texto.includes("flexión")) {
    return `
      <strong>Flexiones:</strong><br><br>
      Las flexiones trabajan pecho, hombros, tríceps y abdomen. Son un buen ejercicio porque no requieren máquinas y se pueden adaptar al nivel del usuario.<br><br>
      <strong>Consejos:</strong><br>
      ✅ Coloca las manos ligeramente más abiertas que los hombros.<br>
      ✅ Mantén el cuerpo recto.<br>
      ✅ Baja de forma controlada.<br>
      ✅ No abras demasiado los codos.<br><br>
      Si estás empezando, puedes hacerlas apoyando las rodillas o usando una superficie elevada.
    `;
  }

  if (texto.includes("descanso") || texto.includes("descansar")) {
    return `
      <strong>Descanso:</strong><br><br>
      El descanso permite que tus músculos recuperen energía antes de la siguiente serie. Si descansas muy poco, puedes perder técnica; si descansas demasiado, puedes bajar la intensidad del entrenamiento.<br><br>
      ✅ Principiante: 45 a 90 segundos.<br>
      ✅ Intermedio: 60 a 120 segundos.<br>
      ✅ Ejercicios pesados: hasta 2 minutos.<br><br>
      También es importante dormir bien, porque durante el sueño el cuerpo se recupera mejor.
    `;
  }

  if (texto.includes("comer") || texto.includes("alimentacion") || texto.includes("alimentación")) {
    return `
      <strong>Alimentación después de entrenar:</strong><br><br>
      Después de entrenar es recomendable consumir proteína y carbohidratos. La proteína ayuda a reparar el músculo y los carbohidratos ayudan a recuperar energía.<br><br>
      Algunas opciones son:<br>
      🍗 Pollo, atún o huevo.<br>
      🍚 Arroz, papa o avena.<br>
      🍌 Plátano u otra fruta.<br>
      🥛 Yogur, leche o queso fresco.<br><br>
      También recuerda tomar agua antes, durante y después del entrenamiento.
    `;
  }

  if (texto.includes("rodilla") || texto.includes("dolor")) {
    return `
      <strong>Molestia o dolor:</strong><br><br>
      Si sientes dolor durante un ejercicio, detén la rutina y revisa tu técnica. El dolor puede aparecer por mala postura, exceso de carga o falta de calentamiento.<br><br>
      <strong>Recomendaciones:</strong><br>
      ✅ No sigas si el dolor aumenta.<br>
      ✅ Reduce la intensidad o cambia el ejercicio.<br>
      ✅ Revisa si estás calentando correctamente.<br>
      ✅ Evita movimientos bruscos.<br>
      ✅ Si el dolor continúa, consulta a un especialista.
    `;
  }

  if (texto.includes("rutina")) {
    return `
      <strong>Rutina básica recomendada:</strong><br><br>
      Para empezar, conviene trabajar todo el cuerpo con ejercicios simples y seguros.<br><br>
      1. Calentamiento - 5 minutos.<br>
      2. Sentadillas - 3 series de 12 repeticiones.<br>
      3. Flexiones apoyadas - 3 series de 8 repeticiones.<br>
      4. Plancha - 3 series de 20 segundos.<br>
      5. Estiramiento final - 5 minutos.<br><br>
      Lo más importante es mantener la constancia y hacer los movimientos con buena técnica.
    `;
  }

  if (texto.includes("hola") || texto.includes("buenas")) {
    return `
      Hola 👋 Soy TrueForm IA. Puedo ayudarte con ejercicios, técnica, descanso, alimentación, molestias y organización de rutinas.<br><br>
      Puedes preguntarme, por ejemplo:<br>
      ✅ ¿Cómo hago una sentadilla?<br>
      ✅ ¿Cuánto debo descansar?<br>
      ✅ ¿Qué comer después de entrenar?<br>
      ✅ ¿Qué hago si me duele la rodilla?
    `;
  }

  if (texto.includes("estancado") || texto.includes("estancamiento")) {
    return `
      <strong>Estancamiento:</strong><br><br>
      El estancamiento aparece cuando tu cuerpo se acostumbra al mismo estímulo y ya no mejora como antes. Esto puede pasar por repetir siempre la misma rutina, no descansar bien o no aumentar progresivamente la dificultad.<br><br>
      <strong>Recomendaciones:</strong><br>
      ✅ Aumenta poco a poco el peso o las repeticiones.<br>
      ✅ Cambia algunos ejercicios cada 4 a 6 semanas.<br>
      ✅ Revisa si estás durmiendo bien.<br>
      ✅ Asegúrate de comer suficiente proteína.<br>
      ✅ No entrenes siempre al fallo.<br><br>
      La idea es progresar sin sacrificar la técnica.
    `;
  }


  if (texto.includes("press banca") || texto.includes("reemplaza")) {
    return `
      <strong>Alternativas al press banca:</strong><br><br>
      Si no puedes hacer press banca o no tienes el equipo necesario, puedes usar ejercicios que trabajen pecho, hombros y tríceps de forma similar.<br><br>
      ✅ Flexiones inclinadas.<br>
      ✅ Press con mancuernas.<br>
      ✅ Press en máquina.<br>
      ✅ Fondos asistidos.<br>
      ✅ Aperturas con mancuernas.<br><br>
      Elige la alternativa según tu nivel, equipo disponible y comodidad.
    `;
  }

  if (texto.includes("hipertrofia")) {
    return `
      <strong>Rutina de hipertrofia:</strong><br><br>
      La hipertrofia busca aumentar la masa muscular mediante entrenamiento de resistencia, buena técnica y progresión constante.<br><br>
      <strong>Recomendaciones:</strong><br>
      ✅ Realiza entre 3 y 4 series por ejercicio.<br>
      ✅ Trabaja entre 8 y 12 repeticiones.<br>
      ✅ Descansa entre 60 y 90 segundos.<br>
      ✅ Aumenta la carga progresivamente.<br>
      ✅ Entrena cada grupo muscular de forma equilibrada.<br><br>
      También debes cuidar la alimentación y el descanso, porque el músculo crece durante la recuperación.
    `;
  }

  if (texto.includes("peso muerto")) {
    return `
      <strong>Peso muerto:</strong><br><br>
      El peso muerto es un ejercicio avanzado que trabaja glúteos, femorales, espalda baja, abdomen y agarre. Es muy efectivo, pero requiere buena técnica.<br><br>
      ✅ Mantén la espalda neutra.<br>
      ✅ Activa el abdomen antes de levantar.<br>
      ✅ Sube la barra cerca del cuerpo.<br>
      ✅ Empuja el suelo con las piernas.<br>
      ✅ Controla la bajada.<br><br>
      No aumentes la carga si sientes que pierdes la postura.
    `;
  }

  if (texto.includes("volumen")) {
    return `
      <strong>Volumen semanal:</strong><br><br>
      El volumen representa la cantidad total de trabajo que realizas en la semana, normalmente medido en series, repeticiones y carga.<br><br>
      Si tu recuperación es buena, puedes aumentar el volumen entre 5% y 10%. Sin embargo, si notas cansancio constante, bajo rendimiento o molestias, conviene reducir algunas series temporalmente.<br><br>
      Lo ideal es encontrar un equilibrio entre estímulo y recuperación.
    `;
  }

  if (texto.includes("descarga")) {
    return `
      <strong>Semana de descarga:</strong><br><br>
      Una semana de descarga sirve para reducir la fatiga acumulada después de varias semanas de entrenamiento intenso.<br><br>
      Puedes aplicarla cada 4 a 6 semanas reduciendo el volumen o la carga aproximadamente entre 30% y 40%.<br><br>
      Esto no significa dejar de entrenar, sino entrenar más ligero para recuperarte y volver con mejor rendimiento.
    `;
  }
  if (texto.includes("peso") || texto.includes("subir carga") || texto.includes("carga")) {
    return `
      <strong>Subir peso:</strong><br><br>
      Puedes aumentar la carga cuando completas todas tus series con buena técnica y sin perder el control del movimiento.<br><br>
      <strong>Recomendación:</strong><br>
      ✅ En ejercicios grandes, sube entre 2.5 kg y 5 kg.<br>
      ✅ En ejercicios pequeños, aumenta menos peso.<br>
      ✅ No subas carga si tu técnica empeora.<br>
      ✅ Mantén un registro de tus avances.<br><br>
      Recuerda: levantar más peso no sirve si pierdes postura o control.
    `;
  }

  if (texto.includes("progreso")) {
    return `
      <strong>Comparación de progreso:</strong><br><br>
      Para evaluar tu progreso, no solo debes mirar el peso levantado. También puedes revisar tu técnica, constancia, número de repeticiones, descanso y cómo te sientes durante el entrenamiento.<br><br>
      Si tu fuerza aumentó, tu técnica se mantiene y te recuperas bien, vas por buen camino. Mantén una progresión gradual y evita hacer cambios demasiado bruscos.
    `;
  }

  return `
    Aún estoy aprendiendo esa consulta 🤖<br><br>
    Puedes preguntarme sobre:<br>
    • Sentadillas<br>
    • Flexiones<br>
    • Plancha<br>
    • Descanso<br>
    • Alimentación<br>
    • Dolor o molestias<br>
    • Rutinas para principiantes<br>
    • Estancamiento<br>
    • Hipertrofia<br>
    • Subir carga
  `;
}


/* Dashboard intermedio */

function comenzarRutinaIntermedia() {

  const contenedor =
    document.getElementById("panelContenido");

  const rutinaGuardada =
    localStorage.getItem("rutinaIntermedia");

  // Si todavía no existe una rutina personalizada
  if (!rutinaGuardada) {

    contenedor.innerHTML = `
      <div class="big-card">

        <h2>No tienes una rutina creada</h2>

        <p>
          Primero debes crear una rutina desde
          "Crear / Modificar rutina".
        </p>

        <button
          class="btn btn-primary"
          onclick="mostrarPanel(
            'crearRutina',
            document.querySelector('[onclick*="crearRutina"]')
          )">
          Crear rutina
        </button>

      </div>
    `;

    return;
  }

  const rutina = JSON.parse(rutinaGuardada);

  let ejerciciosHTML = "";

  rutina.ejercicios.forEach((item, index) => {

    ejerciciosHTML += `
      <div class="routine-item">

        <label>

          <input
            type="checkbox"
            class="ejercicio"
            onchange="actualizarProgresoRutina()"
          >

          ${index + 1}. ${item.ejercicio}
          - ${item.series}

        </label>

      </div>
    `;
  });

  contenedor.innerHTML = `
    <div class="big-card">

      <h2>${rutina.nombre}</h2>

      <p>
        ${rutina.objetivo} -
        ${rutina.grupoMuscular}
      </p>

      <p>
        Marca cada ejercicio cuando lo completes.
      </p>

      ${ejerciciosHTML}

      <div class="progress-bar">
        <div
          id="barraProgresoRutina"
          class="progress-fill"
          style="width:0%;">
        </div>
      </div>

      <h3
        id="textoProgresoRutina"
        class="progress-text">
        0%
      </h3>

      <button
        class="btn btn-primary"
        onclick="finalizarRutina()">
        Finalizar rutina
      </button>

    </div>
  `;
}

/* Dashboard crear rutina calendario*/
let diaRutinaSeleccionado = null;
let ejerciciosIntermedios = [];

function seleccionarDiaRutina(dia) {
  diaRutinaSeleccionado = dia;

  const textoDia = document.getElementById("diaSeleccionado");
  if (textoDia) {
    textoDia.textContent =
      `Día seleccionado: ${dia} de ${meses[mesActual]}`;
  }
}

function agregarEjercicioIntermedio() {
  const ejercicio = document.getElementById("ejercicioRutina").value.trim();
  const series = document.getElementById("seriesRutina").value.trim();
  const lista = document.getElementById("listaEjercicios");

  if (ejercicio === "" || series === "") {
    alert("Completa el ejercicio y las series.");
    return;
  }

  ejerciciosIntermedios.push({
    ejercicio: ejercicio,
    series: series
  });

  lista.innerHTML = `
    <h3>Ejercicios agregados</h3>
    ${ejerciciosIntermedios.map((item, index) => `
      <div class="routine-item">
        <strong>${index + 1}.</strong> ${item.ejercicio} - ${item.series}
      </div>
    `).join("")}
  `;

  document.getElementById("ejercicioRutina").value = "";
  document.getElementById("seriesRutina").value = "";
}

function guardarRutinaCalendario() {

  const nombre = document.getElementById("nombreRutina").value.trim();
  const objetivo = document.getElementById("objetivoRutina").value;
  const grupo = document.getElementById("grupoRutina").value;
  const resultado = document.getElementById("resultadoRutinaCalendario");

  if (!diaRutinaSeleccionado) {
    alert("Selecciona un día del calendario.");
    return;
  }

  if (nombre === "") {
    alert("Escribe el nombre de la rutina.");
    return;
  }

  if (ejerciciosIntermedios.length === 0) {
    alert("Agrega al menos un ejercicio.");
    return;
  }

  // Crear rutina simulada
  const rutina = {
    nombre: nombre,
    objetivo: objetivo,
    grupoMuscular: grupo,
    dia: diaRutinaSeleccionado,
    mes: meses[mesActual],
    mesNumero: mesActual,
    ejercicios: ejerciciosIntermedios
  };

  // Guardar solamente en el navegador
  localStorage.setItem(
    "rutinaIntermedia",
    JSON.stringify(rutina)
  );

  console.log("Rutina simulada guardada:", rutina);

  resultado.innerHTML = `
    <div class="big-card motivation-card">

      <h2>Rutina guardada correctamente ✅</h2>

      <p>
        Tu entrenamiento fue programado para el
        <strong>
          ${diaRutinaSeleccionado} de ${meses[mesActual]}
        </strong>.
      </p>

      <div class="routine-item">
        <strong>Nombre:</strong> ${nombre}
      </div>

      <div class="routine-item">
        <strong>Objetivo:</strong> ${objetivo}
      </div>

      <div class="routine-item">
        <strong>Grupo muscular:</strong> ${grupo}
      </div>

      <div class="routine-item">
        <strong>Total de ejercicios:</strong>
        ${ejerciciosIntermedios.length}
      </div>

      ${ejerciciosIntermedios.map((item, index) => `
        <div class="routine-item">
          <strong>${index + 1}.</strong>
          ${item.ejercicio} - ${item.series}
        </div>
      `).join("")}

      <button
        class="btn btn-primary"
        onclick="editarRutinaCalendario()"
      >
        Modificar rutina
      </button>

    </div>
  `;
}

function editarRutinaCalendario() {
  const resultado = document.getElementById("resultadoRutinaCalendario");

  resultado.innerHTML = `
    <div class="big-card">
      <h2>Modificar rutina</h2>
      <p>Edita los datos y vuelve a guardar tu rutina.</p>

      <div class="field">
        <label>Nombre de la rutina</label>
        <input class="line-input" id="editNombreRutina" value="Piernas">
      </div>

      <div class="field-row">
        <div class="field">
          <label>Objetivo</label>
          <select class="line-select" id="editObjetivoRutina">
            <option>Ganar masa muscular</option>
            <option>Ganar fuerza</option>
            <option selected>Mejorar resistencia</option>
            <option>Bajar grasa</option>
          </select>
        </div>

        <div class="field">
          <label>Grupo muscular</label>
          <select class="line-select" id="editGrupoRutina">
            <option>Pecho</option>
            <option>Espalda</option>
            <option selected>Piernas</option>
            <option>Hombros</option>
            <option>Brazos</option>
          </select>
        </div>
      </div>

      <div class="field">
        <label>Ejercicio 1</label>
        <input class="line-input" id="editEjercicio1" value="Trotación - 4x15">
      </div>

      <div class="field">
        <label>Ejercicio 2</label>
        <input class="line-input" id="editEjercicio2" value="Fuerza - 10">
      </div>

      <div class="field">
        <label>Ejercicio 3</label>
        <input class="line-input" id="editEjercicio3" value="Sentadilla - 5x15">
      </div>

      <button class="btn btn-primary" onclick="guardarEdicionRutinaCalendario()">
        Guardar cambios
      </button>
    </div>
  `;
}

function guardarEdicionRutinaCalendario() {
  const nombre = document.getElementById("editNombreRutina").value;
  const objetivo = document.getElementById("editObjetivoRutina").value;
  const grupo = document.getElementById("editGrupoRutina").value;
  const ejercicio1 = document.getElementById("editEjercicio1").value;
  const ejercicio2 = document.getElementById("editEjercicio2").value;
  const ejercicio3 = document.getElementById("editEjercicio3").value;

  const resultado = document.getElementById("resultadoRutinaCalendario");

  resultado.innerHTML = `
    <div class="big-card motivation-card">
      <h2>Rutina modificada correctamente ✅</h2>
      <p>Los cambios fueron guardados en tu planificación.</p>

      <div class="routine-item"><strong>Nombre:</strong> ${nombre}</div>
      <div class="routine-item"><strong>Objetivo:</strong> ${objetivo}</div>
      <div class="routine-item"><strong>Grupo muscular:</strong> ${grupo}</div>
      <div class="routine-item"><strong>Ejercicio 1:</strong> ${ejercicio1}</div>
      <div class="routine-item"><strong>Ejercicio 2:</strong> ${ejercicio2}</div>
      <div class="routine-item"><strong>Ejercicio 3:</strong> ${ejercicio3}</div>

      <button class="btn btn-primary" onclick="editarRutinaCalendario()">
        Modificar nuevamente
      </button>
    </div>
  `;
}

function mesSiguiente(){

    if(mesActual < 11){
        mesActual++;
    }

    const titulo = document.getElementById("mesActual");

    if(titulo){
        titulo.innerHTML = meses[mesActual] + " 2026";
    }
}
function mesAnterior(){

    if(mesActual > 0){
        mesActual--;
    }

    const titulo = document.getElementById("mesActual");

    if(titulo){
        titulo.innerHTML = meses[mesActual] + " 2026";
    }
}
function mostrarRespaldoTecnico() {
  const caja = document.getElementById("respaldoTecnico");

  caja.innerHTML = `
    <div class="science-box">
      <h3>Respaldo científico</h3>
      <p>
        La técnica correcta en ejercicios compuestos ayuda a mejorar la activación muscular
        y reducir el riesgo de lesión. Se recomienda mantener una postura estable,
        controlar la carga y aplicar progresión gradual.
      </p>
      <p><strong>Fuente:</strong> ACSM y NSCA - Entrenamiento de fuerza y acondicionamiento.</p>
    </div>
  `;
}
function aplicarCambiosEjercicios() {
  const pecho = document.getElementById("cambioPecho").value;
  const pierna = document.getElementById("cambioPierna").value;
  const remo = document.getElementById("cambioRemo").value;
  const plancha = document.getElementById("cambioPlancha").value;

  document.getElementById("resultadoCambios").innerHTML = `
    <div class="science-box">
      <h3>Cambios aplicados ✅</h3>
      <p>Tu rutina fue actualizada con las alternativas seleccionadas.</p>

      <div class="routine-item"><strong>Press de pecho:</strong> ${pecho}</div>
      <div class="routine-item"><strong>Sentadilla con peso:</strong> ${pierna}</div>
      <div class="routine-item"><strong>Remo con mancuerna:</strong> ${remo}</div>
      <div class="routine-item"><strong>Plancha lateral:</strong> ${plancha}</div>
    </div>
  `;
}
/* Opcions de avanzado */
function cambiarTecnicaAvanzada() {
  const ejercicio = document.getElementById("ejercicioTecnica").value;
  const contenido = document.getElementById("contenidoTecnica");

  const datos = {
    pesoMuerto: {
      activacion: ["Glúteos", "Femorales", "Espalda baja"],
      errores: ["Redondear la espalda", "Separar la barra del cuerpo", "Subir con la cadera primero"],
      variantes: ["Peso muerto rumano", "Peso muerto sumo", "Rack pull"]
    },

    pressBanca: {
      activacion: ["Pectoral mayor", "Tríceps", "Hombro anterior"],
      errores: ["Rebotar la barra en el pecho", "Abrir demasiado los codos", "Levantar la espalda baja"],
      variantes: ["Press inclinado", "Press con mancuernas", "Fondos asistidos"]
    },

    sentadilla: {
      activacion: ["Cuádriceps", "Glúteos", "Core"],
      errores: ["Rodillas hacia adentro", "Talones levantados", "Espalda muy inclinada"],
      variantes: ["Sentadilla frontal", "Sentadilla búlgara", "Prensa"]
    },

    dominadas: {
      activacion: ["Dorsales", "Bíceps", "Trapecio"],
      errores: ["Balancearse demasiado", "No completar el rango", "Subir solo con brazos"],
      variantes: ["Jalón al pecho", "Dominadas asistidas", "Remo invertido"]
    }
  };

  const item = datos[ejercicio];

  contenido.innerHTML = `
    <div class="dashboard-main-grid">
      <div class="big-card">
        <h3>Activación muscular</h3>
        ${item.activacion.map(x => `<div class="routine-item">✔ ${x}</div>`).join("")}
      </div>

      <div class="big-card">
        <h3>Errores comunes</h3>
        ${item.errores.map(x => `<div class="routine-item">⚠ ${x}</div>`).join("")}
      </div>
    </div>

    <div class="dashboard-main-grid" style="margin-top:20px;">
      <div class="big-card">
        <h3>Variantes eficientes</h3>
        ${item.variantes.map(x => `<div class="routine-item">${x}</div>`).join("")}
      </div>

      <div class="big-card">
        <h3>Sugerencias para una mejor técnica</h3>
        <div class="routine-item"><label><input type="checkbox"> Técnica controlada</label></div>
        <div class="routine-item"><label><input type="checkbox"> Postura estable</label></div>
        <div class="routine-item"><label><input type="checkbox"> Movimiento completo</label></div>
      </div>
    </div>

    <button class="btn btn-primary" onclick="mostrarRespaldoTecnico()">
      Ver respaldo científico
    </button>

    <div id="respaldoTecnico"></div>
  `;
}
function mostrarComparacionMensual() {
  const resultado = document.getElementById("resultadoComparacion");

  const mes1 = document.getElementById("mesComparar1").value;
  const mes2 = document.getElementById("mesComparar2").value;

  if (mes1 === mes2) {
    alert("Selecciona dos meses diferentes.");
    return;
  }

  const datos = {
    mayo: {
      nombre: "Mayo 2026",
      fuerza: 110,
      volumen: 14,
      tiempo: 3,
      progreso: 58
    },
    junio: {
      nombre: "Junio 2026",
      fuerza: 120,
      volumen: 15,
      tiempo: 4,
      progreso: 68
    },
    julio: {
      nombre: "Julio 2026",
      fuerza: 135,
      volumen: 18,
      tiempo: 5,
      progreso: 78
    }
  };

  const a = datos[mes1];
  const b = datos[mes2];

  const cambioFuerza = b.fuerza - a.fuerza;
  const cambioVolumen = b.volumen - a.volumen;
  const cambioTiempo = b.tiempo - a.tiempo;
  const cambioProgreso = b.progreso - a.progreso;

  resultado.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <i class="fa-solid fa-arrow-trend-up"></i>
        <h3>${cambioFuerza >= 0 ? "+" : ""}${cambioFuerza} kg</h3>
        <p>Fuerza</p>
      </div>

      <div class="stat-card">
        <i class="fa-solid fa-dumbbell"></i>
        <h3>${cambioVolumen >= 0 ? "+" : ""}${cambioVolumen}</h3>
        <p>Series</p>
      </div>

      <div class="stat-card">
        <i class="fa-solid fa-clock"></i>
        <h3>${cambioTiempo >= 0 ? "+" : ""}${cambioTiempo} h</h3>
        <p>Tiempo</p>
      </div>

      <div class="stat-card">
        <i class="fa-solid fa-chart-line"></i>
        <h3>${cambioProgreso >= 0 ? "+" : ""}${cambioProgreso}%</h3>
        <p>Progreso</p>
      </div>
    </div>

    <div class="dashboard-main-grid" style="margin-top:25px;">
      <div class="big-card">
        <h3>${a.nombre}</h3>
        <p>Rendimiento general</p>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${a.progreso}%;"></div>
        </div>
        <h3 class="progress-text">${a.progreso}%</h3>
      </div>

      <div class="big-card">
        <h3>${b.nombre}</h3>
        <p>Rendimiento general</p>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${b.progreso}%;"></div>
        </div>
        <h3 class="progress-text">${b.progreso}%</h3>
      </div>
    </div>

    <div class="big-card" style="margin-top:25px;">
      <h3>Tabla comparativa</h3>

      <table class="table-history">
        <thead>
          <tr>
            <th>Métrica</th>
            <th>${a.nombre}</th>
            <th>${b.nombre}</th>
            <th>Cambio</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Fuerza máxima</td>
            <td>${a.fuerza} kg</td>
            <td>${b.fuerza} kg</td>
            <td>${cambioFuerza >= 0 ? "⬆" : "⬇"} ${cambioFuerza} kg</td>
          </tr>

          <tr>
            <td>Volumen semanal</td>
            <td>${a.volumen} series</td>
            <td>${b.volumen} series</td>
            <td>${cambioVolumen >= 0 ? "⬆" : "⬇"} ${cambioVolumen} series</td>
          </tr>

          <tr>
            <td>Tiempo entrenado</td>
            <td>${a.tiempo} h</td>
            <td>${b.tiempo} h</td>
            <td>${cambioTiempo >= 0 ? "⬆" : "⬇"} ${cambioTiempo} h</td>
          </tr>

          <tr>
            <td>Progreso general</td>
            <td>${a.progreso}%</td>
            <td>${b.progreso}%</td>
            <td>${cambioProgreso >= 0 ? "⬆" : "⬇"} ${cambioProgreso}%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="big-card motivation-card" style="margin-top:25px;">
      <h3>Análisis IA</h3>
      <p>
        ${cambioProgreso >= 0
          ? "Tu rendimiento mejoró respecto al mes anterior. Puedes continuar con una progresión moderada."
          : "Tu rendimiento bajó respecto al mes anterior. Revisa descanso, alimentación y carga de entrenamiento."}
      </p>
    </div>
  `;
}

function programarDescarga() {
  const caja = document.getElementById("resultadoDescarga");

  caja.innerHTML = `
    <div class="science-box">
      <h3>Descarga programada ✅</h3>
      <p>La semana 4 fue configurada con menor volumen e intensidad para favorecer la recuperación.</p>
    </div>
  `;
}
function guardarPlanProgresion() {
  const plan = {
    ejercicio: document.getElementById("progEjercicio").value,
    carga: document.getElementById("progCarga").value,
    meta: document.getElementById("progMeta").value,
    semana1: document.getElementById("progSemana1").value,
    semana2: document.getElementById("progSemana2").value,
    semana3: document.getElementById("progSemana3").value,
    semana4: document.getElementById("progSemana4").value
  };

  localStorage.setItem("planProgresionAvanzado", JSON.stringify(plan));

  document.getElementById("resultadoProgresion").innerHTML = `
    <div class="big-card motivation-card">
      <h2>Plan guardado ✅</h2>
      <p>Tu progresión fue registrada correctamente.</p>

      <div class="routine-item"><strong>Ejercicio:</strong> ${plan.ejercicio}</div>
      <div class="routine-item"><strong>Carga actual:</strong> ${plan.carga}</div>
      <div class="routine-item"><strong>Meta:</strong> ${plan.meta}</div>
    </div>
  `;
}
function obtenerPlanProgresion() {
  const planGuardado = localStorage.getItem("planProgresionAvanzado");

  if (!planGuardado) {
    return `
      <div class="routine-item">✅ Peso muerto - +5 kg esta semana</div>
      <div class="routine-item">⬜ Press banca - 5 series de 6</div>
      <div class="routine-item">⬜ Dominadas - 4 series al fallo controlado</div>
      <div class="routine-item">⬜ Sentadilla - 5 series de 5</div>
    `;
  }

  const plan = JSON.parse(planGuardado);

  return `
    <div class="routine-item"><strong>Ejercicio:</strong> ${plan.ejercicio}</div>
    <div class="routine-item"><strong>Carga actual:</strong> ${plan.carga}</div>
    <div class="routine-item"><strong>Meta:</strong> ${plan.meta}</div>
    <div class="routine-item"><strong>Semana 1:</strong> ${plan.semana1}</div>
    <div class="routine-item"><strong>Semana 2:</strong> ${plan.semana2}</div>
    <div class="routine-item"><strong>Semana 3:</strong> ${plan.semana3}</div>
    <div class="routine-item"><strong>Semana 4:</strong> ${plan.semana4}</div>
  `;
}
window.addEventListener("load", function () {
  const nombre = localStorage.getItem("nombreUsuario");
  const nivel = localStorage.getItem("nivelUsuario");

  const nombreTexto = document.getElementById("nombreUsuario");
  const nivelTexto = document.getElementById("nivelUsuario");

  if (nombreTexto) {
    nombreTexto.textContent = nombre || "Usuario";
  }

  if (nivelTexto) {
    nivelTexto.textContent = "Nivel: " + (nivel || "Sin nivel");
  }
});

