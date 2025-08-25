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

// 2 ondalık TRUNC
function format2Trunc(v) {
  const n = Number.parseFloat(String(v ?? '').replace(',', '.'));
  if (!Number.isFinite(n)) return '0.00';
  const t = Math.trunc(n * 100) / 100;
  return t.toFixed(2);
}

// Güvenli background-image setter (tırnak/paren/ters slash vb. temizler)
function setBgImage(el, url) {
  if (!el) return;
  if (!url) {
    el.style.backgroundImage = '';
    return;
  }
  const safe = String(url)
    .trim()
    .replace(/"/g, '%22')
    .replace(/\)/g, '%29')
    .replace(/\(/g, '%28')
    .replace(/\\+/g, '');
  el.style.backgroundImage = `url("${safe}")`;
}

/* = Sprite (popup yıldızları için) = */
const SPRITE_PATH = './img/icons.svg';
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
  setFavorites(list);
  emitFavoritesSync(id, nowOn);
  emitFavoritesUpdated();

  return nowOn;
}

/* = Popup state/refs = */
let currentRecipe = null;
let currentRating = 0; // ⭐ rating overlay için
let ratingSubmitting = false; // çift tıklama kilidi
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

    // ⭐ rating overlay elemanları
    rateBtn: qs('#pm-rate-btn'),
    ratingOverlay: qs('#rating-overlay'),
    ratingStars: qs('#rating-stars'),
    ratingValueEl: qs('#rating-value'),
    ratingEmail: qs('#rating-email'),
    ratingSend: qs('#rating-send'),
    ratingHint: qs('#rating-hint'),
  };
}

