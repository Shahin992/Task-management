import React from 'react';
import { Modal, Box, Typography, Button, Paper, Backdrop, Fade } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  outline: 'none',
  textAlign: 'center'
};

const ActionModal = ({ 
  open, 
  handleClose, 
  handleAction, 
  type = 'success', 
  title, 
  message, 
  actionText = 'Confirm', 
  cancelText = 'Cancel' 
}) => {
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleOutlineIcon sx={{ fontSize: 60, color: '#4CAF50', mb: 2 }} />;
      case 'error':
        return <ErrorOutlineIcon sx={{ fontSize: 60, color: '#F44336', mb: 2 }} />;
      case 'warning':
        return <WarningAmberIcon sx={{ fontSize: 60, color: '#FF9800', mb: 2 }} />;
      default:
        return <CheckCircleOutlineIcon sx={{ fontSize: 60, color: '#4CAF50', mb: 2 }} />;
    }
  };

  const getActionButtonColor = () => {
    switch (type) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'warning': return '#FF9800';
      default: return '#3B71CA';
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
          <Box>
            {getIcon()}
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              {message}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button 
                onClick={handleClose} 
                variant="outlined" 
                sx={{ 
                  textTransform: 'none', 
                  px: 4, 
                  borderColor: '#ccc', 
                  color: '#333',
                  '&:hover': { borderColor: '#999' }
                }}
              >
                {cancelText}
              </Button>
              <Button 
                onClick={() => {
                  if (handleAction) handleAction();
                  handleClose();
                }} 
                variant="contained" 
                disableElevation 
                sx={{ 
                  bgcolor: getActionButtonColor(), 
                  textTransform: 'none', 
                  px: 4,
                  '&:hover': { bgcolor: getActionButtonColor(), opacity: 0.9 } 
                }}
              >
                {actionText}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default ActionModal;
