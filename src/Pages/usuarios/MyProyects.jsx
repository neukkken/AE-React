import AdminLayout from "../../Layouts/AdminLayout";
import ProjectOverviewCard from "../../Components/CardProyect";
import axios from "axios";
import { useEffect, useState } from "react";

const PROFILE_URL = "https://projetback-r7o8.onrender.com/auth/profile";

const MyProjects = () => {
  const token = localStorage.getItem("token");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(PROFILE_URL, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProjects(response.data.sub.proyectos || []);
      } catch (error) {
        setError(error);
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile: {error.message}</p>;

  return (
    <AdminLayout>
      {projects.length > 0 ? (
        projects.map((project) => (
          <ProjectOverviewCard key={project._id} data={project} />
        ))
      ) : (
        <p>No tienes proyectos.</p>
      )}
    </AdminLayout>
  );
};

export default MyProjects;
