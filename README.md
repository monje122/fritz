# 🌽 FRITZ - Landing Page Scrollytelling Interactiva

Landing page inmersiva de alto impacto inspirada en la experiencia de salsas Fritz (Maíz, Cheddar y Catálogo completo). Diseñada y optimizada específicamente para sentirse nativa y fluida a 60 FPS en **Android, iPhone y PC**.

---

## 📱 Demostración y Compatibilidad Multiplataforma

| Plataforma | Optimización Implementada |
| :--- | :--- |
| **iPhone (iOS Safari)** | • Altura dinámica con `100dvh` (evita saltos al ocultar la barra de URL de Safari).<br>• Soporte de servidor HTTP 206 (Partial Content / Byte Ranges).<br>• Respeto a las zonas seguras (`env(safe-area-inset-top)` / `bottom`).<br>• Gestos táctiles de inercia y DPR escalado para Retina. |
| **Android (Chrome / Samsung Internet)** | • Motor de renderizado en Canvas interpolado (lerp 60fps) sin caídas de frames.<br>• Vibración háptica nativa (`navigator.vibrate`) en los hitos y cambios de sabor.<br>• Touch-friendly con áreas de toque mínimas de 44px. |
| **PC / Mac (Escritorio)** | • **Modo Cine Widescreen**: La botella en el centro con iluminación ambiental reactiva a los colores de la escena (Verde Maíz ➔ Oro Cheddar ➔ Estudio Oscuro).<br>• HUD lateral interactivo con radar de sabor, maridaje y ficha nutricional.<br>• **Simulador Móvil integrado**: Botón para alternar entre vista Cine de escritorio y marco de teléfono móvil en un solo clic.<br>• Navegación por teclado (Flechas ↑/↓, Barra espaciadora, AvPág/RePág) y rueda del ratón suavizada. |

---

## 🚀 Cómo Iniciar el Proyecto

El servidor ya se encuentra corriendo localmente en:
👉 **[http://localhost:8080](http://localhost:8080)** o **[http://127.0.0.1:8080](http://127.0.0.1:8080)**

Para iniciarlo manualmente en cualquier momento:
```bash
cd C:\Users\USUARIO\.gemini\antigravity\scratch\fritz-scrollytelling
node server.js
```

### Para probar en tu teléfono real (iPhone / Android):
1. Asegúrate de que tu teléfono y tu PC estén en la misma red Wi-Fi.
2. Abre la consola y averigua tu IP local (ej. `ipconfig` -> `192.168.1.XX`).
3. Abre en el navegador de tu celular: `http://192.168.1.XX:8080`.

---

## ✨ Estructura del Scrollytelling

1. **Hito 01 - El Verdadero Sabor (Hero)**: Tipografía cinética gigante ("EL VERDADERO SABOR") con la icónica botella Fritz Maíz de 380g e indicador de scroll animado.
2. **Hito 02 - Sabor Irresistiblemente Cremoso**: Giro en 3D de la botella mostrando la tabla de información nutricional posterior con maíz tierno y hojas flotantes en paralaje.
3. **Hito 03 - Intenso y Cremoso Cheddar**: Transición fluida del fondo esmeralda a ámbar fundido con cubos de queso cheddar y salsa derretida.
4. **Hito 04 - Destapa la Tradición**: Zoom cinematográfico a la emblemática tapa roja Fritz.
5. **Hito 05 - La Familia Completa & Explorar Catálogo**: Apertura al estudio con toda la alineación de salsas y botón brillante neón "EXPLORAR CATÁLOGO".
6. **Tienda & Catálogo Interactivo**:
   - 8 Salsas icónicas con precios, medidores de cremosidad/dulzor/picor y tags.
   - Carrito de compras desplegable interactivo con cálculo en tiempo real.
   - Cupón de descuento aplicable: prueba con **`FRITZVIP`** para un 15% OFF.
   - Modal de Información Nutricional auténtica.
   - Efectos de sonido sintetizados y música de ambiente opcional.
