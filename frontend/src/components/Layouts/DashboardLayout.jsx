import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import SidebarMenu from './SidebarMenu';
import Topbar from './Topbar';

const DashboardLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        overflow: 'hidden',
        bgcolor: '#F5F7FA'
      }}
    >
      <SidebarMenu />
      <Box
        component="main"
        sx={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* <Topbar /> */}
        <Box sx={{ p: 4, flex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
