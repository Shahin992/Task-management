import React from 'react';
import { Box, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeCookie } from '../../utils/cookie';
import { clearUser } from '../../store/authSlice';
import { TOKEN_COOKIE_NAME } from '../../config/env';

const SidebarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'ADMIN';

  const adminMenu = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Audit Logs', path: '/admin/audit-logs' },
    { label: 'Users', path: '/admin/users' },
  ];

  const userMenu = [
    { label: 'My Tasks', path: '/user' },
    { label: 'Profile', path: '/user/profile' },
  ];

  const menuItems = isAdmin ? adminMenu : userMenu;
  const headerTitle = isAdmin ? 'Admin Dashboard' : 'User Dashboard';

  return (
    <Box
      sx={{
        width: 250,
        bgcolor: '#3B71CA',
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {headerTitle}
        </Typography>
      </Box>

      <List sx={{ pt: 0 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/admin' && item.path !== '/user' && location.pathname.startsWith(item.path));
          
          return (
            <ListItemButton
              key={item.path}
              selected={isActive}
              onClick={() => navigate(item.path)}
              sx={{
                py: 1.5,
                px: 3,
                borderLeft: isActive ? '4px solid #fff' : '4px solid transparent',
                bgcolor: isActive ? 'rgba(255, 255, 255, 0.1) !important' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ fontSize: '14px' }}
              />
            </ListItemButton>
          );
        })}
      </List>
      
      <Box sx={{ mt: 'auto', p: 2 }}>
        <ListItemButton onClick={() => {
            removeCookie(TOKEN_COOKIE_NAME);
            dispatch(clearUser());
            navigate('/');
        }} sx={{ bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 1 }}>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '14px', textAlign: 'center' }} />
        </ListItemButton>
      </Box>
    </Box>
  );
};

export default SidebarMenu;
