# Vesuviana Cosmetics — Master Design System

**Versión:** 1.0  
**Ámbito:** Vitrina pública, catálogo inteligente, portal B2B, red O2O y administración interna.  
**Dirección:** Herbario clínico de autor.

---

## 1. Tesis de diseño

Vesuviana no se presenta como una marca de belleza más. Se presenta como una casa botánica de formulación capilar: mitad laboratorio, mitad herbario. La interfaz debe sentirse catalogada, precisa y sensorial, nunca rosada, nunca genérica, nunca de plantilla.

La inspiración de referencias como French's Gold y Tintes Universe se traduce en **rigor editorial, jerarquía tipográfica y valor de archivo**, no en copia de layout, color o recursos.

### Idea rectora

> Una lámina botánica del siglo XIX interpretada por un laboratorio clínico contemporáneo.

Tres decisiones gobiernan todo el sistema:

1. **La tipografía es la imagen.** El nombre del producto y la historia botánica ocupan el espacio que normalmente ocuparía una fotografía.
2. **Las líneas importan.** Reglas capilares, divisiones de especímenes, retículas de diagnóstico y contornos SVG construyen la identidad. No se usan sombras difusas como decoración.
3. **Una sola audacia por vista.** El hero asimétrico, la curva Tricomplex o la matriz de diagnóstico pueden ser memorables. El resto permanece disciplinado y silencioso.

### Prohibiciones de dirección

- No usar rosa beauty, degradados pastel, pétalos flotantes ni stock de cabello.
- No usar glassmorphism, cards idénticas, sombras suaves repetidas ni bordes de 24 px en todo.
- No usar emojis como iconos.
- No usar mayúsculas sostenidas en párrafos, navegación o títulos completos. Solo en códigos de espécimen y encabezados técnicos breves.
- No usar la palabra “milagro”, promesas médicas ni resultados garantizados.
- No mostrar accesos visibles de administración.

---

## 2. Paleta maestra

### Casa matriz Vesuviana

| Token | Hex | Uso |
|---|---:|---|
| `--color-bone` | `#FAF8F5` | Fondo principal, papel de herbario |
| `--color-paper` | `#F3EFE8` | Fondo alterno, paneles editoriales |
| `--color-ink` | `#141413` | Texto principal, CTA primario, líneas fuertes |
| `--color-graphite` | `#34332F` | Superficies oscuras secundarias |
| `--color-stone` | `#5C5A55` | Texto secundario accesible |
| `--color-mist` | `#D9D4CA` | Bordes y separadores |
| `--color-veil` | `#ECE7DD` | Rellenos sutiles, estados hover |
| `--color-gold` | `#A87A3F` | Acento botánico decorativo sobre oscuro |
| `--color-gold-deep` | `#8A5A14` | Acento dorado legible sobre fondo hueso |
| `--color-gold-pale` | `#D8BE8C` | Detalle fino, líneas de espécimen |
| `--color-danger` | `#9C2B2B` | Errores de formulario |
| `--color-success` | `#2F6B4F` | Confirmación |

### Contrastes verificados

| Combinación | Ratio | Estado |
|---|---:|---|
| `#141413` sobre `#FAF8F5` | 17.39:1 | AAA |
| `#5C5A55` sobre `#FAF8F5` | 6.50:1 | AA / AAA texto grande |
| `#8A5A14` sobre `#FAF8F5` | 5.58:1 | AA |
| `#2A6F68` sobre `#FAF8F5` | 5.55:1 | AA |
| `#7A1C34` sobre `#FAF8F5` | 9.70:1 | AAA |
| `#141413` sobre `#C88A2B` | 6.26:1 | AA |
| `#A87A3F` sobre `#141413` | 4.85:1 | AA |
| `#141413` sobre `#DCEBE8` | 15.00:1 | AAA |
| `#141413` sobre `#F3E5CB` | 14.82:1 | AAA |
| `#141413` sobre `#EBD7DC` | 13.42:1 | AAA |

**Regla dura:** `#C88A2B` no se usa como color de texto sobre hueso ni como fondo de texto blanco. Para texto Oleo's se usa `#6F4710` o `#8A5A14`; para botones se usa el ámbar con texto `#141413`.

---

## 3. Temas por sub-marca

