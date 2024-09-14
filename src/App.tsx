import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FC } from 'react';

import Landing from './pages/Landing/Landing';
import './App.css';
import SendERC20Component from './components/send-ERC-20-component/send-ERC-20-component';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/send-ERC20-tokens',
    element: <SendERC20Component />,
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
