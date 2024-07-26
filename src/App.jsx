import React, { useEffect } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRoutes, BrowserRouter } from 'react-router-dom';
import Landing from './Pages/Landing';
import '../style.css';
import Login from './Pages/Login';
import HomeAdmin from './Pages/administrador/Home';
import Register from './Pages/Register';
import HomeUsers from './Pages/usuarios/Home';
import UploadProyect from './Pages/usuarios/UploadProyect';
import MyProyects from './Pages/usuarios/MyProyects';
import ForgotPasswordForm from './Pages/ForgotPassword';
import Projects from './Pages/administrador/Projects';
import VisualizarUsuarios from './Pages/administrador/VisualizarUsuarios';
import ResetPassword from './Pages/ResetPassword';

const AppRoutes = () => {
  let routes = useRoutes([
    { path: "/", element: <Landing /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/reset-password', element: <ResetPassword/> },
    { path: '/forgot-password', element: <ForgotPasswordForm/> },
    { path: '/administrador/home', element: <HomeAdmin /> },
    { path: '/administrador/proyectos', element: <Projects /> },
    { path: '/administrador/usuarios', element: <VisualizarUsuarios /> },
    { path: '/usuarios/home', element: <HomeUsers /> },
    { path: '/usuarios/nuevoproyecto', element: <UploadProyect /> },
    { path: '/usuarios/misproyectos', element: <MyProyects /> }
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
