// components/RedirectIfAuth.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export function RedirectIfAuth({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      toast.info("You're already logged in");
      navigate('/dashboard');
    }
  }, [navigate]);

  return children;
}
