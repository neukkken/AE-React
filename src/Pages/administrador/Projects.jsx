import AdminLayout from "../../Layouts/AdminLayout";
import ProjectOverviewCard from "../../Components/CardProyect";
import axios from "axios";
import { useEffect, useState } from "react";

const API_URL_PROYECTS = "https://projetback-r7o8.onrender.com/proyectos";

const Projects = () => {
  const token = localStorage.getItem("token");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(API_URL_PROYECTS, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProjects(response.data);
      } catch (error) {
        setError(error);
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading projects: {error.message}</p>;

  return (
    <AdminLayout>
      {projects.length > 0 ? (
        projects.map((project) => (
          <ProjectOverviewCard key={project._id} data={project} />
        ))
      ) : (
        <p>No projects available.</p>
      )}
    </AdminLayout>
  );
};

export default Projects;
