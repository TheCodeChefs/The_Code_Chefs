import axios from 'axios';

const API_BASE = 'https://tasty-treats-backend.p.goit.global/api';

const categoryListEl = document.getElementById('category-list');
const allCategoriesBtn = document.querySelector('.all-categories-button');
const searchInput = document.getElementById('search-input');
const recipeGridEl = document.getElementById('recipe-grid');
const emptyRecipeGridEl = document.getElementById('empty-recipe-grid');

const resetBtn = document.getElementById('reset-button');

const timeSelect = document.getElementById('time-select');
const areaSelect = document.getElementById('area-select');
const ingredientSelect = document.getElementById('ingredient-select');
const paginationEl = document.getElementById('pagination');

let selectedCategory = null;
let searchQuery = '';
let selectedTime = '';
let selectedArea = '';
let selectedIngredient = '';
let currentPage = 1;
const recipesPerPage = 9;

// Favorileri localStorage destekli Set ile yönetiyoruz
let favorites = [];

function isInFavorites(id) {
  return favorites.some(item => item._id === id);
}

function saveFavoritesToLocalStorage() {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function loadFavoritesFromLocalStorage() {
  const favs = localStorage.getItem('favorites');
  if (favs) {
    try {
      const favArray = JSON.parse(favs);
      favArray.forEach(item => favorites.push(item));
    } catch {
      // Hatalı veri varsa temizle
      localStorage.removeItem('favorites');
    }
  }
}

async function loadCategories() {
  try {
    const res = await axios.get(`${API_BASE}/categories`);
    const categories = res.data;
    categoryListEl.innerHTML = '';

    categories.forEach(cat => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.textContent = cat.name;
      btn.classList.add('category-btn');
      btn.addEventListener('click', () => {
        selectedCategory = cat.name;
        currentPage = 1;
        updateCategoryActive();
        fetchAndRenderRecipes();
      });
      li.appendChild(btn);
      categoryListEl.appendChild(li);
    });
  } catch (err) {
    console.error('Kategori yüklenirken hata:', err);
  }
}

function updateCategoryActive() {
  allCategoriesBtn.classList.remove('active');
  categoryListEl
    .querySelectorAll('li')
    .forEach(li => li.classList.remove('active'));

  if (selectedCategory === null) {
    allCategoriesBtn.classList.add('active');
  } else {
    categoryListEl.querySelectorAll('li').forEach(li => {
      const btn = li.querySelector('button');
      if (btn.textContent === selectedCategory) {
        li.classList.add('active');
      }
    });
  }
}

allCategoriesBtn.addEventListener('click', () => {
  selectedCategory = null;
  currentPage = 1;
  updateCategoryActive();
  fetchAndRenderRecipes();
});

searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value.trim();
  currentPage = 1;
  fetchAndRenderRecipes();
});

resetBtn.addEventListener('click', () => {
  selectedCategory = null;
  searchQuery = '';
  selectedTime = '';
  selectedArea = '';
  selectedIngredient = '';
  searchInput.value = '';
  timeSelect.value = '';
  areaSelect.value = '';
  ingredientSelect.value = '';
  currentPage = 1;
  updateCategoryActive();
  fetchAndRenderRecipes();
});

timeSelect.addEventListener('change', () => {
  selectedTime = timeSelect.value;
  currentPage = 1;
  fetchAndRenderRecipes();
});

areaSelect.addEventListener('change', () => {
  selectedArea = areaSelect.value;
  currentPage = 1;
  fetchAndRenderRecipes();
});

ingredientSelect.addEventListener('change', () => {
  selectedIngredient = ingredientSelect.value;
  currentPage = 1;
  fetchAndRenderRecipes();
});

function fillTimeOptions() {
  const times = [15, 30, 45, 60, 90, 120];
  timeSelect.innerHTML = `<option value="">All times</option>`;
  times.forEach(t => {
    const option = document.createElement('option');
    option.value = t;
    option.textContent = `${t} minutes`;
    timeSelect.appendChild(option);
  });
}

