'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { initAuth } from './authSlice';

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(initAuth());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
