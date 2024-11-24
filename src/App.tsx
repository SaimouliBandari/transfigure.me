import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner';
import './App.scss'

function App() {
  return (
    <>
      <Toaster position="top-right" visibleToasts={1}/>
      <Outlet />
    </>
  )
}

export default App
