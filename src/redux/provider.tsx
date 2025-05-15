// src/redux/provider.tsx
'use client';

import { ThemeRegistry } from '../theme/ThemeRegistry';
import { Provider } from 'react-redux';
import { store } from './store';
import { ReactNode } from 'react';

interface ReduxProviderProps {
  children: ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return <ThemeRegistry><Provider store={store}>{children}</Provider></ThemeRegistry>;
}