import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './css/index.css'
import Home from './pages/Home.jsx'
import Saved from './pages/Saved.jsx'
import Suggestions from './pages/Suggestions.jsx'
import ProcessRemoved from './pages/ProcessRemoved.jsx'

const router = createBrowserRouter([
  {path: "/", element: <Home />},
  {path: "/saved", element: <Saved />},
  {path: "/suggestions", element: <Suggestions />},
  {path: "/processremoved", element: <ProcessRemoved/>}
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
