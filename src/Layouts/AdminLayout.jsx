import React from "react";
import Sidebar from '../Components/SideBar'
import Footer from "../Components/Footer";
import AuthUser from "../../utils/AuthUser";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../Components/Loader";

const AdminLayout = ({children}) => {
  let token = localStorage.getItem('token')
  const navigate = useNavigate()
  const location = useLocation()
  const [user,setUser] = useState(null)

  let currentRoute = location.pathname

  useEffect(() => {
    const accessToken = localStorage.getItem('token'); // Asumiendo que el token está en localStorage
    if (accessToken) {
      AuthUser(accessToken, () => {}, navigate, currentRoute);
    } else {
      console.error("No hay token de acceso disponible");
      navigate('/login');
    }
  }, [navigate, currentRoute]);

  if(!user){
    <Loader/>
  }else{
    return (
      <div className="app-container">
        <Sidebar />
        <div className="content-wrapper">
          <div className="main-content">
            {children}
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  
};

export default AdminLayout;
