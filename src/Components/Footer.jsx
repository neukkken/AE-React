import React from 'react';
import { CFooter, CLink } from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';

const Footer = () => {
  return (
    <CFooter className="footer">
      <div>
        <CLink href="https://coreui.io">Wizard IA </CLink>
        <span> &copy; 2024 Red Team Dev.</span>
      </div>
      <div>
        <span>Powered by</span>
        <CLink href="https://coreui.io">Red Team Dev</CLink>
      </div>
    </CFooter>
  );
};

export default Footer;
