import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './i18n';

import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://226e24857691d4b60fc6c23c1143eaa1@o4505940858568704.ingest.sentry.io/4505940859944960",
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ["focusapp-c58cf.web.app", /^https:\/\/yourserver\.io\/api/],
    }),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

const container = document.getElementById('root');

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={
            <App />
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
