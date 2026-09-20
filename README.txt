3R BURGERS — Cartagena, Zona Sur

Este sitio reproduce el efecto de scroll cinematográfico (parallax + zoom lento
por escena, numeración de escenas, marquee, barra de progreso, loader inicial)
más un hero con video: videos/hero.mp4 avanza y retrocede frame a frame según
el scroll (scroll-scrubbing), en vez de reproducirse solo.

VIDEO DEL HERO
videos/hero.mp4 es el video real (generado con OpenArt) donde la hamburguesa
se arma, aparece el combo con papas y batido, y se empaca en la caja "3R".
Para cambiarlo, reemplazá ese archivo por otro video (misma idea: algo que
"avance" de principio a fin) y ajustá el alto de la sección .scrub en
style.css si el video es más largo o corto que 7 segundos.
IMPORTANTE: el scroll-scrubbing necesita que el servidor soporte "Range
requests" (pedir un pedacito del video, no todo de una vez). El servidor de
pruebas (.claude/serve.js) ya lo soporta. GitHub Pages, Vercel y Netlify
también lo soportan de forma nativa, así que funciona igual al publicarlo.

FOTOS ACTUALES
Por ahora las fotos (combo, ingredientes, burger-01/02/03, final) son imágenes
generadas por IA en images/*.jpg, de relleno con el estilo dramático que
pediste (splash de salsa, fondo negro). Cuando tengas fotos reales de las
hamburguesas de 3R, reemplazá cada .jpg por tu foto real (mismo nombre, o
actualizá el data-src correspondiente en index.html si cambia la extensión).

Las imágenes se cargan de forma perezosa (solo cuando te acercás a esa
sección) para que el sitio pese poco y no se trabe en celulares.

EDITAR DATOS
Todo el texto, precios ($00.000), WhatsApp e Instagram está en index.html.

WHATSAPP
Ya configurado: https://wa.me/573107907194

INSTAGRAM
Ya configurado: https://instagram.com/rigorincon_25

PUBLICAR
Sube estos archivos a Vercel, Netlify, GitHub Pages o cualquier hosting
estático. No necesita servidor: es HTML + CSS + JavaScript puro.