Los temas se aplican con el atributo `data-brand` en la sección o en un ancestro. Ningún componente debe escribir colores de marca directamente; consume variables semánticas.

### Defilé — mantenimiento, cutícula y piel

| Token | Hex |
|---|---:|
| `--brand-primary` | `#2A6F68` |
| `--brand-deep` | `#143E3A` |
| `--brand-soft` | `#6FA39D` |
| `--brand-wash` | `#DCEBE8` |
| `--brand-faint` | `#F1F7F5` |
| `--brand-ink` | `#143E3A` |
| `--brand-graphic` | `#2A6F68` |
| `--brand-on-primary` | `#FAF8F5` |

Lectura: agua clínica, salvia, fibra humectada. La interfaz debe respirar como un baño de crema: amplia, limpia, continua.

### Tricomplex — corteza profunda y rescate estructural

| Token | Hex |
|---|---:|
| `--brand-primary` | `#7A1C34` |
| `--brand-deep` | `#3C0A19` |
| `--brand-soft` | `#A65A6D` |
| `--brand-wash` | `#EBD7DC` |
| `--brand-faint` | `#F8EFF1` |
| `--brand-ink` | `#5D1227` |
| `--brand-graphic` | `#7A1C34` |
| `--brand-on-primary` | `#FAF8F5` |

Lectura: vino clínico, precisión de ampolla, rescate. La densidad puede aumentar; las líneas se vuelven más finas y los datos más presentes.

### Oleo's — escudo exterior lipídico

| Token | Hex |
|---|---:|
| `--brand-primary` | `#C88A2B` |
| `--brand-deep` | `#6F4710` |
| `--brand-soft` | `#DFB570` |
| `--brand-wash` | `#F3E5CB` |
| `--brand-faint` | `#FBF6EC` |
| `--brand-ink` | `#5C3A0E` |
| `--brand-graphic` | `#C88A2B` |
| `--brand-on-primary` | `#141413` |

Lectura: ámbar, aceite, luz transmitida. El brillo se representa con líneas y superficies, no con degradados metálicos.

### Transición de tema

- Duración: 360 ms.
- Propiedades: color, background-color, border-color, fill y stroke.
- Sin cambios de layout.
- Con `prefers-reduced-motion: reduce`, el cambio es instantáneo.
- El estado activo de marca nunca depende solo del color: se añade subrayado, borde y etiqueta textual.

---

## 4. Tipografía

### Familias

| Rol | Familia | Pesos | Uso |
|---|---|---|---|
| Display / editorial | **Cormorant Garamond** | 300, 400, 500, 600, itálica 400 | H1, H2, nombres de producto, citas, historia, cifras editoriales |
| Técnica / UI | **Plus Jakarta Sans** | 400, 500, 600 | Navegación, cuerpo, filtros, fichas, tablas, formularios, botones |

No se añade una tercera familia. Los datos numéricos usan Plus Jakarta Sans con `font-variant-numeric: tabular-nums`.

### Escala fluida

| Token | Tamaño | Altura de línea | Tracking | Uso |
|---|---|---|---|---|
| `--text-display-2xl` | `clamp(4rem, 9.5vw, 9rem)` | 0.88 | -0.045em | Hero principal |
| `--text-display-xl` | `clamp(3rem, 6.5vw, 6.5rem)` | 0.92 | -0.035em | Título de apertura de página |
| `--text-display-lg` | `clamp(2.5rem, 4.8vw, 4.5rem)` | 0.96 | -0.03em | Secciones editoriales |
| `--text-display-md` | `clamp(2rem, 3.2vw, 3.25rem)` | 1.02 | -0.02em | Títulos de módulo |
| `--text-display-sm` | `clamp(1.625rem, 2.2vw, 2.25rem)` | 1.08 | -0.015em | Nombre de producto destacado |
| `--text-title` | `1.25rem` | 1.25 | -0.01em | Título de card, subtítulo |
| `--text-body-lg` | `1.125rem` | 1.65 | 0 | Introducción, párrafo editorial |
| `--text-body` | `1rem` | 1.6 | 0 | Cuerpo y UI |
| `--text-small` | `0.875rem` | 1.5 | 0.005em | Metadatos, ayudas |
| `--text-micro` | `0.75rem` | 1.4 | 0.06em | Códigos, etiquetas técnicas |
| `--text-nano` | `0.6875rem` | 1.35 | 0.12em | Código de espécimen, numeración |

