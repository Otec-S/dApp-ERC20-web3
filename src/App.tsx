import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FC } from 'react';

import Landing from './pages/Landing/Landing';
import './App.css';
import SendERC20 from './pages/SendERC20/send-ERC-20';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/send-ERC20-tokens',
    element: <SendERC20 />,
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
