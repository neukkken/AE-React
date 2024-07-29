import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Review = () => {
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState(null);
  const [responseDetails, setResponseDetails] = useState(null);
  const location = useLocation();
  const projectId = location.state?.projectId;

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsicHJveWVjdG9zIjpbXSwiX2lkIjoiNjY4ZWUzODIwZmFiNjdlZDgyN2ZkZjcwIiwibm9tYnJlIjoiS2V2aW4iLCJhcGVsbGlkbyI6IkxvcGV6IiwiZW1haWwiOiJrZXZpbkBnbWFpbC5jb20iLCJudW1JZGVudGlmaWNhY2lvbiI6IjEyMzQiLCJ0ZWxlZm9ubyI6IjMxMyIsImZlY2hhTmFjaW1pZXRvIjoiMjAyNC0wNy0xMFQxOTozOTo0Mi40MDlaIiwiY2FyYWN0ZXJpemFjaW9uIjoiYSIsImNvbnRyYXNlbmEiOiIkMmIkMTAkaHVnYkZjLmkuTG9pYThNczVSaVg5LmM4Z0swc2R6ck1sTjV1dU1lQ2pMNU85bXJQSHhuc20iLCJyb2xlIjoiQWRtaW5pc3RyYWRvciIsIl9fdiI6MCwiZmVjaGFOYWNpbWllbnRvIjoiMjAyNC0wNy0xMFQxOTozOTo0Mi40MDlaIn0sInJvbGUiOiJBZG1pbmlzdHJhZG9yIiwiaWF0IjoxNzIyMjk1NjU5fQ.BjR4E15l4WxUhIAEmWBveVDe7sHz-hjDpBz8xpK31RY';

  const fetchData = async (url, setter, errorPrefix) => {
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const responseText = await response.text();

      const details = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText
      };

      setResponseDetails(prev => ({ ...prev, [errorPrefix]: details }));

      if (!response.ok) {
        throw new Error(`${errorPrefix}: Error en la respuesta: ${response.status} ${response.statusText}`);
      }

      if (!responseText) {
        console.warn(`${errorPrefix}: La respuesta del servidor está vacía`);
        return;
      }

      const data = JSON.parse(responseText);
      console.log(`${errorPrefix}: Datos recibidos:`, data);
      setter(data);
    } catch (error) {
      console.error(`${errorPrefix}: Error al obtener los datos:`, error);
      setError(prev => ({ ...prev, [errorPrefix]: error.message }));
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchData(`https://projetback-r7o8.onrender.com/proyectos/${projectId}`, setProjectData, 'Proyecto');
    }
  }, [projectId]);

  if (!projectId) {
    return <div>No se proporcionó un ID de proyecto.</div>;
  }

  return (
    <div>
      <h2>Datos de Revisión</h2>
      {projectData ? (
        <div style={{border: '1px solid #ddd', padding: '10px'}}>
          <h3>Proyecto: {projectData.titulo}</h3>
          <p><strong>Descripción:</strong> {projectData.descripcion}</p>
          <p><strong>Fecha:</strong> {projectData.fecha}</p>
          <p><strong>Estado:</strong> {projectData.estado}</p>
          <p><strong>Creado por:</strong> {projectData.usuarioId?.nombre} {projectData.usuarioId?.apellido}</p>
          <h4>Secciones:</h4>
          {projectData.secciones && projectData.secciones.length > 0 ? (
            projectData.secciones.map((seccion, index) => (
              <div key={index} style={{marginLeft: '20px', marginBottom: '10px'}}>
                {seccion.tipoSeccion.map((tipo, idx) => (
                  <div key={idx}>
                    <p><strong>{tipo.nombre}</strong></p>
                    <p>{tipo.contenido}</p>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p>No hay secciones disponibles para este proyecto.</p>
          )}
        </div>
      ) : (
        <p>Cargando datos del proyecto...</p>
      )}
      {error && (
        <div>
          <h3>Errores:</h3>
          {Object.entries(error).map(([key, value]) => (
            <p key={key}><strong>{key}:</strong> {value}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Review;