### Reglas de composición

- Títulos display: peso 400 o 500. La itálica se reserva para nombres botánicos, deseos o citas, nunca para una palabra suelta decorativa dentro de un titular.
- Cuerpo: máximo 68 caracteres por línea. Texto serif editorial: 72 caracteres y `line-height` 1.65.
- Etiquetas técnicas en mayúsculas: solo `--text-nano`, máximo 4 palabras, con tracking 0.12em. Nunca párrafos completos.
- No justificar texto.
- No usar gradientes de texto.
- Los números de precio usan tabular-nums y separador de miles colombiano.

---

## 5. Espaciado, retícula y forma

### Escala

Base 4 px, ritmo principal de 8 px.

| Token | Valor |
|---|---:|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 48px |
| `--space-8` | 64px |
| `--space-9` | 96px |
| `--space-10` | 128px |
| `--space-11` | 160px |

Secciones públicas: `clamp(80px, 10vw, 160px)` de padding vertical. Bloques densos de datos: 48–72 px.

### Retícula

- Ancho máximo de contenido: 1440 px.
- Ancho editorial: 760 px.
- Ancho de lectura: 680 px.
- 12 columnas, gutter fluido `clamp(16px, 2vw, 32px)`.
- Márgenes laterales: `clamp(20px, 5vw, 80px)`.
- Hero: 7 columnas de tipografía / 5 columnas de lámina SVG; alternar el peso visual entre secciones.
- Catálogo: sidebar 280 px + grid fluido de 2–3 columnas en desktop. En 1024 px, sidebar colapsable.
- Tablas técnicas: scroll horizontal contenido con primera columna fija; en móvil, tarjetas de diagnóstico apiladas.

### Forma

- Radio base: 2 px.
- Radio medio: 6 px solo en controles de formulario.
- Píldoras: únicamente filtros activos y contadores.
- Bordes: 1 px `--color-mist`; líneas fuertes 1 px `--color-ink`.
- Sombras: solo para capas flotantes (menú, modal, carrito). `0 24px 80px -32px rgba(20,20,19,0.32)`.
- No hay cards flotantes sobre fondos decorativos. Las cards se separan con reglas y cambios de papel.

### Motivos gráficos

1. **Lámina de espécimen:** marco de línea fina con esquina de registro y código de producto.
2. **Corte transversal del cabello:** tres capas concéntricas rotuladas; se usa en la anatomía interactiva.
3. **Regla capilar:** línea horizontal con marcas y microetiquetas; sustituye divisores genéricos.
4. **Arco de herbario:** ventana de arco suave usada una sola vez por vista para enmarcar una ilustración.
5. **Sello de lote:** pequeño círculo doble con código y año; se usa como detalle, no como icono repetido.

---

## 6. Componentes y patrones

### Navbar omnicanal

- Altura 76 px desktop, 64 px móvil.
- Fondo hueso con 94 % de opacidad tras scroll; borde inferior de 1 px.
- Marca a la izquierda, navegación central, acciones a la derecha.
- Enlaces: Catálogo, Fórmulas, Profesionales, Tiendas.
- Acciones: buscador, carrito con contador, CTA “Compra mayorista”.
- Estado activo: regla inferior de 2 px y peso 600. No solo color.
- Menú móvil a pantalla completa tipo índice de herbario, no drawer genérico.

### Botones

| Variante | Fondo | Texto | Borde | Uso |
|---|---|---|---|---|
| Primario | `--color-ink` | `--color-bone` | ninguno | Acción principal de página |
| Marca | `--brand-primary` | `--brand-on-primary` | ninguno | Comprar en contexto de marca |
| Secundario | transparente | `--color-ink` | 1 px ink | Compra mayorista, acciones alternas |
| Fantasma | transparente | ink | ninguno | Enlaces de navegación |
| Peligro | `--color-danger` | blanco | ninguno | Confirmaciones destructivas |

- Altura mínima: 48 px. En tablas densas, 40 px con área táctil expandida.
- Padding horizontal: 24 px.
- Tipografía: Plus Jakarta Sans 600, 14 px, sentence case.
- Hover: invertir fondo/texto o desplazar 1 px la regla; sin rebote.
- Focus: contorno de 2 px `--brand-primary` con offset 3 px.
- Iconos Lucide a 18 px, alineados al texto, decorativos con `aria-hidden`.

