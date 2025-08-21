// js/popup_menu.js — favori toggle + rating + detay fetch + responsive düzen
const API_ROOT = 'https://tasty-treats-backend.p.goit.global/api';

/* ===== Helpers ===== */
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
const format2Trunc = v => {
  const n = Number.parseFloat(String(v ?? '').replace(',', '.'));
  if (!Number.isFinite(n)) return '0.00';
  const t = Math.trunc(n * 100) / 100;
  return t.toFixed(2);
};

/* ===== Sprite helper (yıldızlar için) ===== */
const SPRITE_PATH = '../img/icons.svg';
function svgIcon(name, className = '') {
  return `<svg class="icon ${className}" aria-hidden="true" focusable="false">
    <use href="${SPRITE_PATH}#icon-${name}"></use>
  </svg>`;
}

/* ===== Favorites (localStorage: OBJE DİZİSİ) ===== */
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
  window.dispatchEvent(new Event('favorites:updated'));
}
function getIdSafe(obj) {
  return obj?._id || obj?.id || obj?.recipeId || '';
}
function findIndexById(list, id) {
  const key = String(id);
  return (list || []).findIndex(r => String(getIdSafe(r)) === key);
}
function isFavorite(id) {
  return findIndexById(getFavorites(), id) !== -1;
}
function makeFavoritePayload(src) {
  const id = getIdSafe(src);
  const title = src?.title || '';
  const description = src?.description || '';
  const rating = Number(src?.rating) || 0;
  const preview =
    src?.preview || src?.thumb || src?.image_url || src?.imageUrl || '';
  let category = src?.category;
  if (!category) category = src?.category?.name || src?.categoryName || '';
  const categoryObj =
    typeof category === 'string' ? { name: category } : category || {};
  return {
    ...src,
    _id: id,
    title,
    description,
    rating,
    preview,
    category: categoryObj,
  };
}
function toggleFavoriteById(id, recipeObjForAdd) {
  const list = getFavorites();
  const idx = findIndexById(list, id);
  if (idx !== -1) {
    list.splice(idx, 1);
    setFavorites(list);
    return false;
  }
  const payload = makeFavoritePayload(recipeObjForAdd || { _id: id });
  list.unshift(payload);
  setFavorites(list);
  return true;
}

/* ===== Global durum ===== */
let currentRecipe = null;
let currentRating = 0;
window.__currentRecipeId = '';

/* ===== Refs ===== */
function refs() {
  return {
    overlay: qs('#popup-overlay'),
    content: qs('#popup-content'),
    pmVideo: qs('#pm-video'),
    pmIframe: qs('#pm-iframe'),
    pmImage: qs('#pm-image'),
    pmTitle: qs('#pm-title'),
    pmRatingVal: qs('#pm-rating-val'),
    pmStars: qs('#pm-stars'),
    pmTime: qs('#pm-time'),
    pmIngredients: qs('#pm-ingredients'),
    pmTags: qs('#pm-tags'),
    pmDesc: qs('#pm-desc'),
    favBtn: qs('#pm-fav-btn'),
    rateBtn: qs('#pm-rate-btn'),
    ratingOverlay: qs('#rating-overlay'),
    ratingStars: qs('#rating-stars'),
    ratingValueEl: qs('#rating-value'),
    ratingEmail: qs('#rating-email'),
    ratingSend: qs('#rating-send'),
    ratingHint: qs('#rating-hint'),
    playBtn: qs('#pm-play-btn'),
    clickCatcher: qs('#pm-click-catcher'),
  };
}

/* ===== Yıldızlar (popup başlığı altındaki statik gösterim) ===== */
const starFilledHTML = `<span class="star filled">${svgIcon('Star')}</span>`;
const starEmptyHTML = `<span class="star empty">${svgIcon(
  'Star-empty'
)}</span>`;
function renderStaticStars(container, val) {
  if (!container) return;
  const n = Number.parseFloat(String(val ?? '').replace(',', '.'));
  const rating = Number.isFinite(n) ? n : 0;
  const full = Math.max(0, Math.min(5, Math.floor(rating)));
  const empty = 5 - full;
  container.innerHTML = `<span class="star-row">
    ${starFilledHTML.repeat(full)}${starEmptyHTML.repeat(empty)}
  </span>`;
}

