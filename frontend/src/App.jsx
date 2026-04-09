import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import router from './routes/Router';
import './index.css';
import api from './utils/apiClient';
import { clearUser, setUser } from './store/authSlice';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const hydrateUser = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.ok) {
          const user = await res.json();
          dispatch(setUser(user));
        } else {
          dispatch(clearUser());
        }
      } catch (error) {
        dispatch(clearUser());
      }
    };

    hydrateUser();
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

export default App;
