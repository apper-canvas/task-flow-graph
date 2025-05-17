import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [],
  loading: false,
  error: null,
  currentCategory: null,
};

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    fetchCategoriesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCategoriesSuccess: (state, action) => {
      state.categories = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchCategoriesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addCategorySuccess: (state, action) => {
      state.categories.push(action.payload);
    },
    updateCategorySuccess: (state, action) => {
      const index = state.categories.findIndex(category => category.Id === action.payload.Id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategorySuccess: (state, action) => {
      state.categories = state.categories.filter(category => category.Id !== action.payload);
    },
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
    clearCategories: (state) => {
      state.categories = [];
    }
  },
});

export const {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  addCategorySuccess,
  updateCategorySuccess,
  deleteCategorySuccess,
  setCurrentCategory,
  clearCurrentCategory,
  clearCategories
} = categoriesSlice.actions;

export default categoriesSlice.reducer;