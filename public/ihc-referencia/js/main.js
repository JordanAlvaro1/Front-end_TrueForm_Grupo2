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
    /* ===== Registro de usuario ===== */
function registrarUsuario(event) {
  event.preventDefault();

  const nombre = document.getElementById("rNombres").value;
  const apellido = document.getElementById("rApellidos").value;
  const nivel = document.getElementById("rNivel").value;
  const email = document.getElementById("rEmail").value;
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const form = event.target;
  const pass = form.querySelector('[name="password"]');
  const pass2 = form.querySelector('[name="password2"]');

  if(!patron.test(email)){
    alert("Ingrese un correo electrónico válido.");
    return false;
}
  if (pass.value !== pass2.value) {
    alert("Las contraseñas no coinciden.");
    return false;
  }

  if (!nivel) {
    alert("Selecciona un nivel.");
    return false;
  }

  localStorage.setItem("nombreUsuario", nombre + " " + apellido);
  localStorage.setItem("nivelUsuario", nivel);

  localStorage.setItem("trueformEmail", email);
  localStorage.setItem("trueformPassword", pass.value);
  localStorage.setItem("trueformNivel", nivel);

  alert("Registro exitoso. Ahora inicia sesión.");

  window.location.href = "login.html";
  return false;
}
    /* ===== Guardado de nivel e usuario ===== */