async function fillAreaOptions() {
  try {
    const res = await axios.get(`${API_BASE}/areas`);
    const areas = res.data;
    areaSelect.innerHTML = `<option value="">All areas</option>`;
    areas.forEach(area => {
      const option = document.createElement('option');
      option.value = area.name;
      option.textContent = area.name;
      areaSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Area options yüklenirken hata:', err);
  }
}

async function fillIngredientOptions() {
  try {
    const res = await axios.get(`${API_BASE}/ingredients`);
    const ingredients = res.data;
    ingredientSelect.innerHTML = `<option value="">All ingredients</option>`;
    ingredients.forEach(ing => {
      const option = document.createElement('option');
      option.value = ing._id;
      option.textContent = ing.name;
      ingredientSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Ingredient options yüklenirken hata:', err);
  }
}

async function fetchAndRenderRecipes(page = 1) {
  currentPage = page;
  recipeGridEl.innerHTML = 'Loading...';

  try {
    const params = {
      page: currentPage,
      limit: recipesPerPage,
    };
    if (selectedCategory) params.category = selectedCategory;
    if (searchQuery) params.title = searchQuery;
    if (selectedTime) params.time = selectedTime;
    if (selectedArea) params.area = selectedArea;
    if (selectedIngredient) params.ingredient = selectedIngredient;

    const res = await axios.get(`${API_BASE}/recipes`, { params });
    const recipes = res.data.results || [];
    const totalPages = res.data.totalPages || 1;

    if (!recipes.length) {
      recipeGridEl.innerHTML = '';
      emptyRecipeGridEl.innerHTML = `<svg
        class="icon-empty-recipes"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 97 83"
        width="97"
        height="83"
      >
        <use href="../svg/symbol-defs.svg#icon-empty-recipes"></use>
        </svg>
        <p>No recipes found.</p>`;
      paginationEl.innerHTML = '';
      return;
    }
    emptyRecipeGridEl.innerHTML = '';
    renderRecipes(recipes);
    renderPagination(totalPages, currentPage);
  } catch (err) {
    console.error('Tarifler yüklenirken hata:', err);
    recipeGridEl.innerHTML = '<p>Error loading recipes.</p>';
    paginationEl.innerHTML = '';
  }
}

function renderRating(rating) {
  let str = '';
  for (let i = 0; i < 5; i++) {
    if (i < parseInt(rating)) {
      str += ` <svg
        class="icon-yellow-star"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <use href="../svg/symbol-defs.svg#icon-yellow-star"></use>
        </svg>`;
    } else {
      str += ` <svg
        class="icon-empty-star"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <use href="../svg/symbol-defs.svg#icon-empty-star"></use>
        </svg>`;
    }
  }
  return str;
}

function renderFavoriteIcon(id) {
  const isFavorite = isInFavorites(id);
  return isFavorite
    ? `<svg
            class="icon-white-heart"
            viewBox="0 0 24 24"
        >
            <use href="../svg/symbol-defs.svg#icon-white-heart"></use>
        </svg>`
    : `<svg
            class="icon-heart"
            viewBox="0 0 24 24"
        >
            <use href="../svg/symbol-defs.svg#icon-heart"></use>
        </svg>`;
}

function getRecipeIdSafe(r) {
  return r?._id || r?.id;
}

function renderRecipes(recipes) {
  recipeGridEl.innerHTML = '';
  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'home-recipe-card';

    const imageUrl =
      recipe.thumb || 'https://via.placeholder.com/280x180?text=No+Image';
    card.style.backgroundImage = `linear-gradient(0.94deg, rgba(5, 5, 5, 0.6) 4.82%, rgba(5, 5, 5, 0.5) 18.72%), url(${imageUrl})`;

    const ratingValue = parseFloat(recipe.rating).toFixed(1);

    card.innerHTML = `
     <button id='favorite-button-${
       recipe._id
     }' class="favorite-btn">${renderFavoriteIcon(recipe._id)}</button>
     
      <div class="home-recipe-card-bottom">
        <div class="home-recipe-card-desc">
            <h3>${recipe.title}</h3>
            <p>${recipe.description || ''}</p>
        </div>
     
        <div class="home-recipe-card-button">
            <div class="stars">
                <div class="floatCount">
                ${ratingValue}
                </div>
                ${renderRating(ratingValue)}
            </div>
            <button class="see-recipe-btn">See Recipe</button>
       </div>
      </div>
    `;

    card.querySelector('.favorite-btn').addEventListener('click', () => {
      toggleFavorite(recipe);
    });

    // Popup açma
    card.querySelector('.see-recipe-btn').addEventListener('click', () => {
      const id = getRecipeIdSafe(recipe);
      if (typeof window.openPopup === 'function') {
        window.openPopup(id || recipe);
      } else {
        console.error('⚠️ openPopup fonksiyonu tanımlı değil!');
      }
    });

    recipeGridEl.appendChild(card);
  });
}

export function toggleFavorite(recipe, byPassLocalSave = false) {
  if (isInFavorites(recipe._id)) {
    favorites = favorites.filter(item => item._id !== recipe._id);
  } else {
    favorites.push(recipe);
  }

  const favoriteButton = document.getElementById(
    `favorite-button-${recipe._id}`
  );

  if (favoriteButton) {
    favoriteButton.innerHTML = renderFavoriteIcon(recipe._id);
  }

  !byPassLocalSave && saveFavoritesToLocalStorage();
}

function renderPagination(totalPages, currentPage) {
  paginationEl.innerHTML = '';

  const createBtn = (
    text,
    page,
    disabled = false,
    active = false,
    className = ''
  ) => {
    const btn = document.createElement('button');
    btn.innerHTML = text;
    btn.className = className;
    if (active) btn.classList.add('active');
    if (disabled) btn.classList.add('disabled');
    btn.disabled = disabled;
    btn.addEventListener('click', () => {
      if (!disabled) fetchAndRenderRecipes(page);
    });
    return btn;
  };

  paginationEl.appendChild(
    createBtn(
      `<svg
            class="icon-left-arrow-1 double"
            viewBox="0 0 48 48"
        >
            <use href="../svg/symbol-defs.svg#icon-left-arrow-1" transform="translate(-7, 0)"></use>
            <use href="../svg/symbol-defs.svg#icon-left-arrow-1" transform="translate(20, 0)"></use>
        </svg>`,
      1,
      currentPage === 1,
      false,
      'page-arrow-icon'
    )
  );
  paginationEl.appendChild(
    createBtn(
      `<svg
            class="icon-left-arrow-1"
            viewBox="0 0 24 24"
        >
            <use href="../svg/symbol-defs.svg#icon-left-arrow-1"></use>
        </svg>`,
      currentPage - 1,
      currentPage === 1,
      false,
      'page-arrow-icon'
    )
  );

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(currentPage - i) <= 1) {
      paginationEl.appendChild(createBtn(i, i, false, currentPage === i));
    } else if (
      (i === 2 && currentPage > 3) ||
      (i === totalPages - 1 && currentPage < totalPages - 2)
    ) {
      const dots = document.createElement('span');
      dots.textContent = '...';
      dots.classList.add('dots');
      paginationEl.appendChild(dots);
    }
  }

  paginationEl.appendChild(
    createBtn(
      `<svg
            class="icon-right-arrow-1"
            viewBox="0 0 24 24"
        >
            <use href="../svg/symbol-defs.svg#icon-right-arrow-1"></use>
        </svg>`,
      currentPage + 1,
      currentPage === totalPages,
      false,
      'page-arrow-icon'
    )
  );
  paginationEl.appendChild(
    createBtn(
      `<span><svg
            class="icon-right-arrow-1 double"
            viewBox="0 0 48 48"
        >
            <use href="../svg/symbol-defs.svg#icon-right-arrow-1" transform="translate(-7, 0)"></use>
            <use href="../svg/symbol-defs.svg#icon-right-arrow-1" transform="translate(20, 0)"></use>
        </svg></span>`,
      totalPages,
      currentPage === totalPages,
      false,
      'page-arrow-icon'
    )
  );
}

