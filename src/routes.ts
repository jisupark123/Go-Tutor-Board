import { createBrowserRouter } from 'react-router';

import Home from '@/pages/Home';

const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: Home,
    },
  ],
  {
    basename: '/Go-Tutor-Board/', // 👈 GitHub Pages repo 이름
  },
);

export default router;
