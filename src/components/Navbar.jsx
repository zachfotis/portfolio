import { Link, useNavigate } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { getAuth } from 'firebase/auth';
import Spinner from './Spinner';
import userImage from '../assets/images/user.png';

function Navbar() {
  const { loggedIn, checkingStatus } = useAuthStatus();
  const navigate = useNavigate();
  const auth = getAuth();

  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };

  if (checkingStatus) {
    return <Spinner />;
  }

  return (
    <div className="navbar bg-base-100 md:px-6">
      <div className="flex-1">
        <Link to="/" className="flex justify-center item-center ">
          {/* <img src={portfolioImage} alt="portfolio" className="h-10" /> */}
          <h1 className="flex items-center text-xl font-normal">
            Fotios N. Zachopoulos
            <div className="badge badge-outline badge-accent ml-2">Portfolio</div>
          </h1>
        </Link>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end ">
          <label tabIndex="0" className="btn btn-ghost btn-circle avatar ">
            <div className="w-10 rounded-full">
              {loggedIn ? (
                <img
                  src="https://pbs.twimg.com/profile_images/962678120552726528/cVj-l5zc_400x400.jpg"
                  alt="profile"
                />
              ) : (
                <img src={userImage} alt="profile" />
              )}
            </div>
          </label>

          <ul
            tabIndex="0"
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            {loggedIn ? (
              <>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <button onClick={onLogout}>Logout</button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/log-in">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
export default Navbar;
