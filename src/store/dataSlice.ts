import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchKlines, Kline, BinanceInterval } from '@/services/binance';

interface DataState {
  data: {
    [symbol: string]: {
      [interval: string]: Kline[];
    };
  };
  loading: boolean;
  error: string | null;
}

const initialState: DataState = {
  data: {},
  loading: false,
  error: null,
};

export const fetchKlinesThunk = createAsyncThunk(
  'data/fetchKlines',
  async (
    { symbol, interval }: { symbol: string; interval: BinanceInterval },
    { rejectWithValue }
  ) => {
    try {
      const klines = await fetchKlines(symbol, interval);
      return { symbol, interval, klines };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch data');
    }
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchKlinesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKlinesThunk.fulfilled, (state, action: PayloadAction<{ symbol: string; interval: string; klines: Kline[] }>) => {
        const { symbol, interval, klines } = action.payload;
        if (!state.data[symbol]) state.data[symbol] = {};
        state.data[symbol][interval] = klines;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchKlinesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dataSlice.reducer; 