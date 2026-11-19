import { Component } from '@angular/core';
@Component({selector:'app-inicio', standalone:true, templateUrl:'./inicio.html',styleUrl:'./inicio.css'})
export class Inicio {
   menuAbierto = false;
   toggleMenu(): void { this.menuAbierto = !this.menuAbierto; }

}
