import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { EjercicioDTO, UsuarioDTO } from '../../model/trueform.model';
import { AuthService } from '../../servicios/auth.service';

type SeccionAdmin = 'resumen' | 'ejercicios' | 'glosario' | 'consejos' | 'videos' | 'usuarios';

interface GlosarioTermino {
  idTermino: number;
  termino: string;
  definicion: string;
  categoria: string;
  activo: boolean;
}

interface FormularioGlosario {
  idTermino: number | null;
  termino: string;
  definicion: string;
  categoria: string;
}

interface ConsejoContenido {
  idTip: number;
  categoria: string;
  titulo: string;
  contenido: string;
  activo: boolean;
  ordenVisualizacion: number;
}

interface FormularioConsejo {
  idTip: number | null;
  categoria: string;
  titulo: string;
  contenido: string;
  ordenVisualizacion: number;
}

interface VideoEducativo {
  idVideo: number;
  titulo: string;
  descripcion: string;
  urlVideo: string;
  categoria: string;
  nivel: string;
  activo: boolean;
}

interface FormularioVideo {
  idVideo: number | null;
  titulo: string;
  descripcion: string;
  urlVideo: string;
  categoria: string;
  nivel: 'GENERAL' | 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO';
}

interface FormularioEjercicio {
  idEjercicio: number | null;
  nombreEjercicio: string;
  grupoMuscular: string;
  descripcion: string;
  tipo: string;
  equipoNecesario: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly seccion = signal<SeccionAdmin>('resumen');
  readonly nombre = localStorage.getItem('nombreUsuario')?.trim() || 'Administrador';
  readonly usuarios = signal<UsuarioDTO[]>([]);
  readonly ejercicios = signal<EjercicioDTO[]>([]);
  readonly terminos = signal<GlosarioTermino[]>([]);
  readonly consejos = signal<ConsejoContenido[]>([]);
  readonly videos = signal<VideoEducativo[]>([]);
  readonly cargandoUsuarios = signal(false);
  readonly cargandoEjercicios = signal(false);
  readonly cargandoGlosario = signal(false);
  readonly cargandoConsejos = signal(false);
  readonly cargandoVideos = signal(false);
  readonly errorUsuarios = signal('');
  readonly errorEjercicios = signal('');
  readonly errorGlosario = signal('');
  readonly errorConsejos = signal('');
  readonly errorVideos = signal('');
  readonly errorFormularioVideo = signal('');
  readonly errorFormularioConsejo = signal('');
  readonly errorFormularioGlosario = signal('');
  readonly aviso = signal('');
  readonly errorFormulario = signal('');
  readonly busqueda = signal('');
  readonly busquedaGlosario = signal('');
  readonly busquedaConsejos = signal('');
  readonly busquedaVideos = signal('');
  readonly mostrarFormulario = signal(false);
  readonly mostrarFormularioGlosario = signal(false);
  readonly mostrarFormularioConsejo = signal(false);
  readonly mostrarFormularioVideo = signal(false);
  readonly guardando = signal(false);
  readonly eliminando = signal<number | null>(null);
  readonly guardandoGlosario = signal(false);
  readonly cambiandoEstadoTermino = signal<number | null>(null);
  readonly guardandoConsejo = signal(false);
  readonly cambiandoEstadoConsejo = signal<number | null>(null);
  readonly guardandoVideo = signal(false);
  readonly cambiandoEstadoVideo = signal<number | null>(null);
  readonly videosActivos = computed(() => this.videos().filter(v => v.activo).length);
  readonly videosVisibles = computed(() => {
    const filtro = this.busquedaVideos().toLocaleLowerCase().trim();
    if (!filtro) return this.videos();
    return this.videos().filter(v =>
      [v.titulo, v.descripcion, v.categoria, v.nivel, v.urlVideo]
        .some(texto => (texto ?? '').toLocaleLowerCase().includes(filtro))
    );
  });
  readonly consejosActivos = computed(() => this.consejos().filter(c => c.activo).length);
  readonly consejosVisibles = computed(() => {
    const filtro = this.busquedaConsejos().toLocaleLowerCase().trim();
    if (!filtro) return this.consejos();
    return this.consejos().filter(c =>
      [c.titulo, c.categoria, c.contenido, String(c.ordenVisualizacion)]
        .some(texto => (texto ?? '').toLocaleLowerCase().includes(filtro))
    );
  });
  readonly terminosActivos = computed(() => this.terminos().filter(t => t.activo).length);
  readonly terminosVisibles = computed(() => {
    const texto = this.busquedaGlosario().toLocaleLowerCase().trim();
    if (!texto) return this.terminos();
    return this.terminos().filter(t =>
      [t.termino, t.definicion, t.categoria]
        .some(valor => (valor ?? '').toLocaleLowerCase().includes(texto))
    );
  });

