// js/popup_menu.js — popup + favorites
const API_ROOT = 'https://tasty-treats-backend.p.goit.global/api';

/* = Helpers = */
const qs = (s, p = document) => p.querySelector(s);
const qsa = (s, p = document) => [...p.querySelectorAll(s)];
const show = el => el && el.classList.remove('hidden');
const hide = el => el && el.classList.add('hidden');
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

/* = Sprite (popup yıldızları için) = */
const SPRITE_PATH = '../img/icons.svg';
const svgIcon = (name, className = '') =>
  `<svg class="icon ${className}" aria-hidden="true" focusable="false">
     <use href="${SPRITE_PATH}#icon-${name}"></use>
   </svg>`;

/* = Favorites (LS) = */
function getFavorites() {
  try {
    const v = JSON.parse(localStorage.getItem('favorites'));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function setFavorites(arr) {
  localStorage.setItem('favorites', JSON.stringify(arr || []));
}
const getIdSafe = o => o?._id || o?.id || o?.recipeId || '';
const findIndexById = (list, id) =>
  (list || []).findIndex(r => String(getIdSafe(r)) === String(id));
function makeFavoritePayload(src) {
  const id = getIdSafe(src);
  return {
    ...src,
    _id: id,
    title: src?.title || '',
    description: src?.description || '',
    rating: Number(src?.rating) || 0,
    preview:
      src?.preview || src?.thumb || src?.image_url || src?.imageUrl || '',
    category:
      typeof src?.category === 'string'
        ? { name: src.category }
        : src?.category?.name
        ? src.category
        : src?.category || {},
  };
}
function isFavorite(id) {
  return findIndexById(getFavorites(), id) !== -1;
}

/* = Yayıncılar = */
function emitFavoritesSync(id, on) {
  const ev = new CustomEvent('favorites:sync', {
    detail: { id: String(id), on: !!on },
  });
  window.dispatchEvent(ev);
  document.dispatchEvent(ev);
}
function emitFavoritesUpdated() {
  const ev = new Event('favorites:updated');
  window.dispatchEvent(ev);
  document.dispatchEvent(ev);
}

/* = Toggle = */
function toggleFavoriteById(id, recipeObjForAdd) {
  const list = getFavorites();
  const idx = findIndexById(list, id);
  let nowOn = false;

  if (idx !== -1) {
    list.splice(idx, 1);
    nowOn = false;
  } else {
    list.unshift(makeFavoritePayload(recipeObjForAdd || { _id: id }));
    nowOn = true;
  }
  // 1) LS yaz
  setFavorites(list);
  // 2) İnce taneli: sadece bu kartın kalbini güncelle
  emitFavoritesSync(id, nowOn);
  // 3) Geniş: favorites sayfası tam listeyi tazelesin
  emitFavoritesUpdated();

  return nowOn;
}

/* = Popup state/refs = */
let currentRecipe = null;
window.__currentRecipeId = '';

function refs() {
  return {
    overlay: qs('#popup-overlay'),
    content: qs('#popup-content'),
    pmImage: qs('#pm-image'),
    pmVideo: qs('#pm-video'),
    pmIframe: qs('#pm-iframe'),
    pmTitle: qs('#pm-title'),
    pmRatingVal: qs('#pm-rating-val'),
    pmStars: qs('#pm-stars'),
    pmTime: qs('#pm-time'),
    pmIngredients: qs('#pm-ingredients'),
    pmTags: qs('#pm-tags'),
    pmDesc: qs('#pm-desc'),
    favBtn: qs('#pm-fav-btn'),
  };
}

/* = Basit yıldız = */
const starFilledHTML = `<span class="star filled">${svgIcon('Star')}</span>`;
const starEmptyHTML = `<span class="star empty">${svgIcon(
  'Star-empty'
)}</span>`;
function renderStaticStars(container, val) {
  if (!container) return;
  const n = Number(val) || 0,
    full = Math.min(5, Math.max(0, Math.floor(n)));
  container.innerHTML = `<span class="star-row">
    ${starFilledHTML.repeat(full)}${starEmptyHTML.repeat(5 - full)}
  </span>`;
}

/* = Render = */
function renderDetails(recipe) {
  const r = refs();
  if (!r.content) return;
  const id = String(getIdSafe(recipe));
  if (id) {
    r.content.dataset.recipeId = id;
    window.__currentRecipeId = id;
  }
  r.pmTitle && (r.pmTitle.textContent = recipe.title || 'Untitled');
  r.pmRatingVal &&
    (r.pmRatingVal.textContent = (Number(recipe.rating) || 0).toFixed(2));
  renderStaticStars(r.pmStars, recipe.rating || 0);
  r.pmTime && (r.pmTime.textContent = recipe.time ? `${recipe.time} min` : '');

  const yt = recipe.youtube || recipe.youtubeUrl || '';
  if (yt) {
    r.pmVideo?.classList.remove('hidden');
    r.pmImage?.classList.add('hidden');
    const vid = yt.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:\b|&|$)/)?.[1] || yt;
    if (r.pmIframe)
      r.pmIframe.src = `https://www.youtube.com/embed/${vid}?rel=0&modestbranding=1&playsinline=1`;
  } else {
    r.pmVideo?.classList.add('hidden');
    r.pmImage?.classList.remove('hidden');
    const img =
      recipe.image_url ||
      recipe.imageUrl ||
      recipe.preview ||
      recipe.thumb ||
      '';
    if (r.pmImage)
      r.pmImage.style.backgroundImage = img ? `url('${esc(img)}')` : '';
  }

  if (r.pmIngredients) {
    r.pmIngredients.innerHTML = '';
    (recipe.ingredients || []).forEach(it => {
      const name = typeof it === 'string' ? it : it?.name || '';
      const measure = typeof it === 'string' ? '' : it?.measure || '';
      const row = document.createElement('div');
      row.className = 'ing-row';
      row.innerHTML = `<span class="ing-name">${name}</span><span class="ig-measure">${measure}</span>`;
      r.pmIngredients.appendChild(row);
    });
  }

  if (r.pmTags) {
    r.pmTags.innerHTML = '';
    (recipe.tags || []).forEach(tag => {
      const span = document.createElement('span');
      span.className = 'tag-chip';
      span.textContent = `#${tag}`;
      r.pmTags.appendChild(span);
    });
  }

  if (r.pmDesc) r.pmDesc.textContent = recipe.description || '';
  if (r.favBtn && id)
    r.favBtn.textContent = isFavorite(id)
      ? 'Remove to favorite'
      : 'Add to favorite';
}

