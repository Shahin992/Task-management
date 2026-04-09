import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, InputAdornment } from '@mui/material';
import BasicSelect from '../components/common/BasicSelect';
import BasicInput from '../components/common/BasicInput';
import { TableSkeleton } from '../components/common/Skeletons';
import GlobalEmptyPage from '../components/common/GlobalEmptyPage';
import SearchIcon from '@mui/icons-material/Search';
import { buildApiUrl } from '../config/env';

const STATUS_OPTIONS = [
  { label: 'Todo', value: 'Todo' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Done', value: 'Done' },
];

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page + 1),
          limit: String(rowsPerPage),
          search,
        });
        const res = await fetch(`${buildApiUrl('/tasks')}?${params.toString()}`, {
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setTasks(data.items.map(t => ({
             id: t.id, 
             title: t.title, 
             status: t.status 
          })));
          setTotal(data.meta.total);
        }
      } catch (e) {
        console.error('Failed to fetch user tasks', e);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchTasks();
  }, [page, rowsPerPage, search]);

  const handleStatusChange = async (id, newStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    try {
      await fetch(buildApiUrl('/tasks/status'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus === 'In Progress' ? 'PROCESSING' : newStatus === 'Todo' ? 'PENDING' : 'DONE' }),
        credentials: 'include'
      });
    } catch(e) {}
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>User Dashboard</Typography>
      <Box sx={{ mb: 2, width: { xs: '100%', sm: 320 } }}>
        <BasicInput
          fullWidth
          placeholder="Search my tasks"
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
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>My Tasks</Typography>
      {loading ? (
        <TableSkeleton rows={8} columns={2} />
      ) : tasks.length === 0 ? (
        <GlobalEmptyPage
          title="No Tasks Assigned"
          message="You do not have any assigned tasks yet. They will appear here once an admin assigns them."
        />
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2 }}>
          <Table sx={{ width: '100%' }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#FAFAFA' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#666', width: '75%' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#666', width: '25%' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell sx={{ minWidth: 200 }}>
                    <BasicSelect
                      fullWidth
                      options={STATUS_OPTIONS}
                      value={task.status === 'PROCESSING' ? 'In Progress' : task.status === 'PENDING' ? 'Todo' : task.status === 'DONE' ? 'Done' : task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      mapping={{ label: 'label', value: 'value' }}
                      className="status-select"
                    />
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
    </Box>
  );
};

export default UserDashboard;
