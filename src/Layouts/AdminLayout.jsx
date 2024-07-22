import React from "react";
import { Sidebar } from "@coreui/coreui";
import Footer from "../Components/Footer";

const AdminLayout = ({children}) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="content-wrapper">
        <div className="main-content">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
