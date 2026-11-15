/**
 * FRITZ Scrollytelling Engine v4.0
 * Pure Scroll-Locked Frame Progression:
 * 1. The page starts locked in the Scrollytelling stage (body.story-locked).
 * 2. When the user scrolls (mouse wheel, touch swipe, keyboard), the page DOES NOT scroll away.
 *    Instead, it scrubs through all 63 frames smoothly (0% -> 100%).
 * 3. In the exact moment it finishes (100% - full lineup), the page unlocks and
 *    smoothly scrolls down to the catalog, products, and the rest of the information.
 * 4. If the user scrolls back to the very top, it re-locks so they can scrub the frames backward.
 */

// ========================================================================
// 1. DATA & CONSTANTS
// ========================================================================
const TOTAL_FRAMES = 64;
const FRAME_PATH = (index) => `./assets/frames/f_${String(index).padStart(3, '0')}.jpg`;

const PRODUCTS = [
  {
    id: 'fritz-maiz',
    name: 'Fritz Salsa de Maíz Dulce',
    subtitle: 'La consentida e inimitable',
    price: 3.50,
    category: 'dulces',
    tag: 'Más Vendida',
    tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    creamy: 10,
    sweet: 8.5,
    spicy: 0,
    desc: 'Elaborada con granos enteros de maíz dulce tierno. Textura densa y aterciopelada que abraza cada bocado.',
    image: './assets/bottle_maiz.png'
  },
  {
    id: 'fritz-cheddar',
    name: 'Fritz Cheddar Melt',
    subtitle: 'Queso fundente supremo',
    price: 3.80,
    category: 'quesos',
    tag: 'Favorito Burgers',
    tagColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    creamy: 10,
    sweet: 3.0,
    spicy: 1,
    desc: 'Sabor a queso cheddar añejado de alta intensidad. Funde al contacto con la carne caliente.',
    image: './assets/bottle_cheddar.png'
  },
  {
    id: 'fritz-tartara',
    name: 'Fritz Tártara de la Casa',
    subtitle: 'Finas hierbas & pepinillos',
    price: 3.20,
    category: 'especiales',
    tag: 'Clásico Callejero',
    tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    creamy: 9,
    sweet: 2.5,
    spicy: 0,
    desc: 'Toque alimonado balanceado con trocitos crocantes de pepinillo dulce y cebollín fresco.',
    image: './assets/bottle_maiz.png'
  },
  {
    id: 'fritz-mayo',
    name: 'Fritz Mayonesa Clásica',
    subtitle: 'Suavidad y equilibrio puro',
    price: 2.90,
    category: 'dulces',
    tag: 'Esencial',
    tagColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    creamy: 9.5,
    sweet: 2.0,
    spicy: 0,
    desc: 'Emulsión sedosa con huevos de campo y toque sutil de mostaza antigua.',
    image: './assets/bottle_maiz.png'
  },
  {
    id: 'fritz-bbq',
    name: 'Fritz BBQ Ahumada a la Leña',
    subtitle: 'Notas dulces y maderas nobles',
    price: 3.60,
    category: 'especiales',
    tag: 'Ahumado Real',
    tagColor: 'bg-red-500/20 text-red-300 border-red-500/40',
    creamy: 7.5,
    sweet: 7.0,
    spicy: 2,
    desc: 'Melaza de caña, tomates madurados al sol y humo de leña de manzano. Ideal para costillas y alitas.',
    image: './assets/bottle_cheddar.png'
  },
  {
    id: 'fritz-ajo',
    name: 'Fritz Salsa de Ajo Gourmet',
    subtitle: 'Ajo asado suave & perejil',
    price: 3.40,
    category: 'especiales',
    tag: 'Para Tequeños',
    tagColor: 'bg-lime-500/20 text-lime-300 border-lime-500/40',
    creamy: 9.0,
    sweet: 1.5,
    spicy: 1,
    desc: 'Ajos asados lentamente para eliminar la acidez punzante y dejar un bouquet aromático exquisito.',
    image: './assets/bottle_maiz.png'
  },
  {
    id: 'fritz-picante',
    name: 'Fritz Picante Habanero Tropical',
    subtitle: 'Fuego dulce equilibrado',
    price: 3.90,
    category: 'especiales',
    tag: 'Para Valientes',
    tagColor: 'bg-rose-600/20 text-rose-300 border-rose-500/40',
    creamy: 6.0,
    sweet: 4.0,
    spicy: 9,
    desc: 'Ají habanero con base de pulpa de mango y maracuyá. Un picante que enaltece el sabor.',
    image: './assets/bottle_cheddar.png'
  },
  {
    id: 'fritz-mostaza',
    name: 'Fritz Mostaza Dulce Deli',
    subtitle: 'Miel silvestre y cúrcuma',
    price: 3.10,
    category: 'dulces',
    tag: 'Estilo Alemán',
    tagColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    creamy: 8.0,
    sweet: 6.5,
    spicy: 2,
    desc: 'Granos de mostaza amarilla molidos con miel de flores y vinagre de sidra.',
    image: './assets/bottle_maiz.png'
  }
];

