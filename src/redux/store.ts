// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './features/dashboardSlice';
import carriersReducer from './features/carriersSlice';
import customersReducer from './features/customersSlice';
import incidentsReducer from './features/incidentsSlice';
import financesReducer from './features/financesSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    carriers: carriersReducer,
    customers: customersReducer,
    incidents: incidentsReducer,
    finances: financesReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Tipado para useSelector y useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;