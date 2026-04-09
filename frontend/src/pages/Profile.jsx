import React from 'react';
import { Avatar, Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

const Profile = () => {
    const user = useSelector((state) => state.auth.user) || {};
    const userName = user.name || 'Current User';
    const userEmail = user.email || 'user@example.com';
    const userRole = user.role || 'USER';
    const userInitials = userName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'U';

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
              Profile
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              View your account information and current access level.
            </Typography>

            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                border: '1px solid #E3E7EE',
                overflow: 'hidden',
                bgcolor: '#FFFFFF',
              }}
            >
              <Box
                sx={{
                  px: { xs: 3, md: 4 },
                  py: { xs: 4, md: 5 },
                  background: 'linear-gradient(135deg, #0F172A 0%, #1D4ED8 100%)',
                  color: 'white',
                }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      fontSize: 28,
                      fontWeight: 700,
                      bgcolor: 'rgba(255,255,255,0.18)',
                      color: 'white',
                      border: '2px solid rgba(255,255,255,0.28)',
                    }}
                  >
                    {userInitials}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {userName}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
                      {userEmail}
                    </Typography>
                    <Chip
                      label={userRole}
                      size="small"
                      sx={{
                        mt: 2,
                        bgcolor: 'rgba(255,255,255,0.14)',
                        color: 'white',
                        fontWeight: 700,
                        borderRadius: '999px',
                      }}
                    />
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ px: { xs: 3, md: 4 }, py: 4 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  Account Details
                </Typography>

                <Stack spacing={3} divider={<Divider flexItem />}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Full Name
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {userName}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Email Address
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {userEmail}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Access Role
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {userRole}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Paper>
        </Box>
    );
};

export default Profile;
