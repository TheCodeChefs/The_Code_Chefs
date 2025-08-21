// js/favorites-filter.js — kategori + sayfalama, responsive, boş veri ve LOADING

// -------------------------------------------------------
// SVG sprite helper
const SPRITE_PATH = '../img/icons.svg';
function svgIcon(name, className = '') {
  return `<svg class="icon ${className}" aria-hidden="true" focusable="false">
    <use href="${SPRITE_PATH}#icon-${name}"></use>
  </svg>`;
}

console.log('✅ favorites-filter.js çalışıyor.');

/* ===== Kategori barını container soluna hizala (eski doğru davranış) ===== */
function alignWithContainer() {
  const section = document.querySelector('.favorites-filter');
  const container = section?.querySelector('.container');
  const wrapper = document.querySelector('.category-wrapper');
  if (!container || !wrapper) return;

  const vw = window.innerWidth;
  const cw = container.offsetWidth;
  const leftSpace = (vw - cw) / 2;

  // tasarımdaki base iç boşluk
  let extra = 20;
  if (vw >= 768 && vw < 1280) extra = 32;
  else if (vw >= 1280) extra = 100;

  wrapper.style.paddingLeft = `${Math.max(0, leftSpace + extra)}px`;
}
window.addEventListener('load', alignWithContainer);
window.addEventListener('resize', alignWithContainer);

// === localStorage helpers
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
function getStarIcons(rating = 0) {
  const full = Math.max(0, Math.min(5, Math.floor(Number(rating) || 0)));
  const empty = 5 - full;
  const filled = Array.from({ length: full })
    .map(() => svgIcon('Star', 'star-icon'))
    .join('');
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
  isLoading: false, // LOADING bayrağı
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

// LOADING elemanı (dinamik eklenir)
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
  // LOADING sırasında kategori çubuğunu da gizle
  if (categoryWrapperEl) categoryWrapperEl.style.display = 'none';
}
function hideLoading() {
  state.isLoading = false;
  if (loadingEl) loadingEl.style.display = 'none';
}

// Her zaman mevcut #pagination-container’ı kullan
function getPaginationEl() {
  let el = document.getElementById('pagination-container');
  if (!el) {
    el = document.querySelector('.pagination');
  }
  return el;
}

function ensureBaseRefs() {
  return favoritesListEl && emptyMessageEl && categoryListEl && allBtn;
}

/* ==== Category buttons ==== */
function renderCategories(items) {
  if (!ensureBaseRefs()) return;

  // FAVORITES BOŞSA → kategori barını tamamen gizle
  if (!items || items.length === 0) {
    if (categoryWrapperEl) categoryWrapperEl.style.display = 'none';
    categoryListEl.innerHTML = '';
    // All categories butonunu da pasif bırak
    if (allBtn) allBtn.classList.remove('active');
    return;
  } else {
    // veri varsa görünür yap
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
}

/* ==== Pagination ==== */
function renderPagination(totalPages) {
  const paginationEl = getPaginationEl();
  if (!paginationEl) return;
  paginationEl.innerHTML = '';

  if (!Number.isFinite(totalPages) || totalPages <= 1) {
    paginationEl.style.display = 'none';
    return;
  }
  paginationEl.style.display = 'flex';

  const iconLeft = isDisabled =>
    svgIcon(isDisabled ? 'pg-left-icon-gray' : 'pg-left-icon');
  const iconRight = isDisabled =>
    svgIcon(isDisabled ? 'pg-right-icon-gray' : 'pg-right-icon');

  const addButton = (
    label,
    page,
    isDisabled = false,
    className = '',
    htmlContent = null
  ) => {
    const btn = document.createElement('button');
    btn.className = className;
    if (htmlContent) btn.innerHTML = htmlContent;
    else btn.textContent = label;
    if (isDisabled) btn.disabled = true;
    if (!isDisabled && page) {
      btn.addEventListener('click', () => {
        state.currentPage = page;
        renderCards();
      });
    }
    paginationEl.appendChild(btn);
  };

  // <<
  addButton(
    '',
    1,
    state.currentPage === 1,
    'page-icon',
    `<span class="double-icon">${iconLeft(state.currentPage === 1)}${iconLeft(
      state.currentPage === 1
    )}</span>`
  );

  // <
  addButton(
    '',
    state.currentPage - 1,
    state.currentPage === 1,
    'page-icon',
    iconLeft(state.currentPage === 1)
  );

  const range = getPaginationRange(state.currentPage, totalPages);

  if (range[0] > 1) {
    const dots = document.createElement('button');
    dots.textContent = '...';
    dots.className = 'dots';
    dots.disabled = true;
    paginationEl.appendChild(dots);
  }

  for (let i = range[0]; i <= range[1]; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === state.currentPage) btn.classList.add('active');
    btn.addEventListener('click', () => {
      state.currentPage = i;
      renderCards();
    });
    paginationEl.appendChild(btn);
  }

  if (range[1] < totalPages) {
    const dots = document.createElement('button');
    dots.textContent = '...';
    dots.className = 'dots';
    dots.disabled = true;
    paginationEl.appendChild(dots);
  }

  // >
  addButton(
    '',
    state.currentPage + 1,
    state.currentPage === totalPages,
    'page-icon',
    iconRight(state.currentPage === totalPages)
  );

  // >>
  addButton(
    '',
    totalPages,
    state.currentPage === totalPages,
    'page-icon',
    `<span class="double-icon">${iconRight(
      state.currentPage === totalPages
    )}${iconRight(state.currentPage === totalPages)}</span>`
  );
}

/* ==== Cards ==== */
function renderCards() {
  if (!ensureBaseRefs()) return;

  // LOADING aşamasında liste/pagination manipüle etme
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
            <span class="star-icon">${getStarIcons(recipe.rating)}</span>
          </span>
          <button class="secondary-button see-recipe-btn">See recipe</button>
        </div>
      </div>
    `;

    // Favorilerden kaldır (kalp)
    card.querySelector('.heart').addEventListener('click', () => {
      const rid = String(getRecipeIdSafe(recipe));
      const all = getFavoritesLS();
      const idx = all.findIndex(r => String(getRecipeIdSafe(r)) === rid);
      if (idx !== -1) {
        all.splice(idx, 1);
        setFavoritesLS(all);
        window.dispatchEvent(new Event('favorites:updated'));
      }
      renderAll();
    });

    // Popup aç
    card.querySelector('.see-recipe-btn').addEventListener('click', () => {
      if (typeof window.openPopup === 'function') {
        window.openPopup(recipe);
      } else {
        console.error(
          '❌ window.openPopup bulunamadı. popup_menu.js yüklendi mi?'
        );
      }
    });

    favoritesListEl.appendChild(card);
  });

  // veri var → kategori barını görünür yap
  if (categoryWrapperEl) categoryWrapperEl.style.display = '';

  // pagination’ı sadece 1’den büyükse göster
  renderPagination(totalPages);
}

/* ==== Hepsini render eden ==== */
function renderAll() {
  const items = getFavoritesLS();
  renderCategories(items); // burada boşsa kategori barı gizlenir
  renderCards();
}

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
    }
  }, 500);
});

// localStorage başka tab/pencereden veya popup’tan güncellenirse
window.addEventListener('storage', e => {
  if (e.key === 'favorites') {
    hideLoading();
    renderAll();
  }
});
window.addEventListener('favorites:updated', () => {
  hideLoading();
  renderAll();
});
