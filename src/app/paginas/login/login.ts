import { RouterLink, Router } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';

@Component({selector:'app-login',standalone:true,imports:[RouterLink, CommonModule,FormsModule],templateUrl:'./login.html',styleUrl:'./login.css'})
export class Login {
  private cd = inject(ChangeDetectorRef);
  private auth = inject(AuthService);
  private router = inject(Router);
  menuAbierto=false; email=''; password=''; verClave=false; procesando=false; error=false; mensaje='';
  toggleMenu():void {this.menuAbierto=!this.menuAbierto;}

  iniciar(event:Event):void {
    event.preventDefault(); this.procesando=true; this.mensaje=''; this.error=false;
    this.auth.iniciarSesion(this.email.trim(), this.password)
      .pipe(timeout(20000), finalize(() => this.cd.markForCheck()))
      .subscribe({
        next: respuesta => {
          if (respuesta.rol === 'ADMIN') {
            this.procesando = false;
            this.password = '';
            void this.router.navigateByUrl('/admin');
            return;
          }
          const nivel = (respuesta.usuario?.nivel || '').toLowerCase();
          if (!['principiante','intermedio','avanzado'].includes(nivel)) {
            this.auth.cerrarSesion();
            this.procesando=false; this.error=true;
            this.mensaje='Nivel de usuario desconocido.';
            return;
          }
          this.procesando=false;
          this.password='';
          // Temporalmente ADMIN entra al espacio deportivo mientras construimos /admin.
          // El rol no se decide en Angular; lo entrega el backend autenticado.
          void this.router.navigateByUrl('/espacio');
        },
        error: e => {
          this.procesando=false; this.error=true;
          this.mensaje=e.name==='TimeoutError'?'El inicio de sesión está tardando más de lo esperado. Inténtalo nuevamente.':
            e.status===401?'Correo o contraseña incorrectos.':
            e.status===0?'No pudimos conectar con el servicio. Revisa tu conexión e inténtalo de nuevo.':
            e.message==='La respuesta de autenticación es incompleta.'?e.message:
            'No se pudo iniciar sesión. Inténtalo nuevamente más tarde.';
        }
      });
  }
}