/* = Basit yıldız = */
const starFilledHTML = `<span class="star filled">${svgIcon('Star')}</span>`;
const starEmptyHTML = `<span class="star empty">${svgIcon(
  'Star-empty'
)}</span>`;
function renderStaticStars(container, val) {
  if (!container) return;
  const n = Number(val) || 0;
  const full = Math.min(5, Math.max(0, Math.floor(n)));
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
    r.ratingOverlay && (r.ratingOverlay.dataset.recipeId = id); // ⭐ rating overlay id
    window.__currentRecipeId = id;
  }
  r.pmTitle && (r.pmTitle.textContent = recipe.title || 'Untitled');
  r.pmRatingVal && (r.pmRatingVal.textContent = format2Trunc(recipe.rating));
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
    setBgImage(r.pmImage, img);
  }

  if (r.pmIngredients) {
    r.pmIngredients.innerHTML = '';
    (recipe.ingredients || []).forEach(it => {
      const name = typeof it === 'string' ? it : it?.name || '';
      const measure = typeof it === 'string' ? '' : it?.measure || '';
      const row = document.createElement('div');
      row.className = 'ing-row';
      row.innerHTML = `<span class="ing-name">${name}</span><span class="ing-measure">${measure}</span>`;
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
// Escape: önce rating açıksa onu kapat, değilse popup'ı
window.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const r = refs();
  if (r.ratingOverlay && !r.ratingOverlay.classList.contains('hidden')) {
    hide(r.ratingOverlay);
    return;
  }
  hide(r.overlay);
  document.documentElement.style.overflow = '';
  r.pmIframe && (r.pmIframe.src = '');
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

/* ============ ⭐ Rating overlay ============ */
// yıldızları temizle/boyama
function clearRatingStars(starsRoot) {
  if (!starsRoot) return;
  qsa('svg path', starsRoot).forEach(p => p.setAttribute('fill', '#dcdcdc'));
}
function paintRatingStars(starsRoot, val) {
  if (!starsRoot) return;
  clearRatingStars(starsRoot);
  const full = Math.floor(val);
  const half = val % 1 >= 0.5;
  qsa('.star-container', starsRoot).forEach((c, idx) => {
    const num = idx + 1;
    const path = qs('path', c);
    if (!path) return;
    if (num <= full) path.setAttribute('fill', '#eea10b');
    else if (num === full + 1 && half)
      path.setAttribute('fill', `url(#halfGradient-${num})`);
  });
}
function validateRatingForm(r) {
  const email = r.ratingEmail?.value.trim() || '';
  const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const ok = currentRating > 0 && okEmail && !ratingSubmitting;
  if (r.ratingSend) r.ratingSend.disabled = !ok;
  if (r.ratingHint)
    r.ratingHint.textContent = ok ? '' : 'Enter valid email and select rating.';
}

// Aç (ID’yi garantiye al)
document.addEventListener('click', e => {
  const r = refs();
  if (e.target.closest('#pm-rate-btn')) {
    // overlay’e id’yi yeniden yaz
    const idNow =
      r.content?.dataset?.recipeId || window.__currentRecipeId || '';
    if (idNow && r.ratingOverlay)
      r.ratingOverlay.dataset.recipeId = String(idNow);

    currentRating = 0;
    ratingSubmitting = false;
    r.ratingValueEl && (r.ratingValueEl.textContent = '0.00');
    r.ratingEmail && (r.ratingEmail.value = '');
    r.ratingHint && (r.ratingHint.textContent = '');
    r.ratingSend && (r.ratingSend.disabled = true);
    clearRatingStars(r.ratingStars);
    show(r.ratingOverlay);
    return;
  }
  // Kapat
  if (
    e.target.closest('#rating-close') ||
    (r.ratingOverlay && e.target === r.ratingOverlay)
  ) {
    hide(r.ratingOverlay);
  }
});

// E-posta girildikçe buton aktif/pasif
document.addEventListener('input', e => {
  const r = refs();
  if (e.target === r.ratingEmail) validateRatingForm(r);
});

// Yarım/dolu seçimi
document.addEventListener('click', e => {
  const r = refs();
  const halfBtn = e.target.closest('.half-btn');
  if (!halfBtn || !r.ratingStars?.contains(halfBtn)) return;
  const val = parseFloat(halfBtn.dataset.val || halfBtn.dataset.value);
  if (!val) return;
  currentRating = val;
  r.ratingValueEl && (r.ratingValueEl.textContent = val.toFixed(2));
  paintRatingStars(r.ratingStars, val);
  validateRatingForm(r);
});

// Gönder
document.addEventListener('click', async e => {
  const r = refs();
  if (!e.target.closest('#rating-send')) return;

  if (ratingSubmitting) return;

  // ID’yi 3 farklı yerden güvenli al
  const id =
    r.ratingOverlay?.dataset?.recipeId ||
    r.content?.dataset?.recipeId ||
    window.__currentRecipeId ||
    '';
  if (!id) {
    if (r.ratingHint) {
      r.ratingHint.textContent = 'Technical error: recipe id missing.';
      r.ratingHint.classList.remove('ok');
    }
    return;
  }

  const payload = {
    rate: Number(currentRating),
    email: (r.ratingEmail?.value || '').trim(),
  };

  try {
    ratingSubmitting = true;
    validateRatingForm(r); // butonu kilitle
    r.ratingHint && (r.ratingHint.textContent = '');

    const url = `${API_ROOT}/recipes/${encodeURIComponent(id)}/rating`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let msg = 'Failed to send rating';
      try {
        const data = await res.json();
        if (data?.message) msg = data.message;
      } catch {}
      throw new Error(`${msg} (HTTP ${res.status})`);
    }

    // Başarılı
    if (r.ratingHint) {
      r.ratingHint.textContent = 'Thanks for rating!';
      r.ratingHint.classList.add('ok');
    }

    // Güncel rating'i çekip popup üstündeki değeri/ikonları güncelle
    try {
      const fresh = await fetch(
        `${API_ROOT}/recipes/${encodeURIComponent(id)}`
      ).then(x => x.json());
      r.pmRatingVal &&
        (r.pmRatingVal.textContent = format2Trunc(fresh?.rating));
      renderStaticStars(r.pmStars, fresh?.rating ?? 0);
    } catch {}

    setTimeout(() => hide(r.ratingOverlay), 900);
  } catch (err) {
    if (r.ratingHint) {
      r.ratingHint.textContent = err?.message || 'Error sending rating.';
      r.ratingHint.classList.remove('ok');
    }
  } finally {
    ratingSubmitting = false;
    validateRatingForm(r); // form durumunu eski haline getir
  }
});
