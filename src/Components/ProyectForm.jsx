import React, { useState } from 'react';
import {
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner
} from '@coreui/react';
import axios from 'axios';

const API_KEY = '';

const ProyectForm = () => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Project Name:', projectName);
    console.log('Description:', description);
    await processDescriptionWithGPT(description);
  };

  const processDescriptionWithGPT = async (desc) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Eres un asistente útil que mejora las descripciones de proyectos.'
            },
            {
              role: 'user',
              content: `Mejora la siguiente descripción: ${desc}`
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const improvedDescription = response.data.choices[0].message.content;
      setDescription(improvedDescription);
    } catch (error) {
      console.error('Error al procesar la descripción con GPT:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CCard>
      <CCardHeader>
        Crear Proyecto
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <div className="mb-3">
            <CFormLabel htmlFor="projectName">Nombre del Proyecto</CFormLabel>
            <CFormInput
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="description">Descripción</CFormLabel>
            <CFormInput
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <CButton type="submit" color="primary" disabled={loading}>
            {loading ? <CSpinner size="sm" /> : 'Enviar'}
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default ProyectForm;
