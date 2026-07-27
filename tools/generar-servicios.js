/* =============================================================================
   Genera las páginas de servicio a partir de la estructura compartida.
   Ejecutar desde la raíz del proyecto:  node tools/generar-servicios.js
   Editar el contenido aquí y volver a ejecutar; la salida son archivos .html
   estáticos, sin dependencias en tiempo de ejecución.
   ========================================================================== */
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');

const NAV_SECUNDARIA = [
  ['mantenimiento.html', 'Mantenimiento'],
  ['frenos.html', 'Frenos'],
  ['diagnostico.html', 'Diagnóstico'],
  ['scanner.html', 'Scanner'],
  ['embrague.html', 'Embrague'],
];

const paginas = [
  {
    archivo: 'mantenimiento.html',
    slug: 'mantenimiento',
    titulo: 'Mantenimiento por kilometraje',
    h1: 'Mantenimiento<br>por kilometraje',
    meta: 'Mantención según la pauta del fabricante en Santiago: aceite, filtros, bujías, correa de distribución y refrigerante. Presupuesto antes de intervenir el vehículo.',
    bajada: 'La pauta del fabricante de tu vehículo, tramo por tramo. Sin trabajos de más ni piezas que todavía sirven.',
    rotuloIntro: 'Qué es',
    tituloIntro: 'La mantención que corresponde, no la que se vende',
    parrafos: [
      'Cada fabricante define qué se revisa y qué se cambia en cada tramo de kilometraje. Nosotros seguimos esa pauta, la contrastamos con el estado real del vehículo y te decimos qué corresponde ahora y qué puede esperar al siguiente servicio.',
      'La mantención al día es lo que evita las fallas caras: una correa de distribución cortada arruina el motor completo, y un refrigerante vencido termina en una culata. Salir barato en la mantención sale caro después.',
    ],
    rotuloLista: 'Qué incluye',
    tituloLista: 'Según el tramo',
    lista: [
      'Cambio de aceite y filtro de aceite',
      'Filtro de aire del motor y de aire acondicionado',
      'Filtro de combustible',
      'Bujías y revisión del sistema de encendido',
      'Líquido de frenos y refrigerante',
      'Correa de distribución, tensores y bomba de agua',
      'Revisión de frenos, suspensión y tren delantero',
      'Prueba de batería, alternador y motor de partida',
      'Informe del estado general del vehículo',
    ],
    aparte: [
      ['Duración habitual', 'Entre 2 horas y 1 día, según el tramo'],
      ['Repuestos', 'Originales o alternativos de marca, lo eliges tú'],
      ['Registro', 'Queda el historial asociado a la patente'],
      ['Retiro a domicilio', 'Disponible dentro de Santiago'],
    ],
    rotuloSenales: 'Cuándo te toca',
    tituloSenales: 'Señales de que ya la debes',
    senales: [
      ['Pasaste el tramo', 'Van más de 10.000 km o más de un año desde el último cambio de aceite.'],
      ['No sabes cuándo fue', 'Compraste el auto usado y no tienes historial de mantenciones.'],
      ['Testigo encendido', 'Aparece el aviso de servicio o de nivel de aceite en el tablero.'],
      ['Uso intensivo', 'Manejas en ciudad con mucho tráfico, o el auto es de flota.'],
    ],
    cierre: 'Dinos el kilometraje de tu auto y te decimos exactamente qué le toca y cuánto cuesta.',
  },

  {
    archivo: 'frenos.html',
    slug: 'frenos',
    titulo: 'Frenos',
    h1: 'Frenos',
    meta: 'Servicio de frenos en Santiago: cambio de pastillas y discos, rectificación, cambio de líquido de frenos y apagado de luces de advertencia. Retiro a domicilio.',
    bajada: 'El sistema que no admite dejarlo para el próximo mes. Revisión, reparación y mantención completa.',
    rotuloIntro: 'Qué es',
    tituloIntro: 'El más completo servicio de frenos para tu auto',
    parrafos: [
      'Revisamos el sistema completo, no solo la pieza que hace ruido: pastillas, discos, líquido, mangueras, cilindros y el estado del freno de mano. Un disco desgastado arruina pastillas nuevas en semanas, así que medimos antes de cambiar.',
      'Si el testigo de frenos o el ABS quedó encendido después de una reparación anterior, lo diagnosticamos con scanner y lo dejamos apagado como corresponde: resolviendo la causa, no borrando el código.',
    ],
    rotuloLista: 'Qué incluye',
    tituloLista: 'El servicio completo',
    lista: [
      'Cambio de pastillas delanteras y traseras',
      'Cambio o rectificación de discos y tambores',
      'Servicio de rectificación en el taller',
      'Cambio de líquido de frenos y purga del sistema',
      'Revisión de mangueras, cilindros y bomba',
      'Diagnóstico y apagado de luces de advertencia y ABS',
      'Ajuste y revisión del freno de mano',
      'Prueba en ruta antes de la entrega',
    ],
    aparte: [
      ['Duración habitual', 'Entre 2 y 5 horas según el trabajo'],
      ['Rectificación', 'Se hace en el taller, sin enviar a terceros'],
      ['Prueba final', 'Siempre se entrega con prueba en ruta'],
      ['Retiro a domicilio', 'Disponible dentro de Santiago'],
    ],
    rotuloSenales: 'Cuándo traerlo',
    tituloSenales: 'Señales de alerta',
    senales: [
      ['Chirrido metálico', 'Las pastillas llegaron al indicador de desgaste, o ya están tocando el disco.'],
      ['Pedal esponjoso', 'El pedal se hunde más de lo normal: hay aire en el sistema o el líquido está vencido.'],
      ['Vibración al frenar', 'El volante o el pedal tiemblan a alta velocidad: los discos están deformados.'],
      ['El auto se va a un lado', 'Frenado disparejo entre ruedas, por pinza trabada o manguera dañada.'],
    ],
    cierre: 'Si escuchas algo raro al frenar, no esperes al fin de mes. Lo revisamos el mismo día.',
  },

  {
    archivo: 'diagnostico.html',
    slug: 'diagnostico',
    titulo: 'Diagnóstico de fallas complejas',
    h1: 'Diagnóstico<br>de fallas',
    meta: 'Diagnóstico de fallas electrónicas complejas en Santiago: osciloscopio, análisis de parámetros en vivo y revisión de módulos. Cuando el código de error no explica el síntoma.',
    bajada: 'Cuando el código de error no explica el síntoma. Osciloscopio y análisis de parámetros en vivo.',
    rotuloIntro: 'Qué es',
    tituloIntro: 'Fallas electrónicas complejas',
    parrafos: [
      'El scanner es la herramienta principal para diagnosticar una falla compleja, pero no basta con leer errores históricos. La diferencia la hace el análisis de datos y parámetros en vivo: ver cómo se comporta cada sensor mientras el motor trabaja.',
      'Para las señales que cambian en milisegundos usamos osciloscopio, que dibuja la forma de onda real de un sensor o un inyector. Ahí aparecen las fallas intermitentes que un lector de códigos nunca alcanza a registrar.',
      'Con eso llegamos a la pieza que efectivamente falla, en lugar de cambiar componentes por descarte. Sale más barato y no se repite.',
    ],
    rotuloLista: 'Qué incluye',
    tituloLista: 'El procedimiento',
    lista: [
      'Lectura de códigos históricos y de todos los módulos',
      'Análisis de parámetros en vivo con el motor en marcha',
      'Osciloscopio para gráficos de señales de sensores',
      'Prueba de sensores, actuadores e inyectores',
      'Medición del sistema de carga y de consumos parásitos',
      'Prueba en ruta con registro de datos',
      'Informe con la causa encontrada y el presupuesto de reparación',
    ],
    aparte: [
      ['Duración habitual', 'De 1 a 3 horas según la complejidad'],
      ['Equipos', 'Scanner multimarca y osciloscopio automotriz'],
      ['Resultado', 'Informe escrito con la causa y el presupuesto'],
      ['Si reparas con nosotros', 'El diagnóstico se descuenta del trabajo'],
    ],
    rotuloSenales: 'Cuándo traerlo',
    tituloSenales: 'Casos típicos',
    senales: [
      ['Falla intermitente', 'El problema aparece y desaparece, y en el taller nunca se manifiesta.'],
      ['Ya cambiaron piezas', 'Te cambiaron componentes por descarte y la falla sigue igual.'],
      ['Testigo que vuelve', 'Borran el código y a los días el testigo se enciende de nuevo.'],
      ['Consumo alto', 'Gasta más combustible que antes sin razón aparente, o pierde fuerza.'],
    ],
    cierre: 'Cuéntanos qué síntoma tiene tu auto y en qué momento aparece. Eso ya nos orienta.',
  },

  {
    archivo: 'scanner.html',
    slug: 'scanner',
    titulo: 'Scanner automotriz',
    h1: 'Scanner',
    meta: 'Scanner automotriz multimarca en Santiago: lectura y borrado de códigos, revisión de módulos, calibraciones y chequeo previo a la revisión técnica.',
    bajada: 'Lectura de todos los módulos, no solo del motor. Multimarca, con el diagnóstico explicado.',
    rotuloIntro: 'Qué es',
    tituloIntro: 'Leer el auto completo, no solo el motor',
    parrafos: [
      'Un auto moderno tiene módulos de motor, transmisión, frenos, airbag, carrocería y confort. Un lector básico solo llega al motor; nosotros escaneamos todos los módulos que el vehículo tenga, y te mostramos qué códigos hay y qué significan.',
      'El scanner también sirve antes de comprar un auto usado o antes de la revisión técnica: revela fallas guardadas y códigos borrados recientemente, que es exactamente lo que un vendedor apurado prefiere que no se vea.',
      'Borramos códigos solo después de resolver la causa. Borrar por borrar deja el auto igual, con el testigo apagado por unos días.',
    ],
    rotuloLista: 'Qué incluye',
    tituloLista: 'El servicio',
    lista: [
      'Escaneo de todos los módulos disponibles del vehículo',
      'Interpretación de los códigos encontrados',
      'Lectura de parámetros en vivo',
      'Prueba de actuadores',
      'Calibraciones y adaptaciones tras una reparación',
      'Reset de intervalos de servicio',
      'Chequeo previo a la revisión técnica',
      'Borrado de códigos una vez resuelta la causa',
    ],
    aparte: [
      ['Duración habitual', 'Entre 30 y 60 minutos'],
      ['Cobertura', 'Multimarca, autos y camionetas livianas'],
      ['Entrega', 'Te explicamos cada código encontrado'],
      ['Revisión de compra', 'Se puede combinar con la inspección completa'],
    ],
    rotuloSenales: 'Cuándo conviene',
    tituloSenales: 'Cuándo pedir un scanner',
    senales: [
      ['Check engine encendido', 'El testigo del motor está encendido o parpadeando.'],
      ['Antes de comprar', 'Vas a comprar un auto usado y quieres saber qué guarda su memoria.'],
      ['Antes de la revisión técnica', 'Para no perder el turno por una falla que se detecta en planta.'],
      ['Después de una reparación', 'Hay módulos que necesitan calibración para volver a funcionar bien.'],
    ],
    cierre: 'Trae el auto y te decimos qué está informando, en palabras que se entienden.',
  },

  {
    archivo: 'embrague.html',
    slug: 'embrague',
    titulo: 'Embrague',
    h1: 'Embrague',
    meta: 'Cambio de embrague en Santiago: kit completo, rectificación del volante de inercia y revisión del sistema hidráulico. Presupuesto antes de desarmar.',
    bajada: 'Kit completo y rectificación del volante de inercia. Se hace una vez y se hace bien.',
    rotuloIntro: 'Qué es',
    tituloIntro: 'Cambio de embrague y rectificación de volante',
    parrafos: [
      'Cambiar el embrague obliga a separar la caja del motor, así que es un trabajo que no conviene hacer a medias: cambiamos el kit completo — disco, prensa y rodamiento — porque volver a entrar por una sola pieza cuesta lo mismo que la primera vez.',
      'El volante de inercia se revisa siempre. Si está dentro de tolerancia se rectifica en el taller; si es bimasa y está vencido, te mostramos la medición antes de proponer el cambio. Un volante rayado destruye un disco nuevo en poco tiempo.',
      'También revisamos el accionamiento: bomba, bombín y cañería hidráulica, o el cable según el modelo. Muchas veces el pedal que no responde es el hidráulico y no el embrague.',
    ],
    rotuloLista: 'Qué incluye',
    tituloLista: 'El trabajo completo',
    lista: [
      'Kit de embrague: disco, prensa y rodamiento',
      'Rectificación del volante de inercia',
      'Medición y evaluación de volante bimasa',
      'Revisión de bomba y bombín de embrague',
      'Cambio de líquido y purga del sistema hidráulico',
      'Revisión de retenes de motor y caja a la vista',
      'Ajuste del pedal y prueba en ruta',
    ],
    aparte: [
      ['Duración habitual', 'De 1 a 2 días según el modelo'],
      ['Rectificación', 'Se hace en el taller, sin enviar a terceros'],
      ['Presupuesto', 'Se confirma tras desarmar, antes de comprar repuestos'],
      ['Retiro a domicilio', 'Disponible dentro de Santiago'],
    ],
    rotuloSenales: 'Cuándo traerlo',
    tituloSenales: 'Señales de alerta',
    senales: [
      ['El motor sube de vueltas', 'Aceleras y el motor revoluciona sin que el auto avance igual: el disco patina.'],
      ['Cuesta poner los cambios', 'Especialmente la primera y la marcha atrás, con el motor encendido.'],
      ['Pedal duro o al fondo', 'El pedal cambió de tacto o se queda abajo: suele ser el hidráulico.'],
      ['Olor a quemado', 'Olor característico después de una subida o del tráfico pesado.'],
    ],
    cierre: 'Dinos marca, modelo y kilometraje. Te damos un rango de presupuesto antes de que traigas el auto.',
  },
];

