import React, { useEffect, useState } from 'react'
import Loader from '../Components/Loader'
import FullHeightLayout from '../Layouts/FullHeightLayout'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthUser from '../../utils/AuthUser'

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentRoute = location.pathname;

  useEffect(() => {
    const accessToken = localStorage.getItem('token'); // Asumiendo que el token está en localStorage
    if (accessToken) {
      AuthUser(accessToken, () => {}, navigate, currentRoute);
    } else {
      console.error("No hay token de acceso disponible");
      navigate('/login');
    }
  }, [navigate, currentRoute]);

  return (
    <FullHeightLayout>
      <Loader/>
    </FullHeightLayout>
  )
}
