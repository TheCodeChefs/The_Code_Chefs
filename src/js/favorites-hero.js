// favorites-hero.js — mobilde LS boşsa gizle; değişiklikleri canlı izle

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.favorites-hero .container');
  if (!container) return;

  // Mobil tanımı
  const mqMobile = window.matchMedia('(max-width: 767px)');

  const getFavoritesCount = () => {
    try {
      const raw = localStorage.getItem('favorites');
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.length : 0;
    } catch {
      return 0;
    }
  };

  const buildHero = () => {
    if (container.querySelector('.f-hero__media')) return; // zaten var
    const picture = document.createElement('picture');

    // Desktop
    const sourceDesktop = document.createElement('source');
    sourceDesktop.media = '(min-width: 1280px)';
    sourceDesktop.srcset = `
      ./img/f-hero-desktop@1x.jpg 1x,
      ./img/f-hero-desktop@2x.jpg 2x
    `;
    picture.appendChild(sourceDesktop);

    // Tablet
    const sourceTablet = document.createElement('source');
    sourceTablet.media = '(min-width: 768px)';
    sourceTablet.srcset = `
      ./img/f-hero-tablet@1x.jpg 1x,
      ./img/f-hero-tablet@2x.jpg 2x
    `;
    picture.appendChild(sourceTablet);

    // Mobile
    const img = document.createElement('img');
    img.className = 'f-hero__img';
    img.src = './img/f-hero-mobile@1x.jpg';
    img.srcset = `
      ./img/f-hero-mobile@1x.jpg 1x,
      ./img/f-hero-mobile@2x.jpg 2x
    `;
    img.alt = 'Öne çıkan lezzetli yemek sunumu';
    img.loading = 'lazy';
    picture.appendChild(img);

    // Wrapper
    const mediaWrapper = document.createElement('div');
    mediaWrapper.className = 'f-hero__media';
    mediaWrapper.appendChild(picture);

    container.appendChild(mediaWrapper);
  };

  const destroyHero = () => {
    const media = container.querySelector('.f-hero__media');
    if (media) media.remove();
  };

  const renderHero = () => {
    const hasFavorites = getFavoritesCount() > 0;
    const isMobile = mqMobile.matches;

    // SADECE mobilde ve boşken gizle; diğer tüm durumlarda göster
    if (!hasFavorites && isMobile) {
      destroyHero();
    } else {
      buildHero();
    }
  };

  // --- İlk render
  renderHero();

  // --- Breakpoint değişince yeniden değerlendir
  mqMobile.addEventListener('change', renderHero);

  // --- Favoriler güncellemeleri (aynı sekmede custom event, farklı sekmede storage)
  window.addEventListener('favorites:updated', renderHero);
  window.addEventListener('storage', e => {
    if (e.key === 'favorites') renderHero();
  });

  // --- Açılışta veri geç gelirse (async yazımlar için kısa retry)
  let tries = 0;
  const maxTries = 12; // ~6 saniye (500ms x 12)
  const t = setInterval(() => {
    tries++;
    renderHero(); // her seferinde koşulu tekrar değerlendir
    if (getFavoritesCount() > 0 || tries >= maxTries) clearInterval(t);
  }, 500);
});