/* --- Plantilla ---------------------------------------------------------- */

const cabeza = (p) => `<!DOCTYPE html>
<html lang="es-CL">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.titulo} — Medelauto, taller mecánico en Santiago</title>
<meta name="description" content="${p.meta}">
<link rel="canonical" href="https://www.medelauto.cl/${p.slug}">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_CL">
<meta property="og:site_name" content="Medelauto">
<meta property="og:title" content="${p.titulo} — Medelauto">
<meta property="og:description" content="${p.bajada}">
<meta name="theme-color" content="#16212a">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=PT+Sans:ital,wght@0,400;0,700;1,400&family=Titillium+Web:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/site.css">
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})
(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": ${JSON.stringify(p.titulo)},
  "serviceType": ${JSON.stringify(p.titulo)},
  "description": ${JSON.stringify(p.meta)},
  "areaServed": { "@type": "City", "name": "Santiago" },
  "provider": {
    "@type": "AutoRepair",
    "name": "Medelauto Servicio Automotriz",
    "telephone": "+56222223369",
    "url": "https://www.medelauto.cl/",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "10 de Julio Huamachuco 443",
      "addressLocality": "Santiago",
      "addressCountry": "CL"
    }
  }
}
</script>
</head>
<body>
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<a class="salto-contenido" href="#contenido">Saltar al contenido</a>`;

