import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
@Component({selector:'app-beneficios', standalone:true,imports:[RouterLink], templateUrl:'./beneficios.html',styleUrl:'./beneficios.css'})
export class Beneficios {
   menuAbierto = false;
   toggleMenu(): void { this.menuAbierto = !this.menuAbierto; }

}