  readonly ejerciciosVisibles = computed(() => {
    const texto = this.busqueda().toLocaleLowerCase().trim();
    if (!texto) return this.ejercicios();
    return this.ejercicios().filter(e =>
      [e.nombreEjercicio, e.grupoMuscular, e.tipo, e.equipoNecesario]
        .some(campo => (campo ?? '').toLocaleLowerCase().includes(texto))
    );
  });

  readonly usuariosPorNivel = computed(() => {
    const usuarios = this.usuarios();
    return {
      principiante: usuarios.filter(u => u.nivel?.toLowerCase() === 'principiante').length,
      intermedio: usuarios.filter(u => u.nivel?.toLowerCase() === 'intermedio').length,
      avanzado: usuarios.filter(u => u.nivel?.toLowerCase() === 'avanzado').length
    };
  });

  formulario: FormularioEjercicio = this.formularioVacio();
  formularioGlosario: FormularioGlosario = this.formularioGlosarioVacio();
  formularioConsejo: FormularioConsejo = this.formularioConsejoVacio();
  formularioVideo: FormularioVideo = this.formularioVideoVacio();

  ngOnInit(): void {
    this.actualizarDatos();
  }

  seleccionar(seccion: SeccionAdmin): void {
    this.seccion.set(seccion);
    this.aviso.set('');
  }

  actualizarDatos(): void {
    this.cargarEjercicios();
    this.cargarUsuarios();
    this.cargarGlosario();
    this.cargarConsejos();
    this.cargarVideos();
  }

  private cargarEjercicios(): void {
    this.cargandoEjercicios.set(true);
    this.errorEjercicios.set('');
    this.http.get<EjercicioDTO[]>('/api/ejercicios')
      .pipe(finalize(() => this.cargandoEjercicios.set(false)))
      .subscribe({
        next: datos => this.ejercicios.set(datos),
        error: (err: HttpErrorResponse) => this.errorEjercicios.set(this.mensajeHttp(err))
      });
  }

  private cargarUsuarios(): void {
    this.cargandoUsuarios.set(true);
    this.errorUsuarios.set('');
    this.http.get<UsuarioDTO[]>('/api/usuarios')
      .pipe(finalize(() => this.cargandoUsuarios.set(false)))
      .subscribe({
        next: datos => this.usuarios.set(datos),
        error: (err: HttpErrorResponse) => this.errorUsuarios.set(this.mensajeHttp(err))
      });
  }

  private cargarGlosario(): void {
    this.cargandoGlosario.set(true);
    this.errorGlosario.set('');
    this.http.get<GlosarioTermino[]>('/api/admin/glosario')
      .pipe(finalize(() => this.cargandoGlosario.set(false)))
      .subscribe({
        next: datos => this.terminos.set(datos),
        error: (err: HttpErrorResponse) => this.errorGlosario.set(this.mensajeHttp(err))
      });
  }

  private cargarConsejos(): void {
    this.cargandoConsejos.set(true);
    this.errorConsejos.set('');
    this.http.get<ConsejoContenido[]>('/api/admin/tips')
      .pipe(finalize(() => this.cargandoConsejos.set(false)))
      .subscribe({
        next: registros => this.consejos.set(registros),
        error: (err: HttpErrorResponse) => this.errorConsejos.set(this.mensajeHttp(err))
      });
  }

  private cargarVideos(): void {
    this.cargandoVideos.set(true);
    this.errorVideos.set('');
    this.http.get<VideoEducativo[]>('/api/admin/videos')
      .pipe(finalize(() => this.cargandoVideos.set(false)))
      .subscribe({
        next: registros => this.videos.set(registros),
        error: (err: HttpErrorResponse) => this.errorVideos.set(this.mensajeHttp(err))
      });
  }

