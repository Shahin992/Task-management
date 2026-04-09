import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Alert, Link } from '@mui/material';
import BasicInput from '../components/common/BasicInput';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../utils/apiClient';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const res = await api.post('/auth/signup', {
        name: trimmedName,
        email: trimmedEmail,
        password,
        role: 'ADMIN',
      });
      if (res.ok) {
        navigate('/');
      } else {
        const data = await res.json();
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred during signup');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#F4F6F8' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 2 }}>
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
          Sign Up
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSignup}>
          <Typography variant="body2" sx={{ mb: -0.5, fontWeight: 500 }}>Full Name</Typography>
          <BasicInput
            fullWidth
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" sx={{ mb: -0.5, fontWeight: 500 }}>Email</Typography>
          <BasicInput
            fullWidth
            placeholder="john@example.com"
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
            Create Account
          </Button>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link component={RouterLink} to="/" sx={{ fontWeight: 600, color: '#3B71CA', textDecoration: 'none' }}>
                Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Signup;
