import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RegistroEntrenamientoDTO, RutinaDTO } from '../../../model/trueform.model';
import {
  AjusteRutinaDTO, HistorialProgresoDTO, RecomendacionAvanzadaDTO,
  ResumenProgresoDTO
} from '../../../model/funciones.model';

/** Pantalla principal AVANZADA. Recibe datos del contenedor; no duplica servicios HTTP. */
export type DestinoAvanzado = 'progresion' | 'comparar' | 'historial' | 'volumen' |
  'recomendaciones' | 'tecnica' | 'chat' | 'exportar' | 'rutinas' |
  'calendario' | 'progreso' | 'ejercicios' | 'tips' | 'glosario';

@Component({
  selector: 'app-inicio-avanzado', standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio-avanzado.html',
  styleUrl: './inicio-avanzado.css'
})
export class InicioAvanzado {
  @Input() nombre = 'Atleta';
  @Input() rutinas: RutinaDTO[] = [];
  @Input() registros: RegistroEntrenamientoDTO[] = [];
  @Input() resumen: ResumenProgresoDTO | null = null;
  @Input() historial: HistorialProgresoDTO | null = null;
  @Input() recomendacion: RecomendacionAvanzadaDTO | null = null;
  @Input() ajuste: AjusteRutinaDTO | null = null;
  @Input() cargando: Record<string, boolean> = {};
  @Input() errores: Record<string, string> = {};
  @Output() navegar = new EventEmitter<DestinoAvanzado>();

  // Un registro de ejercicios no representa necesariamente una sesión completa.
  get diasRegistrados(): number {
    return new Set(this.registros.map(r => r.fecha).filter(Boolean)).size;
  }
  get ejerciciosDistintos(): number {
    return new Set(this.registros.map(r => r.idEjercicio)).size;
  }
  get volumenRegistrado(): number {
    return this.registros.reduce((t, r) => t +
      (Number(r.series || 0) * Number(r.repeticiones || 0) * Number(r.pesoKg || 0)), 0);
  }
  get cumplimiento(): number | null {
    const valor = this.resumen?.cumplimientoPromedio;
    return this.resumen?.hayDatos && valor != null ? Number(valor) : null;
  }
  get registrosRecientes(): RegistroEntrenamientoDTO[] {
    return [...this.registros].sort((a,b) => (b.fecha || '').localeCompare(a.fecha || '')).slice(0,4);
  }
  navegarA(destino: DestinoAvanzado): void { this.navegar.emit(destino); }
}