// State
let cart = [];
let appliedDiscount = 0;
let isAudioPlaying = false;
let targetProgress = 0;
let currentProgress = 0;
let activeChapterIndex = 0;
const framesCache = [];

// ========================================================================
// 2. DOM ELEMENTS
// ========================================================================
const canvas = document.getElementById('story-canvas');
const ctx = canvas.getContext('2d');
const scrollyTrack = document.getElementById('scrolly-section');
const scrollySticky = document.getElementById('scrolly-viewport');
const catalogSection = document.getElementById('sabores-catalogo');
const canvasLoader = document.getElementById('canvas-loader');
const navbar = document.getElementById('navbar');

const topFloatingPill = document.getElementById('top-floating-pill');
const bottomScrollBar = document.getElementById('bottom-scroll-bar');
const scrollProgressFill = document.getElementById('scroll-progress-fill');
const scrollPromptText = document.getElementById('scroll-prompt-text');
const scrollPercentText = document.getElementById('scroll-percent-text');
const catalogCtaHotspot = document.getElementById('catalog-cta-hotspot');
const chapterDots = document.querySelectorAll('.chapter-dot');

const audioElem = document.getElementById('bg-audio');
const soundBtn = document.getElementById('sound-btn');
const soundIconOff = document.getElementById('sound-icon-off');
const soundIconOn = document.getElementById('sound-icon-on');

const cartBtn = document.getElementById('cart-btn');
const cartDrawer = document.getElementById('cart-drawer');
const cartBackdrop = document.getElementById('cart-backdrop');
const cartCloseBtn = document.getElementById('cart-close-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartCountBadge = document.getElementById('cart-count-badge');
const cartItemsCountLabel = document.getElementById('cart-items-count-label');
const cartSubtotalElem = document.getElementById('cart-subtotal');
const cartDiscountElem = document.getElementById('cart-discount');
const cartTotalElem = document.getElementById('cart-total');
const discountRow = document.getElementById('discount-row');
const promoInput = document.getElementById('promo-code-input');
const promoApplyBtn = document.getElementById('promo-apply-btn');
const promoFeedback = document.getElementById('promo-feedback');
const btnCheckout = document.getElementById('btn-checkout');

const nutritionModal = document.getElementById('nutrition-modal');
const nutritionCloseBtn = document.getElementById('nutrition-close-btn');
const toastContainer = document.getElementById('toast-container');
const productsGrid = document.getElementById('products-grid');
const filterTabBtns = document.querySelectorAll('.filter-tab-btn');

// Right HUD
const specProductName = document.getElementById('spec-product-name');
const specProductPrice = document.getElementById('spec-product-price');
const specCreamyVal = document.getElementById('spec-creamy-val');
const specCreamyBar = document.getElementById('spec-creamy-bar');
const specSweetVal = document.getElementById('spec-sweet-val');
const specSweetBar = document.getElementById('spec-sweet-bar');
const specIntensityVal = document.getElementById('spec-intensity-val');
const specIntensityBar = document.getElementById('spec-intensity-bar');
const specPairings = document.getElementById('spec-pairings');
const desktopQuickAdd = document.getElementById('desktop-quick-add');

// ========================================================================
// 3. AUDIO SYNTHESIS
// ========================================================================
let audioCtx = null;

function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
  if (!isAudioPlaying) return;
  try {
    initAudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

function playPopSound() {
  playTone(520, 'triangle', 0.12, 0.15);
}

function playSuccessChime() {
  if (!isAudioPlaying) return;
  try {
    initAudioContext();
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 'sine', 0.2, 0.12), i * 75);
    });
  } catch (e) {}
}