/* ===== Rating modal yıldız boyama ===== */
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
  const ok = currentRating > 0 && okEmail;
  if (r.ratingSend) r.ratingSend.disabled = !ok;
  if (r.ratingHint)
    r.ratingHint.textContent = ok ? '' : 'Enter valid email and select rating.';
}

/* ===== Tablet/desktop yerleşimi: tags + meta aynı satır ===== */
let __topRowInserted = false;
const BREAKPOINT = 780;

function ensureTopRow() {
  const r = refs();
  if (!r.content) return;

  // yerleştirme noktaları
  const ingredientsEl = r.pmIngredients;
  const tagsEl = r.pmTags;
  const metaEl = qs('.meta-line', r.content);

  if (!tagsEl || !metaEl) return;

  if (window.innerWidth >= BREAKPOINT) {
    if (!__topRowInserted) {
      const top = document.createElement('div');
      top.className = 'top-row';
      // ingredients'tan önce göstermek için:
      r.content.insertBefore(top, ingredientsEl);
      top.appendChild(tagsEl);
      top.appendChild(metaEl);
      __topRowInserted = true;
    }
  } else {
    // mobilde özgün akışa geri dön
    if (__topRowInserted) {
      // meta eski yerinde zaten ingredients'tan önceydi; ingredients'tan sonra tags vardı.
      r.content.insertBefore(metaEl, ingredientsEl); // meta ingredients'ın üstünde kalsın
      r.content.insertBefore(tagsEl, r.pmDesc); // tags tekrar description'dan önce
      const top = qs('.top-row', r.content);
      top && top.remove();
      __topRowInserted = false;
    }
  }
}

/* ===== renderDetails: popup alanlarını doldurur ===== */
function renderDetails(recipe) {
  const r = refs();
  if (!r.content) return;

  const id = String(recipe._id || recipe.id || '');
  if (id) {
    r.content.dataset.recipeId = id;
    if (r.ratingOverlay) r.ratingOverlay.dataset.recipeId = id;
    window.__currentRecipeId = id;
  }

  if (r.pmTitle) r.pmTitle.textContent = recipe.title || 'Untitled';
  if (r.pmRatingVal) r.pmRatingVal.textContent = format2Trunc(recipe.rating);
  renderStaticStars(r.pmStars, recipe.rating || 0);
  if (r.pmTime) r.pmTime.textContent = recipe.time ? recipe.time + ' min' : '';

  const yt = recipe.youtube || recipe.youtubeUrl || '';
  if (yt) {
    show(r.pmVideo);
    hide(r.pmImage);
    const vid = yt.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:\b|&|$)/)?.[1] || yt;
    if (r.pmIframe) {
      r.pmIframe.src = `https://www.youtube.com/embed/${vid}?enablejsapi=1&rel=0&modestbranding=1&playsinline=1`;
    }
  } else {
    hide(r.pmVideo);
    show(r.pmImage);
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
      ? 'Remove favorite'
      : 'Add to favorite';

  // geniş ekranda üst satırı kur
  ensureTopRow();
}

function syncFavBtnText() {
  const r = refs();
  const id = r.content?.dataset?.recipeId || window.__currentRecipeId || '';
  if (!r.favBtn || !id) return;
  r.favBtn.textContent = isFavorite(id) ? 'Remove favorite' : 'Add to favorite';
}

/* ============ GLOBAL: openPopup ============ */
window.openPopup = async function openPopup(recipeOrId) {
  const r = refs();
  if (!r.overlay) return;

  // body scroll kilidi
  document.documentElement.style.overflow = 'hidden';

  if (typeof recipeOrId === 'object' && recipeOrId) {
    currentRecipe = recipeOrId;
  } else {
    const idStr = String(recipeOrId ?? '');
    currentRecipe = { _id: idStr };
  }

  renderDetails(currentRecipe);
  show(r.overlay);
  syncFavBtnText();

  const id = String(currentRecipe._id || currentRecipe.id || '');
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

/* ======= Event listeners (popup, fav, rating vs.) ======= */
document.addEventListener('click', e => {
  const r = refs();
  if (e.target.closest('.popup-x') || (r.overlay && e.target === r.overlay)) {
    hide(r.overlay);
    document.documentElement.style.overflow = ''; // scroll kilidini aç
    if (r.pmIframe) r.pmIframe.src = '';
  }
});
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !qs('#rating-overlay.hidden')) return; // rating açıksa kapatma akışı aşağıda
  if (e.key === 'Escape') {
    const r = refs();
    hide(r.overlay);
    document.documentElement.style.overflow = '';
    if (r.pmIframe) r.pmIframe.src = '';
  }
});