const cabecera = (archivoActual) => `
<header class="cabecera">
  <div class="envoltura">
    <div class="cabecera__fila cabecera__fila--superior">
      <a class="marca" href="index.html" aria-label="Medelauto, inicio">
        <img class="marca__logo" src="assets/img/logo-medelauto.png"
             alt="Medel — Mantenimiento y Servicio Automotriz" width="2986" height="935">
        <span class="marca__sello">Desde 1968</span>
      </a>
      <nav class="nav solo-escritorio" aria-label="Principal">
        <a href="index.html">Inicio</a>
        <a href="servicios.html">Servicios</a>
        <a href="index.html#presupuesto">Presupuesto</a>
        <a href="index.html#canal">Canal</a>
        <a href="index.html#ubicacion">Ubicación</a>
        <a href="contacto.html">Contacto</a>
      </nav>
      <button class="hamburguesa" type="button" aria-expanded="false" aria-controls="menu-movil" aria-label="Abrir menú">
        <span></span><span></span><span></span>
      </button>
    </div>
    <div class="cabecera__fila cabecera__fila--inferior">
      <nav class="nav nav--secundaria" aria-label="Servicios">
${NAV_SECUNDARIA.map(([href, texto]) =>
  `        <a href="${href}"${href === archivoActual ? ' aria-current="page"' : ''}>${texto}</a>`
).join('\n')}
      </nav>
      <a class="cabecera__telefono" href="tel:+56222223369">+56 2 2222 3369</a>
    </div>
  </div>
</header>

<div class="overlay-movil" id="menu-movil">
  <button class="overlay-movil__cerrar" type="button" aria-label="Cerrar menú">&times;</button>
  <nav aria-label="Menú móvil">
    <a href="index.html">Inicio</a>
    <a href="servicios.html">Servicios</a>
${NAV_SECUNDARIA.map(([href, texto]) => `    <a href="${href}">${texto}</a>`).join('\n')}
    <a href="index.html#presupuesto">Presupuesto</a>
    <a href="index.html#canal">Canal</a>
    <a href="index.html#ubicacion">Ubicación</a>
    <a href="contacto.html">Contacto</a>
  </nav>
  <div class="overlay-movil__pie">
    <p><a href="tel:+56222223369">+56 2 2222 3369</a><br>
    10 de Julio Huamachuco 443, Santiago<br>
    Lun a Vie 09:00–18:30 · Sáb 09:00–14:00</p>
  </div>
</div>`;