### Card de producto con doble CTA

No es una card de ecommerce estándar. Es una ficha de herbario con dos salidas comerciales.

Estructura:

```text
┌──────────────────────────────────────┐
│ VES-DEF-014              [destacado] │
│                                      │
│        ilustración SVG               │
│                                      │
│ Defilé                               │
│ Champú Detox Botánico                │
│ 300 ml · cuero cabelludo             │
│                                      │
│ Biotina · Keratina · Seda            │
│ Limpieza profunda sin agredir la     │
│ cutícula. Frecuencia 2–3 por semana. │
│                                      │
│ $64.900              [ Comprar ]     │
│ [ Compra mayorista ]                 │
└──────────────────────────────────────┘
```

- Fondo `--brand-faint` o hueso, borde 1 px.
- Ilustración SVG en un área de 4:3 con línea de registro y retícula tenue.
- Código de espécimen en la esquina superior; precio en tabular-nums.
- `Comprar`: botón de marca, lleno, ancho completo o 60 %.
- `Compra mayorista`: botón secundario con borde, ancho completo en móvil.
- Hover: la ilustración se desplaza 2 px y la línea superior se intensifica. No se eleva toda la card.
- La card completa no es un enlace para evitar conflicto con los dos CTA. El título sí enlaza al detalle.

### Filtros del catálogo

- Título “Índice de fórmulas” en serif.
- Grupos con borde superior fino y contador.
- Checkboxes cuadrados de 16 px, no switches.
- Chips solo para filtros aplicados; incluyen “Quitar” accesible.
- Buscador con icono de lupa y atajo `/`.
- Estado vacío: explicar qué combinación no tiene resultados y ofrecer “Restablecer filtros”.
- Historial de filtros: silencioso, acción “Volver al filtro anterior”.

### Matriz de diagnóstico

- Tabla real con `caption` visible u oculto accesible.
- Encabezados técnicos en `--text-micro`, sentence case, fondo `--color-veil`.
- Filas separadas por 1 px; no zebra.
- Primera columna con nombre de línea y punto de color; el color nunca es el único identificador.
- En móvil, cada fila se convierte en ficha con etiquetas.
- La matriz se genera desde `string[][]`; el componente no debe codificar filas.

### Anatomía interactiva

- Diagrama SVG de tres capas concéntricas: corteza, cutícula/cuero cabelludo, escudo exterior.
- Al seleccionar una capa, se actualiza una ficha con línea, activos y gesto de uso.
- Navegación por teclado con tabs semánticos y `aria-selected`.
- En reducción de movimiento, sin transición entre estados.

### Curva Tricomplex

- SVG dibujado a mano, no librería de charts.
- Ejes: tiempo (0–8 semanas) y resistencia/elasticidad (0–100).
- Línea principal borgoña, área de confianza lavanda muy tenue, puntos de protocolo.
- Animación única de trazo al entrar en viewport; se desactiva con reduced motion.
- El gráfico debe incluir resumen textual y valores accesibles.

### Cinta de confianza

- Fondo ink, texto hueso.
- Cuatro indicadores; desplazamiento continuo lento.
- Pausa en hover, focus y al tocar.
- Respeta `prefers-reduced-motion` mostrando una retícula estática.
- No usar iconos genéricos de cohete o medalla; usar Lucide `Truck`, `ShieldCheck`, `Headset`, `MapPin` con stroke 1.5.

### Footer corporativo

- Fondo ink, tipografía hueso.
- Columnas: casa matriz, líneas, servicio, legal.
- Leyenda final obligatoria: `Contacto corporativo | Vesuviana Cosmetics | Desarrollo y Estrategia Digital`.
- El texto `Desarrollo y Estrategia Digital` y el símbolo `©` son los únicos disparadores del acceso discreto.
- Sin enlace “Admin”, sin icono de llave, sin mención en el menú.
- El gesto abre `/vesuviana_vault_login`; no autentica por sí mismo.
- La ruta de acceso debe estar protegida en servidor; el gesto es solo un mecanismo de descubrimiento.

### Administración

