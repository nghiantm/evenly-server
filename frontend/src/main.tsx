import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router";

import { Auth0Provider } from '@auth0/auth0-react';
import LogIn from './routes/SignIn.tsx';
import Dashboard from './routes/Dashboard.tsx';
import Home from './routes/Home.tsx';
import AuthGuard from './routes/AuthGuard.tsx';
import { Provider as CharkaProvider } from './components/ui/provider.tsx';
import { Provider } from 'react-redux';
import Recent from './routes/Recent.tsx';
import AllExpenses from './routes/AllExpenses.tsx';
import { store } from './redux/store.ts';
import Group from './routes/Group.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {index: true, Component: Home },
      {path: "login", Component: LogIn},
      {
        path: "dashboard", 
        Component: AuthGuard,
        children: [
          {index: true, Component: Dashboard},
          {path: "recent", Component: Recent},
          {path: "all", Component: AllExpenses},
          { path: "group/:groupId", Component: Group },
        ]
      },
    ]
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
		domain={import.meta.env.VITE_AUTH0_DOMAIN}
		clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
		authorizationParams={{
        redirect_uri: `${window.location.origin}/dashboard`,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      }}
    >
      <Provider store={store}>
        <CharkaProvider>
          <RouterProvider router={router} />
        </CharkaProvider>
      </Provider>
    </Auth0Provider>
  </StrictMode>,
)
