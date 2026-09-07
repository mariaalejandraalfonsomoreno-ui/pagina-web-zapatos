# Lumina — Tienda de Sneakers

Sitio estático (HTML/CSS/JS puro, sin frameworks) con catálogo, carrito y pedido por WhatsApp.

## Estructura

```
lumina/
├── index.html      → estructura de la página
├── style.css       → estilos visuales
├── products.js     → TUS PRODUCTOS (edita aquí para agregar/quitar zapatos)
├── script.js       → lógica del carrito y checkout
└── images/         → fotos de los productos
```

## 1. Configurar tu número de WhatsApp

Abre `script.js` y en la línea 6 cambia:

```js
const WHATSAPP_NUMBER = "573000000000";
```

Por tu número real, con código de país y sin espacios ni "+". Ejemplo: `"573001234567"`.

## 2. Agregar o editar productos

Abre `products.js`. Cada zapato es un bloque así:

```js
{
  id: "nombre-unico-sin-espacios",
  name: "Nombre visible del producto",
  category: "superstar",   // o "samba", o crea una nueva
  price: 170000,
  image: "images/mi-foto.jpg",
  sizes: ["35", "36", "37"],
  colors: ["Blanco"]
}
```

Para agregar un producto nuevo:
1. Sube la foto a la carpeta `images/`.
2. Copia un bloque `{ ... }` completo dentro de `products.js`, pégalo, y cambia los datos.
3. Guarda el archivo.

Si creas una categoría nueva (distinta a "superstar" o "samba"), agrégala también como botón de filtro en `index.html`, dentro de `<div class="filters">`:

```html
<button class="filter-chip" data-filter="tu-categoria">Tu Categoría</button>
```

## 3. Ver el sitio en tu computador (antes de publicar)

Simplemente abre `index.html` haciendo doble clic — funciona directo en el navegador, sin necesidad de instalar nada.

## 4. Publicar gratis con GitHub Pages

1. Sube estos archivos a tu repositorio (a la raíz, o a una carpeta y ajusta la ruta).
2. En GitHub, ve a **Settings → Pages**.
3. En "Source", selecciona la rama (`main`) y la carpeta (`/root` o `/docs` según donde subiste los archivos).
4. Guarda. GitHub te dará un link tipo `https://tu-usuario.github.io/tu-repo/` en 1-2 minutos.

## 5. Próximos pasos sugeridos

- Comprimir las fotos (usa [squoosh.app](https://squoosh.app) para que carguen más rápido).
- Agregar más productos a `products.js` a medida que los tengas.
- Cuando tengas nombre definitivo de marca, cambia "Lumina" en `index.html` (etiqueta `<title>` y `.logo`) y en `style.css` si quieres ajustar colores.
- Si más adelante quieres pagos en línea (no solo WhatsApp), lo vemos en otra sesión — eso ya requiere una pasarela de pagos y algo de backend.
