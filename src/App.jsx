import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import AppRouter from './routes/AppRouter';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import NetworkStatus from './components/NetworkStatus';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <NetworkStatus />
      <PWAInstallPrompt />
      <AppRouter />
    </Provider>
  );
}

export default App;
