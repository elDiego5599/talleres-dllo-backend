import React from 'react';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <div style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>API Backend Biblioteca</h1>
      <p>Frontend deshabilitado</p>
      <p>El servidor está activo</p>
    </div>
  );
}