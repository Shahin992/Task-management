import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, Paper, Backdrop, Fade, IconButton, FormHelperText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BasicInput from './BasicInput';
import BasicSelect from './BasicSelect';

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

const TaskModal = ({ open, handleClose, handleSubmit, initialData = null, users = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedUserId: '',
    status: 'PENDING'
  });
  const [errors, setErrors] = useState({});

  const STATUS_OPTIONS = [
    { label: 'Todo', id: 'PENDING' },
    { label: 'In Progress', id: 'PROCESSING' },
    { label: 'Done', id: 'DONE' }
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        assignedUserId: initialData.assignedUserId || '',
        status: initialData.status || 'PENDING'
      });
    } else {
      setFormData({ title: '', description: '', assignedUserId: '', status: 'PENDING' });
    }
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.assignedUserId) newErrors.assignedUserId = 'Assignee is required';
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
      handleSubmit(formData);
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
              {initialData ? 'Edit Task' : 'Create Task'}
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box component="form" onSubmit={onSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>Title</Typography>
              <BasicInput
                fullWidth
                name="title"
                placeholder="Task title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
              />
              {errors.title && <FormHelperText error>{errors.title}</FormHelperText>}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>Description</Typography>
              <BasicInput
                fullWidth
                name="description"
                placeholder="Task description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                sx={{
                  '&.MuiInputBase-root': { height: 'auto', py: 1.5 }
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>Assignee</Typography>
              <BasicSelect
                fullWidth
                name="assignedUserId"
                options={users}
                value={formData.assignedUserId}
                onChange={handleChange}
                mapping={{ label: 'name', value: 'id' }}
                defaultText="Select Assignee"
                error={errors.assignedUserId}
              />
            </Box>

            {initialData && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>Status</Typography>
                <BasicSelect
                  fullWidth
                  name="status"
                  options={STATUS_OPTIONS}
                  value={formData.status}
                  onChange={handleChange}
                  mapping={{ label: 'label', value: 'id' }}
                />
              </Box>
            )}

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={handleClose} variant="outlined" sx={{ textTransform: 'none', px: 3, borderColor: '#ccc', color: '#333' }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disableElevation sx={{ bgcolor: '#3B71CA', textTransform: 'none', px: 3, '&:hover': { bgcolor: '#2c5496' } }}>
                {initialData ? 'Update Task' : 'Create Task'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default TaskModal;
