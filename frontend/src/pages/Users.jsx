import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Chip, Button, TablePagination, InputAdornment } from '@mui/material';
import UserModal from '../components/common/UserModal';
import ActionModal from '../components/common/ActionModal';
import BasicInput from '../components/common/BasicInput';
import { TableSkeleton } from '../components/common/Skeletons';
import GlobalEmptyPage from '../components/common/GlobalEmptyPage';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import { buildApiUrl } from '../config/env';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page + 1),
        limit: String(rowsPerPage),
        search,
      });
      const res = await fetch(`${buildApiUrl('/users')}?${params.toString()}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.items.map(u => ({ ...u, status: 'Active' })));
        setTotal(data.meta.total);
      }
    } catch (e) {
      console.error('Failed to fetch users', e);
    } finally {
      // Simulate real fetch time for better UX with skeleton
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, search]);

  const handleOpenModal = (user = null) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserSubmit = async (formData) => {
    try {
      const method = selectedUser ? 'PATCH' : 'POST';
      const url = buildApiUrl('/users');
      const payload = selectedUser ? { ...formData, id: selectedUser.id } : formData;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (res.ok) {
        fetchUsers();
        handleCloseModal();
      } else {
        const err = await res.json();
        alert(err.message || 'Operation failed');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(buildApiUrl('/users'), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: userToDelete.id }),
        credentials: 'include'
      });
      if (res.ok) {
        fetchUsers();
        setDeleteModalOpen(false);
        setUserToDelete(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">User Management</Typography>
          <Box sx={{ mt: 2, width: { xs: '100%', sm: 320 } }}>
            <BasicInput
              fullWidth
              placeholder="Search by name, email, or role"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              endAdornment={
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: '#94A3B8' }} />
                </InputAdornment>
              }
            />
          </Box>
        </Box>
        <Button 
          variant="contained" 
          disableElevation
          onClick={() => handleOpenModal()}
          sx={{ 
            bgcolor: '#3B71CA', 
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            '&:hover': { bgcolor: '#2c5496' }
          }}
        >
          Create User
        </Button>
      </Box>
      
      {loading ? (
        <TableSkeleton rows={8} columns={5} />
      ) : users.length === 0 ? (
        <GlobalEmptyPage 
          title="No Users Registered" 
          message="It looks like there are no users in the system yet. You can add one by clicking the button below." 
          actionText="Add New User"
          onAction={() => handleOpenModal()}
          icon={<PersonAddIcon sx={{ fontSize: 60, color: '#bdbdbd' }} />}
        />
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2 }}>
          <Table sx={{ width: '100%' }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#FAFAFA' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#666', width: '25%' }}>User</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#666', width: '25%' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#666', width: '15%' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#666', width: '15%' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#666', width: '20%' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#3B71CA', fontSize: '14px', width: 32, height: 32 }}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Typography variant="body2" fontWeight={500}>{user.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      size="small" 
                      sx={{ 
                        borderRadius: '4px', 
                        fontSize: '11px', 
                        fontWeight: 700,
                        bgcolor: user.role === 'ADMIN' ? '#E3F2FD' : '#F5F5F5',
                        color: user.role === 'ADMIN' ? '#1976D2' : '#616161'
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: user.status === 'Active' ? '#4CAF50' : '#F44336' }} />
                      <Typography variant="body2">{user.status}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={() => handleOpenModal(user)}
                      sx={{ textTransform: 'none', mr: 1, borderColor: '#ccc', color: '#333' }}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="error" 
                      sx={{ textTransform: 'none' }} 
                      onClick={() => handleDeleteClick(user)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </TableContainer>
      )}

      <UserModal 
        open={isModalOpen}
        handleClose={handleCloseModal}
        handleSubmit={handleUserSubmit}
        initialData={selectedUser}
      />

      <ActionModal
        open={deleteModalOpen}
        handleClose={() => setDeleteModalOpen(false)}
        handleAction={confirmDelete}
        type="warning"
        title="Delete User"
        message={`Are you sure you want to delete "${userToDelete?.name}"? All associated data will be permanently removed.`}
        actionText="Delete User"
      />
    </Box>
  );
};

export default Users;
