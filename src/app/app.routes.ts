import { Routes } from '@angular/router';
import { Inicio } from './paginas/inicio/inicio';
import { Nosotros } from './paginas/nosotros/nosotros';
import { Beneficios } from './paginas/beneficios/beneficios';
import { Contacto } from './paginas/contacto/contacto';
import { Login } from './paginas/login/login';
import { Registro } from './paginas/registro/registro';
import { Ejercicios } from './paginas/ejercicios/ejercicios';
import { Panel } from './paginas/panel/panel';
import { Espacio } from './paginas/espacio/espacio';
export const routes: Routes = [
 {path:'', component:Inicio},
 {path:'nosotros',component:Nosotros},
 {path:'beneficios',component:Beneficios},
 {path:'contacto',component:Contacto},
 {path:'login',component:Login},
 {path:'registro',component:Registro},
 {path:'ejercicios',component:Ejercicios},
 {path:'panel',component:Panel},
 {path:'espacio',component:Espacio},
 {path:'**', redirectTo:''}
];
