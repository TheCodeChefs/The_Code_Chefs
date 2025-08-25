// === SVG sprite helper (kalp, yıldız vb. için)
const SPRITE_PATH = './img/icons.svg';
function svgIcon(name, className = '') {
  const ref = `${SPRITE_PATH}#icon-${name}`;
  return `<svg class="icon ${className}" aria-hidden="true" focusable="false">
    <use href="${ref}" xlink:href="${ref}"></use>
  </svg>`;
}

/* ===== Category: solda container iç çizgisi, sağda viewport kenarı ===== */
function alignCategoryToViewportRight() {
  const wrapper = document.querySelector('.category-wrapper');
  if (!wrapper) return;

  const container =
    wrapper.closest('.container') ||
    document.querySelector('.favorites-filter .container') ||
    document.querySelector('.container');
  if (!container) return;

  const vw = window.innerWidth;
  const rect = container.getBoundingClientRect();
  const cs = window.getComputedStyle(container);
  const pl = parseFloat(cs.paddingLeft) || 0;

  let startX = rect.left + pl;
  let width = vw - startX;

  startX = Math.max(0, Math.round(startX));
  width = Math.max(0, Math.round(width));

  wrapper.style.marginLeft = '0';
  wrapper.style.marginRight = '0';
  wrapper.style.maxWidth = 'none';

  wrapper.style.width = `${width}px`;
  wrapper.style.boxSizing = 'border-box';
  wrapper.style.position = 'relative';
  wrapper.style.transform = `translateX(${startX}px)`;
}

// Debounce
let __alignTimer;
function __reqAlign() {
  clearTimeout(__alignTimer);
  __alignTimer = setTimeout(alignCategoryToViewportRight, 80);
}
window.addEventListener('load', alignCategoryToViewportRight);
window.addEventListener('resize', __reqAlign);

/* ===== Cross-tab publish (index.html & favorites.html arası) ===== */
const favBC =
  'BroadcastChannel' in window ? new BroadcastChannel('favorites') : null;
function broadcastFavoritesChange() {
  window.dispatchEvent(new Event('favorites:updated'));
  if (favBC) favBC.postMessage({ type: 'favorites:updated', at: Date.now() });
  try {
    if (typeof window.renderAll === 'function') window.renderAll();
  } catch {}
}

/* === localStorage helpers === */
function getFavoritesLS() {
  try {
    const v = JSON.parse(localStorage.getItem('favorites'));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function setFavoritesLS(arr) {
  localStorage.setItem('favorites', JSON.stringify(arr || []));
  broadcastFavoritesChange();
}
function getRecipeIdSafe(r) {
  return r?._id || r?.id;
}

const esc = s =>
  (s ?? '').toString().replace(
    /[&<>"']/g,
    m =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[m])
  );

// === Yıldızlar
function getStarIcons(rating = 0, { max = 5, fillEmpty = false } = {}) {
  const full = Math.max(0, Math.min(max, Math.floor(Number(rating) || 0)));
  const filled = Array.from({ length: full })
    .map(() => svgIcon('Star', 'star-icon'))
    .join('');
  if (!fillEmpty) return filled;

  const empty = Math.max(0, max - full);
  const empties = Array.from({ length: empty })
    .map(() => svgIcon('Star-empty', 'star-icon empty'))
    .join('');
  return `${filled}${empties}`;
}

// === Sayfalama yardımcıları
function getRecipesPerPage() {
  const w = window.innerWidth;
  if (w < 768) return 9;
  if (w < 1280) return 12;
  return 12;
}
function getPaginationRange(current, total) {
  if (total <= 2) return [1, total];
  if (current >= total - 1) return [total - 1, total];
  if (current <= 1) return [1, 2];
  return [current, current + 1];
}

/* ==== State ==== */
const state = {
  currentPage: 1,
  currentCategory: 'All',
  recipesPerPage: getRecipesPerPage(),
  isLoading: false,
};

window.addEventListener('resize', () => {
  state.recipesPerPage = getRecipesPerPage();
  renderAll();
});

function computeCategories(items) {
  return [
    ...new Set(
      (items || []).map(
        r => r?.category?.name || r?.category || 'Uncategorized'
      )
    ),
  ];
}

/* ==== DOM refs ==== */
const favoritesListEl = document.getElementById('favorites-list');
const emptyMessageEl = document.getElementById('empty-message');
const categoryListEl = document.getElementById('category-list');
const allBtn = document.getElementById('all-categories-btn');
const categoryWrapperEl = document.querySelector('.category-wrapper');

/* LOADING elemanı */
let loadingEl = null;
function ensureLoadingEl() {
  if (!loadingEl) {
    loadingEl = document.createElement('div');
    loadingEl.id = 'loading-message';
    loadingEl.textContent = 'Loading…';
    loadingEl.style.textAlign = 'center';
    loadingEl.style.margin = '24px auto';
    loadingEl.style.fontWeight = '600';
    loadingEl.style.opacity = '0.8';
    favoritesListEl?.insertAdjacentElement('beforebegin', loadingEl);
  }
  return loadingEl;
}
function showLoading() {
  state.isLoading = true;
  ensureLoadingEl().style.display = 'block';
  emptyMessageEl?.classList.add('hidden');
  const p = getPaginationEl();
  if (p) p.style.display = 'none';
  if (favoritesListEl) favoritesListEl.innerHTML = '';
  if (categoryWrapperEl) categoryWrapperEl.style.display = 'none';
}
function hideLoading() {
  state.isLoading = false;
  if (loadingEl) loadingEl.style.display = 'none';
}

function getPaginationEl() {
  let el = document.getElementById('pagination-container');
  if (!el) el = document.querySelector('.pagination');
  return el;
}

function ensureBaseRefs() {
  return favoritesListEl && emptyMessageEl && categoryListEl && allBtn;
}

/* ==== Category buttons ==== */
function renderCategories(items) {
  if (!ensureBaseRefs()) return;

  if (!items || items.length === 0) {
    if (categoryWrapperEl) categoryWrapperEl.style.display = 'none';
    categoryListEl.innerHTML = '';
    if (allBtn) allBtn.classList.remove('active');
    return;
  } else {
    if (categoryWrapperEl) categoryWrapperEl.style.display = '';
  }

  categoryListEl.innerHTML = '';

  const setActiveClasses = () => {
    document
      .querySelectorAll('.category')
      .forEach(b => b.classList.remove('active'));
    if (state.currentCategory === 'All') allBtn.classList.add('active');
    else allBtn.classList.remove('active');
  };

  allBtn.onclick = () => {
    state.currentCategory = 'All';
    state.currentPage = 1;
    setActiveClasses();
    renderCards();
  };

  computeCategories(items).forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'category';
    btn.textContent = cat;
    if (cat === state.currentCategory) btn.classList.add('active');
    btn.addEventListener('click', () => {
      state.currentCategory = cat;
      state.currentPage = 1;
      setActiveClasses();
      btn.classList.add('active');
      renderCards();
    });
    categoryListEl.appendChild(btn);
  });

  setActiveClasses();
  alignCategoryToViewportRight();
}

