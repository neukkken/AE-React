import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const URL_API_AUTH = "https://projetback-r7o8.onrender.com/auth/profile";

const roleToRouteMap = {
  "Administrador": ["/administrador/home", "/administrador/nuevosproyectos", '/administrador/proyectos', '/administrador/usuarios'],
  "Aprendiz": ["/usuarios/home", "/usuarios/nuevoproyecto", "/usuarios/misproyectos"],
  "Usuario": ["/usuarios/home", "/usuarios/nuevoproyecto", "/usuarios/misproyectos"],
};

const AuthUser = async (accessToken, setUser, navigate, currentRoute) => {
  try {
    const response = await fetch(URL_API_AUTH, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    setUser(result);

    const userRole = result.sub.role;

    if (!userRole) {
      console.error("El usuario no tiene un rol definido");
      return;
    }

    const allowedRoutes = roleToRouteMap[userRole];

    if (allowedRoutes) {
      if (!allowedRoutes.includes(currentRoute)) {
        navigate(allowedRoutes[0]);
      }
    } else {
      console.error("Rol desconocido o ruta no definida para el rol: " + userRole);
    }
  } catch (error) {
    console.error(`Error al verificar la autenticación: ${error.message}`);
  }
};

export default AuthUser;