async function loadPopularRecipes() {
  try {
    const response = await axios.get(`${API_BASE}/recipes/popular`);
    const recipes = response.data;
    const popularList = document.querySelector('#popular-list');
    popularList.innerHTML = '';

    recipes.forEach(recipe => {
      const li = document.createElement('li');
      li.classList.add('popular-card');

      const image =
        recipe.preview ||
        recipe.thumb ||
        'https://via.placeholder.com/100x70?text=No+Image';
      const title = recipe.title || 'Untitled';
      const description =
        recipe.description || recipe.instructions || 'No description available';

      li.className = 'popular-card';
      li.innerHTML = `
  <img src="${image}" alt="${title}" />
  <div class="popular-card-info">
    <h4 class="popular-card-title" >${title}</h4>
    <p class="popular-card-desc">${description}</p>
  </div>
`;

      li.addEventListener('click', () => {
        const id = getRecipeIdSafe(recipe);
        if (typeof window.openPopup === 'function') {
          window.openPopup(id || recipe);
        } else {
          console.error('⚠️ openPopup fonksiyonu tanımlı değil!');
        }
      });

      popularList.appendChild(li);
    });
  } catch (error) {
    console.error('Popüler tarifler alınamadı:', error);
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  loadFavoritesFromLocalStorage();

  selectedCategory = null;
  selectedTime = '';
  selectedArea = '';
  selectedIngredient = '';
  updateCategoryActive();
  await loadCategories();
  fillTimeOptions();
  await fillAreaOptions();
  await fillIngredientOptions();
  await fetchAndRenderRecipes();
  await loadPopularRecipes();
});