  agregarVideo(): void {
    this.formularioVideo = this.formularioVideoVacio();
    this.errorFormularioVideo.set('');
    this.mostrarFormularioVideo.set(true);
    this.seccion.set('videos');
  }

  editarVideo(video: VideoEducativo): void {
    const nivel = video.nivel.toUpperCase();
    this.formularioVideo = {
      idVideo: video.idVideo,
      titulo: video.titulo,
      descripcion: video.descripcion,
      urlVideo: video.urlVideo,
      categoria: video.categoria,
      nivel: nivel === 'PRINCIPIANTE' || nivel === 'INTERMEDIO' || nivel === 'AVANZADO'
        ? nivel : 'GENERAL'
    };
    this.errorFormularioVideo.set('');
    this.mostrarFormularioVideo.set(true);
    this.seccion.set('videos');
  }

  cancelarEdicionVideo(): void {
    this.mostrarFormularioVideo.set(false);
    this.errorFormularioVideo.set('');
    this.formularioVideo = this.formularioVideoVacio();
  }

  guardarVideo(): void {
    if (this.guardandoVideo()) return;
    const f = this.formularioVideo;
    const titulo = f.titulo.trim();
    const descripcion = f.descripcion.trim();
    const urlVideo = f.urlVideo.trim();
    const categoria = f.categoria.trim();
    const nivel = f.nivel;

    if (!titulo || !descripcion || !urlVideo || !categoria || !nivel) {
      this.errorFormularioVideo.set('Completa todos los campos obligatorios.');
      return;
    }
    if (titulo.length > 160 || descripcion.length > 4000 || urlVideo.length > 1000 || categoria.length > 80) {
      this.errorFormularioVideo.set('Un campo supera el límite permitido.');
      return;
    }
    // Comprobación de usabilidad: la API vuelve a validar URL, host y permisos.
    try {
      const url = new URL(urlVideo);
      const permitido = ['youtube.com', 'www.youtube.com', 'm.youtube.com',
        'youtu.be', 'www.youtu.be', 'youtube-nocookie.com',
        'www.youtube-nocookie.com', 'vimeo.com', 'www.vimeo.com', 'player.vimeo.com'];
      if (url.protocol !== 'https:' || !permitido.includes(url.hostname.toLowerCase()) ||
          url.username || url.password || (url.port && url.port !== '443')) {
        this.errorFormularioVideo.set('Solo se admiten enlaces HTTPS de YouTube o Vimeo.');
        return;
      }
    } catch {
      this.errorFormularioVideo.set('Ingresa una URL válida que comience con https://');
      return;
    }

    const datos = { titulo, descripcion, urlVideo, categoria, nivel };
    const esEdicion = f.idVideo !== null;
    const peticion = esEdicion
      ? this.http.put<VideoEducativo>(`/api/admin/videos/${f.idVideo}`, datos)
      : this.http.post<VideoEducativo>('/api/admin/videos', datos);

    this.guardandoVideo.set(true);
    this.errorFormularioVideo.set('');
    this.aviso.set('');
    peticion.pipe(finalize(() => this.guardandoVideo.set(false))).subscribe({
      next: () => {
        this.cancelarEdicionVideo();
        this.aviso.set(esEdicion ? 'Video actualizado correctamente.' : 'Video registrado correctamente.');
        this.cargarVideos();
      },
      error: (err: HttpErrorResponse) => this.errorFormularioVideo.set(
        err.status === 409 ? 'Ya existe un video registrado con esa URL.' : this.mensajeHttp(err)
      )
    });
  }

  cambiarEstadoVideo(video: VideoEducativo): void {
    if (this.cambiandoEstadoVideo() !== null || this.guardandoVideo()) return;
    if (video.activo && !window.confirm(`¿Desactivar «${video.titulo}»? Los deportistas dejarán de verlo.`)) return;
    this.cambiandoEstadoVideo.set(video.idVideo);
    this.errorVideos.set('');
    this.aviso.set('');
    const url = `/api/admin/videos/${video.idVideo}`;
    const peticion = video.activo
      ? this.http.delete<void>(url)
      : this.http.patch<void>(`${url}/reactivar`, {});
    peticion.pipe(finalize(() => this.cambiandoEstadoVideo.set(null))).subscribe({
      next: () => {
        this.aviso.set(video.activo ? 'Video desactivado correctamente.' : 'Video reactivado correctamente.');
        this.cargarVideos();
      },
      error: (err: HttpErrorResponse) => this.errorVideos.set(this.mensajeHttp(err))
    });
  }

