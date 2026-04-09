import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import BasicInput from '../common/BasicInput';

const Topbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const user = useSelector((state) => state.auth.user);
  const userName = user?.name || 'User';
  const userInitials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: '#ebe8ed', color: 'black', height: '80px' }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          height: '100%',
          px: 2,
        }}
      >
        {!isMobile &&(
          <Typography
          variant="h6"
          sx={{ width: 230, fontWeight: '700', userSelect: 'none' }}
        >
          Task Management
        </Typography>)}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
            gap: 3,
          }}
        >
          {/* Search input box */}
          {/* {!isMobile && (
            <Box sx={{ flex: 1, maxWidth: 400 }}>
            <BasicInput
              placeholder="Search system wise"
              name="appName"
              endAdornment={
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: '#ced4da' }} />
                </InputAdornment>
              }
            />
          </Box>)} */}

          {/* User Info */}
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: '#6f42c1' }}>{userInitials}</Avatar>
            <Typography variant="body1">{userName}</Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
