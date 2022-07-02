function ProjectItem({ project }) {
  const currentDate = new Date();
  const projectDate = new Date(project.timestamp.seconds * 1000);
  const daysAgo = projectDate.getDate() - currentDate.getDate();
  const isNew = daysAgo <= 10;

  return (
    <div className="card w-96 bg-base-100 shadow-xl hover:shadow-2xl" style={{ minHeight: '420px' }}>
      <figure className="flex justify-center items-center mt-6">
        <img src={project.icon} alt="project" className=" max-w-full h-24" />
      </figure>
      <div className="card-body pt-5">
        <h2 className="card-title">
          {project.title}
          {project.status === 'development' ? (
            <div
              className="badge badge-info text-white font-normal tooltip"
              data-tip={project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            >
              DEV
            </div>
          ) : (
            <div
              className="badge badge-error text-white font-normal tooltip"
              data-tip={project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            >
              PROD
            </div>
          )}
          {isNew && (
            <div
              className="badge badge-accent badge-outline text-white font-normal tooltip"
              data-tip={daysAgo === 0 ? 'Uploaded today!' : `Uploaded ${daysAgo} day${daysAgo > 1 ? 's' : ''} ago!`}
            >
              NEW
            </div>
          )}
        </h2>
        <p>{project.description}</p>
        <div className="card-actions justify-center mb-3 mt-2">
          {project.technologies.map((technology) => {
            return (
              <div className="tooltip" data-tip={technology} key={technology}>
                <img
                  src={require(`../assets/technology-icons/${technology}.png`)}
                  className="w-7 h-7 rounded-full shadow-lg ring-1 ring-offset-2 ring-stone mr-2"
                  key={technology}
                  alt={technology}
                />
              </div>
            );
          })}
        </div>
        <a className="btn btn-md btn-outline" href={project.url} target="_blank" rel="noopener noreferrer">
          Go To Project
        </a>
      </div>
    </div>
  );
}
export default ProjectItem;
