import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InstrumentState {
  symbol: string;
}

const initialState: InstrumentState = {
  symbol: 'BTCUSDT',
};

const instrumentSlice = createSlice({
  name: 'instrument',
  initialState,
  reducers: {
    setInstrument: (state, action: PayloadAction<string>) => {
      state.symbol = action.payload;
    },
  },
});

export const { setInstrument } = instrumentSlice.actions;
export default instrumentSlice.reducer; 