/* ==== Pagination (yalnızca sayıları ve enable/disable'ı yönetir) ==== */
function renderPagination(totalPages) {
  const container = getPaginationEl();
  if (!container) return;

  if (!Number.isFinite(totalPages) || totalPages <= 1) {
    container.style.display = 'none';
    return;
  }
  container.style.display = 'flex';

  const btnFirst = container.querySelector('.page-icon.first');
  const btnPrev = container.querySelector('.page-icon.prev');
  const btnNext = container.querySelector('.page-icon.next');
  const btnLast = container.querySelector('.page-icon.last');
  const numbersWrap = container.querySelector('.page-numbers');

  const atFirst = state.currentPage === 1;
  const atLast = state.currentPage === totalPages;
  if (btnFirst) btnFirst.disabled = atFirst;
  if (btnPrev) btnPrev.disabled = atFirst;
  if (btnNext) btnNext.disabled = atLast;
  if (btnLast) btnLast.disabled = atLast;

  const [start, end] = getPaginationRange(state.currentPage, totalPages);
  const frag = document.createDocumentFragment();

  if (start > 1) {
    const dotsL = document.createElement('button');
    dotsL.className = 'dots';
    dotsL.textContent = '…';
    dotsL.disabled = true;
    frag.appendChild(dotsL);
  }

  for (let i = start; i <= end; i++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = String(i);
    if (i === state.currentPage) b.classList.add('active');
    b.addEventListener('click', () => {
      if (state.currentPage !== i) {
        state.currentPage = i;
        renderCards();
      }
    });
    frag.appendChild(b);
  }

  if (end < totalPages) {
    const dotsR = document.createElement('button');
    dotsR.className = 'dots';
    dotsR.textContent = '…';
    dotsR.disabled = true;
    frag.appendChild(dotsR);
  }

  if (numbersWrap) {
    numbersWrap.innerHTML = '';
    numbersWrap.appendChild(frag);
  }

  if (btnFirst)
    btnFirst.onclick = () => {
      if (!btnFirst.disabled) {
        state.currentPage = 1;
        renderCards();
      }
    };
  if (btnPrev)
    btnPrev.onclick = () => {
      if (!btnPrev.disabled) {
        state.currentPage = Math.max(1, state.currentPage - 1);
        renderCards();
      }
    };
  if (btnNext)
    btnNext.onclick = () => {
      if (!btnNext.disabled) {
        state.currentPage = Math.min(totalPages, state.currentPage + 1);
        renderCards();
      }
    };
  if (btnLast)
    btnLast.onclick = () => {
      if (!btnLast.disabled) {
        state.currentPage = totalPages;
        renderCards();
      }
    };
}

