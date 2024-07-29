import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CustomCard from "../../Components/Card";
import { Button, Modal, Dropdown } from 'react-bootstrap';
import AdminLayout from "../../Layouts/AdminLayout";

export default function VisualizarUsuarios() {
    const [selectedRole, setSelectedRole] = useState("allUsers");
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [originalUser, setOriginalUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchUsuariosWithRetry();
    }, []);

    const fetchUsuariosWithRetry = async (retries = 3) => {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await axios.get("https://projetback-r7o8.onrender.com/auth/usuario", {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUsuarios(response.data);
                setLoading(false);
                return;
            } catch (err) {
                console.error(`Intento ${i + 1} fallido:`, err);
                if (i === retries - 1) {
                    setError(err);
                    setLoading(false);
                } else {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
    };

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setOriginalUser(user); // Guardar los datos originales del usuario para comparaciones posteriores
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setEditingUser(null);
        setOriginalUser(null); // Resetear los datos originales del usuario
    };

    const handleDelete = async (userId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            try {
                await axios.delete(`https://projetback-r7o8.onrender.com/auth/usuario/${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                fetchUsuariosWithRetry();
            } catch (err) {
                console.error('Error al eliminar usuario:', err);
            }
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!editingUser || !editingUser._id) {
            console.error('No hay usuario editado o ID no encontrado.');
            return;
        }

        const changes = {};
        for (let key in editingUser) {
            if (key !== "email" && editingUser[key] !== originalUser[key]) {
                changes[key] = editingUser[key];
            }
        }

        // Verificar si hay cambios
        if (Object.keys(changes).length === 0) {
            alert('No hay cambios para guardar.');
            handleClose();
            return;
        }

        try {
            const response = await axios.patch(`https://projetback-r7o8.onrender.com/auth/usuario/${editingUser._id}`, changes, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Usuario actualizado:', response.data);
            handleClose();
            fetchUsuariosWithRetry();
        } catch (err) {
            if (err.response && err.response.status === 409) {
                alert('Error: El correo electrónico ya está registrado.');
            } else {
                alert('Error al actualizar usuario.');
                console.error('Error al actualizar usuario:', err);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingUser(prev => {
            console.log('Cambio en el input:', name, value);
            return { ...prev, [name]: value };
        });
    };

    const filteredUsuarios = selectedRole === "allUsers" ? usuarios : usuarios.filter(user => user.role === selectedRole);

    if (loading) return <p>Cargando usuarios...</p>;
    if (error) return <p>Error al cargar usuarios: {error.message}</p>;

    return (
        <AdminLayout>
            <div className="container">
                <div className="selectorContainer">
                    <Dropdown>
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            Seleccionar Rol
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleRoleSelect("allUsers")}>Todos los usuarios</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleRoleSelect("Administrador")}>Administrador</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleRoleSelect("Usuario")}>Usuario</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className="card-container">
                    {filteredUsuarios.map(user => (
                        <CustomCard
                            key={user._id}
                            data={user}
                            handleEditClick={handleEditClick}
                            handleDelete={handleDelete}
                        />
                    ))}
                </div>

                {/* Modal para editar usuario */}
                <Modal show={showModal} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Usuario</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {editingUser && (
                            <form onSubmit={handleSave}>
                                <div className="form-group">
                                    <label>Nombre</label>
                                    <input name="nombre" value={editingUser.nombre} onChange={handleInputChange} placeholder="Nombre" className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label>Apellido</label>
                                    <input name="apellido" value={editingUser.apellido} onChange={handleInputChange} placeholder="Apellido" className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input name="email" value={editingUser.email} onChange={handleInputChange} placeholder="Email" className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label>Número de Identificación</label>
                                    <input name="numIdentificacion" value={editingUser.numIdentificacion} onChange={handleInputChange} placeholder="Número de Identificación" className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label>Teléfono</label>
                                    <input name="telefono" value={editingUser.telefono} onChange={handleInputChange} placeholder="Teléfono" className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label>Fecha de Nacimiento</label>
                                    <input name="fechaNacimieto" value={editingUser.fechaNacimieto} onChange={handleInputChange} type="date" className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label>Caracterización</label>
                                    <input name="caracterizacion" value={editingUser.caracterizacion} onChange={handleInputChange} placeholder="Caracterización" className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label>Rol</label>
                                    <select name="role" value={editingUser.role} onChange={handleInputChange} className="form-control">
                                        <option value="Administrador">Administrador</option>
                                        <option value="Usuario">Usuario</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary mt-3 me-3">Guardar Cambios</button>
                                <button type="button" onClick={handleClose} className="btn btn-secondary mt-3">Cancelar</button>
                            </form>
                        )}
                    </Modal.Body>
                </Modal>
            </div>
        </AdminLayout>
    );
}
