import { configureStore } from '@reduxjs/toolkit'

import turkishCheckersSlice from './turkishCheckersSlice';

export const store = configureStore({
    reducer: {
        turkishCheckers: turkishCheckersSlice,
    },
});
