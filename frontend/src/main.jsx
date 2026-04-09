import React from 'react';
import ReactDOM from 'react-dom/client';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { Provider } from 'react-redux';
import App from './App';
import Utils from './Utils/Utils';
import { store } from './store/store';

const cache = createCache({
  key: 'prfl' + Utils.generateRandomString(5),
  prepend: true,
});

const cleanupStaleServiceWorkers = async () => {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  } catch (error) {
    console.warn('Failed to unregister stale service workers.', error);
  }

  if (!('caches' in window)) {
    return;
  }

  try {
    const cacheKeys = await window.caches.keys();
    await Promise.all(cacheKeys.map((cacheKey) => window.caches.delete(cacheKey)));
  } catch (error) {
    console.warn('Failed to clear stale browser caches.', error);
  }
};

void cleanupStaleServiceWorkers();

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <CacheProvider value={cache}>
      <App />
    </CacheProvider>
  </Provider>
);