  agregarConsejo(): void {
    this.formularioConsejo = this.formularioConsejoVacio();
    this.errorFormularioConsejo.set('');
    this.mostrarFormularioConsejo.set(true);
    this.seccion.set('consejos');
  }

  editarConsejo(tip: ConsejoContenido): void {
    this.formularioConsejo = {
      idTip: tip.idTip,
      categoria: tip.categoria,
      titulo: tip.titulo,
      contenido: tip.contenido,
      ordenVisualizacion: tip.ordenVisualizacion
    };
    this.errorFormularioConsejo.set('');
    this.mostrarFormularioConsejo.set(true);
    this.seccion.set('consejos');
  }

  cancelarEdicionConsejo(): void {
    this.mostrarFormularioConsejo.set(false);
    this.errorFormularioConsejo.set('');
    this.formularioConsejo = this.formularioConsejoVacio();
  }

  guardarConsejo(): void {
    if (this.guardandoConsejo()) return;
    const f = this.formularioConsejo;
    const categoria = f.categoria.trim();
    const titulo = f.titulo.trim();
    const contenido = f.contenido.trim();
    const ordenVisualizacion = Number(f.ordenVisualizacion);

    if (!categoria || !titulo || !contenido) {
      this.errorFormularioConsejo.set('La categoría, el título y el contenido son obligatorios.');
      return;
    }
    if (categoria.length > 80 || titulo.length > 160 || contenido.length > 4000) {
      this.errorFormularioConsejo.set('Uno de los campos es demasiado largo. Revisa el formulario.');
      return;
    }
    if (!Number.isSafeInteger(ordenVisualizacion) || ordenVisualizacion < 1) {
      this.errorFormularioConsejo.set('El orden de visualización debe ser un número entero mayor o igual a 1.');
      return;
    }

    const datos = { categoria, titulo, contenido, ordenVisualizacion };
    const esEdicion = f.idTip !== null;
    const peticion = esEdicion
      ? this.http.put<ConsejoContenido>(`/api/admin/tips/${f.idTip}`, datos)
      : this.http.post<ConsejoContenido>('/api/admin/tips', datos);

    this.guardandoConsejo.set(true);
    this.errorFormularioConsejo.set('');
    this.aviso.set('');
    peticion.pipe(finalize(() => this.guardandoConsejo.set(false))).subscribe({
      next: () => {
        this.cancelarEdicionConsejo();
        this.aviso.set(esEdicion ? 'Consejo actualizado correctamente.' : 'Consejo registrado correctamente.');
        this.cargarConsejos();
      },
      error: (err: HttpErrorResponse) => this.errorFormularioConsejo.set(
        err.status === 409 ? 'Ya existe un consejo con ese título.' : this.mensajeHttp(err)
      )
    });
  }

  cambiarEstadoConsejo(tip: ConsejoContenido): void {
    if (this.cambiandoEstadoConsejo() !== null || this.guardandoConsejo()) return;
    if (tip.activo && !window.confirm(`¿Desactivar «${tip.titulo}»? Los deportistas dejarán de verlo en Tips del día.`)) return;

    this.cambiandoEstadoConsejo.set(tip.idTip);
    this.errorConsejos.set('');
    this.aviso.set('');
    const url = `/api/admin/tips/${tip.idTip}`;
    // Ambas opciones son Observable<void> para evitar incompatibilidades de subscribe().
    const peticion = tip.activo
      ? this.http.delete<void>(url)
      : this.http.patch<void>(`${url}/reactivar`, {});

    peticion.pipe(finalize(() => this.cambiandoEstadoConsejo.set(null))).subscribe({
      next: () => {
        this.aviso.set(tip.activo
          ? 'Consejo desactivado correctamente.'
          : 'Consejo reactivado correctamente.');
        this.cargarConsejos();
      },
      error: (err: HttpErrorResponse) => this.errorConsejos.set(this.mensajeHttp(err))
    });
  }

