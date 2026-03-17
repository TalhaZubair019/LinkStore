'use client';

import { Provider } from 'react-redux';
import { store } from './Store';
import SyncHandler from '../components/SyncHandler';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SyncHandler>
        {children}
      </SyncHandler>
    </Provider>
  );
}

