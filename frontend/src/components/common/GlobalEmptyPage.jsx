import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

const GlobalEmptyPage = ({ 
  title = "No Data Found", 
  message = "There's nothing to display here at the moment.", 
  actionText, 
  onAction,
  icon = <InboxIcon sx={{ fontSize: 60, color: '#bdbdbd' }} /> 
}) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        textAlign: 'center',
        py: 10,
        px: 2,
        bgcolor: '#FAFAFA',
        borderRadius: 2,
        border: '1px dashed #E0E0E0'
      }}
    >
      {icon}
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 2, color: '#424242' }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3, maxWidth: 400 }}>
        {message}
      </Typography>
      {actionText && (
        <Button 
          variant="contained" 
          disableElevation 
          onClick={onAction}
          sx={{ 
            bgcolor: '#3B71CA', 
            textTransform: 'none',
            px: 4,
            fontWeight: 600,
            '&:hover': { bgcolor: '#2c5496' } 
          }}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default GlobalEmptyPage;