  agregarTermino(): void {
    this.formularioGlosario = this.formularioGlosarioVacio();
    this.errorFormularioGlosario.set('');
    this.mostrarFormularioGlosario.set(true);
    this.seccion.set('glosario');
  }

  editarTermino(t: GlosarioTermino): void {
    this.formularioGlosario = {
      idTermino: t.idTermino,
      termino: t.termino,
      definicion: t.definicion,
      categoria: t.categoria
    };
    this.errorFormularioGlosario.set('');
    this.mostrarFormularioGlosario.set(true);
    this.seccion.set('glosario');
  }

  cancelarEdicionTermino(): void {
    this.mostrarFormularioGlosario.set(false);
    this.errorFormularioGlosario.set('');
    this.formularioGlosario = this.formularioGlosarioVacio();
  }

  guardarTermino(): void {
    if (this.guardandoGlosario()) return;
    const f = this.formularioGlosario;
    const termino = f.termino.trim();
    const definicion = f.definicion.trim();
    const categoria = f.categoria.trim();

    if (!termino || !definicion || !categoria) {
      this.errorFormularioGlosario.set('El término, la definición y la categoría son obligatorios.');
      return;
    }
    if (termino.length > 120 || definicion.length > 4000 || categoria.length > 80) {
      this.errorFormularioGlosario.set('Uno de los campos es demasiado largo. Revisa el formulario.');
      return;
    }

    const datos = { termino, definicion, categoria };
    const esEdicion = f.idTermino !== null;
    const peticion = esEdicion
      ? this.http.put<GlosarioTermino>(`/api/admin/glosario/${f.idTermino}`, datos)
      : this.http.post<GlosarioTermino>('/api/admin/glosario', datos);

    this.guardandoGlosario.set(true);
    this.errorFormularioGlosario.set('');
    this.aviso.set('');
    peticion.pipe(finalize(() => this.guardandoGlosario.set(false))).subscribe({
      next: () => {
        this.cancelarEdicionTermino();
        this.aviso.set(esEdicion ? 'Término actualizado correctamente.' : 'Término registrado correctamente.');
        this.cargarGlosario();
      },
      error: (err: HttpErrorResponse) => this.errorFormularioGlosario.set(
        err.status === 409 ? 'Ya existe un término con ese nombre.' : this.mensajeHttp(err)
      )
    });
  }

  cambiarEstadoTermino(t: GlosarioTermino): void {
    if (this.cambiandoEstadoTermino() !== null || this.guardandoGlosario()) return;
    if (t.activo && !window.confirm(`¿Desactivar «${t.termino}»? Los deportistas dejarán de verlo.`)) return;

    this.cambiandoEstadoTermino.set(t.idTermino);
    this.errorGlosario.set('');
    this.aviso.set('');
    const url = `/api/admin/glosario/${t.idTermino}`;
    const peticion = t.activo
      ? this.http.delete<void>(url)
      : this.http.patch<void>(`${url}/reactivar`, {});

    peticion.pipe(finalize(() => this.cambiandoEstadoTermino.set(null))).subscribe({
      next: () => {
        this.aviso.set(t.activo ? 'Término desactivado correctamente.' : 'Término reactivado correctamente.');
        this.cargarGlosario();
      },
      error: (err: HttpErrorResponse) => this.errorGlosario.set(this.mensajeHttp(err))
    });
  }

  agregarEjercicio(): void {
    this.formulario = this.formularioVacio();
    this.errorFormulario.set('');
    this.mostrarFormulario.set(true);
    this.seccion.set('ejercicios');
  }

  editarEjercicio(ejercicio: EjercicioDTO): void {
    this.formulario = {
      idEjercicio: ejercicio.idEjercicio,
      nombreEjercicio: ejercicio.nombreEjercicio,
      grupoMuscular: ejercicio.grupoMuscular,
      descripcion: ejercicio.descripcion ?? '',
      tipo: ejercicio.tipo ?? '',
      equipoNecesario: ejercicio.equipoNecesario ?? ''
    };
    this.errorFormulario.set('');
    this.mostrarFormulario.set(true);
    this.seccion.set('ejercicios');
  }

  cancelarEdicion(): void {
    this.mostrarFormulario.set(false);
    this.errorFormulario.set('');
    this.formulario = this.formularioVacio();
  }

