# Vesuviana Cosmetics · Credenciales y decisiones de diseño

Documento de referencia del sitio web de Vesuviana Cosmetics. Última actualización: octubre 2026.

## 1. Acceso al panel

- Sitio público: `/`
- Acceso administrativo: `/admin`
- Inicio de sesión: `/admin/login`
- Recuperación de contraseña: `/admin/recuperar`

El enlace al panel está en el pie de página del sitio público. No se muestra en el menú principal.

### Usuarios iniciales

| Persona | Correo | Contraseña | Rol |
| --- | --- | --- | --- |
| Eduardo | `eduardo@vesuvianacosmetics.com` | `Vesuviana2026!` | Superadministrador |
| Sandra Nino | `sandra.nino@vesuvianacosmetics.com` | `Moderadora2026!` | Moderadora de contenido |

Estas credenciales corresponden a la semilla de fábrica (`seed_version: 2.0.0`). Si se restauran los datos de fábrica desde el panel, vuelven a quedar activas.

> Importante: las contraseñas se almacenan como hash SHA-256 con salt individual. El sitio es una aplicación frontend con `localStorage`; este esquema sirve para el prototipo y la gestión interna, pero no sustituye la autenticación de un backend en producción.

## 2. Roles y permisos

### Superadministrador

- Gestiona usuarios: crea moderadores, restablece contraseñas y suspende cuentas.
- Consulta la auditoría de cambios.
- Supervisa el estado general del sitio.
- No edita contenido público ni gestiona catálogo desde el panel.

### Moderador de contenido

- Gestiona el carrusel de portada.
- Gestiona marcas y categorías.
- Crea, edita y elimina productos.
- Gestiona asesores mayoristas.
- Gestiona distribuidores autorizados.
- No puede gestionar usuarios, auditoría ni restaurar la fábrica.

La navegación del panel se filtra por rol. Las rutas de contenido están protegidas por `ModeratorRoute` y las de usuarios/auditoría por `SuperAdminRoute`. Las validaciones de permisos se aplican igualmente en las mutaciones, por lo que no basta con ocultar enlaces.

## 3. Sesión y seguridad

- La sesión se guarda en `localStorage` con la clave `vesuviana_admin_session_v2`.
- El estado del sitio se guarda con la clave `vesuviana_cms_state_v2`.
- Al restaurar la fábrica, la sesión vuelve al superadministrador.
- Si una cuenta es suspendida mientras tiene sesión abierta, el panel muestra una pantalla de cuenta suspendida y permite cerrar sesión.
- El hash se calcula como `SHA-256(salt + ":" + contraseña)`.
- Los salts iniciales son `vesuviana-eduardo-2026` y `vesuviana-sandra-2026`.
- La recuperación de contraseña es informativa: no envía correos. El superadministrador debe restablecer la clave desde `/admin/usuarios`.
- Para producción se recomienda migrar autenticación, sesiones y datos a un backend, usar un algoritmo de hash lento (Argon2 o bcrypt) y rotar las credenciales iniciales.

## 4. Identidad visual

### Posicionamiento

Vesuviana Cosmetics se presenta como una casa venezolana de belleza capilar que reúne tres marcas: Defile, Oleos y Tricomplex. El lenguaje público debe hablar siempre de cabello, fibra capilar, cuero cabelludo, tratamientos y rutinas capilares.

No usar en contenido público: “serum”, “piel”, “facial”, “dermocosmética”, “fórmulas”, “El ritual” ni “Selección Vesuviana”.

### Paleta

| Token | Hex | Uso |
| --- | --- | --- |
| `cream` | `#FAF6F0` | Fondo principal |
| `sand` | `#F2E9DE` | Bloques secundarios y superficies suaves |
| `ink` | `#141312` | Texto principal y secciones oscuras |
| `gold` | `#B58938` | Detalles y bordes dorados |
| `gold-bright` | `#D4AF37` | Acentos sobre fondos oscuros |
| `gold-deep` | `#7A5A20` | Acentos sobre fondos claros |
| `stone` | `#6B645B` | Texto secundario |
| `line` | `#E4D9C9` | Bordes y separadores |
| `success` | `#2F6B4F` | Estados positivos |
| `danger` | `#A33131` | Errores y acciones destructivas |

### Tipografía

- Títulos: Cormorant Garamond, serif editorial.
- Texto e interfaz: Plus Jakarta Sans.
- Títulos de portada con escala fluida, interlineado compacto y tracking negativo.
- Etiquetas en mayúsculas pequeñas con tracking amplio.

### Componentes y formas

- Radio principal de tarjetas: `1.5rem`.
- Bordes finos color arena.
- Botones tipo píldora.
- Sombras suaves y difusas, nunca duras.
- Fotografía protagonista, con overlays oscuros graduales para legibilidad.

## 5. Decisiones de contenido y estructura

### Portada