const pie = () => `
<footer class="pie">
  <div class="envoltura">
    <div class="pie__rejilla">
      <div class="pie__marca">
        <img class="marca__logo" src="assets/img/logo-medelauto.png"
             alt="Medel — Mantenimiento y Servicio Automotriz" width="2986" height="935">
        <p class="pie__nota">Servicio automotriz en Santiago desde 1968.<br>
        Mecánica general, electricidad y diagnóstico.</p>
      </div>
      <div>
        <h4>Servicios</h4>
        <ul>
${NAV_SECUNDARIA.map(([href, texto]) => `          <li><a href="${href}">${texto}</a></li>`).join('\n')}
          <li><a href="servicios.html">Ver todos</a></li>
        </ul>
      </div>
      <div>
        <h4>Taller</h4>
        <ul>
          <li>10 de Julio Huamachuco 443</li>
          <li>Santiago, Chile</li>
          <li><a href="tel:+56222223369">+56 2 2222 3369</a></li>
          <li><a href="mailto:taller@medelauto.cl">taller@medelauto.cl</a></li>
          <li><a href="mailto:felipe@medelauto.cl">felipe@medelauto.cl</a></li>
        </ul>
      </div>
      <div>
        <h4>Horario</h4>
        <ul>
          <li>Lunes a viernes 09:00–18:30</li>
          <li>Sábado 09:00–14:00</li>
          <li>Domingo cerrado</li>
        </ul>
        <h4 style="margin-top:1.75rem">Síguenos</h4>
        <ul>
          <li><a href="https://www.instagram.com/medelauto" target="_blank" rel="noopener">Instagram @medelauto</a></li>
        </ul>
      </div>
    </div>
    <div class="pie__legal">
      <span>© <span data-anio>2026</span> Medelauto Servicio Automotriz</span>
      <span>Santiago de Chile</span>
    </div>
  </div>
</footer>

<a class="wasap" href="https://wa.me/56942214502?text=Hola%2C%20quiero%20cotizar%20un%20servicio%20para%20mi%20auto" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.23 8.23 0 0 1 8.24 8.24c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.74 2.66 4.22 3.73.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28Z"/></svg>
  <span>WhatsApp</span>
</a>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
<script src="assets/site.js" defer></script>
</body>
</html>
`;

