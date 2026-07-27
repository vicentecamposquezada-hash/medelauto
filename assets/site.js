/* =============================================================================
   MEDELAUTO — comportamiento del sitio
   Sin dependencias externas, igual que el runtime de plantilla del sitio de
   referencia: menú móvil, parallax de banners, revelado al hacer scroll,
   escala de kilometraje y validación del formulario.
   ========================================================================== */
(function () {
  'use strict';

  var menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Menú móvil ------------------------------------------------------- */
  function iniciarMenu() {
    var boton = document.querySelector('.hamburguesa');
    var overlay = document.getElementById('menu-movil');
    if (!boton || !overlay) return;

    var cerrar = overlay.querySelector('.overlay-movil__cerrar');

    function alternar(abrir) {
      overlay.classList.toggle('esta-abierto', abrir);
      boton.setAttribute('aria-expanded', String(abrir));
      document.body.style.overflow = abrir ? 'hidden' : '';
      if (abrir) {
        var primero = overlay.querySelector('a');
        if (primero) primero.focus();
      } else {
        boton.focus();
      }
    }

    boton.addEventListener('click', function () {
      alternar(boton.getAttribute('aria-expanded') !== 'true');
    });
    if (cerrar) cerrar.addEventListener('click', function () { alternar(false); });

    overlay.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') alternar(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('esta-abierto')) alternar(false);
    });
  }

  /* --- Sombra del header al desplazar ----------------------------------- */
  function iniciarCabecera() {
    var cabecera = document.querySelector('.cabecera');
    if (!cabecera) return;
    var pendiente = false;

    function revisar() {
      cabecera.classList.toggle('esta-fijo', window.scrollY > 8);
      pendiente = false;
    }
    window.addEventListener('scroll', function () {
      if (!pendiente) { pendiente = true; window.requestAnimationFrame(revisar); }
    }, { passive: true });
    revisar();
  }

  /* --- Revelado al hacer scroll ----------------------------------------- */
  function iniciarRevelado() {
    var elementos = document.querySelectorAll('.revelar');
    if (!elementos.length) return;

    if (menosMovimiento || !('IntersectionObserver' in window)) {
      elementos.forEach(function (el) { el.classList.add('esta-visible'); });
      return;
    }

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('esta-visible');
          observador.unobserve(entrada.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    elementos.forEach(function (el) { observador.observe(el); });
  }

  /* --- Parallax de los banners oscuros ---------------------------------- */
  function iniciarParallax() {
    var fondos = document.querySelectorAll('.banner__fondo');
    if (!fondos.length || menosMovimiento) return;
    if (window.matchMedia('(hover: none)').matches) return; // táctil: sin parallax

    var pendiente = false;

    function mover() {
      fondos.forEach(function (fondo) {
        var caja = fondo.parentElement.getBoundingClientRect();
        if (caja.bottom < 0 || caja.top > window.innerHeight) return;
        var avance = (caja.top + caja.height / 2 - window.innerHeight / 2) / window.innerHeight;
        fondo.style.transform = 'translate3d(0,' + (avance * 42).toFixed(2) + 'px,0)';
      });
      pendiente = false;
    }

    window.addEventListener('scroll', function () {
      if (!pendiente) { pendiente = true; window.requestAnimationFrame(mover); }
    }, { passive: true });
    window.addEventListener('resize', mover, { passive: true });
    mover();
  }

  /* --- LA PAUTA: escala de kilometraje ---------------------------------- */
  function iniciarPauta() {
    var pauta = document.querySelector('[data-pauta]');
    if (!pauta) return;

    var botones = Array.prototype.slice.call(pauta.querySelectorAll('[role="tab"]'));
    var paneles = Array.prototype.slice.call(pauta.querySelectorAll('[role="tabpanel"]'));
    var aguja = pauta.querySelector('.pauta__aguja');
    if (!botones.length) return;

    function seleccionar(indice, moverFoco) {
      botones.forEach(function (boton, i) {
        var activo = i === indice;
        boton.setAttribute('aria-selected', String(activo));
        boton.tabIndex = activo ? 0 : -1;
      });
      paneles.forEach(function (panel, i) { panel.hidden = i !== indice; });

      if (aguja) {
        var b = botones[indice].getBoundingClientRect();
        var caja = pauta.querySelector('.pauta__escala').getBoundingClientRect();
        aguja.style.left = (b.left - caja.left + b.width / 2) + 'px';
      }
      if (moverFoco) botones[indice].focus();
    }

    botones.forEach(function (boton, i) {
      boton.addEventListener('click', function () { seleccionar(i, false); });
      boton.addEventListener('keydown', function (e) {
        var salto = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (salto) {
          e.preventDefault();
          seleccionar((i + salto + botones.length) % botones.length, true);
        } else if (e.key === 'Home') {
          e.preventDefault(); seleccionar(0, true);
        } else if (e.key === 'End') {
          e.preventDefault(); seleccionar(botones.length - 1, true);
        }
      });
    });

    seleccionar(0, false);
    window.addEventListener('resize', function () {
      var actual = botones.findIndex(function (b) {
        return b.getAttribute('aria-selected') === 'true';
      });
      seleccionar(actual < 0 ? 0 : actual, false);
    }, { passive: true });
  }

  /* --- Letras animadas con GSAP ----------------------------------------- */

  /* Parte el contenido en palabras y letras conservando los elementos hijos
     (los <span class="linea"> del titular, por ejemplo). Deja el texto
     original en aria-label para que los lectores de pantalla no lo deletreen. */
  function partirEnLetras(raiz) {
    var letras = [];

    function recorrer(nodo) {
      var hijos = Array.prototype.slice.call(nodo.childNodes);
      hijos.forEach(function (hijo) {
        if (hijo.nodeType === Node.TEXT_NODE) {
          var texto = hijo.textContent;
          if (!texto.trim()) return;

          var fragmento = document.createDocumentFragment();
          texto.split(/(\s+)/).forEach(function (trozo) {
            if (!trozo) return;
            if (/^\s+$/.test(trozo)) {
              fragmento.appendChild(document.createTextNode(' '));
              return;
            }
            var palabra = document.createElement('span');
            palabra.className = 'palabra';
            trozo.split('').forEach(function (caracter) {
              var letra = document.createElement('span');
              letra.className = 'letra';
              letra.textContent = caracter;
              palabra.appendChild(letra);
              letras.push(letra);
            });
            fragmento.appendChild(palabra);
          });
          nodo.replaceChild(fragmento, hijo);
        } else if (hijo.nodeType === Node.ELEMENT_NODE && hijo.tagName !== 'BR') {
          recorrer(hijo);
        }
      });
    }

    recorrer(raiz);
    return letras;
  }

  function iniciarLetras() {
    if (menosMovimiento || typeof window.gsap === 'undefined') return;

    var titulares = document.querySelectorAll('[data-letras]');
    if (!titulares.length) return;

    var gsap = window.gsap;
    var hayScrollTrigger = typeof window.ScrollTrigger !== 'undefined';
    if (hayScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    document.documentElement.classList.add('gsap-listo');

    titulares.forEach(function (titular) {
      if (!titular.getAttribute('aria-label')) {
        titular.setAttribute('aria-label', titular.textContent.replace(/\s+/g, ' ').trim());
      }
      var letras = partirEnLetras(titular);
      if (!letras.length) return;

      // El texto ya está en aria-label: las letras sueltas se ocultan al lector.
      letras.forEach(function (letra) { letra.setAttribute('aria-hidden', 'true'); });

      var animacion = {
        opacity: 0,
        yPercent: 115,
        rotationZ: 3,
        duration: 0.85,
        ease: 'power3.out',
        stagger: { each: 0.016 },
        clearProps: 'transform,opacity'
      };

      if (titular.hasAttribute('data-letras-portada')) {
        animacion.delay = 0.15;
        gsap.from(letras, animacion);
      } else if (hayScrollTrigger) {
        animacion.scrollTrigger = { trigger: titular, start: 'top 82%', once: true };
        gsap.from(letras, animacion);
      } else {
        gsap.from(letras, animacion);
      }
    });
  }

  /* --- Franja del taller: se va oscureciendo al bajar -------------------- */

  /* Atada al scroll (scrub): la imagen pasa de su tono normal a uno apagado y
     termina en el mismo valor con que sigue, de fondo, dentro del banner de la
     pauta. Así la foto no se corta, se hunde. */
  var BRILLO_INICIAL = 0.94;
  var BRILLO_FINAL = 0.26;

  function iniciarTira() {
    var tira = document.querySelector('[data-tira]');
    if (!tira) return;

    var imagen = tira.querySelector('img');
    if (!imagen) return;

    if (menosMovimiento || typeof window.gsap === 'undefined' ||
        typeof window.ScrollTrigger === 'undefined') {
      return;
    }

    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    // Se anima un objeto plano y se escribe el filtro a mano: tweenear
    // `filter` como cadena es frágil entre navegadores.
    var estado = { brillo: BRILLO_INICIAL, saturacion: 1 };

    function pintar() {
      imagen.style.filter =
        'contrast(1.06) brightness(' + estado.brillo.toFixed(3) + ')' +
        ' saturate(' + estado.saturacion.toFixed(3) + ')';
    }
    pintar();

    gsap.to(estado, {
      brillo: BRILLO_FINAL,
      saturacion: 0.55,
      ease: 'none',
      onUpdate: pintar,
      scrollTrigger: {
        trigger: tira,
        start: 'top 75%',
        end: 'bottom 25%',
        scrub: 0.5
      }
    });
  }

  /* --- Foto de fondo que se va al fondo --------------------------------- */

  /* Atada al scroll (scrub): la panorámica entra nítida y legible y termina
     difuminada y apagada, ya como textura detrás del texto. El desenfoque
     sobre un elemento a sangre completa es caro, así que en táctil no se
     anima: se deja fijo el estado final. */
  var FOTO_INICIO = { brillo: 0.27, desenfoque: 0, opacidad: 0.64 };
  var FOTO_FINAL  = { brillo: 0.13, desenfoque: 9, opacidad: 0.36 };

  function iniciarFotoFondo() {
    var fotos = document.querySelectorAll('[data-foto-fondo]');
    if (!fotos.length) return;

    function pintar(foto, estado) {
      foto.style.filter =
        'grayscale(1) contrast(1.08)' +
        ' brightness(' + estado.brillo.toFixed(3) + ')' +
        ' blur(' + estado.desenfoque.toFixed(2) + 'px)';
      foto.style.opacity = estado.opacidad.toFixed(3);
    }

    var sinAnimacion = menosMovimiento ||
      typeof window.gsap === 'undefined' ||
      typeof window.ScrollTrigger === 'undefined' ||
      window.matchMedia('(hover: none)').matches;

    if (sinAnimacion) {
      fotos.forEach(function (foto) {
        pintar(foto, FOTO_FINAL);
        foto.style.willChange = 'auto';
      });
      return;
    }

    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    fotos.forEach(function (foto) {
      var estado = {
        brillo: FOTO_INICIO.brillo,
        desenfoque: FOTO_INICIO.desenfoque,
        opacidad: FOTO_INICIO.opacidad
      };
      pintar(foto, estado);

      gsap.to(estado, {
        brillo: FOTO_FINAL.brillo,
        desenfoque: FOTO_FINAL.desenfoque,
        opacidad: FOTO_FINAL.opacidad,
        ease: 'none',
        onUpdate: function () { pintar(foto, estado); },
        scrollTrigger: {
          trigger: foto.parentElement,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 0.6
        }
      });
    });
  }

  /* --- Tarjeta del canal ------------------------------------------------ */

  /* Con data-youtube vacío la tarjeta es un enlace normal al canal. Con un ID,
     el reproductor se inserta recién al hacer clic: nada de terceros ni cookies
     mientras el visitante no lo pida. */
  function iniciarCanal() {
    var tarjeta = document.querySelector('.canal__tarjeta[data-youtube]');
    if (!tarjeta) return;

    var id = tarjeta.getAttribute('data-youtube').trim();
    if (!id) return;

    var poster = tarjeta.querySelector('img');
    if (poster) {
      poster.src = 'https://i.ytimg.com/vi/' + encodeURIComponent(id) + '/maxresdefault.jpg';
    }

    tarjeta.addEventListener('click', function (e) {
      e.preventDefault();
      var marco = document.createElement('iframe');
      marco.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1';
      marco.title = 'Video del taller Medelauto';
      marco.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture';
      marco.allowFullscreen = true;
      marco.setAttribute('style',
        'position:absolute;inset:0;width:100%;height:100%;border:0;z-index:2');
      tarjeta.appendChild(marco);
      tarjeta.querySelectorAll('.canal__play, .canal__etiqueta').forEach(function (el) {
        el.remove();
      });
    });
  }

  /* --- Formulario de cotización ----------------------------------------- */
  function iniciarFormulario() {
    var formulario = document.querySelector('[data-formulario-cotizacion]');
    if (!formulario) return;

    var aviso = formulario.querySelector('.aviso-formulario');

    formulario.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!formulario.reportValidity()) return;

      var datos = new FormData(formulario);
      var lineas = [
        'Cotización desde medelauto.cl',
        'Nombre: ' + (datos.get('nombre') || ''),
        'Teléfono: ' + (datos.get('telefono') || ''),
        'Vehículo: ' + (datos.get('vehiculo') || ''),
        'Kilometraje: ' + (datos.get('kilometraje') || 'no indicado'),
        'Servicio: ' + (datos.get('servicio') || ''),
        '',
        (datos.get('detalle') || '')
      ];

      var cuerpo = encodeURIComponent(lineas.join('\n'));
      var asunto = encodeURIComponent('Cotización — ' + (datos.get('servicio') || 'consulta'));

      if (aviso) {
        aviso.hidden = false;
        aviso.textContent = 'Abrimos tu correo con la solicitud lista. Si no se abre, ' +
          'escríbenos a taller@medelauto.cl o llámanos al +56 2 2222 3369.';
        aviso.setAttribute('role', 'status');
      }

      window.location.href = 'mailto:taller@medelauto.cl?subject=' + asunto + '&body=' + cuerpo;
    });
  }

  /* --- Año en el pie ---------------------------------------------------- */
  function iniciarAnio() {
    document.querySelectorAll('[data-anio]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function iniciar() {
    iniciarMenu();
    iniciarCabecera();
    iniciarRevelado();
    iniciarParallax();
    iniciarLetras();
    iniciarPauta();
    iniciarTira();
    iniciarFotoFondo();
    iniciarCanal();
    iniciarFormulario();
    iniciarAnio();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