- Hero de aproximadamente 72–78% de la altura de pantalla en escritorio.
- Sin botones dentro del hero: toda la diapositiva es clicable hacia `/catalogo`.
- Los controles del carrusel quedan fuera del enlace para evitar conflictos.
- Se mantiene el autoplay y la navegación manual.
- “Nuestras marcas” muestra logos y tarjetas sin conteos de productos; está preparado para incorporar nuevas marcas.
- Se conserva “Nuestra historia” con fotografía real y valores de marca.
- “Productos destacados” usa un carrusel horizontal tipo streaming: 4 tarjetas visibles en escritorio, 2 en tablet y 1 en móvil; se muestran 8 productos.
- Se eliminaron las secciones “El ritual” y “Selección Vesuviana”.
- Mayoristas y distribuidores se unificaron en una sola sección “Red autorizada” con dos accesos: “Ventas al mayor” y “Distribuidores”.

### Catálogo

- El enlace del menú se llama “Catálogo”.
- El encabezado usa “Todos los productos”, no “Todas las fórmulas”.
- Se mantienen filtros por marca, categoría y búsqueda.
- Los packshots transparentes se muestran con `object-contain` para no recortar envases.

### Ficha de producto

- Tres beneficios principales.
- CTA principal por WhatsApp.
- Accesos secundarios a “Distribuidores” y “Ventas al mayor”.
- Se eliminó por completo la figura de asesor en jefe y la Gerencia Nacional.
- Sección de productos relacionados sin lenguaje de “ritual”.

### Ventas al mayor

- El único CTA principal es “Buscar mi asesor”.
- Se eliminó por completo la figura de asesor en jefe y la Gerencia Nacional.
- Se eliminó el bloque “Perfil mayorista”.
- Se conserva “Cómo empezar” en tres pasos.
- Los asesores se filtran por estado y búsqueda.
- La red cubre 10 estados, la misma cantidad que el directorio de distribuidores.

### Navegación y pie

- “Área privada” se retiró del navbar y del menú móvil.
- El acceso administrativo vive en el pie de página.
- El pie incluye el crédito discreto “Diseño web · lulujax” con enlace a `https://lulujax.netlify.app`.

## 6. Fotografía y recursos

- Las 38 fotos originales están en `public/`.
- Los packshots con transparencia están en `public/productos/`.
- Las fotos de marca se muestran completas con `object-contain` sobre un fondo desenfocado.
- El manifiesto central de imágenes es `src/core/data/vesuviana_media.ts`.
- Logos:
  - Defile: `5118493774723091967.jpg` (oscuro) y `5118493774723091969.jpg` (claro).
  - Oleos: `5118493774723091949.jpg` (icono) y `5118493774723091959.jpg` (wordmark).
  - Tricomplex: sin logo disponible; se usa wordmark tipográfico en las tarjetas.
- Campañas principales: `5118493774723091970.jpg` y `5118493774723091971.jpg`.
- El PDF fuente es `public/CATALOGO DEFILE PARA IMPPRIMIR 2026 (1).pdf`.
- `public/catalogo-pdf/` conserva renders de páginas revisadas y no se usa en el sitio actualmente.

## 7. Arquitectura relevante

| Archivo | Responsabilidad |
| --- | --- |
| `src/core/data/vesuviana_media.ts` | Manifiesto de imágenes y logos |
| `src/core/data/vesuviana_initial_seed.ts` | Semilla de marcas, categorías, productos, asesores, distribuidores y usuarios |
| `src/core/data/vesuviana_landing_content.ts` | Copy público, navegación y testimonios |
| `src/core/services/auth_service.ts` | Salt, hash y verificación de contraseñas |
| `src/core/store/vesuviana_app_provider.tsx` | Sesión, login/logout y mutaciones |
| `src/core/validation/vesuviana_validation_service.ts` | Validaciones y permisos |
| `src/components/layout/site_navbar.tsx` | Navegación pública |
| `src/components/layout/site_footer.tsx` | Acceso administrativo y crédito |
| `src/components/public/hero_carousel.tsx` | Hero clicable y controles |
| `src/pages/public/home_page.tsx` | Estructura de la portada |
| `src/pages/public/catalog_page.tsx` | Catálogo y filtros |
| `src/pages/public/product_detail_page.tsx` | Ficha de producto |
| `src/pages/public/wholesale_page.tsx` | Ventas al mayor |
| `src/pages/admin/admin_login_page.tsx` | Inicio de sesión |
| `src/pages/admin/admin_users_page.tsx` | Gestión de usuarios y claves |

## 8. Desarrollo y verificación

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

El build de producción compila correctamente. Vite advierte que el bundle principal supera los 500 kB; es una advertencia de tamaño, no un error.

## 9. Limitaciones conocidas

- No hay backend ni envío real de correos.
- Los datos persisten solo en el navegador del usuario.
- Si se borra `localStorage`, el sitio vuelve a la semilla de fábrica.
- La autenticación es adecuada para un prototipo interno, no para producción sin backend.
- Las imágenes y el PDF pesan varios megabytes; conviene optimizar formatos y tamaños antes de publicar en producción.
