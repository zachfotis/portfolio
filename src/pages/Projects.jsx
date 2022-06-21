import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
import ProjectItem from '../components/ProjectItem';
import Spinner from '../components/Spinner';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const projects = [];
        const projectsRef = collection(db, 'projects');
        const docsSnap = await getDocs(projectsRef);
        docsSnap.forEach((doc) => {
          return projects.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setProjects(projects);
        setLoading(false);
      } catch (error) {}
    };
    getProjects();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className="bg-stone-50 p-10 w-full flex-auto flex flex-wrap gap-16 justify-evenly items-center">
      {projects.map((project) => {
        return <ProjectItem project={project} key={project.id} />;
      })}
    </section>
  );
}

export default Projects;
