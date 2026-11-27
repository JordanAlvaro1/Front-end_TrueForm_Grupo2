import { finalize, timeout } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EjercicioDTO, ProgresoDTO, RegistroEntrenamientoDTO, RutinaDTO, UsuarioDTO } from '../../model/trueform.model';
import { TrueformApiService } from '../../servicios/trueform-api.service';
import { EjercicioService } from '../../servicios/ejercicio.service';
import { RutinaService } from '../../servicios/rutina.service';
import { ProgresoService } from '../../servicios/progreso.service';
import { RegistroEntrenamientoService } from '../../servicios/registro-entrenamiento.service';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-panel', standalone: true,
  imports:[RouterLink, CommonModule, FormsModule, RouterLink, MatCardModule, MatTableModule,
    MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule],
  templateUrl: './panel.html', styleUrl: './panel.css'
})
export class Panel implements OnInit {
  private auth = inject(AuthService);
  private cd = inject(ChangeDetectorRef);
  private router = inject(Router);
  private api = inject(TrueformApiService);
  private ejerciciosApi = inject(EjercicioService);
  private rutinasApi = inject(RutinaService);
  private progresosApi = inject(ProgresoService);
  private registrosApi = inject(RegistroEntrenamientoService);

  idUsuario = 0;
  usuario: UsuarioDTO | null = null;
  rutinas: RutinaDTO[] = [];
  progresos: ProgresoDTO[] = [];
  registros: RegistroEntrenamientoDTO[] = [];
  ejercicios: EjercicioDTO[] = [];
  cargando = false;
  guardandoRutina = false;
  guardandoProgreso = false;
  guardandoRegistro = false;
  errores: string[] = [];
  aviso = '';
  columnasRutinas = ['nombreRutina', 'fechaInicio', 'estado'];
  columnasProgreso = ['fechaRegistro', 'idRutina', 'pesoActual', 'porcentajeCumplimiento'];
  columnasRegistros = ['fecha', 'nombreEjercicio', 'series', 'repeticiones', 'pesoKg'];
  hoy = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })();

  nuevaRutina = { nombreRutina: '', descripcion: '', fechaInicio: this.hoy, fechaFin: '', estado: 'activa' };
  nuevoProgreso = { idRutina: 0, pesoActual: 0, porcentajeCumplimiento: 0, observaciones: '' };
  nuevoRegistro = { idRutina: 0, idEjercicio: 0, fecha: this.hoy, series: 3, repeticiones: 10, pesoKg: 0 };

  ngOnInit(): void {
    // Es solo una preferencia de presentación guardada en el navegador, NO autenticación.
    const id = Number(localStorage.getItem('idUsuario'));
    if (!Number.isSafeInteger(id) || id <= 0) {
      this.router.navigateByUrl('/login');
      return;
    }
    this.idUsuario = id;
    this.recargar();
  }
  recargar(): void {
    this.cargando = true;
    this.errores = [];
    this.aviso = '';
    this.api.buscarUsuario(this.idUsuario).pipe(timeout(20000), finalize(() => this.cd.markForCheck())).subscribe({
      next: usuario => { this.usuario = usuario; this.cargando = false; },
      error: e => { this.cargando = false; this.errores.push(this.mensajeError('usuario', e.status)); }
    });
    this.rutinasApi.listarPorUsuario(this.idUsuario).pipe(timeout(20000), finalize(() => this.cd.markForCheck())).subscribe({
      next: datos => this.rutinas = datos,
      error: e => this.errores.push(this.mensajeError('rutinas',e.status))
    });
    this.progresosApi.listarPorUsuario(this.idUsuario).pipe(timeout(20000), finalize(() => this.cd.markForCheck())).subscribe({
      next: datos => this.progresos = datos,
      error: e => this.errores.push(this.mensajeError('progresos',e.status))
    });
    this.registrosApi.listarPorUsuario(this.idUsuario).pipe(timeout(20000), finalize(() => this.cd.markForCheck())).subscribe({
      next: datos => this.registros = datos,
      error: e => this.errores.push(this.mensajeError('registros de entrenamiento',e.status))
    });
    this.ejerciciosApi.listar().pipe(timeout(20000), finalize(() => this.cd.markForCheck())).subscribe({
      next: datos => this.ejercicios = datos,
      error: e => this.errores.push(this.mensajeError('ejercicios',e.status))
    });
  }
  crearRutina(): void {
    if (!this.nuevaRutina.nombreRutina.trim() || !this.nuevaRutina.fechaInicio) return;
    this.guardandoRutina = true; this.aviso = '';
    this.rutinasApi.crear({
      idUsuario: this.idUsuario,
      nombreRutina: this.nuevaRutina.nombreRutina.trim(),
      descripcion: this.nuevaRutina.descripcion,
      fechaInicio: this.nuevaRutina.fechaInicio,
      fechaFin: this.nuevaRutina.fechaFin || null,
      estado: this.nuevaRutina.estado
    }).pipe(timeout(20000), finalize(() => this.cd.markForCheck())).subscribe({
      next: () => { this.guardandoRutina = false; this.nuevaRutina.nombreRutina=''; this.nuevaRutina.descripcion='';
        this.aviso='¡Rutina creada correctamente!'; this.refrescarRutinas(); },
      error: e => {this.guardandoRutina=false;this.aviso=this.mensajeError('guardar rutina',e.status);}
    });
  }
  crearProgreso(): void {
    if (!this.nuevoProgreso.idRutina) return;
    this.guardandoProgreso = true; this.aviso = '';
    this.progresosApi.crear({
      idUsuario: this.idUsuario,
      idRutina: Number(this.nuevoProgreso.idRutina),
      pesoActual: this.nuevoProgreso.pesoActual || null,
      porcentajeCumplimiento: this.nuevoProgreso.porcentajeCumplimiento,
      observaciones: this.nuevoProgreso.observaciones
    }).pipe(timeout(20000), finalize(() => this.cd.markForCheck())).subscribe({
      next: () => { this.guardandoProgreso=false; this.aviso='¡Progreso guardado correctamente!'; this.refrescarProgresos(); },
      error: e => { this.guardandoProgreso=false; this.aviso=this.mensajeError('guardar progreso',e.status); }
    });
  }
  crearRegistro(): void {
    if (!this.nuevoRegistro.idRutina || !this.nuevoRegistro.idEjercicio || !this.nuevoRegistro.fecha) return;
    this.guardandoRegistro=true;this.aviso='';
    this.registrosApi.crear({
      idRutina: Number(this.nuevoRegistro.idRutina),
      idEjercicio: Number(this.nuevoRegistro.idEjercicio),
      fecha: this.nuevoRegistro.fecha,
      series: Number(this.nuevoRegistro.series),
      repeticiones: Number(this.nuevoRegistro.repeticiones),
      pesoKg: Number(this.nuevoRegistro.pesoKg)
    }).pipe(timeout(20000), finalize(() => this.cd.markForCheck())).subscribe({
      next: () => {this.guardandoRegistro=false;this.aviso='¡Entrenamiento registrado correctamente!';this.refrescarRegistros();},
      error: e => {this.guardandoRegistro=false;this.aviso=this.mensajeError('guardar entrenamiento',e.status);}
    });
  }
  cerrarDemo(): void {
    this.auth.cerrarSesion();
    this.router.navigateByUrl('/login');
  }
  private refrescarRutinas(): void {this.rutinasApi.listarPorUsuario(this.idUsuario).pipe(timeout(20000), finalize(() => this.cd.markForCheck())).subscribe({next: datos=>this.rutinas=datos,error:e=>this.errores.push(this.mensajeError('rutinas',e.status))});}
  private refrescarProgresos(): void {this.progresosApi.listarPorUsuario(this.idUsuario).pipe(timeout(20000), finalize(() => this.cd.markForCheck())).subscribe({next: datos=>this.progresos=datos,error:e=>this.errores.push(this.mensajeError('progresos',e.status))});}
  private refrescarRegistros(): void {this.registrosApi.listarPorUsuario(this.idUsuario).pipe(timeout(20000), finalize(() => this.cd.markForCheck())).subscribe({next: datos=>this.registros=datos,error:e=>this.errores.push(this.mensajeError('registros',e.status))});}
  private mensajeError(operacion: string, status: number): string {
    if (status === undefined) return `La operación está tardando más de lo normal. Revisa si se guardaron tus cambios antes de volver a intentarlo.`;
    if (status === 0 || status === 502 || status === 504) return `No pudimos completar la operación. Comprueba tu conexión e inténtalo más tarde.`;
    return `No se pudo completar la operación. Verifica los datos e inténtalo de nuevo.`;
  }
}
