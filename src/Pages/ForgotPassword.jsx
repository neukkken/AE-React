import FullHeightLayout from "../Layouts/FullHeightLayout";

import React, { useState } from 'react';
import {
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CFormFeedback,
  CSpinner
} from '@coreui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('https://projetback-r7o8.onrender.com/auth/forgot-password', { email });
      setMessage('Un enlace para restablecer tu contraseña ha sido enviado a tu email.');
      setError('');
    } catch (error) {
      setError('Error al enviar el email de recuperación. Por favor, inténtalo de nuevo.');
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FullHeightLayout>
        <div className="forgot-password-container">
      <CForm onSubmit={handleSubmit} className="forgot-password-form">
        <h2>Recuperar Contraseña</h2>
        <CFormLabel htmlFor="email">Email</CFormLabel>
        <CFormInput
          id="email"
          name="email"
          type="text"
          placeholder="Ingresa tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          invalid={!!error}
          className="mb-3"
        />
        <CFormFeedback className='mb-1' invalid>{error}</CFormFeedback>

        {message && <p className="text-success">{message}</p>}
        <div className="mt-3 text-center">
          <p className="mb-1">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
        </div>

        {isLoading ? (
          <CButton color="primary" disabled>
            <CSpinner as="span" size="sm" aria-hidden="true" />
            Enviando...
          </CButton>
        ) : (
          <CButton color="primary" type="submit">Enviar</CButton>
        )}
          
        
        
        </CForm>
        
        </div>
    </FullHeightLayout>
  );
};

export default ForgotPasswordForm;

