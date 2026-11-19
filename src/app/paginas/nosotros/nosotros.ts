import { Component } from '@angular/core';
@Component({selector:'app-nosotros', standalone:true, templateUrl:'./nosotros.html',styleUrl:'./nosotros.css'})
export class Nosotros {
   menuAbierto = false;
   toggleMenu(): void { this.menuAbierto = !this.menuAbierto; }

}
