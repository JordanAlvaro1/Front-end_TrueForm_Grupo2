import { Component } from '@angular/core';
@Component({selector:'app-beneficios', standalone:true, templateUrl:'./beneficios.html',styleUrl:'./beneficios.css'})
export class Beneficios {
   menuAbierto = false;
   toggleMenu(): void { this.menuAbierto = !this.menuAbierto; }

}
