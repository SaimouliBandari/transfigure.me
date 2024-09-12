import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import Dashboard from './views/Dashboard/Dashboard.tsx'

const routes = createBrowserRouter([
  {
    path: '',
    element: <App/>,
    children: [
      {
        path: '/',
        element: <Dashboard/>
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={routes}/>
  </StrictMode>
)
