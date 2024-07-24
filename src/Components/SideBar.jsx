import React, { useState } from 'react';
import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CNavItem,
  CNavTitle,
  CNavGroup,
  CSidebarToggler,
  CSidebarHeader,
  CBadge,
  CSpinner,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSpeedometer, cilPuzzle, cilCloudDownload, cilLayers } from '@coreui/icons';
import '@coreui/coreui/dist/css/coreui.min.css';
import GetUser from '../../utils/GetUser';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const URL_API_LOGOUT = "https://projetback-r7o8.onrender.com/auth/logout"

const Sidebar = () => {
  const [itemsNav, setItemsNav] = useState(null)
  const [user, setUser] = useState(null)
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      const user = await GetUser(token);
      setUser(user);
    };

    fetchUser();
  }, [token]);

  const logout = async () => {
    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    try {
      const response = await axios.post(URL_API_LOGOUT, { token }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        throw new Error(`Error HTTP ${response.status} - ${response.statusText}`);
      }

      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error(`Error al cerrar sesión: ${error.message}`);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CSpinner />
      </div>
    );
  }
  
  if(user == null){
    return (
      <div className="flex items-center justify-center h-screen">
        <CSpinner />
      </div>
    )
  }

  if(user.role == "Administrador"){
    return (
      <CSidebar className="border-end vh-100 position-fixed">
        <CSidebarHeader className="border-bottom">
          <CSidebarBrand>ProjectWizard IA</CSidebarBrand>
        </CSidebarHeader>
        <CSidebarNav>
          <CNavItem href="/administrador/usuarios">
            <CIcon customClassName="nav-icon" icon={cilSpeedometer} /> Usuarios
          </CNavItem>
          <CNavItem href="/administrador/proyectos">
            <CIcon customClassName="nav-icon" icon={cilSpeedometer} /> Proyectos
            
          </CNavItem>
          <CNavGroup
            toggler={
              <>
                <CIcon customClassName="nav-icon" icon={cilPuzzle} /> Nav dropdown
              </>
            }
          >
            <CNavItem href="#">
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>{' '}
              Nav dropdown item
            </CNavItem>
            <CNavItem href="#">
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>{' '}
              Nav dropdown item
            </CNavItem>
          </CNavGroup>
          <CNavItem href="https://coreui.io">
            <CIcon customClassName="nav-icon" icon={cilCloudDownload} /> Download CoreUI
          </CNavItem>
          <CNavItem href="/administrador/perfil">
            <CIcon customClassName="nav-icon" icon={cilLayers} /> Perfil
          </CNavItem>
        </CSidebarNav>
        <CSidebarHeader className="border-top">
          <CSidebarToggler onClick={() => (logout())}/>
        </CSidebarHeader>
      </CSidebar>
    );
  }else{
    return (
      <CSidebar className="border-end vh-100 position-fixed">
        <CSidebarHeader className="border-bottom">
          <CSidebarBrand>ProjectWizard IA</CSidebarBrand>
        </CSidebarHeader>
        <CSidebarNav>
          <CNavItem href="/usuarios/nuevoproyecto">
            <CIcon customClassName="nav-icon" icon={cilSpeedometer} /> Crear Proyecto
          </CNavItem>
          <CNavItem href="/usuarios/misproyectos">
            <CIcon customClassName="nav-icon" icon={cilSpeedometer} /> Mis Proyectos
            
          </CNavItem>
          <CNavGroup
            toggler={
              <>
                <CIcon customClassName="nav-icon" icon={cilPuzzle} /> Nav dropdown
              </>
            }
          >
            <CNavItem href="#">
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>{' '}
              Nav dropdown item
            </CNavItem>
            <CNavItem href="#">
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>{' '}
              Nav dropdown item
            </CNavItem>
          </CNavGroup>
          <CNavItem href="https://coreui.io">
            <CIcon customClassName="nav-icon" icon={cilCloudDownload} /> Download CoreUI
          </CNavItem>
          <CNavItem href="/usuarios/perfil">
            <CIcon customClassName="nav-icon" icon={cilLayers} /> Perfil
          </CNavItem>
        </CSidebarNav>
        <CSidebarHeader className="border-top">
          <CSidebarToggler onClick={() => (logout())}/>
        </CSidebarHeader>
      </CSidebar>
    );
  }

  
};

export default Sidebar;