/* ==== Cards ==== */
function renderCards() {
  if (!ensureBaseRefs()) return;

  if (state.isLoading) {
    const p = getPaginationEl();
    if (p) p.style.display = 'none';
    favoritesListEl.innerHTML = '';
    emptyMessageEl.classList.add('hidden');
    return;
  }

  const favoriteRecipes = getFavoritesLS();
  const paginationEl = getPaginationEl();

  // Boş liste → mesajı göster, pagination gizle, kategori barını gizle
  if (!favoriteRecipes || favoriteRecipes.length === 0) {
    favoritesListEl.innerHTML = '';
    emptyMessageEl.classList.remove('hidden');
    if (paginationEl) paginationEl.style.display = 'none';
    if (categoryWrapperEl) categoryWrapperEl.style.display = 'none';
    return;
  }
  emptyMessageEl.classList.add('hidden');

  // Kategori filtresi
  const filtered =
    state.currentCategory === 'All'
      ? favoriteRecipes
      : favoriteRecipes.filter(
          r =>
            (r?.category?.name || r?.category || 'Uncategorized') ===
            state.currentCategory
        );

  if (filtered.length === 0) {
    favoritesListEl.innerHTML = `<p style="text-align:center;">No recipes in this category.</p>`;
    if (paginationEl) paginationEl.style.display = 'none';
    // veri var ama bu kategoride yok → kategori barı görünür kalmalı
    if (categoryWrapperEl) categoryWrapperEl.style.display = '';
    return;
  }

  // Sayfalama
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / state.recipesPerPage)
  );
  if (state.currentPage > totalPages) state.currentPage = totalPages;
  const start = (state.currentPage - 1) * state.recipesPerPage;
  const currentItems = filtered.slice(start, start + state.recipesPerPage);

  // Kartlar
  favoritesListEl.innerHTML = '';
  currentItems.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    const bg = recipe.preview || recipe.thumb || recipe.image_url || '';
    card.style.backgroundImage = bg ? `url('${bg}')` : 'none';

    card.innerHTML = `
      <div class="recipe-overlay"></div>
      <div class="heart" data-id="${getRecipeIdSafe(recipe) ?? ''}">
        ${svgIcon('heart')}
      </div>
      <div class="recipe-card-content">
        <h4>${esc(recipe.title)}</h4>
        <p>${esc(recipe.description || 'Açıklama bulunamadı.')}</p>
        <div class="recipe-meta">
          <span class="star-group">
            ${Number(recipe.rating ?? 0).toFixed(2)}
            <span class="star-icon">
              ${getStarIcons(recipe.rating)}
            </span>
          </span>
          <button class="secondary-button see-recipe-btn">See recipe</button>
        </div>
      </div>
    `;

    const heartEl = card.querySelector('.heart');
    if (heartEl) {
      heartEl.addEventListener('click', () => {
        const rid = String(getRecipeIdSafe(recipe));
        const all = getFavoritesLS();
        const idx = all.findIndex(r => String(getRecipeIdSafe(r)) === rid);
        if (idx !== -1) {
          all.splice(idx, 1);
          setFavoritesLS(all); // setFavoritesLS → broadcastFavoritesChange()
        }
      });
    }

    const seeBtn = card.querySelector('.see-recipe-btn');
    if (seeBtn) {
      seeBtn.addEventListener('click', () => {
        if (typeof window.openPopup === 'function') {
          window.openPopup(recipe);
        } else {
          console.error(
            '❌ window.openPopup bulunamadı. popup_menu.js yüklendi mi?'
          );
        }
      });
    }

    favoritesListEl.appendChild(card);
  });

  if (categoryWrapperEl) categoryWrapperEl.style.display = '';

  // pagination’ı sadece 1’den büyükse göster
  renderPagination(totalPages);

  // Kartlar sonrası hizalamayı yinele (kategori yüksekliği değişebilir)
  alignCategoryToViewportRight();
}

/* ==== Hepsini render eden ==== */
function renderAll() {
  const items = getFavoritesLS();
  renderCategories(items); // burada boşsa kategori barı gizlenir
  renderCards();
}
// Popup'tan doğrudan çağrı için global'e bağla
window.renderAll = renderAll;

/* ==== Açılış ==== */
window.addEventListener('load', () => {
  if (!ensureBaseRefs()) {
    console.warn('⚠️ Gerekli DOM elemanları bulunamadı.');
    return;
  }

  // İlk anda loading göster
  showLoading();
  renderCards(); // loading görünürken listeyi temizler (kategori barı da gizli)

  // favorites henüz yazılmamış olabilir (main.js asenkron)
  let tries = 0;
  const t = setInterval(() => {
    const hasData = getFavoritesLS().length > 0;
    tries++;

    if (hasData || tries > 10) {
      clearInterval(t);
      hideLoading();
      renderAll(); // veri varsa listele, yoksa boş mesaj + kategori gizli
      alignCategoryToViewportRight();
    }
  }, 500);
});

// localStorage başka tab/pencereden veya popup’tan güncellenirse
window.addEventListener('storage', e => {
  if (e.key === 'favorites') {
    hideLoading();
    renderAll();
    alignCategoryToViewportRight();
  }
});
window.addEventListener('favorites:updated', () => {
  hideLoading();
  renderAll();
  alignCategoryToViewportRight();
});
// BroadcastChannel’dan gelen mesajlar
if (favBC) {
  favBC.onmessage = ev => {
    if (ev.data?.type === 'favorites:updated') {
      hideLoading();
      renderAll();
      alignCategoryToViewportRight();
    }
  };
}