function iniciarSesion(event) {
  event.preventDefault();

  const email = document.getElementById("lEmail").value;
  const pass = document.getElementById("lPass").value;

  const emailGuardado = localStorage.getItem("trueformEmail");
  const passGuardado = localStorage.getItem("trueformPassword");
  const nivelGuardado = localStorage.getItem("trueformNivel");

  if (email === emailGuardado && pass === passGuardado) {
    if (nivelGuardado === "principiante") {
      window.location.href = "dashboard-principiante.html";
    } else if (nivelGuardado === "intermedio") {
      window.location.href = "dashboard-intermedio.html";
    } else if (nivelGuardado === "avanzado") {
      window.location.href = "dashboard-avanzado.html";
    }
  } else {
    alert("Correo o contraseña incorrectos.");
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
      "Rutina del día",
      "Sigue paso a paso tu entrenamiento recomendado para hoy."
      );
    contenedor.innerHTML = `
      <div class="big-card">
        <h2>Rutina guiada paso a paso</h2>
        <p>Rutina recomendada para principiantes.</p>
        <div class="routine-item"><strong>1.</strong> Movilidad articular - 5 minutos</div>
        <div class="routine-item"><strong>2.</strong> Sentadillas - 3 series de 12 repeticiones</div>
        <div class="routine-item"><strong>3.</strong> Flexiones apoyadas - 3 series de 8 repeticiones</div>
        <div class="routine-item"><strong>4.</strong> Plancha abdominal - 3 series de 20 segundos</div>
        <div class="routine-item"><strong>5.</strong> Estiramiento final - 5 minutos</div>
        <button class="btn btn-primary" onclick="comenzarRutina()">Comenzar rutina</button>
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
      <p>Resumen visual de tus entrenamientos completados durante la semana.</p>

      <div class="chart-box">
        <div class="bar-chart">
          <div class="bar-item">
            <span>Lun</span>
            <div class="bar"><div style="height:80%;"></div></div>
            <small>80%</small>
          </div>

          <div class="bar-item">
            <span>Mar</span>
            <div class="bar"><div style="height:60%;"></div></div>
            <small>60%</small>
          </div>

          <div class="bar-item">
            <span>Mié</span>
            <div class="bar"><div style="height:45%;"></div></div>
            <small>45%</small>
          </div>

          <div class="bar-item">
            <span>Jue</span>
            <div class="bar"><div style="height:70%;"></div></div>
            <small>70%</small>
          </div>

          <div class="bar-item">
            <span>Vie</span>
            <div class="bar"><div style="height:30%;"></div></div>
            <small>30%</small>
          </div>

          <div class="bar-item">
            <span>Sáb</span>
            <div class="bar"><div style="height:90%;"></div></div>
            <small>90%</small>
          </div>

          <div class="bar-item">
            <span>Dom</span>
            <div class="bar"><div style="height:50%;"></div></div>
            <small>50%</small>
          </div>
        </div>
      </div>

      <div class="stats-grid" style="margin-top:25px;">
        <div class="stat-card">
          <i class="fa-solid fa-calendar-check"></i>
          <h3>4/7</h3>
          <p>Días entrenados</p>
        </div>

        <div class="stat-card">
          <i class="fa-solid fa-fire"></i>
          <h3>6</h3>
          <p>Días de racha</p>
        </div>

        <div class="stat-card">
          <i class="fa-solid fa-dumbbell"></i>
          <h3>20</h3>
          <p>Ejercicios realizados</p>
        </div>

        <div class="stat-card">
          <i class="fa-solid fa-chart-line"></i>
          <h3>60%</h3>
          <p>Avance semanal</p>
        </div>
      </div>
    </div>
  `;
}

  if (panel === "tips") {
    cambiarTitulo(
    "Tips básicos",
    "Aprende hábitos saludables para mejorar tu rendimiento."
    );
    contenedor.innerHTML = `
      <div class="tips-grid">
        <div class="tip-card">💧 Toma agua antes, durante y después de entrenar.</div>
        <div class="tip-card">🧍 Mantén una postura correcta en cada ejercicio.</div>
        <div class="tip-card">😴 Descansa bien para mejorar tu recuperación.</div>
        <div class="tip-card">🔥 Empieza poco a poco y aumenta la intensidad progresivamente.</div>
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
      <h2>📚 Aprende los conceptos básicos</h2>
        <p class="glosario-texto">
          Antes de comenzar tu entrenamiento, conoce los ejercicios y términos más importantes.
        </p>
      <h3>🏋 Ejercicios</h3>

      <div class="routine-item">
        <strong>Sentadilla</strong> <span class="tag-easy">Fácil</span>
        <p>Fortalece piernas y glúteos.</p>
        <small><strong>Trabaja:</strong> cuádriceps, glúteos y femorales.</small>
        <p>💡 Mantén la espalda recta y baja de forma controlada.</p>
      </div>

      <div class="routine-item">
        <strong>Plancha</strong> <span class="tag-easy">Fácil</span>
        <p>Fortalece abdomen y zona media.</p>
        <small><strong>Trabaja:</strong> abdomen, espalda baja y core.</small>
        <p>💡 No bajes la cadera durante el ejercicio.</p>
      </div>

      <div class="routine-item">
        <strong>Flexiones</strong> <span class="tag-easy">Fácil</span>
        <p>Trabajan pecho, hombros y tríceps.</p>
        <small><strong>Trabaja:</strong> pecho, tríceps y hombros.</small>
        <p>💡 Si eres principiante, puedes apoyar las rodillas.</p>
      </div>

      <h3 style="margin-top:25px;">📖 Conceptos básicos</h3>

      <div class="routine-item">
        <strong>Serie:</strong> grupo de repeticiones de un ejercicio.
      </div>

      <div class="routine-item">
        <strong>Repetición:</strong> cada vez que realizas un movimiento completo.
      </div>

      <div class="routine-item">
        <strong>Descanso:</strong> pausa entre series para recuperar energía.
      </div>

      <h3 style="margin-top:25px;">💪 Músculos</h3>

      <div class="routine-item">
        <strong>Cuádriceps:</strong> músculo ubicado en la parte frontal del muslo.
      </div>

      <div class="routine-item">
        <strong>Glúteos:</strong> músculos importantes para fuerza, estabilidad y postura.
      </div>

      <div class="routine-item">
        <strong>Core:</strong> zona media del cuerpo que ayuda a mantener equilibrio y estabilidad.
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

function mostrarIntermedio(panel, contenedor) {

  if (panel === "inicio") {
    cambiarTitulo(
      "Panel Intermedio",
      "Mejora tu rendimiento, evita el estancamiento y controla tu progreso."
    );

    contenedor.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card"><i class="fa-solid fa-calendar-check"></i><h3>5/7</h3><p>Días completados</p></div>
        <div class="stat-card"><i class="fa-solid fa-chart-line"></i><h3>62%</h3><p>Progreso semanal</p></div>
        <div class="stat-card"><i class="fa-solid fa-fire"></i><h3>9</h3><p>Días de racha</p></div>
        <div class="stat-card"><i class="fa-solid fa-repeat"></i><h3>4</h3><p>Ejercicios cambiados</p></div>
      </div>

      <div class="dashboard-main-grid">
        <div class="big-card">
          <h2>Rutina personalizada</h2>
          <p>Entrenamiento enfocado en fuerza y resistencia.</p>
          <div class="routine-item">✅ Calentamiento dinámico - 8 minutos</div>
          <div class="routine-item">⬜ Sentadilla con peso - 4 series de 10</div>
          <div class="routine-item">⬜ Press de pecho - 4 series de 10</div>
          <div class="routine-item">⬜ Remo con mancuerna - 3 series de 12</div>
          <button class="btn btn-primary" onclick="comenzarRutinaIntermedia()">Comenzar rutina</button>
        </div>

        <div class="big-card">
          <h2>Progreso actual</h2>
          <p>Tu avance semanal va mejorando.</p>
          <div class="progress-bar"><div class="progress-fill" style="width:62%;"></div></div>
          <h3 class="progress-text">62%</h3>
          <p>Buen ritmo. Mantén la intensidad.</p>
        </div>
      </div>

      <div class="big-card motivation-card">
        <h2>Recomendación</h2>
        <p>“Para evitar el estancamiento, aumenta poco a poco la carga o las repeticiones.”</p>
      </div>
    `;
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
          <div class="stat-card"><i class="fa-solid fa-chart-line"></i><h3>62%</h3><p>Avance semanal</p></div>
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
            <td>8 500 kg</td>
            <td><span class="estado completado">Completado</span></td>
          </tr>

          <tr>
            <td>03/07/2026</td>
            <td>Pecho y tríceps</td>
            <td>65 min</td>
            <td>6 200 kg</td>
            <td><span class="estado completado">Completado</span></td>
          </tr>

          <tr>
            <td>05/07/2026</td>
            <td>Espalda y bíceps</td>
            <td>70 min</td>
            <td>7 100 kg</td>
            <td><span class="estado completado">Completado</span></td>
          </tr>

          <tr>
            <td>07/07/2026</td>
            <td>Full body</td>
            <td>60 min</td>
            <td>5 900 kg</td>
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


function comenzarRutina() {
  const contenedor = document.getElementById("panelContenido");

  contenedor.innerHTML = `
    <div class="big-card">
      <h2>Entrenamiento en curso</h2>
      <p>Marca cada ejercicio cuando lo completes.</p>
      <div class="routine-item">
        <label><input type="checkbox" class="ejercicio" onchange="actualizarProgresoRutina()"> Calentamiento - 5 minutos</label>
      </div>
      <div class="routine-item">
        <label><input type="checkbox" class="ejercicio" onchange="actualizarProgresoRutina()"> Sentadillas - 3 series de 12</label>
      </div>
      <div class="routine-item">
        <label><input type="checkbox" class="ejercicio" onchange="actualizarProgresoRutina()"> Flexiones apoyadas - 3 series de 8</label>
      </div>
      <div class="routine-item">
        <label><input type="checkbox" class="ejercicio" onchange="actualizarProgresoRutina()"> Plancha - 3 series de 20 segundos</label>
      </div>
      <div class="routine-item">
        <label><input type="checkbox" class="ejercicio" onchange="actualizarProgresoRutina()"> Estiramiento final - 5 minutos</label>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" id="barraRutina" style="width:0%;"></div>
      </div>
      <h3 id="contadorRutina" class="progress-text">0/5</h3>
      <button class="btn btn-primary" onclick="finalizarRutina()">Finalizar rutina</button>
    </div>
  `;
}

function actualizarProgresoRutina() {
  const ejercicios = document.querySelectorAll(".ejercicio");
  const completados = document.querySelectorAll(".ejercicio:checked").length;
  const total = ejercicios.length;
  const porcentaje = (completados / total) * 100;

  document.getElementById("contadorRutina").textContent = `${completados}/${total}`;
  document.getElementById("barraRutina").style.width = `${porcentaje}%`;
}

function finalizarRutina() {
  const ejercicios = document.querySelectorAll(".ejercicio");
  const completados = document.querySelectorAll(".ejercicio:checked").length;
  const total = ejercicios.length;
  const contenedor = document.getElementById("panelContenido");

  if (completados < total) {
    const confirmar = confirm(`Solo completaste ${completados}/${total} ejercicios. ¿Deseas finalizar de todas formas?`);
    if (!confirmar) return;
  }

  contenedor.innerHTML = `
    <div class="big-card motivation-card">
      <h2>Rutina finalizada ✅</h2>
      <p>Has completado <strong>${completados}/${total}</strong> ejercicios.</p>

      <div class="routine-item">
        ${completados === total ? "🎉 Excelente, completaste toda la rutina." : "⚠ Rutina finalizada parcialmente."}
      </div>

      <button class="btn btn-primary" onclick="guardarProgreso(${completados}, ${total})">
        Guardar progreso
      </button>
    </div>
  `;
}

function guardarProgreso(completados, total) {
  const porcentaje = Math.round((completados / total) * 100);
  const contenedor = document.getElementById("panelContenido");

  contenedor.innerHTML = `
    <div class="big-card motivation-card">
      <h2>Progreso guardado 🎉</h2>
      <p>Tu rutina fue registrada correctamente.</p>

      <div class="routine-item">
        Completaste <strong>${completados}/${total}</strong> ejercicios.
      </div>

      <div class="progress-bar">
        <div class="progress-fill" style="width:${porcentaje}%;"></div>
      </div>

      <h3 class="progress-text">${porcentaje}%</h3>

      <button class="btn btn-primary" onclick="mostrarPanel('inicio', document.querySelector('.side-link'))">
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
  const contenedor = document.getElementById("panelContenido");

  contenedor.innerHTML = `
    <div class="big-card">
      <h2>Rutina intermedia en curso</h2>
      <p>Marca cada ejercicio cuando lo completes.</p>

      <div class="routine-item">
        <label><input type="checkbox" class="ejercicio" onchange="actualizarProgresoRutina()"> Calentamiento dinámico - 8 minutos</label>
      </div>

      <div class="routine-item">
        <label><input type="checkbox" class="ejercicio" onchange="actualizarProgresoRutina()"> Sentadilla con peso - 4x10</label>
      </div>

      <div class="routine-item">
        <label><input type="checkbox" class="ejercicio" onchange="actualizarProgresoRutina()"> Press de pecho - 4x10</label>
      </div>

      <div class="routine-item">
        <label><input type="checkbox" class="ejercicio" onchange="actualizarProgresoRutina()"> Remo con mancuerna - 3x12</label>
      </div>

      <div class="routine-item">
        <label><input type="checkbox" class="ejercicio" onchange="actualizarProgresoRutina()"> Plancha lateral - 3x30s</label>
      </div>

      <div class="progress-bar">
        <div class="progress-fill" id="barraRutina" style="width:0%;"></div>
      </div>

      <h3 id="contadorRutina" class="progress-text">0/5</h3>

      <button class="btn btn-primary" onclick="finalizarRutina()">Finalizar rutina</button>
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

  resultado.innerHTML = `
    <div class="big-card motivation-card">
      <h2>Rutina guardada correctamente ✅</h2>
      <p>Tu entrenamiento fue programado para el <strong>${diaRutinaSeleccionado} de julio</strong>.</p>

      <div class="routine-item"><strong>Nombre:</strong> ${nombre}</div>
      <div class="routine-item"><strong>Objetivo:</strong> ${objetivo}</div>
      <div class="routine-item"><strong>Grupo muscular:</strong> ${grupo}</div>
      <div class="routine-item"><strong>Total de ejercicios:</strong> ${ejerciciosIntermedios.length}</div>

      <button class="btn btn-primary" onclick="editarRutinaCalendario()">Modificar rutina</button>
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