function syncFavBtnText() {
  const r = refs();
  const id = r.content?.dataset?.recipeId || window.__currentRecipeId || '';
  if (!r.favBtn || !id) return;
  r.favBtn.textContent = isFavorite(id)
    ? 'Remove to favorite'
    : 'Add to favorite';
}

/* = Global: openPopup = */
window.openPopup = async function openPopup(recipeOrId) {
  const r = refs();
  if (!r.overlay) return;
  document.documentElement.style.overflow = 'hidden';

  currentRecipe =
    typeof recipeOrId === 'object' && recipeOrId
      ? recipeOrId
      : { _id: String(recipeOrId || '') };
  renderDetails(currentRecipe);
  show(r.overlay);
  syncFavBtnText();

  const id = getIdSafe(currentRecipe);
  if (!id) return;
  try {
    const res = await fetch(`${API_ROOT}/recipes/${encodeURIComponent(id)}`);
    if (res.ok) {
      const fresh = await res.json();
      currentRecipe = { ...currentRecipe, ...fresh };
      renderDetails(currentRecipe);
      syncFavBtnText();
    }
  } catch {}
};

/* = Close = */
document.addEventListener('click', e => {
  const r = refs();
  if (e.target.closest('.popup-x') || (r.overlay && e.target === r.overlay)) {
    hide(r.overlay);
    document.documentElement.style.overflow = '';
    r.pmIframe && (r.pmIframe.src = '');
  }
});
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const r = refs();
    hide(r.overlay);
    document.documentElement.style.overflow = '';
    r.pmIframe && (r.pmIframe.src = '');
  }
});

/* = Fav buton = */
document.addEventListener('click', e => {
  const r = refs();
  if (!e.target.closest('#pm-fav-btn')) return;
  const id = r.content?.dataset?.recipeId || window.__currentRecipeId || '';
  if (!id) return;
  const on = toggleFavoriteById(id, currentRecipe);
  r.favBtn &&
    (r.favBtn.textContent = on ? 'Remove to favorite' : 'Add to favorite');
});
