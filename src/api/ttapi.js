// api/ttapi.js
const BASE_URL = 'https://tasty-treats-backend.p.goit.global/api';

/** Generic fetch helper */
async function request(url, options = {}) {
  const res = await fetch(url, { cache: 'no-store', ...options });
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  }
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export const getEvents = () => request(`${BASE_URL}/events`);
export const getPopularRecipes = () => request(`${BASE_URL}/recipes/popular`);
export const getCategories = () => request(`${BASE_URL}/categories`);
export const getIngredients = () => request(`${BASE_URL}/ingredients`);
export const getAreas = () => request(`${BASE_URL}/areas`);
export const getRecipeDetails = id => request(`${BASE_URL}/recipes/${id}`);

/**
 * ✅ Doğru rating gönderimi
 * Endpoint: PATCH /recipes/:id/rating
 * Body: { rate: number(0.5..5 step=0.5), email: string }
 */
export async function sendRecipeRating(id, rate, email) {
  const payload = { rate: Number(rate), email: String(email || '').trim() };
  return request(`${BASE_URL}/recipes/${encodeURIComponent(id)}/rating`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(payload),
  });
}

/**
 * ⛔️ Eski kullanım (POST + { rating }) yanlıştı.
 * Geriye dönük uyum için bu fonksiyon, doğru olana yönlendirir.
 * email parametresi zorunlu — yoksa hata fırlatır.
 */
export async function setRecipeRating(id, rating, email) {
  if (!email) {
    throw new Error(
      'Email is required for rating (use sendRecipeRating(id, rate, email)).'
    );
  }
  return sendRecipeRating(id, rating, email);
}

export const setOrder = orderData =>
  request(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
