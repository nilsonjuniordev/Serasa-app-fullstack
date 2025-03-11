import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Producer } from '../types/producer.types';

interface ProducerState {
  producers: Producer[];
  loading: boolean;
  error: string | null;
}

const initialState: ProducerState = {
  producers: [],
  loading: false,
  error: null,
};

export const fetchProducers = createAsyncThunk(
  'producer/fetchProducers',
  async () => {
    const response = await axios.get('http://147.79.83.158:3006/produtores');
    return response.data;
  }
);

export const deleteProducer = createAsyncThunk(
  'producer/deleteProducer',
  async (id: string) => {
    await axios.delete(`http://147.79.83.158:3006/produtores/${id}`);
    return id;
  }
);

const producerSlice = createSlice({
  name: 'producer',
  initialState,
  reducers: {
    setProducers: (state, action: PayloadAction<Producer[]>) => {
      state.producers = action.payload;
    },
    addProducer: (state, action: PayloadAction<Producer>) => {
      state.producers.push(action.payload);
    },
    updateProducer: (state, action: PayloadAction<Producer>) => {
      const index = state.producers.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.producers[index] = action.payload;
      }
    },
    removeProducer: (state, action: PayloadAction<number>) => {
      state.producers = state.producers.filter(p => p.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducers.fulfilled, (state, action) => {
        state.loading = false;
        state.producers = action.payload;
      })
      .addCase(fetchProducers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar produtores';
      })
      .addCase(deleteProducer.fulfilled, (state, action) => {
        state.producers = state.producers.filter(
          (producer) => producer.id !== Number(action.payload)
        );
      });
  },
});

export const { setProducers, addProducer, updateProducer, removeProducer } = producerSlice.actions;
export default producerSlice.reducer; 