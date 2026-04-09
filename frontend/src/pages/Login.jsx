import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Alert, Link } from '@mui/material';
import BasicInput from '../components/common/BasicInput';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../utils/apiClient';
import { setCookie } from '../utils/cookie';
import { TOKEN_COOKIE_NAME } from '../config/env';
import { setUser } from '../store/authSlice';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const [email, setEmail] = useState('admin@task.local');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitLogin = async (rawEmail, rawPassword) => {
    const trimmedEmail = rawEmail.trim();

    if (!trimmedEmail || !rawPassword) {
      setError('Email and password are required');
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setError('');
      const res = await api.post('/auth/login', { email: trimmedEmail, password: rawPassword });
      
      if (res.ok) {
        const data = await res.json();
        setCookie(TOKEN_COOKIE_NAME, data.accessToken);
        dispatch(setUser(data.user));

        if (data.user?.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      } else {
        try {
          const data = await res.json();
          setError(data.message || 'Invalid email or password');
        } catch (jsonErr) {
          setError('Invalid credentials or server error');
        }
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await submitLogin(email, password);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#F4F6F8' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 2 }}>
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
          Login
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleLogin}>
          <Typography variant="body2" sx={{ mb: -0.5, fontWeight: 500 }}>Email</Typography>
          <BasicInput
            fullWidth
            placeholder="admin@task.local"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" sx={{ mb: -0.5, fontWeight: 500 }}>Password</Typography>
          <BasicInput
            fullWidth
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disableElevation
            sx={{
              mt: 2,
              bgcolor: '#3B71CA',
              textTransform: 'none',
              fontWeight: 600,
              py: 1,
              transition: 'all 0.2s',
              ':hover': { 
                bgcolor: '#2c5496',
                boxShadow: '0 4px 12px rgba(59, 113, 202, 0.3)'
              }
            }}
          >
            Login
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/signup" sx={{ fontWeight: 600, color: '#3B71CA', textDecoration: 'none' }}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
