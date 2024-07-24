import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export default function SubirProyecto() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: "",
    fecha: "",
    estado: "En progreso",
    descripcion: "",
    camposAdicionales: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleCampoAdicionalChange = (index, field, value) => {
    setFormData((prevState) => {
      const newCamposAdicionales = [...prevState.camposAdicionales];
      if (!newCamposAdicionales[index]) {
        newCamposAdicionales[index] = {};
      }
      newCamposAdicionales[index][field] = value;
      return {
        ...prevState,
        camposAdicionales: newCamposAdicionales
      };
    });
  };

  const agregarCampoAdicional = () => {
    setFormData((prevState) => ({
      ...prevState,
      camposAdicionales: [...prevState.camposAdicionales, { titulo: "", descripcion: "" }]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiX2lkIjoiNjY3YjlkN2E3NGMwZmM4MTkyOGUzZjRhIiwibm9tYnJlIjoiU2FudGlhZ28iLCJhcGVsbGlkbyI6Ik5hcnZhZXoiLCJlbWFpbCI6InNhbnRpYWdvQGdtYWlsLmNvbSIsIm51bUlkZW50aWZpY2FjaW9uIjoiMTIzNDU2NzgiLCJ0ZWxlZm9ubyI6IjMxMyIsImZlY2hhTmFjaW1pZXRvIjoiMjAyNC0wNi0yNlQwNDo0NzoyMC43MjdaIiwiY2FyYWN0ZXJpemFjaW9uIjoiY2FyYWN0ZXJpemFjaW9uIiwiY29udHJhc2VuYSI6IiQyYiQxMCRPVmpqZDZwaWRQNThyMmhtczU0dk91SHp4elc2RWd6R3J2ZVVhdHAvL0xkS2xDbURWUXVmSyIsInJvbGUiOiJBZG1pbmlzdHJhZG9yIiwiX192IjowfSwicm9sZSI6IkFkbWluaXN0cmFkb3IiLCJpYXQiOjE3MjE4NDQ1NjMsImV4cCI6MTcyMTg2MjU2M30.aquQpyhDkq4usbZyfFtn_2ND80pAZM4ahpZt23qJpFo";
    
    if (!token) {
      setError("No se encontró el token de autenticación");
      setLoading(false);
      return;
    }

    try {
      const decodedToken = parseJwt(token);
      const usuarioId = decodedToken.sub._id;

      const dataToSend = {
        ...formData,
        usuarioId: usuarioId
      };

      console.log("Enviando datos:", dataToSend);

      const response = await axios.post(
        "https://projetback-r7o8.onrender.com/proyectos",
        dataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Respuesta del servidor:", response.data);
      setSuccess(true);
      setFormData({
        titulo: "",
        fecha: "",
        estado: "En progreso",
        descripcion: "",
        camposAdicionales: []
      });
      alert("Proyecto subido exitosamente");
      setTimeout(() => {
        navigate('/ruta-a-ver-proyectos');
      }, 2000);
    } catch (err) {
      console.error("Error detallado:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.message);
      alert("Error al subir el proyecto: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Datos del proyecto</h2>

        <div className="form-group">
          <label htmlFor="titulo">Título del proyecto:</label>
          <input
            type="text"
            className="form-control"
            id="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="fecha">Fecha:</label>
          <input
            type="date"
            className="form-control"
            id="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción del proyecto:</label>
          <textarea
            className="form-control"
            id="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {formData.camposAdicionales.map((campo, index) => (
          <div className="form-group" key={index}>
            <label htmlFor={`campoAdicional${index}`}>Sesión {index + 1}:</label>
            <input
              type="text"
              className="form-control"
              id={`campoAdicional${index}`}
              placeholder="Título de la sesión"
              value={campo.titulo || ""}
              onChange={(e) => handleCampoAdicionalChange(index, 'titulo', e.target.value)}
            />
            <br />
            <textarea
              className="form-control"
              id={`descripcionSesion${index}`}
              placeholder="Descripción de la Sesión"
              value={campo.descripcion || ""}
              onChange={(e) => handleCampoAdicionalChange(index, 'descripcion', e.target.value)}
            />
          </div>
        ))}

        <button type="button" onClick={agregarCampoAdicional} className="btn btn-secondary mb-3">
           Agregar campo
        </button>

        <div className="button">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>
        {error && <p className="error-message">Error al subir el proyecto: {error}</p>}
        {success && <p className="success-message">¡Proyecto subido exitosamente!</p>}
      </form>
    </div>
  );
}