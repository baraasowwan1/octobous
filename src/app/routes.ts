import { createBrowserRouter } from 'react-router';
import { Root } from './components/Root';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Portfolio } from './pages/Portfolio';
import { Contact } from './pages/Contact';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          { index: true, Component: Home },
          { path: 'about', Component: About },
          { path: 'portfolio', Component: Portfolio },
          { path: 'contact', Component: Contact },
        ],
      },
    ],
  },
]);
