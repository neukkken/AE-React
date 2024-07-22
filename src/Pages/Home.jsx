import React, { useState } from 'react';
import { CButton, CForm, CFormInput, CFormLabel, CFormFeedback } from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL_LOGIN = 'https://projetback-r7o8.onrender.com/auth/login';

export default function Home() {

  const [data, setData] = useState(null);

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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.contrasena) newErrors.contrasena = 'Password is required';
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Form data:', formData);
      axios.post(API_URL_LOGIN, formData).then(response => setData(response.data));
    }
  };

  console.log(data)

  return (
    <div className="login-container">
      <CForm onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <CFormLabel htmlFor="email">Email</CFormLabel>
        <CFormInput
          id="email"
          name="email"
          type="text"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          invalid={!!errors.email}
        />
        <CFormFeedback invalid>{errors.email}</CFormFeedback>

        <CFormLabel htmlFor="password">Password</CFormLabel>
        <CFormInput
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.contrasena}
          onChange={handleChange}
          invalid={!!errors.contrasena}
        />
        <CFormFeedback invalid>{errors.contrasena}</CFormFeedback>

        <CButton color="primary" type="submit">Login</CButton>
      </CForm>
    </div>
  );
}
