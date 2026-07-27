/* =============================================================================
   MEDELAUTO — generador de la vista única
   Empaqueta las 8 páginas del sitio, la hoja de estilos, el JS y las imágenes
   en un solo archivo HTML que funciona sin servidor: se abre con doble clic o
   se envía por correo.

   Cada página se monta dentro de un iframe con srcdoc, es decir como documento
   completo e independiente. Es más fiel que apilar los <main> en un solo
   documento: site.js corre igual que en el sitio real, sin tener que
   reinicializar ScrollTrigger ni el IntersectionObserver al cambiar de página.

   Las imágenes se guardan una sola vez en un mapa y se inyectan por marcador
   al renderizar; si se incrustaran en el HTML de cada página, el logo quedaría
   repetido 16 veces (cabecera y pie de las 8).

   Uso: node tools/construir-vista-unica.js
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const SALIDA = path.join(RAIZ, 'medelauto-completo.html');

const PAGINAS = [
  { archivo: 'index.html',         rotulo: 'Inicio' },
  { archivo: 'servicios.html',     rotulo: 'Servicios' },
  { archivo: 'mantenimiento.html', rotulo: 'Mantenimiento' },
  { archivo: 'frenos.html',        rotulo: 'Frenos' },
  { archivo: 'diagnostico.html',   rotulo: 'Diagnóstico' },
  { archivo: 'scanner.html',       rotulo: 'Scanner' },
  { archivo: 'embrague.html',      rotulo: 'Embrague' },
  { archivo: 'contacto.html',      rotulo: 'Contacto' },
];

const TIPOS = { '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg' };

/* --- Imágenes ------------------------------------------------------------ */

const imagenes = {};

function comoDataURI(rutaRelativa) {
  const absoluta = path.join(RAIZ, rutaRelativa);
  const tipo = TIPOS[path.extname(absoluta).toLowerCase()];
  if (!tipo) throw new Error('Tipo de imagen no contemplado: ' + rutaRelativa);
  const datos = fs.readFileSync(absoluta).toString('base64');
  return 'data:' + tipo + ';base64,' + datos;
}

/* Registra la imagen y devuelve el marcador que la representa mientras el
   archivo se arma. El reemplazo real ocurre en el navegador, al renderizar. */
function marcador(rutaRelativa) {
  if (!imagenes[rutaRelativa]) imagenes[rutaRelativa] = comoDataURI(rutaRelativa);
  return '@@IMG:' + rutaRelativa + '@@';
}

/* --- Utilidades ---------------------------------------------------------- */

/* El contenido va dentro de <script>, así que cualquier </script> literal
   (el bloque JSON-LD de la portada, por ejemplo) cerraría la etiqueta antes
   de tiempo. */
