
// Sidebar.js
import React, { useState } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import MobileSidebar from './MobileSidebar';
import { useTheme } from '@mui/material/styles';

const activeColor = '#6475f7';

const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { label: 'Task', path: '/tasks', icon: <SchoolIcon /> },
  ];

  const handleToggle = () => setCollapsed((prev) => !prev);

  if (isMobile) {
    return (
      <>
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1300, color: '#fff', bgcolor: '#2c0b52' }}
        >
          <MenuIcon />
        </IconButton>
        <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      </>
    );
  }

  return (
    <Box
      sx={{
        width: collapsed ? 80 : 240,
        bgcolor: '#2c0b52',
        color: 'white',
        minHeight: '100vh',
        p: 1.25,
        transition: 'width 0.3s ease',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Nav Items */}
      <List sx={{ flex: 1, mt: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.path}
              selected={isActive}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: '16px',
                mb: 1,
                color: 'inherit',
                bgcolor: isActive ? activeColor : 'transparent',
                '&:hover, &:focus, &.Mui-selected': {
                  bgcolor: activeColor + '!important',
                  color: 'white',
                },
                justifyContent: collapsed ? 'center' : 'flex-start',
                px: 1,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? 'unset' : '35px',
                  color: '#fff',
                  mr: collapsed ? 0 : 1,
                  justifyContent: 'center',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>

              {/* Text */}
              <Box
                sx={{
                  maxWidth: collapsed ? 0 : '100%',
                  opacity: collapsed ? 0 : 1,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  transition: 'max-width 0.3s ease, opacity 0.3s ease',
                  display: 'inline-block',
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '18px',
                    fontWeight: 500,
                    color: '#fff',
                    sx: {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    },
                  }}
                />
              </Box>
            </ListItemButton>
          );
        })}
      </List>

      {/* Collapse Toggle */}
      <IconButton
        onClick={handleToggle}
        sx={{
          position: 'absolute',
          bottom: 90,
          right: collapsed ? 'calc(50% - 60px)' : -20,
          bgcolor: activeColor,
          color: 'white',
          width: 32,
          height: 32,
          borderRadius: '50%',
          boxShadow: 3,
          zIndex: 10,
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: '#5064f4',
          },
        }}
      >
        {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
      </IconButton>
    </Box>
  );
};

export default Sidebar;
