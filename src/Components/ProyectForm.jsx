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
  const [precioDesglosado, setPrecioDesglosado] = useState(null);
  const [costosLoading, setCostosLoading] = useState(false);

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

  const eliminarCampoAdicional = (index) => {
    setFormData((prevState) => {
      const newCamposAdicionales = prevState.camposAdicionales.filter(
        (_, i) => i !== index
      );
      return {
        ...prevState,
        camposAdicionales: newCamposAdicionales,
      };
    });
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
        titulo: formData.titulo,
        fecha: formData.fecha,
        estado: formData.estado,
        descripcion: formData.descripcion,
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

      const seccionesData = formData.camposAdicionales.map((seccion) => ({
        nombre: seccion.titulo,
        contenido: seccion.descripcion,
      }));

      const finalData = {
        proyecto: projectId,
        tipoSeccion: seccionesData,
      };

      await axios.post(SECCION_API_URL, finalData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

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

  const handleDescriptionChange = (e) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      descripcion: value,
    }));
  };

  const processDescriptionWithGPT = async (desc) => {
    setLoading(true);
    try {
      const response = await axios.post(
        GPT_API_URL,
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Eres un asistente útil que mejora la formulacion de proyectos, no respondas nada que no tenga que ver con la formulacion de proyectos, solo responde con la descripcion mejorada",
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

  const processSectionWithGPT = async (index) => {
    const seccion = formData.camposAdicionales[index];
    setLoading(true);
    try {
      const response = await axios.post(
        GPT_API_URL,
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Eres un asistente útil que mejora las descripciones de proyectos, no respondas nada que no tenga que ver con formulacion de proyectos, limita a dar la respuesta de lo que te piden",
            },
            {
              role: "user",
              content: `Mejora el siguiente texto teniendo en cuenta el título del proyecto "${formData.titulo}", el título de la sección "${seccion.titulo}" y la descripción del proyecto "${formData.descripcion}": ${seccion.descripcion}, no quiero nada aparte de la respuesta y damelo sin estilo, texto plano`,
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
      setFormData((prevState) => {
        const newCamposAdicionales = [...prevState.camposAdicionales];
        newCamposAdicionales[index].descripcion = improvedDescription;
        return {
          ...prevState,
          camposAdicionales: newCamposAdicionales,
        };
      });
    } catch (error) {
      console.error("Error al procesar la sección con GPT:", error);
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

  const adjustTextareaHeight = (textarea) => {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const getCostBreakdownFromGPT = async (description) => {
    setCostosLoading(true);
    try {
        const response = await axios.post(
            GPT_API_URL,
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "Eres un asistente experto en costos de proyectos, proporciona un desglose detallado de costos para proyectos en base a la descripción proporcionada",
                    },
                    {
                        role: "user",
                        content: `Dado el siguiente proyecto y su descripción: "${description}", proporciona un desglose detallado de los costos estimados:`,
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

        const costBreakdown = response.data.choices[0].message.content;
        console.log("Respuesta del modelo:", costBreakdown); 

        const breakdownObject = costBreakdown
            .split("\n")
            .map((line) => line.split(":"))
            .filter((pair) => pair.length === 2)
            .reduce((acc, [key, value]) => {
                const parsedValue = parseFloat(value.trim().replace("$", ""));
                acc[key.trim()] = isNaN(parsedValue) ? "Desconocido" : parsedValue;
                return acc;
            }, {});

        console.log("Desglose procesado:", breakdownObject); // Verifica el desglose procesado
        setPrecioDesglosado(breakdownObject);
    } catch (error) {
        console.error("Error al obtener el desglose de costos con GPT:", error);
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
        setCostosLoading(false);
    }
};


  useEffect(() => {
    adjustTextareaHeight(descriptionRef.current);
  }, [formData.descripcion]);

  useEffect(() => {
    document.querySelectorAll(".section-description-textarea").forEach((textarea) => {
      adjustTextareaHeight(textarea);
    });
  }, [formData.camposAdicionales]);

  const isButtonDisabled = !(formData.titulo && formData.descripcion);

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
              className="form-control"
              rows="3"
            />
            <CButton
              type="button"
              onClick={() => processDescriptionWithGPT(formData.descripcion)}
              disabled={loading}
              className="mt-2"
            >
              {loading ? <CSpinner size="sm" /> : "Mejorar Descripción"}
            </CButton>
          </div>
          {formData.camposAdicionales.map((campo, index) => (
            <div key={index} className="mb-3">
              <CFormLabel htmlFor={`titulo-seccion-${index}`}>
                Título de la Sección
              </CFormLabel>
              <CFormInput
                type="text"
                id={`titulo-seccion-${index}`}
                value={campo.titulo}
                onChange={(e) =>
                  handleCampoAdicionalChange(index, "titulo", e.target.value)
                }
              />
              <CFormLabel htmlFor={`descripcion-seccion-${index}`}>
                Descripción de la Sección
              </CFormLabel>
              <textarea
                id={`descripcion-seccion-${index}`}
                value={campo.descripcion}
                onChange={(e) => handleCampoAdicionalChange(index, "descripcion", e.target.value)}
                className="form-control section-description-textarea"
                rows="3"
              />
              <CButton
                type="button"
                onClick={() => processSectionWithGPT(index)}
                disabled={loading}
                className="mt-2"
              >
                {loading ? <CSpinner size="sm" /> : "Mejorar Sección"}
              </CButton>
              <CButton
                type="button"
                onClick={() => eliminarCampoAdicional(index)}
                color="danger"
                className="mt-2 ms-2"
              >
                Eliminar Sección
              </CButton>
            </div>
          ))}
          <CButton type="button" onClick={agregarCampoAdicional}>
            Agregar Sección
          </CButton>
          <CButton
            type="button"
            onClick={() => getCostBreakdownFromGPT(formData.descripcion)}
            disabled={isButtonDisabled}
            className="mt-2"
          >
            {costosLoading ? <CSpinner size="sm" /> : "Calcular Costos"}
          </CButton>

          {precioDesglosado && (
            <div className="mt-3">
              <strong>Desglose de Precio Estimado:</strong>
              <ul>
                {Object.entries(precioDesglosado).map(([key, value]) => (
                  <li key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}: ${value}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <CButton type="submit" color="primary" disabled={loading}>
            {loading ? <CSpinner size="sm" /> : "Subir Proyecto"}
          </CButton>
        </CForm>
        {error && <p className="text-danger mt-3">{error}</p>}
        {success && (
          <p className="text-success mt-3">Proyecto subido exitosamente!</p>
        )}
      </CCardBody>
    </CCard>
  );
};

export default SubirProyecto;