function paraIncrustar(texto) {
  return JSON.stringify(texto).replace(/<\//g, '<\\/');
}

/* --- Hoja de estilos ----------------------------------------------------- */

let css = fs.readFileSync(path.join(RAIZ, 'assets/site.css'), 'utf8');
css = css.replace(/url\((["']?)img\/([^"')]+)\1\)/g, (_, comilla, archivo) =>
  'url("' + marcador('assets/img/' + archivo) + '")');

const js = fs.readFileSync(path.join(RAIZ, 'assets/site.js'), 'utf8');

/* --- Puente hacia el contenedor ------------------------------------------ */

/* Corre dentro del iframe. Se escribe como función de verdad y se serializa
   con toString(): armarla concatenando cadenas obliga a escapar a mano las
   barras invertidas de la expresión regular, y ahí ya se coló un \\. donde
   correspondía \. — el enlace con ancla se escapaba del contenedor. */
function puenteEnIframe() {
  document.addEventListener('click', function (e) {
    var enlace = e.target.closest && e.target.closest('a[href]');
    if (!enlace) return;
    var partes = (enlace.getAttribute('href') || '').match(/^([\w-]+\.html)(#.*)?$/);
    if (!partes) return;
    e.preventDefault();
    parent.postMessage({ tipo: 'ir', archivo: partes[1], ancla: partes[2] || '' }, '*');
  });

  window.addEventListener('message', function (e) {
    if (!e.data || e.data.tipo !== 'ancla' || !e.data.ancla) return;
    var destino = document.querySelector(e.data.ancla);
    if (destino) destino.scrollIntoView();
  });
}

const puente = '(' + puenteEnIframe.toString() + '());';

/* --- Páginas ------------------------------------------------------------- */

const documentos = PAGINAS.map(({ archivo, rotulo }) => {
  const fuente = fs.readFileSync(path.join(RAIZ, archivo), 'utf8');

  const titulo = (fuente.match(/<title>([\s\S]*?)<\/title>/) || [, archivo])[1].trim();

  let cuerpo = (fuente.match(/<body[^>]*>([\s\S]*)<\/body>/) || [, ''])[1];

  // Fuera el contenedor de Google Tag Manager: en el archivo todavía lleva el
  // ID de ejemplo y solo produciría una petición fallida.
  cuerpo = cuerpo.replace(/<noscript><iframe src="https:\/\/www\.googletagmanager\.com[\s\S]*?<\/noscript>/g, '');

  // Los <script> del final los repone la plantilla, ya en línea.
  cuerpo = cuerpo.replace(/<script[^>]*src="[^"]*"[^>]*><\/script>\s*/g, '');

  cuerpo = cuerpo.replace(/(src|href)="(assets\/img\/[^"]+)"/g,
    (_, atributo, ruta) => atributo + '="' + marcador(ruta) + '"');

  return { archivo, rotulo, titulo, cuerpo };
});

/* --- Plantilla ----------------------------------------------------------- */

const plantilla = `<!DOCTYPE html>
<html lang="es-CL">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Medelauto — sitio completo</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  html, body { height: 100%; margin: 0; }
  body {
    display: flex;
    flex-direction: column;
    background: #10171d;
    font-family: "Titillium Web", "Segoe UI", system-ui, sans-serif;
  }

  .visor {
    flex: 1 1 auto;
    width: 100%;
    border: 0;
    display: block;
    background: #f7f6f3;
  }

  /* Barra del previsualizador. Deliberadamente distinta del sitio para que no
     se confunda con la cabecera real. */
  .barra {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    padding: 0.55rem 0.9rem;
    background: #10171d;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }
  .barra__titulo {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #d0706a;
    margin-right: 0.25rem;
  }
  .barra__paginas { display: flex; gap: 0.3rem; flex-wrap: wrap; }
  .barra button {
    font: inherit;
    font-size: 0.76rem;
    padding: 0.34rem 0.7rem;
    border-radius: 2px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    background: transparent;
    color: rgba(255, 255, 255, 0.72);
    cursor: pointer;
  }
  .barra button:hover { border-color: rgba(255, 255, 255, 0.4); color: #fff; }
  .barra button[aria-current="true"] {
    background: #a83433;
    border-color: #a83433;
    color: #fff;
  }
  .barra__oculta {
    margin-left: auto;
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.45);
  }
  body.sin-barra .barra { display: none; }

  .aviso {
    position: fixed;
    left: 50%;
    bottom: 1rem;
    transform: translateX(-50%);
    background: rgba(16, 23, 29, 0.92);
    color: rgba(255, 255, 255, 0.82);
    font-size: 0.74rem;
    padding: 0.5rem 0.9rem;
    border-radius: 2px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 300ms ease;
  }
  .aviso.se-ve { opacity: 1; }
</style>
</head>
<body>

<div class="barra">
  <span class="barra__titulo">Medelauto · vista completa</span>
  <div class="barra__paginas" id="paginas"></div>
  <span class="barra__oculta">Tecla B: ocultar esta barra</span>
</div>

<iframe class="visor" id="visor" title="Sitio de Medelauto"></iframe>

<div class="aviso" id="aviso"></div>

<script>
(function () {
  'use strict';

  var IMAGENES = ${paraIncrustar(JSON.stringify(imagenes))};
  var CSS = ${paraIncrustar(css)};
  var JS = ${paraIncrustar(js)};
  var PAGINAS = ${paraIncrustar(JSON.stringify(documentos))};

  IMAGENES = JSON.parse(IMAGENES);
  PAGINAS = JSON.parse(PAGINAS);

  var visor = document.getElementById('visor');
  var listaPaginas = document.getElementById('paginas');
  var aviso = document.getElementById('aviso');
  var actual = null;

  /* Reemplaza los marcadores por las imágenes reales. Se hace aquí y no al
     construir el archivo para guardar cada imagen una sola vez. */
  function resolverImagenes(texto) {
    return texto.replace(/@@IMG:([^@]+)@@/g, function (coincidencia, ruta) {
      return IMAGENES[ruta] || coincidencia;
    });
  }

  /* Puente hacia el contenedor: dentro del iframe los enlaces .html no
     resuelven contra nada, así que se interceptan y se avisa hacia arriba. */
  var PUENTE = ${paraIncrustar(puente)};

  function documentoDe(pagina) {
    return resolverImagenes(
      '<!DOCTYPE html><html lang="es-CL"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<title>' + pagina.titulo + '</title>' +
      '<link rel="preconnect" href="https://fonts.googleapis.com">' +
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
      '<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700' +
        '&family=PT+Sans:ital,wght@0,400;0,700;1,400&family=Titillium+Web:wght@400;600;700' +
        '&display=swap" rel="stylesheet">' +
      '<style>' + CSS + '</style></head><body>' +
      pagina.cuerpo +
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\\/script>' +
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\\/script>' +
      '<script>' + JS + '<\\/script>' +
      '<script>' + PUENTE + '<\\/script>' +
      '</body></html>'
    );
  }

  var temporizador;
  function anunciar(texto) {
    aviso.textContent = texto;
    aviso.classList.add('se-ve');
    clearTimeout(temporizador);
    temporizador = setTimeout(function () { aviso.classList.remove('se-ve'); }, 1800);
  }

  function mostrar(archivo, ancla) {
    var pagina = PAGINAS.filter(function (p) { return p.archivo === archivo; })[0];
    if (!pagina) return;
    actual = archivo;

    Array.prototype.forEach.call(listaPaginas.children, function (boton) {
      boton.setAttribute('aria-current', String(boton.dataset.archivo === archivo));
    });

    if (ancla) {
      visor.addEventListener('load', function alCargar() {
        visor.removeEventListener('load', alCargar);
        visor.contentWindow.postMessage({ tipo: 'ancla', ancla: ancla }, '*');
      });
    }

    visor.srcdoc = documentoDe(pagina);
    document.title = pagina.titulo;
    if (location.hash.slice(1) !== archivo) history.replaceState(null, '', '#' + archivo);
  }

  PAGINAS.forEach(function (pagina) {
    var boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = pagina.rotulo;
    boton.dataset.archivo = pagina.archivo;
    boton.addEventListener('click', function () { mostrar(pagina.archivo, ''); });
    listaPaginas.appendChild(boton);
  });

  window.addEventListener('message', function (e) {
    if (!e.data || e.data.tipo !== 'ir') return;
    if (e.data.archivo === actual && e.data.ancla) {
      visor.contentWindow.postMessage({ tipo: 'ancla', ancla: e.data.ancla }, '*');
      return;
    }
    mostrar(e.data.archivo, e.data.ancla);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'b' && e.key !== 'B') return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    document.body.classList.toggle('sin-barra');
    anunciar(document.body.classList.contains('sin-barra')
      ? 'Barra oculta — pulsa B para traerla de vuelta'
      : 'Barra visible');
  });

  var inicial = location.hash.slice(1);
  mostrar(PAGINAS.some(function (p) { return p.archivo === inicial; })
    ? inicial : PAGINAS[0].archivo, '');
}());
</script>
</body>
</html>
`;

fs.writeFileSync(SALIDA, plantilla, 'utf8');

const kb = (Buffer.byteLength(plantilla, 'utf8') / 1024).toFixed(0);
console.log('Generado: ' + path.relative(RAIZ, SALIDA));
console.log('  páginas:  ' + documentos.length);
console.log('  imágenes: ' + Object.keys(imagenes).length);
console.log('  tamaño:   ' + kb + ' KB');
