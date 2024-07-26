import AdminLayout from "../../Layouts/AdminLayout";
import ProjectOverviewCard from "../../Components/CardProyect";
import axios from "axios";
import { useEffect, useState } from "react";

const API_URL_PROYECTS = "https://projetback-r7o8.onrender.com/proyectos"

const Projects = () => {
    const token = localStorage.getItem("token");
    const [projects, setProjects] = useState(null);

    useEffect(() => {
        axios.get(API_URL_PROYECTS, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setProjects(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    }, [])

    

    return (
        <AdminLayout>
            {
                projects && projects.map((project) => (
                    <ProjectOverviewCard key={project._id} data={project} />
                ))
            }
        </AdminLayout>
    );
}

export default Projects;
