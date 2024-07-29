import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CCard, CCardBody, CCardImage, CCardTitle, CCardText, CButton } from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';

const ProjectOverviewCard = ({ data }) => {
  const navigate = useNavigate();

  const handleReviewClick = () => {
    navigate('/review', { state: { projectId: data._id } });
  };

  return (
    <CCard className="project-overview-card">
      <CCardImage orientation="top" src="https://via.placeholder.com/300" alt={`${data.titulo} image`} />
      <CCardBody>
        <CCardTitle>{data.titulo}</CCardTitle>
        <CCardText>{data.descripcion}</CCardText>
        <CCardText>
          <span className="created-by-label">Creado por:</span> {data.usuarioId?.nombre} {data.usuarioId?.apellido}
        </CCardText>
        <CButton onClick={handleReviewClick} color="secondary">Revisar</CButton>
      </CCardBody>
    </CCard>
  );
};

export default ProjectOverviewCard;