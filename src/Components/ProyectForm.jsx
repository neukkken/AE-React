import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import "../../SubirProyecto.css";

const API_URL = "https://projetback-r7o8.onrender.com/proyectos";
const SECCION_API_URL = "https://projetback-r7o8.onrender.com/seccion";
const GPT_API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = "";

const parseJwt = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
};

const SubirProyecto = () => {
  const [formData, setFormData] = useState({
    titulo: "",
    fecha: "",
    estado: "En progreso",
    descripcion: "",
    camposAdicionales: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [descriptionImproved, setDescriptionImproved] = useState("");
  const descriptionRef = useRef(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
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
        camposAdicionales: newCamposAdicionales,
      };
    });
  };

  const agregarCampoAdicional = () => {
    setFormData((prevState) => ({
      ...prevState,
      camposAdicionales: [
        ...prevState.camposAdicionales,
        { titulo: "", descripcion: "" },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const token = localStorage.getItem("token");

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
        usuarioId: usuarioId,
      };

      await processDescriptionWithGPT(formData.descripcion);

      const response = await axios.post(API_URL, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const projectId = response.data._id;
      console.log("Proyecto creado con ID:", projectId);

      for (const seccion of formData.camposAdicionales) {
        const seccionData = {
          proyecto: projectId,
          tipoSeccion: {
            nombre: seccion.titulo,
            contenido: seccion.descripcion,
          },
        };
        await axios.post(SECCION_API_URL, seccionData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      console.log("Secciones creadas exitosamente");
      setSuccess(true);
      setFormData({
        titulo: "",
        fecha: "",
        estado: "En progreso",
        descripcion: "",
        camposAdicionales: [],
      });
      alert("Proyecto y secciones subidos exitosamente");
    } catch (err) {
      console.error("Error detallado:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.message);
      alert(
        "Error al subir el proyecto: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const processDescriptionWithGPT = async (desc) => {
    setLoading(true);
    try {
      const response = await axios.post(
        GPT_API_URL,
        {
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                "Eres un asistente útil que mejora las descripciones de proyectos.",
            },
            {
              role: "user",
              content: `Mejora la siguiente descripción, solo dame la respuesta: ${desc}`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const improvedDescription = response.data.choices[0].message.content;
      setDescriptionImproved(improvedDescription);
      setFormData((prevState) => ({
        ...prevState,
        descripcion: improvedDescription,
      }));
    } catch (error) {
      console.error("Error al procesar la descripción con GPT:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request data:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDescriptionChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      descripcion: e.target.value,
    }));
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    const textarea = descriptionRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [formData.descripcion]);

  return (
    <CCard className="card-container">
      <CCardHeader>Crear Proyecto</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <div className="mb-3">
            <CFormLabel htmlFor="titulo">Título del Proyecto</CFormLabel>
            <CFormInput
              type="text"
              id="titulo"
              value={formData.titulo}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="fecha">Fecha</CFormLabel>
            <CFormInput
              type="date"
              id="fecha"
              value={formData.fecha}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="descripcion">Descripción</CFormLabel>
            <textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={handleDescriptionChange}
              ref={descriptionRef}
              rows={1}
              style={{ resize: "none", overflow: "hidden", width: "100%" }}
              className="form-control"
            />
          </div>
          {formData.camposAdicionales.map((campo, index) => (
            <div className="mb-3" key={index}>
              <CFormLabel htmlFor={`campoAdicional${index}`}>
                Sesión {index + 1}:
              </CFormLabel>
              <CFormInput
                type="text"
                id={`campoAdicional${index}`}
                placeholder="Título de la sesión"
                value={campo.titulo || ""}
                onChange={(e) =>
                  handleCampoAdicionalChange(index, "titulo", e.target.value)
                }
              />
              <textarea
                className="form-control mt-2"
                id={`descripcionSesion${index}`}
                placeholder="Descripción de la Sesión"
                value={campo.descripcion || ""}
                onChange={(e) =>
                  handleCampoAdicionalChange(
                    index,
                    "descripcion",
                    e.target.value
                  )
                }
              />
            </div>
          ))}
          <CButton
            type="button"
            onClick={agregarCampoAdicional}
            className="mb-3"
          >
            Agregar campo adicional
          </CButton>
          <div className="button">
            <CButton type="submit" disabled={loading} color="primary">
              {loading ? <CSpinner size="sm" /> : "Enviar"}
            </CButton>
          </div>
          {error && (
            <p className="error-message">Error al subir el proyecto: {error}</p>
          )}
          {success && (
            <p className="success-message">¡Proyecto subido exitosamente!</p>
          )}
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default SubirProyecto;
