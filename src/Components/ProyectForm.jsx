import React, { useState, useRef, useEffect } from 'react';
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
  const descriptionRef = useRef(null);

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
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Eres un asistente útil que mejora las descripciones de proyectos.'
            },
            {
              role: 'user',
              content: `Mejora la siguiente descripción, solo dame la respuesta: ${desc}`
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
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    const textarea = descriptionRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; 
      textarea.style.height = `${textarea.scrollHeight}px`; 
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [description]);

  return (
    <CCard>
      <CCardHeader>
        Crear Proyecto
      </CCardHeader>
      <CCardBody>
        <div style={{ width: '80%', margin: '0 auto' }}>
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
              <textarea
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                ref={descriptionRef}
                rows={1} 
                style={{ resize: 'none', overflow: 'hidden', width: '100%' }} 
                className="form-control" 
              />
            </div>
            <CButton type="submit" color="primary" disabled={loading}>
              {loading ? <CSpinner size="sm" /> : 'Mejorar descripcion'}
            </CButton>
          </CForm>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default ProyectForm;
