📂 proyecto-libros/
│── 📂 assets/
│   ├── 📂 css/
│   │   ├── styles.css          # Estilos generales
│   │   ├── temas.css           # Estilos dinámicos por tema (medieval, japonés, etc.)
│   │   ├── animaciones.css     # Animaciones y efectos visuales
│   ├── 📂 js/
│   │   ├── main.js             # Funcionalidad de la página principal
│   │   ├── detalle.js          # Funcionalidad de la página de detalles
│   │   ├── grupos.js           # Funcionalidad de la página de grupos
│   │   ├── colores.js          # Extrae los colores de las portadas (Color Thief)
│   ├── 📂 img/                 # Carpeta de imágenes (portadas de libros)
│── 📂 data/
│   ├── books.json              # Base de datos de libros
│── index.html                  # Página principal (Lista de libros, búsqueda, filtros)
│── detalle.html                # Página de detalles de un libro
│── grupos.html                 # Página de grupos/colecciones
│── legal.html                  # Página de archivos legales
│── README.md                   # Explicación del proyecto


✅ Diseño Futurista + Animaciones

Uso de CSS con efectos de neón, glassmorphism y transiciones suaves.
Animaciones con GSAP y efectos hover dinámicos.
✅ Detección de colores de las portadas

Usaremos JavaScript + la librería "Color Thief" para extraer los colores principales de la portada y aplicar un esquema de colores dinámico a cada libro.
✅ Búsqueda, Filtros y Ordenación en index.html

Buscador en tiempo real.
Filtros por colección, autor, género.
Ordenación (por fecha, título, etc.).
✅ Libros relacionados en detalle.html

Se mostrarán los de la misma colección.
También por palabras clave desde books.json.
✅ grupos.html con diseño sobrepuesto y atractivo

Libros apilados de forma dinámica, con animaciones al pasar el mouse.
Posible uso de CSS Grid y efectos Parallax para hacerlo más llamativo.
✅ Mobile Friendly (Responsive Design)

Diseño adaptable a móviles.
Navegación optimizada para pantallas táctiles.
✅ Pie de Página

Enlaces a redes sociales, contacto y archivos legales.


🛠️ Sistema de Temas Dinámicos (Ambientación por Libro)
Cada libro tendrá un "tema" en books.json, por ejemplo:

Medieval → Colores oscuros, fuentes góticas, texturas de pergamino.
Japonés → Colores rojos/blancos, pinceladas tipo sumi-e.
Espacio → Fondo con estrellas, neón azul, efecto de galaxia.
Vikingos → Madera, runas, colores tierra.
Amor → Tonos pastel, transiciones suaves, brillos.
Nuclear → Verdes y amarillos neón, glitch, partículas radioactivas.
Supervivencia → Naturaleza, verdes oscuros, efectos de desgaste.
📌 Cómo funcionará:

En books.json, cada libro tendrá una propiedad "tema" con su categoría.
JS usará CSS dinámico para cambiar el diseño según el libro seleccionado.
Se usará Color Thief para tomar el color predominante de la portada y hacer ajustes automáticos.
Algunas animaciones específicas para cada tema.
