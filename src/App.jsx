import React, { useEffect } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRoutes, BrowserRouter } from 'react-router-dom';
import Landing from './Pages/Landing';
import '../style.css';
import Login from './Pages/Login';
import Home from './Pages/administrador/Home';
import Register from './Pages/Register';

const AppRoutes = () => {
  let routes = useRoutes([
    { path: "/", element: <Landing /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/administrador/home', element: <Home /> }
  ]);

  return routes;
}

export default function App() {
  useEffect(() => {
    document.body.classList.add('fade-in');

    return () => {
      document.body.classList.remove('fade-in');
    };
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
