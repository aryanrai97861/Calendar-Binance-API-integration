import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Timeframe = '1d' | '1w' | '1M';

interface TimeframeState {
  value: Timeframe;
}

const initialState: TimeframeState = {
  value: '1d',
};

const timeframeSlice = createSlice({
  name: 'timeframe',
  initialState,
  reducers: {
    setTimeframe: (state, action: PayloadAction<Timeframe>) => {
      state.value = action.payload;
    },
  },
});

export const { setTimeframe } = timeframeSlice.actions;
export default timeframeSlice.reducer; 