// ========================================================================
// 4. PRELOAD FRAMES
// ========================================================================
function preloadFrames() {
  let loaded = 0;
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = FRAME_PATH(i);
    img.onload = () => {
      loaded++;
      if (loaded === 1) {
        drawFrame(0);
      }
      if (loaded >= Math.floor(TOTAL_FRAMES * 0.35)) {
        if (canvasLoader) {
          canvasLoader.style.opacity = '0';
          setTimeout(() => { canvasLoader.style.display = 'none'; }, 500);
        }
      }
    };
    img.onerror = () => {
      loaded++;
    };
    framesCache[i - 1] = img;
  }
}

// ========================================================================
// 5. CANVAS DRAWING
// ========================================================================
function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();

  const displayWidth = rect.width;
  const displayHeight = rect.height;

  if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
    canvas.width = Math.floor(displayWidth * dpr);
    canvas.height = Math.floor(displayHeight * dpr);
    ctx.scale(dpr, dpr);
  }

  const frameIdx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(currentProgress * (TOTAL_FRAMES - 1))));
  drawFrame(frameIdx);
}

function drawFrame(index) {
  const img = framesCache[index];
  if (!img || !img.complete || img.naturalWidth === 0) return;

  const rect = canvas.getBoundingClientRect();
  const cWidth = rect.width;
  const cHeight = rect.height;

  ctx.clearRect(0, 0, cWidth, cHeight);

  const imgAspect = img.naturalWidth / img.naturalHeight;
  const canvasAspect = cWidth / cHeight;

  let renderW, renderH, offsetX, offsetY;

  if (canvasAspect < imgAspect) {
    renderH = cHeight;
    renderW = cHeight * imgAspect;
    offsetX = (cWidth - renderW) / 2;
    offsetY = 0;
  } else {
    renderW = cWidth;
    renderH = cWidth / imgAspect;
    offsetX = 0;
    offsetY = (cHeight - renderH) / 2;
  }

  ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
}

// ========================================================================
// 6. SCROLL & PROGRESSION CONTROLLER (Native Sticky Track)
// ========================================================================

// Calcular el progreso (0.0 a 1.0) según la posición de scroll en la pista
function updateScrollProgress() {
  if (!scrollyTrack) return;
  const rect = scrollyTrack.getBoundingClientRect();
  const maxScroll = scrollyTrack.offsetHeight - window.innerHeight;
  if (maxScroll <= 0) return;

  // -rect.top representa cuántos px hemos bajado dentro de la pista sticky
  const scrolled = -rect.top;
  const progress = Math.max(0, Math.min(1, scrolled / maxScroll));
  targetProgress = progress;

  // Barra de navegación: blur cuando se hace scroll
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });

// Navegar suavemente al catálogo al terminar o al hacer clic
function proceedToCatalog() {
  catalogSection.scrollIntoView({ behavior: 'smooth' });
  playSuccessChime();
}
window.proceedToCatalog = proceedToCatalog;

// Hotspot del botón EXPLORAR CATÁLOGO al final
if (catalogCtaHotspot) {
  catalogCtaHotspot.addEventListener('click', proceedToCatalog);
}

// Click en los puntos de capítulo
chapterDots.forEach(dot => {
  dot.addEventListener('click', () => {
    const step = parseInt(dot.getAttribute('data-step'), 10);
    const targetP = step === 0 ? 0 : step === 1 ? 0.22 : step === 2 ? 0.50 : 0.85;
    const maxScroll = scrollyTrack.offsetHeight - window.innerHeight;
    const targetScrollY = scrollyTrack.offsetTop + (targetP * maxScroll);
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    playPopSound();
  });
});

