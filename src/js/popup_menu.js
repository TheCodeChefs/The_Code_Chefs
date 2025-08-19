// popup_menu.js — API + YouTube + ingredients map + rating modal (half-stars + diagnostic sending)
console.log('✅ popup_menu.js yüklendi');
import { toggleFavorite } from './home-filter.js';

(function () {
  const API_ROOT = 'https://tasty-treats-backend.p.goit.global/api';

  /* ========== LocalStorage (favorites) ========== */
  const FAV_KEY = 'favorites';
  const getFavs = () => {
    try {
      return JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
    } catch {
      return [];
    }
  };
  const setFavs = list => localStorage.setItem(FAV_KEY, JSON.stringify(list));
  const inFavs = id => getFavs().some(r => r && (r._id === id || r.id === id));

  /* ========== Cache & fetch helpers ========== */
  const cache = { ingredientsMap: null, recipes: new Map() };
  const fetchJSON = async url => {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return r.json();
  };

  async function getIngredientsMap() {
    if (cache.ingredientsMap) return cache.ingredientsMap;
    const list = await fetchJSON(`${API_ROOT}/ingredients`);
    const map = new Map();
    (list || []).forEach(it => {
      const id = it._id || it.id;
      const name = it.ttl || it.title || it.name || it.ingredient || '';
      map.set(id, { id, name });
    });
    cache.ingredientsMap = map;
    return map;
  }

  async function getRecipeDetail(id) {
    if (cache.recipes.has(id)) return cache.recipes.get(id);
    const data = await fetchJSON(`${API_ROOT}/recipes/${id}`);
    cache.recipes.set(id, data);
    return data;
  }

  /* ========== Utils ========== */
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
  const starFilled = `<svg class="star" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
  const starEmpty = `<svg class="star empty" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24zm-10 6.11l-3.76 2.27 1-4.28L5.5 10.5l4.38-.38L12 6.1l2.12 4.02 4.38.38-3.74 3.84 1 4.28L12 15.35z"/></svg>`;
  const renderStars = (r = 0) =>
    `<span class="star-row">${starFilled.repeat(
      Math.min(5, Math.max(0, Math.floor(+r || 0)))
    )}${starEmpty.repeat(
      5 - Math.min(5, Math.max(0, Math.floor(+r || 0)))
    )}</span>`;
  const getRecipeId = recipe => String(recipe?._id || recipe?.id || '');

  // ingredient helpers (şema dayanıklı)
  const pickName = (it, map) => {
    if (!it) return '';
    if (typeof it === 'string') return it;
    const viaMap = map?.get?.(it.id || it._id);
    return (
      it.name ??
      it.title ??
      viaMap?.name ??
      it.ingredient ??
      it.product ??
      it.description ??
      it.item ??
      ''
    );
  };
  const pickMeasure = it => {
    if (!it || typeof it === 'string') return '';
    if (typeof it.measure === 'string') return it.measure;
    const q =
      it.quantity ?? it.qty ?? it.amount ?? it.value ?? it.count ?? it.number;
    const u =
      it.unit ?? it.unitShort ?? it.unitLong ?? it.measureUnit ?? it.units;
    if (q || u) return [q, u].filter(Boolean).join(' ');
    if (it.measure && typeof it.measure === 'object') {
      const mq = it.measure.quantity ?? it.measure.amount ?? it.measure.value;
      const mu = it.measure.unit ?? it.measure.unitShort ?? it.measure.units;
      if (mq || mu) return [mq, mu].filter(Boolean).join(' ');
    }
    if (it.measures?.metric) {
      const m = it.measures.metric;
      const mq = m.amount ?? m.quantity ?? m.value;
      const mu = m.unitShort ?? m.unit;
      if (mq || mu) return [mq, mu].filter(Boolean).join(' ');
    }
    return '';
  };
  const normalizeIngredients = recipe => {
    if (Array.isArray(recipe?.ingredients)) return recipe.ingredients;
    if (typeof recipe?.ingredients === 'string') {
      return recipe.ingredients
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean)
        .map(s => ({ name: s }));
    }
    if (Array.isArray(recipe?.components)) return recipe.components;
    if (Array.isArray(recipe?.extendedIngredients))
      return recipe.extendedIngredients;
    return [];
  };

  // YouTube helpers
  function extractYouTubeId(urlOrId = '') {
    const s = String(urlOrId).trim();
    if (!s) return '';
    if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
    const m =
      s.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      ) || s.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : '';
  }
  function youtubeEmbedUrl(recipe) {
    const raw =
      recipe?.youtube ||
      recipe?.video ||
      recipe?.youtubeUrl ||
      recipe?.youtubeLink ||
      recipe?.yt ||
      '';
    const id = extractYouTubeId(raw);
    return id
      ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`
      : '';
  }

  // ESC leak guard
  window.__pmEscHandler = window.__pmEscHandler || null;

  /* ========== PUBLIC: openPopup ========== */
  window.openPopup = async function (recipeOrId) {
    const overlay = document.getElementById('home-filter-popup-overlay');
    const content = document.getElementById('home-filter-popup-content');
    if (!overlay || !content)
      return console.error('❌ #popup-overlay/#popup-content yok.');

    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    // local veri ile iskelet
    let recipe =
      typeof recipeOrId === 'object'
        ? recipeOrId
        : getFavs().find(r => getRecipeId(r) === String(recipeOrId)) || {
            _id: recipeOrId,
          };
    renderSkeleton(content, recipe);
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    try {
      const id = getRecipeId(recipe);
      const [detail, map] = await Promise.all([
        id ? getRecipeDetail(id) : Promise.resolve(null),
        getIngredientsMap(),
      ]);
      recipe = { ...recipe, ...(detail || {}) };
      renderFull(content, overlay, recipe, map);
    } catch (err) {
      console.error('Popup fetch error:', err);
      content.innerHTML = errorView(err);
      bindClose(overlay);
    }
  };

  /* ========== PUBLIC: closePopup ========== */
  window.closePopup = function () {
    const overlay = document.getElementById('home-filter-popup-overlay');
    if (!overlay) return;
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
    if (window.__pmEscHandler) {
      document.removeEventListener('keydown', window.__pmEscHandler);
      window.__pmEscHandler = null;
    }
  };

  /* ========== Views ========== */
  function mediaHTML(recipe) {
    const yt = youtubeEmbedUrl(recipe);
    if (yt) {
      return `
        <div class="video-wrapper">
          <iframe class="video-iframe" src="${yt}" title="Recipe video" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen></iframe>
        </div>`;
    }
    return `<div class="media-frame" style="background-image:url('${esc(
      recipe?.preview || recipe?.thumb || ''
    )}')"></div>`;
  }

  function renderSkeleton(content, recipe) {
    content.innerHTML = `
      <button class="popup-x" type="button" aria-label="Close">×</button>
      <div class="media-wrapper"><div class="media-frame sk-bg"></div></div>
      <h2 class="recipe-title">${esc(recipe?.title || 'Loading...')}</h2>
      <div class="meta-line sk-line" style="height:16px;width:160px;"></div>
      <div class="ingredients">
        ${['', '', '', '', '']
          .map(
            () =>
              `<div class="ing-row"><span class="ing-name sk-line" style="width:60%"></span><span class="ing-measure sk-line" style="width:20%"></span></div>`
          )
          .join('')}
      </div>
      <div class="tags">${['', '', '']
        .map(
          () =>
            `<span class="tag-chip sk-line" style="width:90px;height:28px;"></span>`
        )
        .join('')}</div>
      <div class="recipe-description sk-block" style="height:90px"></div>
      <div class="popup-actions">
        <button class="btn btn-green" disabled>…</button>
        <button class="btn btn-outline" disabled>…</button>
      </div>`;
    bindClose(document.getElementById('home-filter-popup-overlay'));
  }

  function renderFull(content, overlay, recipe, ingredientsMap) {
    const timeText = recipe?.time?.minutes ?? recipe?.time ?? '';
    const tagsHTML = (recipe?.tags || [])
      .map(t => `<span class="tag-chip">#${esc(t)}</span>`)
      .join('');

    const ingList = normalizeIngredients(recipe);
    const ingredientsHTML = ingList
      .map(it => {
        const name = pickName(it, ingredientsMap);
        const meas = pickMeasure(it);
        return `<div class="ing-row"><span class="ing-name">${esc(
          name
        )}</span><span class="ing-measure">${esc(meas)}</span></div>`;
      })
      .join('');

    const favInitial = inFavs(getRecipeId(recipe))
      ? 'Remove from favorite'
      : 'Add to favorite';

    content.innerHTML = `
      <button class="popup-x" type="button" aria-label="Close">×</button>

      <div class="media-wrapper">
        ${mediaHTML(recipe)}
      </div>

      <h2 class="recipe-title">${esc(recipe?.title || 'Untitled')}</h2>

      <div class="meta-line">
        <span class="rating-val">${(Number(recipe?.rating) || 0).toFixed(
          1
        )}</span>
        ${renderStars(recipe?.rating)}
        ${
          timeText
            ? `<span class="dot">•</span><span class="cook-time">${esc(
                timeText
              )} min</span>`
            : ''
        }
      </div>

      <div class="ingredients">
        ${
          ingredientsHTML ||
          `<div class="ing-row"><span class="ing-name">Ingredients</span><span class="ing-measure">N/A</span></div>`
        }
      </div>

      <div class="tags">${tagsHTML}</div>

      <div class="recipe-description">
        ${esc(recipe?.description || recipe?.instructions || '')}
      </div>

      <div class="popup-actions">
        <button class="btn btn-green" id="pm-fav-btn">${favInitial}</button>
        <button class="btn btn-outline" id="pm-rate-btn">Give a rating</button>
      </div>
    `;

    bindClose(overlay);

    // favorites
    content.querySelector('#pm-fav-btn').addEventListener('click', () => {
      const list = getFavs();
      const id = getRecipeId(recipe);
      toggleFavorite(recipe, true);
      if (inFavs(id)) {
        setFavs(list.filter(r => getRecipeId(r) !== id));
        content.querySelector('#pm-fav-btn').textContent = 'Add to favorite';
      } else {
        setFavs([{ ...recipe }, ...list]);
        content.querySelector('#pm-fav-btn').textContent =
          'Remove from favorite';
      }
    });

    // rating modal trigger
    content.querySelector('#pm-rate-btn').addEventListener('click', () => {
      openRatingModal(recipe);
    });
  }

  function errorView(err) {
    return `
      <button class="popup-x" type="button" aria-label="Close" onclick="closePopup()">×</button>
      <div style="padding:12px">
        <h3 style="margin:8px 0;color:#b00020">Failed to load recipe</h3>
        <p style="color:#666;font-size:14px;">${esc(
          err?.message || 'Unknown error'
        )}</p>
      </div>`;
  }

  function bindClose(overlay) {
    const x = document.querySelector('.popup-x');
    if (x) x.onclick = () => window.closePopup();
    overlay.onclick = e => {
      if (e.target === overlay) window.closePopup();
    };
    if (window.__pmEscHandler)
      document.removeEventListener('keydown', window.__pmEscHandler);
    window.__pmEscHandler = ev => {
      if (ev.key === 'Escape') window.closePopup();
    };
    document.addEventListener('keydown', window.__pmEscHandler);
  }

  /* ========== Rating send (diagnostic) ========== */
  async function sendRecipeRating(recipe, value, email) {
    const recipeId = getRecipeId(recipe);
    if (!recipeId) throw new Error('Missing recipe id');

    const url = `${API_ROOT}/recipes/${recipeId}/rating`;
    const payload = { rate: Number(value) }; // backend 0.5 destekliyorsa böyle bırak
    if (email) payload.email = email;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      mode: 'cors',
      cache: 'no-store',
    });

    let bodyText = '';
    try {
      bodyText = await res.clone().text();
    } catch {}
    console.groupCollapsed('[rating] response');
    console.log('URL:', url);
    console.log('Status:', res.status, res.statusText);
    console.log('Headers:', Object.fromEntries(res.headers.entries()));
    console.log('Body:', bodyText);
    console.groupEnd();

    if (!res.ok) {
      try {
        const data = JSON.parse(bodyText || '{}');
        throw new Error(data.message || `${res.status} ${res.statusText}`);
      } catch {
        throw new Error(bodyText || `${res.status} ${res.statusText}`);
      }
    }

    try {
      return JSON.parse(bodyText || '{}');
    } catch {
      return {};
    }
  }

  /* ========== Rating mini-modal (half-stars) ========== */
  function openRatingModal(recipe) {
    const content = document.getElementById('home-filter-popup-content');
    if (!content) return;

    const prev = content.querySelector('.rating-overlay');
    if (prev) prev.remove();

    const tpl = document.createElement('div');
    tpl.className = 'rating-overlay';
    tpl.innerHTML = `
      <div class="rating-card" role="dialog" aria-label="Rate recipe">
        <button class="rating-x" type="button" aria-label="Close">×</button>
        <h3 class="rating-title">Rating</h3>
        <div class="rating-row">
          <span class="rating-value">0.0</span>
          <div class="rating-stars" aria-label="Stars">
            ${[1, 2, 3, 4, 5]
              .map(
                i => `
              <div class="star-container" data-star="${i}">
                <button class="half-btn left"  data-val="${
                  i - 1 + 0.5
                }" aria-label="${i - 0.5} stars"></button>
                <button class="half-btn right" data-val="${i}" aria-label="${i} stars"></button>
                <svg viewBox="0 0 24 24" width="28" height="28">
                  <defs>
                    <linearGradient id="halfGradient-${i}" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="50%" stop-color="#FFC107"></stop>
                      <stop offset="50%" stop-color="#D6D6D6"></stop>
                    </linearGradient>
                  </defs>
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#D6D6D6"/>
                </svg>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <label class="rating-label">
          <input type="email" class="rating-email" placeholder="Enter email" />
        </label>

        <button class="btn rating-send" disabled>Send</button>
        <p class="rating-hint"></p>
      </div>
    `;
    content.appendChild(tpl);

    const card = tpl.querySelector('.rating-card');
    const xBtn = card.querySelector('.rating-x');
    const emailI = card.querySelector('.rating-email');
    const sendB = card.querySelector('.rating-send');
    const starsC = card.querySelector('.rating-stars');
    const valueL = card.querySelector('.rating-value');
    const hint = card.querySelector('.rating-hint');

    let current = 0;
    const validEmail = (s = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

    const paint = n => {
      current = n;
      valueL.textContent = n.toFixed(1);
      card.querySelectorAll('.star-container').forEach(cont => {
        const starNum = Number(cont.dataset.star);
        const path = cont.querySelector('svg path');
        if (n >= starNum) {
          path.setAttribute('fill', '#FFC107'); // full
        } else if (n >= starNum - 0.5) {
          path.setAttribute('fill', `url(#halfGradient-${starNum})`); // half
        } else {
          path.setAttribute('fill', '#D6D6D6'); // empty
        }
      });
      sendB.disabled = !(current && validEmail(emailI.value));
    };

    starsC.addEventListener('click', e => {
      const btn = e.target.closest('.half-btn');
      if (!btn) return;
      paint(Number(btn.dataset.val));
    });

    emailI.addEventListener('input', () => {
      sendB.disabled = !(current && validEmail(emailI.value));
    });

    xBtn.onclick = () => tpl.remove();
    tpl.addEventListener('click', e => {
      if (e.target === tpl) tpl.remove();
    });

    sendB.addEventListener('click', async () => {
      hint.textContent = '';
      sendB.disabled = true;
      try {
        await sendRecipeRating(recipe, current, emailI.value.trim());
        hint.textContent = 'Thanks for your rating!';
        hint.classList.add('ok');
        setTimeout(() => tpl.remove(), 900);
      } catch (err) {
        hint.textContent = String(
          err?.message || 'Failed to send rating. Please try again.'
        );
        hint.classList.remove('ok');
        sendB.disabled = false;
      }
    });
  }
})();
