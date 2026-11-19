import { finalize, timeout } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EjercicioDTO } from '../../model/trueform.model';
import { EjercicioService } from '../../servicios/ejercicio.service';

@Component({
  selector: 'app-ejercicios', standalone: true,
  imports:[RouterLink, CommonModule, RouterLink, MatTableModule, MatPaginatorModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './ejercicios.html', styleUrl: './ejercicios.css'
})
export class Ejercicios implements OnInit, AfterViewInit {
  private cd = inject(ChangeDetectorRef);
  private api = inject(EjercicioService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  columnas = ['idEjercicio', 'nombreEjercicio', 'grupoMuscular', 'tipo', 'equipoNecesario'];
  datos = new MatTableDataSource<EjercicioDTO>([]);
  cargando = false;
  error = '';

  ngOnInit(): void { this.cargar(); }
  ngAfterViewInit(): void { this.datos.paginator = this.paginator; this.datos.sort = this.sort; }
  cargar(): void {
    this.cargando = true;
    this.error = '';
    this.api.listar().pipe(timeout(20000), finalize(() => this.cd.markForCheck())).subscribe({
      next: ejercicios => { this.datos.data = ejercicios; this.cargando = false; },
      error: e => { this.cargando = false; this.error = e.name === 'TimeoutError' ? 'La API tardó más de 20 segundos en responder.' : e.status === 0 || e.status === 502 || e.status === 504
        ? 'No se encontró la API. Comprueba IntelliJ, PostgreSQL y el proxy.'
        : `Error HTTP ${e.status} al consultar /api/ejercicios.`; }
    });
  }
  filtrar(event: Event): void {
    this.datos.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.datos.paginator?.firstPage();
  }
}
