import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { InicioIntermedio } from './inicio-intermedio/inicio-intermedio';
import { InicioAvanzado } from './inicio-avanzado/inicio-avanzado';
import { Observable, timeout } from 'rxjs';
import { EjercicioDTO, ProgresoDTO, RegistroEntrenamientoDTO, RutinaDTO, UsuarioDTO } from '../../model/trueform.model';
import { RutinaService } from '../../servicios/rutina.service';
import { ProgresoService } from '../../servicios/progreso.service';
import { RegistroEntrenamientoService } from '../../servicios/registro-entrenamiento.service';
import { EjercicioService } from '../../servicios/ejercicio.service';
import { TrueformApiService } from '../../servicios/trueform-api.service';
import { FuncionesTrueFormService } from '../../servicios/funciones-trueform.service';
import { AuthService } from '../../servicios/auth.service';
import { VideoEducativoDTO, VideoEducativoService } from '../../servicios/video-educativo.service';
import {
  AjusteRutinaDTO, CalendarioDTO, ComparacionMensualDTO, EjercicioGuiadoDTO, FavoritoDTO,
  GlosarioDTO, HistorialProgresoDTO, IaResponseDTO, ProgresoSemanalDTO, RecomendacionAvanzadaDTO,
  RecomendacionInicialDTO, RecomendacionProgresoDTO, ResumenProgresoDTO,
  ResumenSemanalDTO, RutinaEjercicioDTO, RutinaSemanalDTO, TipDTO
} from '../../model/funciones.model';
import { ObjetivoDTO } from '../../model/trueform.model';

type Vista = 'inicio'|'gestion'|'cambios'|'rutinas'|'calendario'|'progreso'|'ejercicios'|'recomendaciones'|'tips'|'glosario'|'chat'|'tecnica'|'perfil'|'progresion'|'comparar'|'historial'|'volumen'|'exportar';

@Component({
  selector:'app-espacio', standalone:true,
  imports:[RouterLink, CommonModule,FormsModule,MatButtonModule,InicioIntermedio,InicioAvanzado],
  templateUrl:'./espacio.html',styleUrl:'./espacio.css'
})
export class Espacio implements OnInit {
  private auth = inject(AuthService);
  private cd = inject(ChangeDetectorRef);
  private router = inject(Router);
  private api = inject(TrueformApiService);
  private funciones = inject(FuncionesTrueFormService);
  private apiRutinas = inject(RutinaService);
  private apiProgreso = inject(ProgresoService);
  private apiRegistros = inject(RegistroEntrenamientoService);
  private apiEjercicios = inject(EjercicioService);
  private apiVideos = inject(VideoEducativoService);

