import { RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TrueformApiService, UsuarioDTO } from '../../servicios/trueform-api.service';
@Component({selector:'app-login',standalone:true,imports:[RouterLink, CommonModule,FormsModule],templateUrl:'./login.html',styleUrl:'./login.css'})
export class Login {
 private cd=inject(ChangeDetectorRef); private api=inject(TrueformApiService); private router=inject(Router);
 menuAbierto=false; email=''; password=''; verClave=false; procesando=false; error=false; mensaje='';
 toggleMenu():void {this.menuAbierto=!this.menuAbierto;}
 iniciar(event:Event):void {
  event.preventDefault();this.procesando=true;this.mensaje='';this.error=false;
  this.api.iniciarSesion(this.email.trim(),this.password).pipe(timeout(20000), finalize(() => this.cd.markForCheck())).subscribe({
    next:(usuario:UsuarioDTO)=>{
      // Solo datos públicos de presentación. NO guardamos contraseña ni token en localStorage.
      localStorage.setItem('idUsuario',String(usuario.idUsuario));
      localStorage.setItem('nombreUsuario',usuario.nombres+' '+usuario.apellidos);
      localStorage.setItem('nivelUsuario',usuario.nivel);
      const nivel=(usuario.nivel||'').toLowerCase();
      const aceptados=['principiante','intermedio','avanzado'];
      if(!aceptados.includes(nivel)){this.procesando=false;this.error=true;this.mensaje='Nivel de usuario desconocido.';return;}
      // Panel Angular conectado a la API; no usamos los dashboards HTML provisionales.
      this.procesando=false;
      this.router.navigateByUrl('/espacio');
    },
    error:(e)=>{
      this.procesando=false;this.error=true;
      this.mensaje=e.name==='TimeoutError'?'La API tardó más de 20 segundos en responder.':
        e.status===401?'Correo o contraseña incorrectos.':
        e.status===0?'No se pudo conectar. Verifica que Spring Boot esté iniciado en localhost:8080.':
        'No se pudo iniciar sesión (HTTP '+e.status+'). Revisa IntelliJ y PostgreSQL.';
    }
  });
 }
}
