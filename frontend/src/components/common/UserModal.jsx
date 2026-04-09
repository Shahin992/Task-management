import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, Paper, Backdrop, Fade, IconButton, FormHelperText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BasicInput from './BasicInput';
import BasicSelect from './BasicSelect';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  outline: 'none'
};

const UserModal = ({ open, handleClose, handleSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER'
  });
  const [errors, setErrors] = useState({});

  const ROLE_OPTIONS = [
    { label: 'User', id: 'USER' },
    { label: 'Admin', id: 'ADMIN' },
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        password: '', // Password shouldn't be pre-filled for security
        role: initialData.role || 'USER'
      });
    } else {
      setFormData({ name: '', email: '', password: '', role: 'USER' });
    }
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const newErrors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPassword = formData.password.trim();

    if (!trimmedName) newErrors.name = 'Name is required';
    if (!trimmedEmail) {
       newErrors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
       newErrors.email = 'Please enter a valid email address';
    }

    if (!initialData && !trimmedPassword) {
      newErrors.password = 'Password is required';
    } else if (trimmedPassword && trimmedPassword.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const payload = {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
      };

      if (formData.password.trim()) {
        payload.password = formData.password.trim();
      } else {
        delete payload.password;
      }

      handleSubmit(payload);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={open}>
        <Paper sx={modalStyle}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              {initialData ? 'Edit User' : 'Create User'}
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box component="form" onSubmit={onSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>Full Name</Typography>
              <BasicInput
                fullWidth
                name="name"
                placeholder="Ex. John Doe"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
              />
              {errors.name && <FormHelperText error>{errors.name}</FormHelperText>}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>Email Address</Typography>
              <BasicInput
                fullWidth
                name="email"
                placeholder="Ex. john@example.com"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
              />
              {errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                 {initialData ? 'New Password (Optional)' : 'Password'}
              </Typography>
              <BasicInput
                fullWidth
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
              />
              {errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>User Role</Typography>
              <BasicSelect
                fullWidth
                name="role"
                options={ROLE_OPTIONS}
                value={formData.role}
                onChange={handleChange}
                mapping={{ label: 'label', value: 'id' }}
              />
            </Box>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={handleClose} variant="outlined" sx={{ textTransform: 'none', px: 3, borderColor: '#ccc', color: '#333' }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disableElevation sx={{ bgcolor: '#3B71CA', textTransform: 'none', px: 3, '&:hover': { bgcolor: '#2c5496' } }}>
                {initialData ? 'Update User' : 'Create User'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default UserModal;
