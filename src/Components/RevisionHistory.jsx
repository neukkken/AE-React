const handleAprobacion = async (esAprobado) => {
    const estado = esAprobado ? "aprobado" : "rechazado";
    const comentario = esAprobado ? "" : prompt("Por favor, ingrese un comentario para el rechazo:");
  
    try {
      const response = await fetch(`https://projetback-r7o8.onrender.com/proyectos/${projectId}/revision`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado, comentario })
      });
  
      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
  
      setAprobacionMensaje({
        texto: esAprobado ? "¡Proyecto aprobado con éxito!" : "El proyecto ha sido rechazado.",
        tipo: esAprobado ? "aprobado" : "no-aprobado"
      });
  
      // Actualizar el estado del proyecto en el componente
      setProjectData(prevData => ({ ...prevData, estado }));
  
    } catch (error) {
      console.error("Error al enviar la revisión:", error);
      setError(prev => ({ ...prev, Revision: error.message }));
    }
  
    setTimeout(() => setAprobacionMensaje(null), 3000);
  };