  guardarEjercicio(): void {
    if (this.guardando()) return;
    const f = this.formulario;
    const nombreEjercicio = f.nombreEjercicio.trim();
    const grupoMuscular = f.grupoMuscular.trim();
    if (!nombreEjercicio || !grupoMuscular) {
      this.errorFormulario.set('El nombre y el grupo muscular son obligatorios.');
      return;
    }
    if (nombreEjercicio.length > 150 || grupoMuscular.length > 100 ||
        f.tipo.length > 50 || f.equipoNecesario.length > 150) {
      this.errorFormulario.set('Hay un campo que supera la longitud permitida.');
      return;
    }

    const datos = {
      nombreEjercicio,
      grupoMuscular,
      descripcion: f.descripcion.trim(),
      tipo: f.tipo.trim(),
      equipoNecesario: f.equipoNecesario.trim()
    };
    const esEdicion = f.idEjercicio !== null;
    const peticion = esEdicion
      ? this.http.put<EjercicioDTO>('/api/ejercicios', { idEjercicio: f.idEjercicio, ...datos })
      : this.http.post<EjercicioDTO>('/api/ejercicios', datos);

    this.guardando.set(true);
    this.errorFormulario.set('');
    this.aviso.set('');
    peticion.pipe(finalize(() => this.guardando.set(false))).subscribe({
      next: () => {
        this.cancelarEdicion();
        this.aviso.set(esEdicion ? 'Ejercicio actualizado correctamente.' : 'Ejercicio creado correctamente.');
        this.cargarEjercicios();
      },
      error: (err: HttpErrorResponse) => this.errorFormulario.set(this.mensajeHttp(err))
    });
  }

  eliminarEjercicio(ejercicio: EjercicioDTO): void {
    if (this.eliminando() !== null || this.guardando()) return;
    if (!window.confirm(`¿Eliminar «${ejercicio.nombreEjercicio}» del catálogo? Esta acción no se puede deshacer.`)) return;
    this.eliminando.set(ejercicio.idEjercicio);
    this.aviso.set('');
    this.errorEjercicios.set('');
    this.http.delete<void>(`/api/ejercicios/${ejercicio.idEjercicio}`)
      .pipe(finalize(() => this.eliminando.set(null)))
      .subscribe({
        next: () => {
          this.aviso.set('Ejercicio eliminado del catálogo.');
          this.cargarEjercicios();
        },
        error: (err: HttpErrorResponse) => this.errorEjercicios.set(
          err.status === 409
            ? 'No se puede eliminar porque el ejercicio está relacionado con otros registros.'
            : this.mensajeHttp(err)
        )
      });
  }

  salir(): void {
    this.auth.cerrarSesion();
    void this.router.navigateByUrl('/login');
  }

  private formularioVideoVacio(): FormularioVideo {
    return { idVideo: null, titulo: '', descripcion: '', urlVideo: '',
      categoria: '', nivel: 'GENERAL' };
  }

  private formularioConsejoVacio(): FormularioConsejo {
    const mayorOrden = this.consejos().reduce(
      (maximo, consejo) => Math.max(maximo, consejo.ordenVisualizacion), 0
    );
    return { idTip: null, categoria: '', titulo: '', contenido: '', ordenVisualizacion: mayorOrden + 1 };
  }

  private formularioGlosarioVacio(): FormularioGlosario {
    return { idTermino: null, termino: '', definicion: '', categoria: '' };
  }

  private formularioVacio(): FormularioEjercicio {
    return {
      idEjercicio: null, nombreEjercicio: '', grupoMuscular: '',
      descripcion: '', tipo: '', equipoNecesario: ''
    };
  }

  private mensajeHttp(error: HttpErrorResponse): string {
    if (error.status === 0 || error.status === 502 || error.status === 504) {
      return 'No pudimos conectar con el servicio. Inténtalo más tarde.';
    }
    if (error.status === 401) return 'La sesión expiró. Vuelve a iniciar sesión.';
    if (error.status === 403) return 'No tienes permisos para realizar esta operación.';
    if (error.status === 404) return 'El recurso solicitado no existe.';
    if (error.status === 400) return 'Los datos ingresados no son válidos. Revisa el formulario.';
    return 'No se pudo completar la operación. Inténtalo de nuevo.';
  }
}
