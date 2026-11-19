import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
@Component({selector:'app-inicio', standalone:true,imports:[RouterLink], templateUrl:'./inicio.html',styleUrl:'./inicio.css'})
export class Inicio {
   menuAbierto = false;
   toggleMenu(): void { this.menuAbierto = !this.menuAbierto; }

}