- Estética de mesa de archivo, no dashboard SaaS.
- Fondo hueso, barra lateral de 240 px con índice.
- Módulos: Productos, Asesores B2B, Tiendas O2O, Leads.
- Tablas densas, acciones de fila accesibles, confirmación explícita para eliminar.
- Estado vacío con acción primaria.
- Formularios con etiquetas visibles, errores inline y resumen de errores.
- Sin acceso visible desde la vitrina.

---

## 7. Sistema de ilustración SVG sin fotografía

Todos los productos usan `TechnicalSvgPlaceholder`. Debe ser vectorial, accesible y temático.

### Variantes obligatorias

| Variante | Uso | Elementos |
|---|---|---|
| `shampoo_bottle` | Champús y acondicionadores | Botella alta, bomba, líneas de graduación, etiqueta tipográfica |
| `mask_jar` | Mascarillas y baños de crema | Tarro bajo, tapa, textura de ondas, cuchara |
| `technical_ampoule` | Ampollas Defilé y Tricomplex | Ampollas en pares, cuello quebrado, líquido, marcas de dosis |
| `dropper_bottle` | Sérums | Frasco cuadrado, gotero, gota suspendida |
| `oil_flask` | Óleos y fluidos | Frasco oval, aceite dorado, burbujas, sello |
| `molecular_structure` | Complejos y educación | Nodos, enlaces, hexágonos botánicos |

### Reglas

- Trazo principal 1.5 px; detalles 0.75 px.
- Sin gradientes fotográficos. Se permiten uno o dos rellenos planos translúcidos.
- Paleta: `currentColor`, `--brand-graphic`, `--brand-wash`, `--color-paper`.
- Fondo con retícula de 8 px muy tenue y marcas de registro.
- Cada ilustración incluye `role="img"` y `aria-label` descriptivo cuando transmite información; si es decorativa, `aria-hidden`.
- No usar texto incrustado en SVG para contenido esencial.
- Animación opcional: gota que cae una vez, brillo lineal que recorre el frasco. Nunca en bucle llamativo.

### Composición de lámina

```text
┌──────────────────────────────┐
│ VES.014                 °    │
│                              │
│          ╭───╮               │
│          │   │               │
│          ╰───╯               │
│                              │
│  ─────────────────────────   │
│  LÁMINA 03 / FÓRMULA ACTIVA  │
└──────────────────────────────┘
```

---

## 8. Movimiento

### Tokens

| Token | Valor | Uso |
|---|---|---|
| `--duration-fast` | 150ms | Hover, focus |
| `--duration-base` | 240ms | Controles, tema |
| `--duration-slow` | 420ms | Expansión, tabs |
| `--duration-cinematic` | 760ms | Entrada de hero |
| `--ease-standard` | `cubic-bezier(0.22, 1, 0.36, 1)` | General |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Salidas |

### Principios

- Una secuencia de entrada por página. No animar cada sección al hacer scroll.
- La entrada del hero: opacidad 0→1, `translateY` 16 px→0, 760 ms, stagger 60 ms para tres elementos.
- Cambio de tema de marca: crossfade de color 360 ms, sin reflow.
- Hover en cards: 2 px de desplazamiento de la ilustración y cambio de borde, 180 ms.
- Carrusel: transición de 520 ms, controles visibles, pausa al enfocar y reduced motion.
- Sin parallax, sin scroll-jacking, sin contadores animados.
- `prefers-reduced-motion`: elimina transformaciones y animaciones no esenciales, conserva cambios de estado.

---

## 9. Accesibilidad y calidad

- Contraste mínimo 4.5:1 para texto normal y 3:1 para texto grande/UI.
- Focus visible universal: 2 px, offset 3 px, nunca eliminado.
- Objetivos táctiles de 44×44 px mínimo.
- HTML semántico: `nav`, `main`, `section` con `aria-labelledby`, `footer`, `table`.
- Un solo `h1` por página.
- Skip link visible al enfocar.
- Todos los formularios con `label`, ayuda y error asociados por `aria-describedby`.
- Errores con texto, no solo borde rojo.
- Carrusel y cinta con controles de pausa/acceso a contenido estático.
- El color de marca no es el único indicador de estado.
- Enlaces subrayados en cuerpo de texto.
- Imágenes SVG decorativas con `aria-hidden`; informativas con etiqueta.
- Responsive verificado a 375, 768, 1024, 1440 y 1920 px.
- Sin scroll horizontal de página. Solo tablas y cintas dentro de contenedores controlados.
- Probado con teclado, reduced motion y zoom al 200 %.
- Los precios y nombres no se truncan en mobile.
- La compra mayorista pre-filtra el producto y crea un lead; no simula una compra B2C.
- El gesto admin no es autenticación. El login del vault debe validar credenciales en servidor y proteger `/dashboard` con sesión.