  idUsuario = 0;
  usuario: UsuarioDTO | null = null;
  vista: Vista = 'inicio';
  menuMovil = false;
  cargando: Record<string,boolean> = {};
  errores: Record<string,string> = {};
  aviso = '';
  rutinas: RutinaDTO[] = [];
  progresos: ProgresoDTO[] = [];
  registros: RegistroEntrenamientoDTO[] = [];
  ejercicios: EjercicioDTO[] = [];
  favoritos: FavoritoDTO[] = [];
  calendario: CalendarioDTO[] = [];
  detalleRutina: RutinaEjercicioDTO[] = [];
  rutinaSemanal: RutinaSemanalDTO | null = null;
  semanaProgreso: ProgresoSemanalDTO | null = null;
  resumenSemanal: ResumenSemanalDTO | null = null;
  resumenProgreso: ResumenProgresoDTO | null = null;
  historial: HistorialProgresoDTO | null = null;
  comparacion: ComparacionMensualDTO | null = null;
  recomendacionInicial: RecomendacionInicialDTO | null = null;
  recomendacionProgreso: RecomendacionProgresoDTO | null = null;
  recomendacionAvanzada: RecomendacionAvanzadaDTO | null = null;
  ajuste: AjusteRutinaDTO | null = null;
  tips: TipDTO[] = [];
  videosPublicados: VideoEducativoDTO[] = [];
  glosario: GlosarioDTO | null = null;
  respuestaIA: IaResponseDTO | null = null;
  alternativas: EjercicioDTO[] = [];
  ejercicioAlternativas = '';
  objetivos: ObjetivoDTO[] = [];
  objetivoElegido = 0;
  rutinaSeleccionada = 0;
  diaGuia = 'lunes';
  posicionGuia = 0;
  guiado: EjercicioGuiadoDTO | null = null;
  porcentajeFinal = 100;
  filtroEjercicios = '';
  consultaGlosario = '';
  preguntaIA = '';
  mesBase = this.mesRelativo(-1);
  mesComparado = this.mesRelativo(0);
  nuevaAgenda = {idRutina:0,fecha:this.hoy(),estado:'pendiente'};
  asignacion = {idEjercicio:0,series:3,repeticiones:10,descansoSegundos:60,diaSemana:'lunes',ordenEjercicio:1};
  readonly dias = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];
  private readonly menuBase: Array<{vista:Vista;icono:string;nombre:string;grupo:string}> = [
    {vista:'inicio',icono:'⌂',nombre:'Dashboard',grupo:'MI ESPACIO'},
    {vista:'rutinas',icono:'▤',nombre:'Mis rutinas',grupo:'MI ESPACIO'},
    {vista:'calendario',icono:'▦',nombre:'Calendario',grupo:'MI ESPACIO'},
    {vista:'progreso',icono:'↗',nombre:'Progreso e informes',grupo:'MI ESPACIO'},
    {vista:'ejercicios',icono:'◇',nombre:'Ejercicios y favoritos',grupo:'ENTRENAMIENTO'},
    {vista:'recomendaciones',icono:'✦',nombre:'Recomendaciones',grupo:'ENTRENAMIENTO'},
    {vista:'tips',icono:'☀',nombre:'Tips del día',grupo:'APRENDIZAJE'},
    {vista:'glosario',icono:'A',nombre:'Glosario',grupo:'APRENDIZAJE'},
    {vista:'chat',icono:'◈',nombre:'Chat IA',grupo:'APRENDIZAJE'},
    {vista:'tecnica',icono:'▷',nombre:'Técnica y videos',grupo:'APRENDIZAJE'},
    {vista:'perfil',icono:'◉',nombre:'Mi perfil',grupo:'CUENTA'}
  ];

  // Los menús comparten las mismas vistas y servicios: no se elimina ninguna historia de usuario.
  private readonly menuIntermedio: Array<{vista:Vista;icono:string;nombre:string;grupo:string}> = [
    {vista:'inicio',icono:'⌂',nombre:'Panel intermedio',grupo:'NIVEL INTERMEDIO'},
    {vista:'rutinas',icono:'▤',nombre:'Rutina personalizada',grupo:'NIVEL INTERMEDIO'},
    {vista:'gestion',icono:'✎',nombre:'Crear / modificar rutina',grupo:'NIVEL INTERMEDIO'},
    {vista:'progreso',icono:'↗',nombre:'Mi progreso',grupo:'NIVEL INTERMEDIO'},
    {vista:'cambios',icono:'⇄',nombre:'Cambiar ejercicios',grupo:'NIVEL INTERMEDIO'},
    {vista:'tips',icono:'☀',nombre:'Tips intermedios',grupo:'NIVEL INTERMEDIO'},
    {vista:'tecnica',icono:'▷',nombre:'Técnica y videos',grupo:'NIVEL INTERMEDIO'},
    {vista:'chat',icono:'◈',nombre:'Chat IA',grupo:'NIVEL INTERMEDIO'},
    {vista:'calendario',icono:'▦',nombre:'Calendario',grupo:'FUNCIONES NUEVAS'},
    {vista:'ejercicios',icono:'♡',nombre:'Ejercicios y favoritos',grupo:'FUNCIONES NUEVAS'},
    {vista:'recomendaciones',icono:'✦',nombre:'Recomendaciones',grupo:'FUNCIONES NUEVAS'},
    {vista:'glosario',icono:'A',nombre:'Glosario',grupo:'FUNCIONES NUEVAS'},
    {vista:'perfil',icono:'◉',nombre:'Mi perfil',grupo:'CUENTA'}
  ];

  // Experiencia avanzada de IHC: las nuevas historias de usuario permanecen disponibles.
  private readonly menuAvanzado: Array<{vista:Vista;icono:string;nombre:string;grupo:string}> = [
    {vista:'inicio',icono:'⌂',nombre:'Panel avanzado',grupo:'NIVEL AVANZADO'},
    {vista:'progresion',icono:'↗',nombre:'Plan de progresión',grupo:'NIVEL AVANZADO'},
    {vista:'comparar',icono:'▥',nombre:'Comparar rendimiento',grupo:'NIVEL AVANZADO'},
    {vista:'historial',icono:'◷',nombre:'Historial físico',grupo:'NIVEL AVANZADO'},
    {vista:'volumen',icono:'≡',nombre:'Ajustar volumen',grupo:'NIVEL AVANZADO'},
    {vista:'recomendaciones',icono:'✦',nombre:'Recomendación avanzada',grupo:'NIVEL AVANZADO'},
    {vista:'tecnica',icono:'▷',nombre:'Optimizar técnica y videos',grupo:'NIVEL AVANZADO'},
    {vista:'chat',icono:'◈',nombre:'Chat IA',grupo:'NIVEL AVANZADO'},
    {vista:'exportar',icono:'⇩',nombre:'Exportar progreso',grupo:'NIVEL AVANZADO'},
    {vista:'rutinas',icono:'▤',nombre:'Mis rutinas',grupo:'FUNCIONES NUEVAS'},
    {vista:'calendario',icono:'▦',nombre:'Calendario',grupo:'FUNCIONES NUEVAS'},
    {vista:'progreso',icono:'↗',nombre:'Progreso e informes',grupo:'FUNCIONES NUEVAS'},
    {vista:'ejercicios',icono:'♡',nombre:'Ejercicios y favoritos',grupo:'FUNCIONES NUEVAS'},
    {vista:'tips',icono:'☀',nombre:'Tips del día',grupo:'FUNCIONES NUEVAS'},
    {vista:'glosario',icono:'A',nombre:'Glosario',grupo:'FUNCIONES NUEVAS'},
    {vista:'perfil',icono:'◉',nombre:'Mi perfil',grupo:'CUENTA'}
  ];
  get menu(): Array<{vista:Vista;icono:string;nombre:string;grupo:string}> {
    return this.nivel==='intermedio' ? this.menuIntermedio : this.nivel==='avanzado' ? this.menuAvanzado : this.menuBase;
  }
  private intermedioCargado = false;
  // Estado de módulos avanzados. El plan de cuatro semanas se guarda únicamente en este navegador.
  private avanzadoCargado = false;
  ejercicioProgresionId = 0;
  planAvanzado = {idEjercicio:0,cargaActual:0,cargaObjetivo:0,semana1:'',semana2:'',semana3:'',semana4:''};
  planGuardadoLocal = false;
  volumenSeleccionadoId = 0;
  seriesVolumen = 3;
  repeticionesVolumen = 10;
  errorVolumen = '';

  rutinaEdicionId = 0;
  rutinaEdicion = {nombreRutina:'',descripcion:'',fechaInicio:'',fechaFin:'',estado:'activa'};
  rutinaNueva = {nombreRutina:'',descripcion:'',fechaInicio:this.hoy(),fechaFin:'',estado:'activa'};
  ejercicioACambiar = 0;
  ejercicioReemplazo = 0;
  alternativasCambio: EjercicioDTO[] = [];
  errorFormulario = '';

  ngOnInit(): void {
    const id = Number(localStorage.getItem('idUsuario'));
    if (!Number.isSafeInteger(id) || id < 1) { void this.router.navigateByUrl('/login'); return; }
    this.idUsuario = id;
    this.leerPlanAvanzadoLocal();
    this.recargarBase();
    this.cargarVista('inicio');
  }
  private hoy(): string { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
  private mesRelativo(offset:number): string {const d=new Date();d.setMonth(d.getMonth()+offset);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;}
  get nombre(): string {return this.usuario?.nombres || localStorage.getItem('nombreUsuario')?.split(' ')[0] || 'Atleta';}
  get nivel(): string {return (this.usuario?.nivel||localStorage.getItem('nivelUsuario')||'principiante').toLowerCase();}
  get porcentajeMedio(): number { if(!this.progresos.length)return 0;const validos=this.progresos.filter(p=>p.porcentajeCumplimiento!=null);return validos.length?Math.round(validos.reduce((sum,p)=>sum+Number(p.porcentajeCumplimiento),0)/validos.length):0; }
  get ultimoPeso(): number | null {const v=[...this.progresos].filter(p=>p.pesoActual!=null).sort((a,b)=>(b.fechaRegistro||'').localeCompare(a.fechaRegistro||''));return v.length?Number(v[0].pesoActual):null;}
  get ejerciciosFiltrados(): EjercicioDTO[] {const q=this.filtroEjercicios.trim().toLowerCase();return q?this.ejercicios.filter(e=>[e.nombreEjercicio,e.grupoMuscular,e.tipo,e.equipoNecesario].some(t=>(t||'').toLowerCase().includes(q))):this.ejercicios;}
  nombreDeEjercicio(id:number):string {return this.ejercicios.find(e=>e.idEjercicio===id)?.nombreEjercicio || 'Ejercicio #'+id;}
  esFavorito(idEjercicio:number):boolean{return this.favoritos.some(f=>f.idEjercicio===idEjercicio);}
  get nombreRutina(): string {return this.rutinas.find(r=>r.idRutina===this.rutinaSeleccionada)?.nombreRutina||'Selecciona una rutina';}
  get nivelEtiqueta(): string {return this.nivel.charAt(0).toUpperCase()+this.nivel.slice(1);}
  get volumenTotal(): number {return this.registros.reduce((acc,r)=>acc+Number(r.series||0)*Number(r.repeticiones||0)*Number(r.pesoKg||0),0);}
  get registrosDeProgresion(): RegistroEntrenamientoDTO[] {
    return [...this.registros].filter(r=>!this.ejercicioProgresionId || r.idEjercicio===Number(this.ejercicioProgresionId))
      .sort((a,b)=>(b.fecha||'').localeCompare(a.fecha||''));
  }
  get ejerciciosConHistorial(): Array<{id:number;nombre:string}> {
    const ids=new Set<number>();
    return this.registros.filter(r=>{if(ids.has(r.idEjercicio))return false;ids.add(r.idEjercicio);return true;})
      .map(r=>({id:r.idEjercicio,nombre:r.nombreEjercicio})).sort((a,b)=>a.nombre.localeCompare(b.nombre));
  }
  get volumenSeleccionado(): RutinaEjercicioDTO | undefined {
    return this.detalleRutina.find(e=>e.idRutinaEjercicio===Number(this.volumenSeleccionadoId));
  }
  get descripcionNivel(): string {return this.nivel==='avanzado'?'Analiza tu rendimiento, volumen e historial para planear el siguiente objetivo.':this.nivel==='intermedio'?'Mantén la constancia y organiza tus entrenamientos con recomendaciones según tu progreso.':'Empieza con una rutina clara, aprende la técnica y avanza a tu propio ritmo.';}

  private mensajeError(e:unknown):string {
    const err=e as {name?:string;status?:number;error?:{mensaje?:string}};
    if(err?.name==='TimeoutError')return 'La API tardó más de 18 segundos. Comprueba IntelliJ antes de repetir la operación.';
    if(err?.status===0 || err?.status===502 || err?.status===504)return 'No se pudo contactar con Spring Boot. Verifica localhost:8080 y el proxy.';
    if(err?.status===404)return 'No se encontraron datos para esta consulta.';
    if(err?.status===409)return 'El registro ya existe o tiene relaciones que impiden esta operación.';
    if(err?.status===422)return 'No hay datos suficientes para generar este informe.';
    return err?.error?.mensaje || `La consulta falló (HTTP ${err?.status ?? 'desconocido'}). Revisa IntelliJ.`;
  }
  private pedir<T>(clave:string,operacion:Observable<T>,ok:(v:T)=>void):void {
    this.cargando[clave]=true;delete this.errores[clave];this.cd.markForCheck();
    operacion.pipe(timeout(18000)).subscribe({
      next:value=>{ok(value);this.cargando[clave]=false;this.cd.markForCheck();},
      error:e=>{this.cargando[clave]=false;this.errores[clave]=this.mensajeError(e);this.cd.markForCheck();}
    });
  }
  recargarBase():void {
    this.intermedioCargado=false;this.avanzadoCargado=false;
    this.pedir('usuario',this.api.buscarUsuario(this.idUsuario),u=>{this.usuario=u;this.objetivoElegido=u.idObjetivo||0;if(this.vista==='inicio'&&this.nivel==='intermedio')this.cargarInicioIntermedio();if(this.vista==='inicio'&&this.nivel==='avanzado')this.cargarInicioAvanzado();});
    this.pedir('rutinas',this.apiRutinas.listarPorUsuario(this.idUsuario),r=>{this.rutinas=r; if(!this.rutinaSeleccionada && r.length){this.seleccionarRutina(r[0].idRutina);} });
    this.pedir('progresos',this.apiProgreso.listarPorUsuario(this.idUsuario),p=>this.progresos=p);
    this.pedir('registros',this.apiRegistros.listarPorUsuario(this.idUsuario),r=>this.registros=r);
  }
  cambiarVista(v:Vista):void {this.vista=v;this.aviso='';this.menuMovil=false;this.cargarVista(v);}
  private cargarVista(v:Vista):void {
    if(v==='inicio'||v==='progreso')this.cargarInformes();
    if(v==='inicio'&&this.nivel==='intermedio')this.cargarInicioIntermedio();
    if(v==='inicio'&&this.nivel==='avanzado')this.cargarInicioAvanzado();
    if(v==='progresion')this.cargarEjercicios();
    if(v==='volumen'){this.cargarEjercicios();if(!this.rutinaSeleccionada && this.rutinas.length)this.seleccionarRutina(this.rutinas[0].idRutina);}
    if(v==='historial')this.pedir('historial',this.funciones.historialProgreso(this.idUsuario),h=>this.historial=h);
    if(v==='exportar')this.pedir('resumen',this.funciones.resumenProgreso(this.idUsuario),r=>this.resumenProgreso=r);
    if(v==='rutinas'){this.pedir('semanal',this.funciones.rutinaSemanal(this.idUsuario),r=>this.rutinaSemanal=r);this.cargarEjercicios();}
    if(v==='gestion')this.cargarEjercicios();
    if(v==='cambios'){this.cargarEjercicios();if(!this.rutinaSeleccionada && this.rutinas.length)this.seleccionarRutina(this.rutinas[0].idRutina);}
    if(v==='calendario')this.cargarCalendario();
    if(v==='ejercicios')this.cargarEjerciciosYFavoritos();
    if(v==='recomendaciones')this.cargarRecomendaciones();
    if(v==='tips')this.pedir('tips',this.funciones.tipsDelDia(),t=>this.tips=t);
    if(v==='tecnica')this.cargarVideos();
    if(v==='perfil')this.pedir('objetivos',this.funciones.objetivos(),o=>this.objetivos=o);
  }
  private cargarInicioIntermedio():void {
    if(this.intermedioCargado)return;
    this.intermedioCargado=true;
    this.cargarEjercicios();
    this.pedir('semanal',this.funciones.rutinaSemanal(this.idUsuario),r=>this.rutinaSemanal=r);
    this.pedir('calendario',this.funciones.calendario(this.idUsuario),r=>this.calendario=r);
    this.pedir('resumenCalendario',this.funciones.resumenCalendario(this.idUsuario,this.hoy()),r=>this.resumenSemanal=r);
    this.pedir('recomendacionProgreso',this.funciones.recomendacionProgreso(this.idUsuario),r=>this.recomendacionProgreso=r);
    this.pedir('ajuste',this.funciones.ajusteRutina(this.idUsuario),r=>this.ajuste=r);
    this.pedir('tips',this.funciones.tipsDelDia(),r=>this.tips=r);
  }
  private cargarInicioAvanzado():void {
    if(this.avanzadoCargado)return;
    this.avanzadoCargado=true;
    this.pedir('historial',this.funciones.historialProgreso(this.idUsuario),h=>this.historial=h);
    this.pedir('recomendacionAvanzada',this.funciones.recomendacionAvanzada(this.idUsuario),r=>this.recomendacionAvanzada=r);
    this.pedir('ajuste',this.funciones.ajusteRutina(this.idUsuario),r=>this.ajuste=r);
  }
  private get planKey(): string {return `tf_plan_avanzado_local_${this.idUsuario}`;}
  private leerPlanAvanzadoLocal():void {
    try {
      const guardado=localStorage.getItem(this.planKey);
      if(!guardado)return;
      const datos=JSON.parse(guardado) as Partial<typeof this.planAvanzado>;
      if(!datos || typeof datos!=='object')return;
      this.planAvanzado={
        idEjercicio:Number(datos.idEjercicio)||0,cargaActual:Number(datos.cargaActual)||0,
        cargaObjetivo:Number(datos.cargaObjetivo)||0,semana1:String(datos.semana1||''),
        semana2:String(datos.semana2||''),semana3:String(datos.semana3||''),semana4:String(datos.semana4||'')
      };
      this.planGuardadoLocal=true;
    }catch {this.planGuardadoLocal=false;}
  }
  guardarPlanAvanzadoLocal():void {
    if(!this.planAvanzado.idEjercicio || !Number.isFinite(Number(this.planAvanzado.cargaActual)) ||
       !Number.isFinite(Number(this.planAvanzado.cargaObjetivo)) ||
       Number(this.planAvanzado.cargaActual)<0 || Number(this.planAvanzado.cargaObjetivo)<=0){
      this.errores['planLocal']='Selecciona un ejercicio y usa cargas válidas (meta mayor que 0).';return;
    }
    delete this.errores['planLocal'];
    try {localStorage.setItem(this.planKey,JSON.stringify(this.planAvanzado));this.planGuardadoLocal=true;this.aviso='Borrador de progresión guardado SOLO en este navegador (no en PostgreSQL).';}
    catch {this.errores['planLocal']='No fue posible almacenar el borrador en este navegador.';}
  }
  borrarPlanAvanzadoLocal():void {
    localStorage.removeItem(this.planKey);this.planAvanzado={idEjercicio:0,cargaActual:0,cargaObjetivo:0,semana1:'',semana2:'',semana3:'',semana4:''};
    this.planGuardadoLocal=false;this.aviso='Borrador local eliminado.';
  }
  prepararVolumen(id:number):void {
    this.volumenSeleccionadoId=Number(id);this.errorVolumen='';
    const seleccionado=this.volumenSeleccionado;
    if(seleccionado){this.seriesVolumen=seleccionado.series;this.repeticionesVolumen=seleccionado.repeticiones;}
  }
  guardarVolumen():void {
    const original=this.volumenSeleccionado;
    if(!original || !Number.isInteger(Number(this.seriesVolumen)) || Number(this.seriesVolumen)<1 || Number(this.seriesVolumen)>100 ||
      !Number.isInteger(Number(this.repeticionesVolumen)) || Number(this.repeticionesVolumen)<1 || Number(this.repeticionesVolumen)>1000){
      this.errorVolumen='Selecciona un ejercicio y configura entre 1–100 series y 1–1000 repeticiones.';return;
    }
    if(!confirm('¿Guardar el ajuste de series y repeticiones de esta rutina en PostgreSQL?'))return;
    this.errorVolumen='';
    this.pedir('guardarVolumen',this.funciones.modificarEjercicio({...original,series:Number(this.seriesVolumen),repeticiones:Number(this.repeticionesVolumen)}),()=>{
      this.aviso='Volumen del ejercicio actualizado en PostgreSQL.';
      const idRutina=this.rutinaSeleccionada;this.seleccionarRutina(idRutina);
      this.pedir('semanal',this.funciones.rutinaSemanal(this.idUsuario),r=>this.rutinaSemanal=r);
    });
  }
  editarRutina(id:number):void {
    this.rutinaEdicionId=Number(id);
    const r=this.rutinas.find(t=>t.idRutina===this.rutinaEdicionId);
    if(r)this.rutinaEdicion={nombreRutina:r.nombreRutina,descripcion:r.descripcion||'',fechaInicio:r.fechaInicio,fechaFin:r.fechaFin||'',estado:r.estado};
    this.errorFormulario='';
  }
  private validarRutina(d:{nombreRutina:string;fechaInicio:string;fechaFin:string;estado:string}):boolean {
    if(!d.nombreRutina.trim() || d.nombreRutina.trim().length>150 || !d.fechaInicio || !d.estado.trim() || (d.fechaFin&&d.fechaFin<d.fechaInicio)){
      this.errorFormulario='Indica nombre, estado y fecha de inicio válidos; la fecha final no puede ser anterior al inicio.';
      return false;
    }
    this.errorFormulario='';return true;
  }
  crearRutinaIntermedia():void {
    if(!this.validarRutina(this.rutinaNueva))return;
    this.pedir('crearRutina',this.apiRutinas.crear({
      idUsuario:this.idUsuario,nombreRutina:this.rutinaNueva.nombreRutina.trim(),descripcion:this.rutinaNueva.descripcion.trim(),
      fechaInicio:this.rutinaNueva.fechaInicio,fechaFin:this.rutinaNueva.fechaFin||null,estado:this.rutinaNueva.estado.trim()
    }),r=>{
      this.aviso=`Rutina «${r.nombreRutina}» creada en PostgreSQL.`;
      this.rutinaNueva={nombreRutina:'',descripcion:'',fechaInicio:this.hoy(),fechaFin:'',estado:'activa'};
      this.pedir('rutinas',this.apiRutinas.listarPorUsuario(this.idUsuario),items=>{this.rutinas=items;this.seleccionarRutina(r.idRutina);});
      this.pedir('semanal',this.funciones.rutinaSemanal(this.idUsuario),sem=>this.rutinaSemanal=sem);
    });
  }
  guardarEdicionRutina():void {
    const original=this.rutinas.find(r=>r.idRutina===this.rutinaEdicionId);
    if(!original || !this.validarRutina(this.rutinaEdicion))return;
    this.pedir('editarRutina',this.apiRutinas.actualizar({
      ...original,nombreRutina:this.rutinaEdicion.nombreRutina.trim(),descripcion:this.rutinaEdicion.descripcion.trim(),
      fechaInicio:this.rutinaEdicion.fechaInicio,fechaFin:this.rutinaEdicion.fechaFin||null,estado:this.rutinaEdicion.estado.trim()
    }),r=>{
      this.aviso=`Rutina «${r.nombreRutina}» modificada en PostgreSQL.`;
      this.rutinas=this.rutinas.map(item=>item.idRutina===r.idRutina?r:item);
      this.pedir('semanal',this.funciones.rutinaSemanal(this.idUsuario),sem=>this.rutinaSemanal=sem);
    });
  }
  prepararCambio(id:number):void {
    this.ejercicioACambiar=Number(id);this.ejercicioReemplazo=0;this.alternativasCambio=[];
    const asignado=this.detalleRutina.find(e=>e.idRutinaEjercicio===this.ejercicioACambiar);
    if(asignado)this.pedir('alternativasCambio',this.funciones.alternativas(asignado.idEjercicio),a=>this.alternativasCambio=a);
  }
  elegirAlternativa(id:number):void {this.ejercicioReemplazo=id;}
  guardarCambioEjercicio():void {
    const asignado=this.detalleRutina.find(e=>e.idRutinaEjercicio===this.ejercicioACambiar);
    const reemplazo=this.ejercicios.find(e=>e.idEjercicio===Number(this.ejercicioReemplazo));
    if(!asignado || !reemplazo || asignado.idEjercicio===reemplazo.idEjercicio)return;
    if(!confirm(`¿Reemplazar «${this.nombreDeEjercicio(asignado.idEjercicio)}» por «${reemplazo.nombreEjercicio}»?`))return;
    this.pedir('cambioEjercicio',this.funciones.modificarEjercicio({...asignado,idEjercicio:reemplazo.idEjercicio}),()=>{
      this.aviso=`Ejercicio sustituido por «${reemplazo.nombreEjercicio}» y guardado en PostgreSQL.`;
      this.seleccionarRutina(this.rutinaSeleccionada);
      this.pedir('semanal',this.funciones.rutinaSemanal(this.idUsuario),r=>this.rutinaSemanal=r);
    });
  }
  private cargarEjercicios():void {if(this.ejercicios.length)return;this.pedir('ejercicios',this.apiEjercicios.listar(),e=>this.ejercicios=e);}
  private cargarEjerciciosYFavoritos():void {
    this.cargarEjercicios();this.pedir('favoritos',this.funciones.favoritos(this.idUsuario),f=>this.favoritos=f);
  }
  private cargarInformes():void {
    this.pedir('resumen',this.funciones.resumenProgreso(this.idUsuario),r=>this.resumenProgreso=r);
    this.pedir('semanalProgreso',this.funciones.progresoSemanal(this.idUsuario),r=>this.semanaProgreso=r);
    if(this.vista==='progreso')this.pedir('historial',this.funciones.historialProgreso(this.idUsuario),h=>this.historial=h);
  }
  private cargarCalendario():void {
    this.pedir('calendario',this.funciones.calendario(this.idUsuario),c=>this.calendario=c);
    this.pedir('resumenCalendario',this.funciones.resumenCalendario(this.idUsuario,this.hoy()),r=>this.resumenSemanal=r);
  }
  private cargarRecomendaciones():void {
    this.pedir('recomendacionInicial',this.funciones.recomendacionInicial(this.idUsuario),r=>this.recomendacionInicial=r);
    this.pedir('recomendacionProgreso',this.funciones.recomendacionProgreso(this.idUsuario),r=>this.recomendacionProgreso=r);
    this.pedir('recomendacionAvanzada',this.funciones.recomendacionAvanzada(this.idUsuario),r=>this.recomendacionAvanzada=r);
    this.pedir('ajuste',this.funciones.ajusteRutina(this.idUsuario),r=>this.ajuste=r);
  }
  seleccionarRutina(id:number):void {
    this.rutinaSeleccionada=Number(id);this.prepararVolumen(0);this.detalleRutina=[];this.guiado=null;this.posicionGuia=0;this.ejercicioACambiar=0;this.ejercicioReemplazo=0;this.alternativasCambio=[];
    if(this.rutinaSeleccionada) this.pedir('detalleRutina',this.funciones.ejerciciosDeRutina(this.rutinaSeleccionada),d=>this.detalleRutina=d);
  }
  asignar():void {
    if(!this.rutinaSeleccionada || !this.asignacion.idEjercicio)return;
    const datos={...this.asignacion,idRutina:this.rutinaSeleccionada,idEjercicio:Number(this.asignacion.idEjercicio)};
    this.pedir('asignar',this.funciones.asignarEjercicio(datos),()=>{this.aviso='Ejercicio añadido a tu rutina.';this.seleccionarRutina(this.rutinaSeleccionada);this.pedir('semanal',this.funciones.rutinaSemanal(this.idUsuario),r=>this.rutinaSemanal=r);});
  }
  quitarEjercicio(id:number):void {
    if(!confirm('¿Quitar este ejercicio de la rutina?'))return;
    this.pedir('quitarEjercicio',this.funciones.quitarEjercicio(id),()=>{this.aviso='Ejercicio retirado.';this.seleccionarRutina(this.rutinaSeleccionada);this.pedir('semanal',this.funciones.rutinaSemanal(this.idUsuario),r=>this.rutinaSemanal=r);});
  }
  cargarGuia(posicion=0):void {
    if(!this.rutinaSeleccionada)return;
    this.posicionGuia=posicion;this.guiado=null;
    this.pedir('guiado',this.funciones.ejercicioGuiado(this.rutinaSeleccionada,this.diaGuia,posicion),g=>this.guiado=g);
  }
  finalizar():void {
    if(!this.rutinaSeleccionada || !confirm('¿Registrar la finalización de esta rutina? Se creará un progreso nuevo.'))return;
    this.pedir('finalizar',this.funciones.finalizarRutina(this.idUsuario,this.rutinaSeleccionada,Number(this.porcentajeFinal)),()=>{
      this.aviso='Rutina finalizada y progreso registrado.';this.recargarBase();this.cargarInformes();
    });
  }
  agendar():void {
    if(!this.nuevaAgenda.idRutina||!this.nuevaAgenda.fecha)return;
    this.pedir('agendar',this.funciones.agendar(Number(this.nuevaAgenda.idRutina),this.nuevaAgenda.fecha),()=>{this.aviso='Sesión añadida al calendario.';this.cargarCalendario();});
  }
  cambiarEstado(a:CalendarioDTO,estado:string):void {
    this.pedir('estadoAgenda',this.funciones.actualizarAgenda({...a,estado}),()=>{this.aviso='Estado actualizado.';this.cargarCalendario();});
  }
  quitarAgenda(id:number):void {
    if(!confirm('¿Eliminar esta sesión del calendario?'))return;
    this.pedir('borrarAgenda',this.funciones.eliminarAgenda(id),()=>{this.aviso='Sesión eliminada.';this.cargarCalendario();});
  }
  alternarFavorito(e:EjercicioDTO):void {
    const anterior=this.favoritos.find(f=>f.idEjercicio===e.idEjercicio);
    const recargar=()=>this.pedir('favoritos',this.funciones.favoritos(this.idUsuario),f=>this.favoritos=f);
    if(anterior){this.pedir('favoritosEditar',this.funciones.quitarFavorito(anterior.idFavorito),()=>{this.aviso='Ejercicio retirado de favoritos.';recargar();});}
    else {this.pedir('favoritosEditar',this.funciones.agregarFavorito(this.idUsuario,e.idEjercicio),()=>{this.aviso='Ejercicio guardado en favoritos.';recargar();});}
  }
  verAlternativas(e:EjercicioDTO):void {
    this.ejercicioAlternativas=e.nombreEjercicio;
    this.pedir('alternativas',this.funciones.alternativas(e.idEjercicio),a=>this.alternativas=a);
  }
  // Compartida por principiante, intermedio y avanzado. JWT viaja por el interceptor.
  cargarVideos():void {
    this.videosPublicados=[];
    const nivelActual = this.nivel.toUpperCase();
    const nivel = nivelActual === 'INTERMEDIO' || nivelActual === 'AVANZADO'
      ? nivelActual
      : 'PRINCIPIANTE';
    this.pedir('videos', this.apiVideos.listarPublicados(nivel), videos => {
      this.videosPublicados = videos;
    });
  }

  buscarTermino():void {
    if(!this.consultaGlosario.trim())return;
    this.glosario=null;this.pedir('glosario',this.funciones.buscarGlosario(this.consultaGlosario.trim()),r=>this.glosario=r);
  }
  preguntar():void {
    if(!this.preguntaIA.trim())return;
    this.respuestaIA=null;this.pedir('chat',this.funciones.consultarIA(this.idUsuario,this.preguntaIA.trim()),r=>this.respuestaIA=r);
  }
  comparar():void {
    if(!this.mesBase||!this.mesComparado||this.mesBase===this.mesComparado){this.errores['comparacion']='Selecciona dos meses diferentes.';return;}
    this.comparacion=null;this.pedir('comparacion',this.funciones.compararMeses(this.idUsuario,this.mesBase,this.mesComparado),r=>this.comparacion=r);
  }
  exportar():void {
    this.pedir('exportar',this.funciones.exportarCsv(this.idUsuario),blob=>{
      const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`progreso-${this.idUsuario}.csv`;
      document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);this.aviso='CSV descargado desde la API.';
    });
  }
  guardarObjetivo():void {
    if(!this.objetivoElegido)return;
    this.pedir('guardarObjetivo',this.funciones.cambiarObjetivo(this.idUsuario,Number(this.objetivoElegido)),()=>{this.aviso='Objetivo guardado en PostgreSQL.';this.pedir('usuario',this.api.buscarUsuario(this.idUsuario),u=>this.usuario=u);});
  }
  salir():void {this.auth.cerrarSesion();void this.router.navigateByUrl('/login');}
}
