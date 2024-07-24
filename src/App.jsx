import React from 'react'
import '@coreui/coreui/dist/css/coreui.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useRoutes, BrowserRouter } from 'react-router-dom'
import Home from './Pages/Home'
import "../style.css"
import SubirProyecto from './Pages/usuario/SubirProyecto'

const AppRoutes = () => {
  let routes = useRoutes([
    { path: "/", element: <Home/> },
    { path: "/subir-proyecto", element: <SubirProyecto /> }
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