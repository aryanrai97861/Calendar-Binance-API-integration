import { configureStore } from '@reduxjs/toolkit';
import instrumentReducer from './instrumentSlice';
import timeframeReducer from './timeframeSlice';
import dataReducer from './dataSlice';

export const store = configureStore({
  reducer: {
    instrument: instrumentReducer,
    timeframe: timeframeReducer,
    data: dataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 