---

## 10. Tono de contenido

### Personalidad

Botánica, precisa, serena. Habla como una formuladora que conoce la fibra capilar y respeta a quien la usa. No exagera. No infantiliza. No usa jerga vacía.

### Reglas de copy

- Sentence case en todo.
- Verbos concretos: “sella”, “equlibra”, “protege”, “acondiciona”.
- Beneficio + mecanismo + condición de uso.
- Especificar frecuencia, cantidad o contexto cuando exista.
- Precios en COP con separador de miles.
- CTA con resultado: “Comprar”, “Hablar con un asesor”, “Ver tiendas”, “Solicitar catálogo mayorista”.
- Errores: qué pasó y cómo corregirlo, sin disculpas vacías.
- Estados vacíos: una frase útil y una acción.
- Evitar “transforma tu vida”, “cabello perfecto”, “fórmula mágica”.

### Ejemplo de ficha

> **Champú Detox Botánico**  
> Limpieza profunda para cuero cabelludo con acumulación de residuos. Biotina, keratina y extracto de romero equilibran la fibra sin resecar la cutícula. Uso 2–3 veces por semana; masajear 60 segundos y enjuagar con agua tibia.

---

## 11. Aplicación por vista

### Inicio

- Hero asimétrico con lámina SVG botánica y carrusel de tres relatos, no de imágenes de stock.
- Selector de marca que reescribe el tema de toda la sección y muestra tres productos.
- Anatomía capilar y curva Tricomplex como momento interactivo principal.
- Matriz de diagnóstico desde `string[][]`.
- Cinta de confianza en ink.
- Historia, ingredientes y reseñas en composición editorial de dos columnas.

### Catálogo

- Encabezado tipo índice de herbario con contador de fórmulas.
- Sidebar de filtros; en móvil, panel expandible.
- Grid de fichas de espécimen con doble CTA.
- Resultados vacíos útiles.
- Carrito lateral y estado de compra visibles.

### Portal B2B

- Explicación de beneficios y requisitos en formato de dossier.
- Selector geográfico por departamento/región.
- Directorio de asesores con tarjetas de perfil, cobertura, canales y CTA “Hablar con este asesor”.
- El producto de interés viaja preseleccionado desde el catálogo.

### Tiendas O2O

- Puente digital-físico explicado sin jerga.
- Buscador y filtro por departamento.
- Fichas de tienda con dirección, contacto, horario y mapa.
- Mapa estático estilizado si no hay proveedor; nunca un iframe vacío.
- CTA “Trazar ruta” con enlace externo y “Llamar” con `tel:`.

### Admin

- Login silencioso, sin marca llamativa, con gestor de contraseñas habilitado.
- Dashboard de archivo, no de analítica decorativa.
- Módulos CRUD de productos, asesores y tiendas.
- Gestión de leads B2B en cola FIFO.
- Confirmaciones y errores claros.

---

## 12. Checklist de entrega

- [ ] Tokens aplicados solo mediante variables semánticas.
- [ ] Los cuatro temas comparten estructura y cambian solo la paleta.
- [ ] Contraste verificado en todos los estados.
- [ ] Focus visible en todos los controles.
- [ ] Navegación completa por teclado.
- [ ] Reduced motion respetado.
- [ ] Responsive a 375 px sin scroll horizontal.
- [ ] Sin comentarios en el código TypeScript/React.
- [ ] Nombres de archivo y símbolos en `snake_case`; clases e interfaces en `PascalCase`.
- [ ] Sin fotos de stock; todas las fichas usan SVG técnico.
- [ ] Sin rastro visible del acceso admin.
- [ ] La compra mayorista crea un lead y conserva el producto de interés.
- [ ] La matriz de diagnóstico proviene de `string[][]`.
- [ ] Catálogo, historial y leads usan las estructuras manuales.
