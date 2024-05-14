import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'

export const fetchProducts = createAsyncThunk(
  'test/fetchData/fulfilled',
  async () => {
    try {
      const response = await axios.get('https://dummyjson.com/products');

      return response.data.products;
    } catch (error) {
      throw error;
    }
  }
);
export const createProduct = createAsyncThunk(
  'product/createProduct/fulfilled',
  async (body: any) => {
    try {
      body.id = Date.now()
      const response = await axios.post('https://dummyjson.com/products/add', JSON.stringify(body));

      return response.data.products;
    } catch (error) {
      throw error;
    }
  }
);
export const updateProduct = createAsyncThunk(
  'product/updateProduct/fulfilled',
  async (body: any) => {
    try {
      const response = await axios.put(`https://dummyjson.com/products/${body.id}`, {
        title: body.title,
        price: body.price,
        brand: body.brand,
        description: body.description,
        category: body.category
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }
);
export const deleteProduct = createAsyncThunk(
  'product/deleteProduct/fulfilled',
  async (productId: any) => {
    try {
      const response = await axios.delete(`https://dummyjson.com/products/${productId}`);
      return response.data.products;
    } catch (error) {
      throw error;
    }
  }
);

const initialState = {
  data: []
}

const slice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.data = [action.meta.arg, ...state.data] as any;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        console.log('update')
      })
      .addCase(deleteProduct.fulfilled, (state, action: any) => {
        state.data = state.data.filter((elem: any) => elem.id !== action.meta.arg) as any;
      })
  },
});

export default slice.reducer;
