import React, { useState } from 'react';
import AdminLayout from '../Layouts/AdminLayout';
import "../../perfil.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

export default function Perfil() {
    const [avatar, setAvatar] = useState('https://placehold.co/200x200'); // URL inicial del avatar

    // Manejador de cambio para el input de archivo
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                // Reemplaza la URL con el endpoint de tu API para subir imágenes
                const response = await axios.post('https://projetback-r7o8.onrender.com/files/upload/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                // Asegúrate de que la respuesta contiene la URL de la imagen
                const imageUrl = response.data.imageUrl; // Ajusta según la estructura de la respuesta de tu API
                setAvatar(imageUrl);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    // Manejador para el clic en el botón de carga
    const handleUploadClick = () => {
        document.getElementById('fileInput').click(); // Activa el input de archivo
    };

    return (
        <AdminLayout>
            <div className="containerPerfilUsuarios">
                <div className="avatar-center">
                    <img src={avatar} alt="Profile Avatar" />
                </div>
                <div className="button-container">
                    <button className="button upload" onClick={handleUploadClick}>
                        <i className="bi bi-upload"></i>
                    </button>
                    <button className="button delete">
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }} // Oculta el input de archivo
                    onChange={handleFileChange}
                />
                <form>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">Nombre</label>
                            <input type="text" id="firstName" placeholder="" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Apellido</label>
                            <input type="text" id="lastName" placeholder="" required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input type="email" id="email" placeholder="" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="taxId">Número de Identificación</label>
                            <input type="text" id="taxId" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="mobile">Teléfono</label>
                            <input type="tel" id="mobile" placeholder="" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="birthdate">Fecha de Nacimiento</label>
                            <input type="date" id="birthdate" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="caracterizacion">Caracterización</label>
                            <input type="text" id="caracterizacion" placeholder="" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" id="password" placeholder="" required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="role">Role</label>
                            <select id="role">
                                <option value="administrador">Administrador</option>
                                <option value="usuario">Usuario</option>
                            </select>
                        </div>
                    </div>
                    <div className="submit-container">
                        <button type="submit" className="submit-button">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
