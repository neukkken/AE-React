import React, { useState } from 'react';
import { CButton, CForm, CFormInput, CFormLabel, CFormFeedback, CSpinner } from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Importar Link de react-router-dom

const API_URL_LOGIN = 'https://projetback-r7o8.onrender.com/auth/login';

export default function Login() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    contrasena: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    contrasena: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Campo cambiado: ${name}, Valor: ${value}`);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.contrasena) newErrors.contrasena = 'Password is required';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      console.log('Form data:', formData);

      try {
        const response = await axios.post(API_URL_LOGIN, formData);
        console.log('Response data:', response.data);

        if (response.status === 200) {
          localStorage.setItem('token', response.data.access_token);
          setData(response.data);
        }
      } catch (error) {
        console.error('There was an error!', error);
        if (error.response) {
          const apiErrors = {};
          if (error.response.status === 404 && error.response.data.message === 'Invalid Credentials') {
            apiErrors.email = 'Invalid email or password';
            apiErrors.contrasena = 'Invalid email or password';
          }
          setErrors(apiErrors);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Errors:', newErrors);
    }
  };

  return (
    <div className="login-container">
      <CForm onSubmit={handleSubmit} className="login-form">
        <h2>Inicia Sesión</h2>
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

        <CFormLabel htmlFor="contrasena">Contraseña</CFormLabel>
        <CFormInput
          id="contrasena"
          name="contrasena"
          type="password"
          placeholder="Ingresa tu contraseña"
          value={formData.contrasena}
          onChange={handleChange}
          invalid={!!errors.contrasena}
        />
        <CFormFeedback className='mb-3' invalid>{errors.contrasena}</CFormFeedback>

        <div className="mt-3 text-center">
          <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
        </div>

        {isLoading ? (
          <CButton color="primary" disabled>
            <CSpinner as="span" size="sm" aria-hidden="true" />
            Loading...
          </CButton>
        ) : (
          <CButton color="primary" type="submit">Login</CButton>
        )}
      </CForm>
    </div>
  );
}
