import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EjercicioDTO, RutinaDTO } from '../../../model/trueform.model';
import {
  AjusteRutinaDTO, CalendarioDTO, ProgresoSemanalDTO, RecomendacionProgresoDTO,
  ResumenSemanalDTO, RutinaEjercicioDTO, RutinaSemanalDTO, TipDTO
} from '../../../model/funciones.model';

/** Página de bienvenida INTERMEDIA; obtiene todo del Espacio y no duplica los servicios HTTP. */
export type DestinoIntermedio = 'rutinas'|'gestion'|'cambios'|'progreso'|'calendario'|
  'ejercicios'|'recomendaciones'|'tips'|'tecnica'|'chat'|'glosario';

@Component({
  selector: 'app-inicio-intermedio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio-intermedio.html',
  styleUrl: './inicio-intermedio.css'
})
export class InicioIntermedio {
  @Input() nombre = 'Atleta';
  @Input() rutinas: RutinaDTO[] = [];
  @Input() rutinaSeleccionada = 0;
  @Input() detalleRutina: RutinaEjercicioDTO[] = [];
  @Input() ejercicios: EjercicioDTO[] = [];
  @Input() rutinaSemanal: RutinaSemanalDTO | null = null;
  @Input() progresoSemanal: ProgresoSemanalDTO | null = null;
  @Input() resumenSemanal: ResumenSemanalDTO | null = null;
  @Input() recomendacion: RecomendacionProgresoDTO | null = null;
  @Input() ajuste: AjusteRutinaDTO | null = null;
  @Input() calendario: CalendarioDTO[] = [];
  @Input() tips: TipDTO[] = [];
  @Input() cargando: Record<string, boolean> = {};
  @Input() errores: Record<string, string> = {};
  @Output() navegar = new EventEmitter<DestinoIntermedio>();

  get rutina(): RutinaDTO | undefined {
    return this.rutinas.find(r => r.idRutina === this.rutinaSeleccionada) || this.rutinas[0];
  }
  get totalSemana(): string {
    if (!this.resumenSemanal) return '—';
    return `${this.resumenSemanal.completados}/${this.resumenSemanal.programados}`;
  }
  get avanceSemanal(): number | null {
    const valor = this.progresoSemanal?.promedioCumplimiento;
    return valor == null ? null : Math.max(0, Math.min(100, Number(valor)));
  }
  get avanceVisual(): number { return this.avanceSemanal ?? 0; }
  get totalEjercicios(): number { return this.detalleRutina.length; }
  nombreEjercicio(id: number): string {
    return this.ejercicios.find(e => e.idEjercicio === id)?.nombreEjercicio || `Ejercicio #${id}`;
  }
  navegarA(v: DestinoIntermedio): void { this.navegar.emit(v); }
}
