import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Projects from './pages/Projects';
import Login from './pages/Login';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <main className="w-full min-h-screen flex flex-col justify-start items-center">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Projects />} />
          <Route path="/log-in" element={<Login />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer autoClose={2000} />
    </main>
  );
}
export default App;