document.addEventListener('click', e => {
  const r = refs();
  if (!e.target.closest('#pm-fav-btn')) return;
  const id = r.content?.dataset?.recipeId || window.__currentRecipeId || '';
  if (!id) return;
  const added = toggleFavoriteById(id, currentRecipe);
  if (r.favBtn)
    r.favBtn.textContent = added ? 'Remove favorite' : 'Add to favorite';
  window.dispatchEvent(new Event('favorites:updated'));
});

/* ===== Video Play / Pause ===== */
(function setupVideoControls() {
  const r = refs();
  if (!r.pmVideo) return;
  let isPlaying = false;
  r.playBtn?.addEventListener('click', () => {
    if (!r.pmIframe?.src) return;
    const sep = r.pmIframe.src.includes('?') ? '&' : '?';
    if (!r.pmIframe.src.includes('autoplay=1'))
      r.pmIframe.src += `${sep}autoplay=1`;
    r.pmVideo.classList.add('is-playing');
    isPlaying = true;
  });
  r.clickCatcher?.addEventListener('click', () => {
    if (!r.pmIframe?.src) return;
    r.pmIframe.src = r.pmIframe.src.replace(/[?&]autoplay=1/, '');
    r.pmVideo.classList.remove('is-playing');
    isPlaying = false;
  });
})();

/* ===== Rating overlay ===== */
document.addEventListener('click', e => {
  const r = refs();
  if (e.target.closest('#pm-rate-btn')) {
    currentRating = 0;
    if (r.ratingValueEl) r.ratingValueEl.textContent = '0.00';
    if (r.ratingEmail) r.ratingEmail.value = '';
    if (r.ratingHint) r.ratingHint.textContent = '';
    if (r.ratingSend) r.ratingSend.disabled = true;
    clearRatingStars(r.ratingStars);
    show(r.ratingOverlay);
    return;
  }
  if (
    e.target.closest('#rating-close') ||
    (r.ratingOverlay && e.target === r.ratingOverlay)
  ) {
    hide(r.ratingOverlay);
  }
});
window.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const r = refs();
  if (!r.ratingOverlay?.classList.contains('hidden')) hide(r.ratingOverlay);
});

document.addEventListener('click', e => {
  const r = refs();
  const halfBtn = e.target.closest('.half-btn');
  if (!halfBtn || !r.ratingStars?.contains(halfBtn)) return;
  const val = parseFloat(halfBtn.dataset.val || halfBtn.dataset.value);
  if (!val) return;
  currentRating = val;
  if (r.ratingValueEl) r.ratingValueEl.textContent = val.toFixed(2);
  paintRatingStars(r.ratingStars, val);
  validateRatingForm(r);
});
document.addEventListener('input', e => {
  const r = refs();
  if (e.target === r.ratingEmail) validateRatingForm(r);
});
document.addEventListener('click', async e => {
  const r = refs();
  if (!e.target.closest('#rating-send')) return;
  const id =
    r.ratingOverlay?.dataset?.recipeId || r.content?.dataset?.recipeId || '';
  if (!id) return;
  const payload = {
    rate: currentRating,
    email: r.ratingEmail?.value.trim() || '',
  };
  try {
    if (r.ratingSend) r.ratingSend.disabled = true;
    const res = await fetch(
      `${API_ROOT}/recipes/${encodeURIComponent(id)}/rating`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) throw new Error('Failed to send rating');
    if (r.ratingHint) {
      r.ratingHint.textContent = 'Thanks for rating!';
      r.ratingHint.classList.add('ok');
    }
    try {
      const fresh = await fetch(
        `${API_ROOT}/recipes/${encodeURIComponent(id)}`
      ).then(x => x.json());
      if (r.pmRatingVal)
        r.pmRatingVal.textContent = format2Trunc(fresh?.rating);
      renderStaticStars(r.pmStars, fresh?.rating ?? 0);
    } catch {}
    setTimeout(() => hide(r.ratingOverlay), 900);
  } catch (err) {
    if (r.ratingHint) {
      r.ratingHint.textContent = err?.message || 'Error sending rating.';
      r.ratingHint.classList.remove('ok');
    }
  } finally {
    if (r.ratingSend) r.ratingSend.disabled = false;
  }
});

/* ===== Resize: üst satırı canlı güncelle ===== */
window.addEventListener('resize', ensureTopRow);
