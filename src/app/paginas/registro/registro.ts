import { RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ObjetivoDTO, RegistroUsuarioDTO, TrueformApiService } from '../../servicios/trueform-api.service';
@Component({selector:'app-registro',standalone:true,imports:[RouterLink, CommonModule,FormsModule],templateUrl:'./registro.html',styleUrl:'./registro.css'})
export class Registro implements OnInit {
 private cd=inject(ChangeDetectorRef); private api=inject(TrueformApiService);private router=inject(Router);
 menuAbierto=false; verClave=false; procesando=false; error=false;mensaje='';password2='';
 equipos=['Sin equipo','Mancuernas','Bandas elásticas','Barra y discos','Máquinas de gimnasio','Equipo completo'];
 objetivos:ObjetivoDTO[]=[];
 datos:RegistroUsuarioDTO={nombres:'',apellidos:'',email:'',password:'',edad:18,peso:70,altura:1.7,nivel:'',idObjetivo:0,equipo:''};
 ngOnInit():void {this.api.objetivos().pipe(timeout(20000), finalize(() => this.cd.markForCheck())).subscribe({next:o=>this.objetivos=o,error:()=>{this.error=true;this.mensaje='No se pudieron cargar los objetivos desde la API.';}});}
 toggleMenu():void{this.menuAbierto=!this.menuAbierto;}
 registrar(event:Event):void {
  event.preventDefault();this.mensaje='';this.error=false;
  if(this.datos.password!==this.password2){this.error=true;this.mensaje='Las contraseñas no coinciden.';return;}
  if(!this.datos.idObjetivo || !this.datos.nivel || !this.datos.equipo){this.error=true;this.mensaje='Completa nivel, objetivo y equipo.';return;}
  this.procesando=true;
  this.api.registrar({...this.datos,email:this.datos.email.trim()}).pipe(timeout(20000), finalize(() => this.cd.markForCheck())).subscribe({
   next:()=>{this.procesando=false;this.router.navigateByUrl('/login');},
   error:e=>{
    this.procesando=false;this.error=true;
    this.mensaje=e.name==='TimeoutError'?'La API tardó demasiado. Comprueba si el usuario se registró antes de intentarlo otra vez.':
      e.status===409?'Ya existe un usuario con ese correo.':
      e.status===400?'Datos inválidos. Revisa campos, contraseña y objetivo.':
      e.status===0?'No hay conexión con el backend en localhost:8080.':
      'Error HTTP '+e.status+'. Revisa los datos y la consola de IntelliJ.';
   }
  });
 }
}
