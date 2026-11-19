import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
@Component({selector:'app-contacto', standalone:true,imports:[RouterLink], templateUrl:'./contacto.html',styleUrl:'./contacto.css'})
export class Contacto {
   menuAbierto = false;
   toggleMenu(): void { this.menuAbierto = !this.menuAbierto; }
   enviarContacto(event: Event): void { event.preventDefault(); alert('Formulario de contacto de demostración. Aún no existe un endpoint de contacto en la API.'); }
}
