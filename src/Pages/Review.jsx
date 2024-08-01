import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../Pages/css/Review.css';

const RevisionHistory = ({ revisiones, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>Historial de Revisiones</h4>
        {revisiones && revisiones.length > 0 ? (
          <ul>
            {revisiones.map((revision, index) => (
              <li key={index}>
                <strong>Estado:</strong> {revision.estado}
                <br />
                <strong>Fecha:</strong> {new Date(revision.fecha).toLocaleString()}
                {revision.comentario && (
                  <>
                    <br />
                    <strong>Comentario:</strong> {revision.comentario}
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay revisiones disponibles para este proyecto.</p>
        )}
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

const Review = () => {
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState(null);
  const [responseDetails, setResponseDetails] = useState(null);
  const [aprobacionMensaje, setAprobacionMensaje] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const location = useLocation();
  const projectId = location.state?.projectId;

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiX2lkIjoiNjZhYWI2MzFjZTJjNTFmNjU2NjYxYTMzIiwibm9tYnJlIjoiU3RldmVuIiwiYXBlbGxpZG8iOiJHb21leiIsImVtYWlsIjoiZHNnYzA2MTRAZ21haWwuY29tIiwibnVtSWRlbnRpZmljYWNpb24iOiIxMDYxNzA4NDc2IiwidGVsZWZvbm8iOiIzMTM0ODM4MzUwIiwiZmVjaGFOYWNpbWllbnRvIjoiMjAwNi0wNi0xNFQwMDowMDowMC4wMDBaIiwiY2FyYWN0ZXJpemFjaW9uIjoibm8gdGVuZ28iLCJjb250cmFzZW5hIjoiJDJiJDEwJHEzd1VMdmdRVlZ1bDRoQUI0N3JVYU93MnFkeDhkbVFFN2xoZ0tTRmN3cTNpSDBUamozOVRPIiwicm9sZSI6IkFkbWluaXN0cmFkb3IiLCJwcm95ZWN0b3MiOltdLCJfX3YiOjB9LCJyb2xlIjoiQWRtaW5pc3RyYWRvciIsImlhdCI6MTcyMjUzOTMwOH0.2iOKML61mzH-gBNxNNQYSJeHL_JsA8yq2bk0u6gqHEk';

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

  const handleAprobacion = (esAprobado) => {
    const estado = esAprobado ? "aprobado" : "rechazado";
    const comentario = esAprobado ? "" : prompt("Por favor, ingrese un comentario para el rechazo:");

    // Simulamos la actualización que normalmente vendría del backend
    const nuevaRevision = {
      estado,
      comentario,
      fecha: new Date().toISOString()
    };

    // Actualizamos el estado local del proyecto
    setProjectData(prevData => ({
      ...prevData,
      estado,
      revisiones: [
        ...(prevData.revisiones || []),
        nuevaRevision
      ]
    }));

    // Mostramos el mensaje de aprobación/rechazo
    setAprobacionMensaje({
      texto: esAprobado ? "¡Proyecto aprobado con éxito!" : "El proyecto ha sido rechazado.",
      tipo: esAprobado ? "aprobado" : "no-aprobado"
    });

    // El mensaje desaparecerá después de 3 segundos
    setTimeout(() => setAprobacionMensaje(null), 3000);
  };

  if (!projectId) {
    return <div className="error-mensaje">No se proporcionó un ID de proyecto.</div>;
  }

  return (
    <div className="contenedor-revision">
      <div className="cabecera-revision">
        <h2>Datos de Revisión</h2>
      </div>
      {aprobacionMensaje && (
        <div className={`mensaje-aprobacion ${aprobacionMensaje.tipo}`}>
          {aprobacionMensaje.texto}
        </div>
      )}
      {projectData ? (
        <div className="detalles-proyecto">
          <div className="proyecto-header">
            <h3>Proyecto: {projectData.titulo}</h3>
            <div className="iconos-aprobacion">
              <span className="icono-aprobado" onClick={() => handleAprobacion(true)}>✓</span>
              <span className="icono-no-aprobado" onClick={() => handleAprobacion(false)}>✗</span>
            </div>
          </div>
          <div className="letrero-descripcion">Descripción del Proyecto</div>
          <p><strong>Descripción:</strong> {projectData.descripcion}</p>
          <p><strong>Fecha:</strong> {projectData.fecha}</p>
          <p><strong>Estado:</strong> {projectData.estado}</p>
          <p><strong>Creado por:</strong> {projectData.usuarioId?.nombre} {projectData.usuarioId?.apellido}</p>
      
          <h4>Secciones:</h4>
          {projectData.secciones && projectData.secciones.length > 0 ? (
            projectData.secciones.map((seccion, index) => (
              <div key={index} className="item-seccion">
                {seccion.tipoSeccion.map((tipo, idx) => (
                  <div key={idx}>
                    <h4>{tipo.nombre}</h4>
                    <p>{tipo.contenido}</p>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p>No hay secciones disponibles para este proyecto.</p>
          )}

          <button onClick={() => setIsHistoryModalOpen(true)}>Ver Historial de Revisiones</button>

          <RevisionHistory 
            revisiones={projectData.revisiones} 
            isOpen={isHistoryModalOpen}
            onClose={() => setIsHistoryModalOpen(false)}
          />
        </div>
      ) : (
        <p className="mensaje-carga">Cargando datos del proyecto...</p>
      )}
      {error && (
        <div className="contenedor-error">
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