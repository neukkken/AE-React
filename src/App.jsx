import React from 'react'
import '@coreui/coreui/dist/css/coreui.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useRoutes, BrowserRouter } from 'react-router-dom'
import Home from './Pages/Home'

const AppRoutes = () => {
  let routes = useRoutes([
    { path: "/", element: <Home/>}
  ])

  return routes
}

export default function App() {
    return (
      <>
        <BrowserRouter>
          <AppRoutes/>
        </BrowserRouter>
      </>
  )
}
