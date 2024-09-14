import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FC } from 'react';

import Landing from './pages/Landing/Landing';
import './App.css';
import './styles/reset.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
]);

const App: FC = () => {
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
