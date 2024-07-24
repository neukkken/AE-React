import React from 'react';
import { CCard, CCardBody, CCardImage, CCardTitle, CCardText, CButton } from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';

const ProjectOverviewCard = ({ data }) => {
  return (
    <CCard className="project-overview-card">
      <CCardImage orientation="top" src="https://via.placeholder.com/300" alt={`${data.titulo} image`} />
      <CCardBody>
        <CCardTitle>{data.titulo}</CCardTitle>
        <CCardText>{data.descripcion}</CCardText>
        <CCardText>
          <span className="created-by-label">Creado por:</span> {data.usuarioId.nombre} {data.usuarioId.apellido}
        </CCardText>
        <CButton href={data.moreInfoLink} color="secondary">Revisar</CButton>
      </CCardBody>
    </CCard>
  );
};

export default ProjectOverviewCard;
