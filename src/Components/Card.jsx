import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { CIcon } from '@coreui/icons-react';
import * as icon from '@coreui/icons';

const CustomCard = ({ data, handleEditClick, handleDelete }) => {
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="" /> 
            <Card.Body>
                <Card.Title>{data.nombre} {data.apellido}</Card.Title>
                <Card.Text>{data.email}</Card.Text>
                <Card.Text>{data.role}</Card.Text>
                <Button
                    variant="outline-primary"
                    style={{ marginRight: '15px' }}
                    onClick={() => handleEditClick(data)}
                >
                    <CIcon icon={icon.cilPencil} size="xl" />
                </Button>
                <Button
                    variant="outline-danger"
                    onClick={() => handleDelete(data._id)}
                >
                    <CIcon icon={icon.cilTrash} size="xl" />
                </Button>
            </Card.Body>
        </Card>
    );
};

export default CustomCard;
