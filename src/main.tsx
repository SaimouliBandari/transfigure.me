import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import './index.scss'
// import Dashboard from './views/Dashboard/Dashboard.tsx'
import { StyledEngineProvider } from '@mui/material'
import Dashboard from 'views/DashboardV2/Dashboard.tsx'

const routes = createBrowserRouter([
  {
    path: '',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Dashboard />
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <RouterProvider router={routes} />
    </StyledEngineProvider>

  </StrictMode>
)