const cuerpo = (p) => `
<main id="contenido">

  <section class="seccion banner portada portada--interior">
    <div class="banner__fondo"></div>
    <div class="trama"></div>
    <div class="envoltura">
      <div class="portada__contenido">
        <p class="migas"><a href="index.html">Inicio</a><span>/</span><a href="servicios.html">Servicios</a><span>/</span>${p.titulo}</p>
        <h1 data-letras data-letras-portada>${p.h1}</h1>
        <p class="bajada">${p.bajada}</p>
      </div>
    </div>
  </section>

  <section class="seccion">
    <div class="envoltura">
      <div class="ficha revelar">
        <div>
          <span class="rotulo">${p.rotuloIntro}</span>
          <h2 data-letras>${p.tituloIntro}</h2>
${p.parrafos.map((t) => `          <p>${t}</p>`).join('\n')}
        </div>
        <div class="ficha__aparte">
          <h3>De un vistazo</h3>
          <dl>
${p.aparte.map(([k, v]) => `            <dt>${k}</dt>\n            <dd>${v}</dd>`).join('\n')}
          </dl>
          <div class="grupo-botones">
            <a class="boton boton--compacto" href="index.html#presupuesto">Ir a presupuesto</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="seccion seccion--hueco">
    <div class="envoltura">
      <div class="encabezado-seccion revelar">
        <span class="rotulo">${p.rotuloLista}</span>
        <h2 data-letras>${p.tituloLista}</h2>
      </div>
      <ul class="especialidades especialidades--claro revelar">
${p.lista.map((t) => `        <li>${t}</li>`).join('\n')}
      </ul>
    </div>
  </section>

  <section class="seccion seccion--tinta banner">
    <div class="banner__fondo"></div>
    <div class="trama"></div>
    <div class="envoltura">
      <div class="encabezado-seccion revelar">
        <span class="rotulo">${p.rotuloSenales}</span>
        <h2 data-letras>${p.tituloSenales}</h2>
      </div>
      <div class="senales revelar" style="background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.12)">
${p.senales.map(([t, d]) => `        <div style="background:var(--tinta)"><h4>${t}</h4><p style="color:rgba(255,255,255,.7)">${d}</p></div>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="seccion">
    <div class="envoltura">
      <div class="dos-columnas revelar">
        <div>
          <span class="rotulo">Presupuesto</span>
          <h2 data-letras>Sabes el precio antes de que entre al taller</h2>
          <p>${p.cierre}</p>
        </div>
        <div>
          <ul class="lista-marcada">
            <li>Rango de precio de repuestos y de mano de obra</li>
            <li>Cuánto se demora el trabajo</li>
            <li>Nada se ejecuta sin tu aprobación</li>
            <li>Si al desarmar aparece algo más, te llamamos antes de seguir</li>
          </ul>
          <div class="grupo-botones" style="margin-top:0">
            <a class="boton boton--rojo" href="index.html#presupuesto">Pedir presupuesto</a>
            <a class="boton" href="tel:+56222223369">+56 2 2222 3369</a>
          </div>
        </div>
      </div>
    </div>
  </section>

</main>`;

/* --- Escritura ---------------------------------------------------------- */
let escritas = 0;
for (const p of paginas) {
  const html = cabeza(p) + cabecera(p.archivo) + cuerpo(p) + pie();
  fs.writeFileSync(path.join(RAIZ, p.archivo), html, 'utf8');
  console.log('escrito  ' + p.archivo);
  escritas++;
}
console.log('\n' + escritas + ' páginas de servicio generadas.');
