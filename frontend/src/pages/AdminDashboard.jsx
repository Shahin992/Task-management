import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, TablePagination, InputAdornment } from '@mui/material';
import TaskModal from '../components/common/TaskModal';
import ActionModal from '../components/common/ActionModal';
import { TableSkeleton } from '../components/common/Skeletons';
import GlobalEmptyPage from '../components/common/GlobalEmptyPage';
import api from '../utils/apiClient';
import BasicInput from '../components/common/BasicInput';
import SearchIcon from '@mui/icons-material/Search';
import { buildApiUrl } from '../config/env';

const mapTask = (task) => ({
  id: task.id,
  title: task.title,
  description: task.description,
  assignedUserId: task.assignedUserId,
  assignee: task.assignedUser?.name || task.assignedUserId || 'Unassigned',
  status: task.status,
});

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page + 1),
          limit: String(rowsPerPage),
          search,
        });
        const res = await api.get(`/tasks?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setTasks(data.items.map(mapTask));
          setTotal(data.meta.total);
        }
      } catch (e) {
        console.error('Failed to fetch tasks', e);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await api.get('/users?page=1&limit=100&search=');
        if (res.ok) {
          const data = await res.json();
          setUsers(data.items);
        }
      } catch (e) {
        console.error('Failed to fetch users', e);
      }
    };

    fetchTasks();
    fetchUsers();
  }, [page, rowsPerPage, search]);

  const handleOpenModal = (task = null) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  const handleTaskSubmit = async (formData) => {
    try {
      const method = selectedTask ? 'PATCH' : 'POST';
      const url = buildApiUrl('/tasks');
      const payload = selectedTask ? { ...formData, id: selectedTask.id } : formData;
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Failed to save task');
      }

      const savedTask = await res.json();

      if (selectedTask) {
        setTasks(tasks.map((task) => (task.id === savedTask.id ? mapTask(savedTask) : task)));
      } else {
        setTasks([mapTask(savedTask), ...tasks]);
      }

      handleCloseModal();
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'In Progress' || status === 'PROCESSING') return { bg: '#D3EADD', text: '#217A44' };
    if (status === 'Done' || status === 'DONE') return { bg: '#E4DFE2', text: '#5D5C61' };
    if (status === 'Todo' || status === 'PENDING') return { bg: '#FDF1D6', text: '#B8860B' };
    return { bg: '#E0E0E0', text: '#333' };
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    const id = taskToDelete.id;
    try {
      await fetch(buildApiUrl('/tasks'), { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
        credentials: 'include'
      });
    } catch(e) {}
    setTasks(tasks.filter(t => t.id !== id));
    setDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">Task Management</Typography>
          <Box sx={{ mt: 2, width: { xs: '100%', sm: 320 } }}>
            <BasicInput
              fullWidth
              placeholder="Search by title, description, status"
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
          Create Task
        </Button>
      </Box>

      {loading ? (
        <TableSkeleton rows={8} columns={4} />
      ) : tasks.length === 0 ? (
        <GlobalEmptyPage
          title="No Tasks Created"
          message="There are no tasks yet. Create your first task to get the team moving."
          actionText="Create Task"
          onAction={() => handleOpenModal()}
        />
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2 }}>
          <Table sx={{ width: '100%' }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#FAFAFA' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#666', width: '40%' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#666', width: '20%' }}>Assignee</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#666', width: '20%' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#666', width: '20%' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.assignee}</TableCell>
                  <TableCell>
                    <Chip
                      label={task.status === 'PROCESSING' ? 'In Progress' : task.status === 'PENDING' ? 'Todo' : task.status === 'DONE' ? 'Done' : task.status}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(task.status).bg,
                        color: getStatusColor(task.status).text,
                        borderRadius: '4px',
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={() => handleOpenModal(task)}
                      sx={{ textTransform: 'none', mr: 1, borderColor: '#ccc', color: '#333' }}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="error" 
                      sx={{ textTransform: 'none' }} 
                      onClick={() => handleDeleteClick(task)}
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

      <TaskModal 
        open={isModalOpen}
        handleClose={handleCloseModal}
        handleSubmit={handleTaskSubmit}
        initialData={selectedTask}
        users={users}
      />

      <ActionModal
        open={deleteModalOpen}
        handleClose={() => setDeleteModalOpen(false)}
        handleAction={confirmDelete}
        type="warning"
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
        actionText="Delete"
      />
    </Box>
  );
};

export default AdminDashboard;
