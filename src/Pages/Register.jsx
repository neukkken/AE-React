import React, { useState } from 'react';
import { CButton, CForm, CFormInput, CFormLabel, CFormFeedback, CSpinner } from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Importar Link de react-router-dom

const API_URL_REGISTER = 'https://projetback-r7o8.onrender.com/auth/usuario'; 

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    "nombre": '',
    "apellido": '',
    "email": '',
    "numIdentificacion": '',
    "telefono": '',
    "fechaNacimiento": '',
    "caracterizacion": 'ninguna',
    "role": 'Usuario',
    "contrasena": '',
    "confirmContrasena": '' 
  });
  const [errors, setErrors] = useState({
    "nombre": '',
    "apellido": '',
    "email": '',
    "numIdentificacion": '',
    "telefono": '',
    "fechaNacimiento": '',
    "contrasena": '',
    "confirmContrasena": '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    for (const [key, value] of Object.entries(formData)) {
      if (!value && key !== 'confirmContrasena') {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.contrasena !== formData.confirmContrasena) {
      newErrors.confirmContrasena = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);

      try {
        const response = await axios.post(API_URL_REGISTER, formData);
        console.log('Registration successful:', response.data);
        navigate('/login');
      } catch (error) {
        console.error('There was an error!', error);
        if (error.response) {
          const apiErrors = error.response.data.errors || {};
          setErrors(apiErrors);
          console.log(error);
          console.log(formData);
        } else {
          setErrors({ general: 'An unexpected error occurred' });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="register-container">
      <CForm onSubmit={handleSubmit} className="register-form">
        <h2>Registro</h2>
        <CFormLabel htmlFor="nombre">Nombre</CFormLabel>
        <CFormInput
          id="nombre"
          name="nombre"
          type="text"
          placeholder="Ingresa tu nombre"
          value={formData.nombre}
          onChange={handleChange}
          invalid={!!errors.nombre}
        />
        <CFormFeedback className='mb-1' invalid>{errors.nombre}</CFormFeedback>

        <CFormLabel htmlFor="apellido">Apellido</CFormLabel>
        <CFormInput
          id="apellido"
          name="apellido"
          type="text"
          placeholder="Ingresa tu apellido"
          value={formData.apellido}
          onChange={handleChange}
          invalid={!!errors.apellido}
        />
        <CFormFeedback className='mb-1' invalid>{errors.apellido}</CFormFeedback>

        <CFormLabel htmlFor="email">Email</CFormLabel>
        <CFormInput
          id="email"
          name="email"
          type="text"
          placeholder="Ingresa tu email"
          value={formData.email}
          onChange={handleChange}
          invalid={!!errors.email}
        />
        <CFormFeedback className='mb-1' invalid>{errors.email}</CFormFeedback>

        <CFormLabel htmlFor="numIdentificacion">Número de Identificación</CFormLabel>
        <CFormInput
          id="numIdentificacion"
          name="numIdentificacion"
          type="text"
          placeholder="Ingresa tu Numero de Identificacion"
          value={formData.numIdentificacion}
          onChange={handleChange}
          invalid={!!errors.numIdentificacion}
        />
        <CFormFeedback className='mb-1' invalid>{errors.numIdentificacion}</CFormFeedback>

        <CFormLabel htmlFor="telefono">Teléfono</CFormLabel>
        <CFormInput
          id="telefono"
          name="telefono"
          type="text"
          placeholder="Ingresa tu numero de telefono"
          value={formData.telefono}
          onChange={handleChange}
          invalid={!!errors.telefono}
        />
        <CFormFeedback className='mb-1' invalid>{errors.telefono}</CFormFeedback>

        <CFormLabel htmlFor="fechaNacimiento">Fecha de Nacimiento</CFormLabel>
        <CFormInput
          id="fechaNacimiento"
          name="fechaNacimiento"
          type="date"
          placeholder="Ingresa tu fecha de nacimiento"
          value={formData.fechaNacimiento}
          onChange={handleChange}
          invalid={!!errors.fechaNacimiento}
          min="1960-01-01" 
          max={new Date().toISOString().split('T')[0]} 
        />
        <CFormFeedback className='mb-1' invalid>{errors.fechaNacimiento}</CFormFeedback>

        <CFormLabel htmlFor="contrasena">Contraseña</CFormLabel>
        <CFormInput
          id="contrasena"
          name="contrasena"
          type="password"
          placeholder="Ingresa tu contrasena"
          value={formData.contrasena}
          onChange={handleChange}
          invalid={!!errors.contrasena}
        />
        <CFormFeedback className='mb-1' invalid>{errors.contrasena}</CFormFeedback>

        <CFormLabel htmlFor="confirmContrasena">Confirmar Contraseña</CFormLabel>
        <CFormInput
          id="confirmContrasena"
          name="confirmContrasena"
          type="password"
          placeholder="Confirma tu contrasena"
          value={formData.confirmContrasena}
          onChange={handleChange}
          invalid={!!errors.confirmContrasena}
        />
        <CFormFeedback className='mb-3' invalid>{errors.confirmContrasena}</CFormFeedback>

        <div className="mt-3 text-center">
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
        </div>

        {isLoading ? (
          <CButton color="primary" disabled>
            <CSpinner as="span" size="sm" aria-hidden="true" />
            Loading...
          </CButton>
        ) : (
          <CButton color="primary" type="submit">Register</CButton>
        )}

      </CForm>
    </div>
  );
}