// Actualizaciones visuales y de fondo ambiental
function updateHUDAndColors(progress) {
  let bgGradient = 'radial-gradient(circle at 50% 50%, #208743 0%, #115729 60%, #0d381b 100%)';
  let chapterIdx = 0;

  if (progress < 0.20) {
    chapterIdx = 0; // Inicio Maíz
    bgGradient = 'radial-gradient(circle at 50% 50%, #208743 0%, #115729 60%, #0d381b 100%)';
    updateHUDSpecs(PRODUCTS[0]);
  } else if (progress < 0.40) {
    chapterIdx = 1; // 360 Nutrition & Maíz
    bgGradient = 'radial-gradient(circle at 50% 50%, #208743 0%, #115729 60%, #0d381b 100%)';
    updateHUDSpecs(PRODUCTS[0]);
  } else if (progress < 0.65) {
    chapterIdx = 2; // Cheddar
    bgGradient = 'radial-gradient(circle at 50% 50%, #eb9422 0%, #ba6a0c 60%, #753f02 100%)';
    updateHUDSpecs(PRODUCTS[1]);
  } else if (progress < 0.72) {
    chapterIdx = 2; // Cap zoom
    bgGradient = 'radial-gradient(circle at 50% 50%, #b8141c 0%, #850b11 60%, #4a0307 100%)';
  } else {
    chapterIdx = 3; // Familia completa
    bgGradient = 'radial-gradient(circle at 50% 50%, #251b17 0%, #15100e 60%, #0c0908 100%)';
  }

  // Sincronizar fondos sin saltos bruscos
  if (scrollySticky) scrollySticky.style.background = bgGradient;
  if (scrollyTrack) scrollyTrack.style.background = bgGradient;

  // Sincronizar dots de capítulo
  if (chapterIdx !== activeChapterIndex) {
    activeChapterIndex = chapterIdx;
    chapterDots.forEach((dot) => {
      const step = parseInt(dot.getAttribute('data-step'), 10);
      if (step === activeChapterIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    if (navigator.vibrate) {
      try { navigator.vibrate(12); } catch (e) {}
    }
    playPopSound();
  }

  // Barra de progreso inferior y porcentaje
  const percent = Math.floor(progress * 100);
  if (scrollProgressFill) scrollProgressFill.style.width = `${percent}%`;
  if (scrollPercentText) scrollPercentText.textContent = `${percent}%`;

  if (progress < 0.85) {
    if (scrollPromptText) scrollPromptText.textContent = 'Haz scroll para ver los fotogramas';
    if (bottomScrollBar) {
      bottomScrollBar.style.opacity = '1';
      bottomScrollBar.style.pointerEvents = 'none';
    }
    if (catalogCtaHotspot) catalogCtaHotspot.classList.remove('active');
  } else {
    if (scrollPromptText) scrollPromptText.textContent = '✨ ¡Familia Fritz Completa!';
    if (bottomScrollBar) {
      bottomScrollBar.style.opacity = '0';
      bottomScrollBar.style.pointerEvents = 'none';
    }
    if (catalogCtaHotspot) catalogCtaHotspot.classList.add('active');
  }

  // Top Floating Pill fade out
  if (topFloatingPill) {
    if (progress > 0.08) {
      topFloatingPill.classList.add('fade-out');
    } else {
      topFloatingPill.classList.remove('fade-out');
    }
  }
}

function updateHUDSpecs(product) {
  if (!product) return;
  if (specProductName) specProductName.textContent = product.name;
  if (specProductPrice) specProductPrice.textContent = `$${product.price.toFixed(2)}`;
  if (specCreamyVal) specCreamyVal.textContent = `${product.creamy} / 10`;
  if (specCreamyBar) specCreamyBar.style.width = `${(product.creamy / 10) * 100}%`;
  if (specSweetVal) specSweetVal.textContent = `${product.sweet} / 10`;
  if (specSweetBar) specSweetBar.style.width = `${(product.sweet / 10) * 100}%`;
  if (specIntensityVal) specIntensityVal.textContent = `${(product.creamy * 0.9).toFixed(1)} / 10`;
  if (specIntensityBar) specIntensityBar.style.width = `${product.creamy * 9}%`;

  if (desktopQuickAdd) {
    desktopQuickAdd.onclick = () => addToCart(product.id);
  }
}

// 60FPS Render Loop
function renderLoop() {
  const diff = targetProgress - currentProgress;
  if (Math.abs(diff) > 0.0001) {
    currentProgress += diff * 0.38;
  } else {
    currentProgress = targetProgress;
  }

  const frameIdx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(currentProgress * (TOTAL_FRAMES - 1))));
  drawFrame(frameIdx);

  updateHUDAndColors(currentProgress);

  requestAnimationFrame(renderLoop);
}

// Window resize
window.addEventListener('resize', resizeCanvas, { passive: true });

// ========================================================================
// 7. AUDIO SYSTEM TOGGLE
// ========================================================================
function toggleAudio() {
  initAudioContext();
  if (isAudioPlaying) {
    audioElem.pause();
    isAudioPlaying = false;
    soundIconOn.classList.add('hidden');
    soundIconOff.classList.remove('hidden');
    showToast('Sonido silenciado');
  } else {
    audioElem.play().then(() => {
      isAudioPlaying = true;
      soundIconOff.classList.add('hidden');
      soundIconOn.classList.remove('hidden');
      showToast('Sonido activado 🎵');
      playTone(440, 'sine', 0.2, 0.1);
    }).catch(() => {
      showToast('Haz clic de nuevo para autorizar el audio');
    });
  }
}
soundBtn.addEventListener('click', toggleAudio);

// ========================================================================
// 8. PRODUCT CATALOG & FILTERS
// ========================================================================
function renderProducts(category = 'all') {
  productsGrid.innerHTML = '';
  const filtered = category === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === category);

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card group';
    card.innerHTML = `
      <div class="flex justify-between items-start mb-3">
        <span class="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${p.tagColor}">
          ${p.tag}
        </span>
        <button class="text-white/40 hover:text-red-400 transition-colors" title="Guardar favorito">
          ♥
        </button>
      </div>

      <div class="h-48 flex items-center justify-center my-2 relative overflow-hidden">
        <img src="${p.image}" alt="${p.name}" class="h-full object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300">
      </div>

      <div class="flex-1 flex flex-col justify-between mt-2">
        <div>
          <span class="text-[11px] font-bold text-white/50 uppercase tracking-widest">${p.subtitle}</span>
          <h3 class="font-heading font-black text-xl text-white mt-0.5 leading-snug">${p.name}</h3>
          <p class="text-xs text-white/70 line-clamp-2 mt-2 leading-relaxed">${p.desc}</p>
        </div>

        <div class="my-4 space-y-2 border-t border-white/10 pt-3">
          <div class="taste-bar-container">
            <span class="w-16">Cremosidad</span>
            <div class="taste-bar-track">
              <div class="taste-bar-fill" style="width: ${(p.creamy / 10) * 100}%"></div>
            </div>
            <span class="text-[10px] text-white/80 font-bold">${p.creamy}/10</span>
          </div>

          <div class="taste-bar-container">
            <span class="w-16">Dulzura</span>
            <div class="taste-bar-track">
              <div class="taste-bar-fill bg-amber-400" style="width: ${(p.sweet / 10) * 100}%"></div>
            </div>
            <span class="text-[10px] text-white/80 font-bold">${p.sweet}/10</span>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2">
          <div>
            <div class="text-[10px] text-white/40 font-bold uppercase">Precio Unitario</div>
            <div class="text-xl font-black text-white">$${p.price.toFixed(2)}</div>
          </div>
          <button onclick="window.addToCart('${p.id}')" class="bg-white hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5">
            <span>Agregar</span>
            <span class="text-base leading-none">+</span>
          </button>
        </div>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

filterTabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterTabBtns.forEach(b => {
      b.classList.remove('active', 'bg-white', 'text-black');
      b.classList.add('bg-white/10', 'text-white/80');
    });
    btn.classList.add('active', 'bg-white', 'text-black');
    btn.classList.remove('bg-white/10', 'text-white/80');

    const cat = btn.getAttribute('data-category');
    renderProducts(cat);
    playPopSound();
  });
});

// ========================================================================
// 9. SHOPPING CART SYSTEM
// ========================================================================
window.addToCart = function(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  playPopSound();
  showToast(`¡${product.name} agregado al carrito!`);
};

window.removeFromCart = function(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
  playPopSound();
};

window.changeCartQty = function(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  updateCartUI();
  playPopSound();
};

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountBadge.textContent = totalItems;
  cartItemsCountLabel.textContent = `${totalItems} producto${totalItems === 1 ? '' : 's'}`;

  cartCountBadge.classList.add('scale-125');
  setTimeout(() => cartCountBadge.classList.remove('scale-125'), 200);

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full text-center py-12">
        <span class="text-5xl mb-4">🥫</span>
        <p class="text-sm font-bold text-white">Tu carrito está vacío</p>
        <p class="text-xs text-white/50 mt-1 max-w-xs">Explora el catálogo y añade tus salsas favoritas para comenzar tu pedido.</p>
        <button onclick="document.getElementById('cart-close-btn').click(); proceedToCatalog();" class="mt-6 glass-btn text-xs uppercase tracking-wider py-2.5 px-6">
          Ver Catálogo
        </button>
      </div>
    `;
  } else {
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
        <img src="${item.image}" alt="${item.name}" class="w-12 h-14 object-contain">
        <div class="flex-1">
          <h4 class="text-xs font-bold text-white line-clamp-1">${item.name}</h4>
          <span class="text-xs font-extrabold text-amber-300">$${(item.price * item.qty).toFixed(2)}</span>
        </div>
        <div class="flex items-center gap-2 bg-black/40 rounded-xl px-2 py-1 border border-white/10">
          <button onclick="window.changeCartQty('${item.id}', -1)" class="w-5 h-5 flex items-center justify-center text-white/60 hover:text-white font-bold text-xs">-</button>
          <span class="text-xs font-black text-white w-4 text-center">${item.qty}</span>
          <button onclick="window.changeCartQty('${item.id}', 1)" class="w-5 h-5 flex items-center justify-center text-white/60 hover:text-white font-bold text-xs">+</button>
        </div>
        <button onclick="window.removeFromCart('${item.id}')" class="text-white/40 hover:text-red-400 text-sm ml-1">✕</button>
      </div>
    `).join('');
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmount = subtotal * appliedDiscount;
  const total = Math.max(0, subtotal - discountAmount);

  cartSubtotalElem.textContent = `$${subtotal.toFixed(2)}`;
  if (appliedDiscount > 0) {
    discountRow.classList.remove('hidden');
    cartDiscountElem.textContent = `-$${discountAmount.toFixed(2)}`;
  } else {
    discountRow.classList.add('hidden');
  }
  cartTotalElem.textContent = `$${total.toFixed(2)}`;
}

function openCart() {
  cartDrawer.classList.add('open');
  cartBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  playPopSound();
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartBackdrop.classList.remove('open');
  if (!isLocked) {
    document.body.style.overflow = '';
  }
}

cartBtn.addEventListener('click', openCart);
cartCloseBtn.addEventListener('click', closeCart);
cartBackdrop.addEventListener('click', closeCart);

promoApplyBtn.addEventListener('click', () => {
  const code = promoInput.value.trim().toUpperCase();
  if (code === 'FRITZVIP' || code === 'FRITZ15') {
    appliedDiscount = 0.15;
    promoFeedback.textContent = '✓ Código VIP aplicado: 15% de descuento.';
    promoFeedback.className = 'text-[11px] font-semibold text-emerald-400';
    updateCartUI();
    playSuccessChime();
    showToast('¡Cupón aplicado con éxito!');
  } else {
    promoFeedback.textContent = '✕ Código no válido. Intenta con FRITZVIP';
    promoFeedback.className = 'text-[11px] font-semibold text-red-400';
    playTone(250, 'sawtooth', 0.2, 0.1);
  }
});

const WHATSAPP_PHONE = '584123714136';

btnCheckout.addEventListener('click', () => {
  if (cart.length === 0) {
    showToast('Añade al menos una salsa para proceder');
    return;
  }

  playSuccessChime();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmount = subtotal * appliedDiscount;
  const total = subtotal - discountAmount;

  // Formato profesional del pedido para WhatsApp
  let message = `👋 *¡Hola Salsas Fritz!* Me gustaría realizar el siguiente pedido desde la web:\n\n`;
  message += `🛒 *DETALLE DEL PEDIDO:*\n`;

  cart.forEach(item => {
    message += `• ${item.qty}x ${item.name} — $${(item.price * item.qty).toFixed(2)}\n`;
  });

  message += `\n💰 *Subtotal:* $${subtotal.toFixed(2)}`;
  if (appliedDiscount > 0) {
    message += `\n🎁 *Descuento:* -$${discountAmount.toFixed(2)} (${Math.round(appliedDiscount * 100)}% Cupón)`;
  }
  message += `\n🛵 *Envío:* GRATIS`;
  message += `\n🔥 *TOTAL A PAGAR:* $${total.toFixed(2)}\n\n`;

  message += `📍 *Datos para el despacho:*\n`;
  message += `• Nombre y Apellido:\n`;
  message += `• Ciudad / Dirección de entrega:\n`;
  message += `• Método de pago (Pago Móvil / Zelle / Efectivo):\n\n`;
  message += `¡Muchas gracias! Quedo a la espera de la confirmación 🌽🔥`;

  const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

  showToast('Abriendo WhatsApp con tu pedido... 📲');

  setTimeout(() => {
    window.open(waUrl, '_blank');
  }, 400);
});

const btnAddCombo = document.getElementById('btn-add-combo');
if (btnAddCombo) {
  btnAddCombo.addEventListener('click', () => {
    ['fritz-maiz', 'fritz-cheddar', 'fritz-tartara', 'fritz-bbq'].forEach(id => {
      const p = PRODUCTS.find(x => x.id === id);
      if (p) cart.push({ ...p, qty: 1 });
    });
    updateCartUI();
    openCart();
    playSuccessChime();
    showToast('¡Combo Familia Fritz añadido al carrito!');
  });
}

// ========================================================================
// 10. NUTRITION MODAL & SEARCH
// ========================================================================
function openNutritionModal() {
  nutritionModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  playPopSound();
}

function closeNutritionModal() {
  nutritionModal.classList.remove('open');
  if (!isLocked) {
    document.body.style.overflow = '';
  }
}

const openNutritionTriggers = document.querySelectorAll('.open-nutrition-trigger');
openNutritionTriggers.forEach(btn => btn.addEventListener('click', (e) => {
  e.preventDefault();
  openNutritionModal();
}));

const btnOpenNutrition = document.getElementById('btn-open-nutrition');
if (btnOpenNutrition) btnOpenNutrition.addEventListener('click', openNutritionModal);

nutritionCloseBtn.addEventListener('click', closeNutritionModal);
nutritionModal.addEventListener('click', (e) => {
  if (e.target === nutritionModal) closeNutritionModal();
});

const searchTriggerBtn = document.getElementById('search-trigger-btn');
if (searchTriggerBtn) {
  searchTriggerBtn.addEventListener('click', () => {
    const query = prompt('Buscar salsa o ingrediente (ej. Maíz, Cheddar, Picante, BBQ):');
    if (query && query.trim()) {
      proceedToCatalog();
      const q = query.trim().toLowerCase();
      const matched = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
      if (matched.length > 0) {
        showToast(`Mostrando ${matched.length} resultados para "${query}"`);
      } else {
        showToast(`No encontramos resultados para "${query}", mostrando todos.`);
      }
    }
  });
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="text-amber-400">✨</span>
    <span>${message}</span>
  `;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// ========================================================================
// 11. INITIALIZATION
// ========================================================================
function init() {
  targetProgress = 0;
  currentProgress = 0;

  preloadFrames();
  resizeCanvas();
  renderProducts('all');
  updateScrollProgress();
  updateHUDAndColors(0);
  requestAnimationFrame(renderLoop);
  console.log('🌽 Fritz Scrollytelling Engine v5.0 (Native Sticky Track) Ready!');
}

init();
