import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

function Profile() {
  const { loggedIn, checkingStatus } = useAuthStatus();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addNewProject, setAddNewProject] = useState({
    title: '',
    description: '',
    url: '',
    icon: {},
    technologies: [],
  });

  const navigate = useNavigate();

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

  const onCreate = async (e) => {
    // e.target.disabled = true;
    setLoading(true);
    console.log(addNewProject.icon.name);

    // Store image in firebase PROMISE
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${uuidv4()}`;
        const storageRef = ref(storage, 'images/' + fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        const toastId = toast.loading(`Uploading ${image.name}...`);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (progress < 100) {
              toast.update(toastId, {
                progress: parseInt(Math.ceil(progress).toFixed(0)) / 100,
                type: 'info',
              });
            }
          },

          (error) => {
            toast.update(toastId, { render: 'Upload failed!', type: 'error', isLoading: false });
            reject(error);
          },

          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              toast.update(toastId, {
                render: 'Uploaded successfully!',
                type: 'success',
                isLoading: false,
              });
              toast.dismiss(toastId);
              resolve(downloadURL);
            });
          }
        );
      });
    };

    // Store image in firebase and get url
    let imgUrl = null;
    try {
      imgUrl = await storeImage(addNewProject.icon);
    } catch (error) {
      toast.error('Could not upload images!');
      setLoading(false);
      return;
    }

    const newProjectDataCopy = {
      ...addNewProject,
      icon: imgUrl,
      timestamp: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, 'projects'), newProjectDataCopy);
      toast.success(`Project ${docRef.id} created successfully!`);
      navigate(`/`);
    } catch (error) {
      toast.error('Could not create project!');
    }
    setLoading(false);
  };

  if (checkingStatus || loading) {
    return <Spinner />;
  }

  if (!loggedIn) {
    return <Navigate to="/log-in" />;
  }
  return (
    <div className="w-full bg-stone-50 flex-1">
      <div className="grid bg-white flex-1 shadow-lg profile-grid m-10">
        <div className="contents text-xs uppercase font-semibold">
          <h1 className="px-4 py-2 bg-accent text-white rounded-tl-xl flex items-center">
            Project
          </h1>
          <h1 className="p-2 bg-accent text-white flex items-center">Description</h1>
          <h1 className="p-2 bg-accent text-white flex items-center">Technologies</h1>
          <h1 className="p-2 bg-accent text-white rounded-tr-xl flex items-center justify-center">
            Actions
          </h1>
        </div>
        {projects.map((project) => (
          <>
            <div key={project.id}>
              <div className="flex justify-start items-center w-fit h-full p-4 gap-4">
                <div className="avatar">
                  <div className="mask mask-squircle w-12 h-12">
                    <img src={project.icon} alt="logo" />
                  </div>
                </div>
                <div>
                  <div className="font-bold">{project.title}</div>
                  <a
                    className="text-sm opacity-50"
                    href="https://house-marketplace.fzachopoulos.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.url}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex justify-start items-center w-fit h-full p-2">
              <p>{project.description}</p>
            </div>
            <div className="flex justify-start items-center flex-wrap p-2">
              {project.technologies.map((technology) => {
                return (
                  <div className="tooltip mr-1" key={technology} data-tip={technology}>
                    <img
                      className="w-6 h-6 rounded-full shadow-lg ring-1 ring-offset-2 ring-stone mr-2"
                      src={require(`../assets/technology-icons/${technology}.png`)}
                      key={technology}
                      alt={technology}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col justify-center items-center gap-2 w-fit h-full p-2 mx-6">
              <button className="btn btn-outline btn-info btn-sm">Update</button>
              <button className="btn btn-outline btn-error btn-sm">Delete</button>
            </div>
          </>
        ))}
        <div className="flex justify-start items-center w-full h-full px-4 py-2 gap-4">
          <div className="avatar">
            <div className="image-upload w-12 h-12">
              <label htmlFor="icon" className="mask mask-squircle ">
                <img src={require('../assets/images/add.png')} alt="logo" />
              </label>
              <input
                className="formInputFile"
                type="file"
                id="icon"
                accept=".jpg,.png,.jpeg"
                onChange={(e) => {
                  setAddNewProject({
                    ...addNewProject,
                    icon: e.target.files[0],
                  });
                }}
              />
            </div>
          </div>
          <div className="w-full">
            <div className="font-bold">
              <input
                type="text"
                placeholder="Project Title"
                id="title"
                className="input input-xs input-bordered w-full block mb-1"
                onChange={(e) => {
                  setAddNewProject({
                    ...addNewProject,
                    title: e.target.value,
                  });
                }}
              />
              <input
                type="text"
                placeholder="Project Url"
                id="title"
                className="input input-xs input-bordered w-full"
                onChange={(e) => {
                  setAddNewProject({
                    ...addNewProject,
                    url: e.target.value,
                  });
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-start items-center w-full h-full px-2 py-6 gap-4">
          <textarea
            className="textarea textarea-bordered w-full h-28 p-2"
            placeholder="Project Description"
            onChange={(e) => {
              setAddNewProject({
                ...addNewProject,
                description: e.target.value,
              });
            }}
          ></textarea>
        </div>

        <div className="flex justify-start items-center w-full px-2 py-6 gap-4">
          <select
            className="form-multiselect w-full mt-1 p-2 h-full m-2  border-2"
            multiple="multiple"
            onChange={(e) => {
              var selected = [...e.target.options]
                .filter((option) => option.selected)
                .map((option) => option.value);
              setAddNewProject({
                ...addNewProject,
                technologies: selected,
              });
            }}
          >
            <option value="HTML">HTML</option>
            <option value="CSS">CSS</option>
            <option value="Javascript">Javascript</option>
            <option value="SASS">Sass</option>
            <option value="TailwindCSS">Tailwind</option>
            <option value="React">React</option>
            <option value="Node">Node</option>
            <option value="Express">Express</option>
            <option value="MongoDB">MongoDB</option>
            <option value="Firebase">Firebase</option>
            <option value="Heroku">Heroku</option>
          </select>
        </div>
        <div className="flex flex-col justify-center items-center gap-2 w-fit h-full p-2 mx-6">
          <button className="btn btn-outline btn-success btn-sm" onClick={onCreate}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
export default Profile;
