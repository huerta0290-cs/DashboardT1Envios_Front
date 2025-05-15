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
    finances: financesReducer,
    // Otros reducers se agregarán cuando implementemos las otras pestañas
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar ciertas acciones y caminos para evitar advertencias de serialización
        ignoredActions: ['dashboard/fetchData/fulfilled'],
        ignoredPaths: ['dashboard.data'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;