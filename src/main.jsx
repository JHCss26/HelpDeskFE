import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { Chart as ChartJs, ArcElement, Tooltip, Legend, LinearScale, CategoryScale, Title, BarElement } from 'chart.js';
const base = import.meta.env.VITE_BASENAME

ChartJs.register(ArcElement, Tooltip, Legend, LinearScale, CategoryScale, Title, BarElement);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={base} future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
        <React.Suspense fallback={<div>Loading...</div>}>
          <App />
        </React.Suspense>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
