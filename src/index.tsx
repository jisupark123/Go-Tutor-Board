import '@/global/styles/index.css';
import { StrictMode } from 'react';
import { SoundProvider } from '@dodagames/go';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';

import router from '@/routes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SoundProvider>
      <RouterProvider router={router} />
    </SoundProvider>
  </StrictMode>,
);
