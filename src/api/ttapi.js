const BASE_URL = 'https://tasty-treats-backend.p.goit.global/api';

export const getEvents = async () => {
  try {
    const response = await fetch(`${BASE_URL}/events`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};
export const getPopularRecipes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/recipes/popular`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching popular recipes:', error);
    throw error;
  }
};
export const getCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
/*export const getRecipesByCategory = async (
  category,
  page = 1,
  limit = 6,
  time,
  area,
  ingredients
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/recipes?category=${category}&page=${page}&limit=${limit}&time=${time}&area=${area}&ingredients=${ingredients}`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Recipes by category:', data);
  } catch (error) {
    console.error('Error fetching recipes by category:', error);
    throw error;
  }
};
*/
export const getRecipeDetails = async id => {
  try {
    const response = await fetch(`${BASE_URL}/recipes/${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};

export const setRecipeRating = async (id, rating) => {
  try {
    const response = await fetch(`${BASE_URL}/recipes/${id}/rating`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error setting recipe rating:', error);
    throw error;
  }
};

export const getIngredients = async () => {
  try {
    const response = await fetch(`${BASE_URL}/ingredients`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    throw error;
  }
};

export const getAreas = async () => {
  try {
    const response = await fetch(`${BASE_URL}/areas`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching areas:', error);
    throw error;
  }
};

export const setOrder = async orderData => {
  try {
    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error setting order:', error);
    throw error;
  }
};
