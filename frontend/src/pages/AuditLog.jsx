import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import api from '../utils/apiClient';
import { TableSkeleton } from '../components/common/Skeletons';
import GlobalEmptyPage from '../components/common/GlobalEmptyPage';

const formatAction = (log) => {
  switch (log.actionType) {
    case 'USER_CREATED':
      return 'User Created';
    case 'USER_UPDATED':
      return 'User Updated';
    case 'USER_DELETED':
      return 'User Deleted';
    case 'TASK_CREATED':
      return 'Task Created';
    case 'TASK_UPDATED':
      return 'Task Updated';
    case 'TASK_STATUS_CHANGED':
      return 'Task Status Changed';
    case 'TASK_DELETED':
      return 'Task Deleted';
    default:
      return log.actionType || 'Unknown Action';
  }
};

const formatDetails = (log, usersById) => {
  const summary = log.summary || {};

  if (log.targetEntity === 'User') {
    const details = [];
    if (summary.email) details.push(`Email: ${summary.email}`);
    if (summary.role) details.push(`Role: ${summary.role}`);
    if (summary.name) details.push(`Name: ${summary.name}`);
    return details.join(' | ') || `User ID: ${log.targetId}`;
  }

  if (log.targetEntity === 'task') {
    const details = [];
    if (summary.title) details.push(`Title: ${summary.title}`);
    if (summary.status) details.push(`Status: ${summary.status}`);
    if (summary.assignedUserId) {
      details.push(`Assigned User: ${usersById[summary.assignedUserId] || summary.assignedUserId}`);
    }
    if (summary.before && summary.after) {
      details.push('Updated task details');
    }
    if (summary.after && !summary.before) {
      details.push(`New Status: ${summary.after}`);
    }
    return details.join(' | ') || `Task ID: ${log.targetId}`;
  }

  return `Target ID: ${log.targetId}`;
};

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const fetchLogs = async () => {
      if (page === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      try {
        const params = new URLSearchParams({
          page: String(page + 1),
          limit: String(rowsPerPage),
        });
        const [logsRes, usersRes] = await Promise.all([
          api.get(`/audit-logs?${params.toString()}`),
          api.get('/users?page=1&limit=100&search='),
        ]);

        if (logsRes.ok) {
          const logsData = await logsRes.json();
          const usersPayload = usersRes.ok ? await usersRes.json() : { items: [] };
          const usersById = usersPayload.items.reduce((acc, user) => {
            acc[user.id] = user.name;
            return acc;
          }, {});

          const mappedLogs = logsData.items.map((l) => ({
            id: l.id,
            timestamp: new Date(l.createdAt).toLocaleString(),
            user: l.actor?.name || 'admin',
            action: formatAction(l),
            details: formatDetails(l, usersById),
          }));

          setLogs((prev) => (page === 0 ? mappedLogs : [...prev, ...mappedLogs]));
          setTotal(logsData.meta.total);
        }
      } catch (e) {
        console.error('Failed to fetch audit logs', e);
      } finally {
        setTimeout(() => {
          setLoading(false);
          setLoadingMore(false);
        }, 800);
      }
    };
    fetchLogs();
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (!loadMoreRef.current || loading || loadingMore || logs.length >= total) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadingMore && logs.length < total) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [loading, loadingMore, logs.length, total]);

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>Audit Log</Typography>
      
      {loading ? (
        <TableSkeleton rows={8} columns={4} />
      ) : logs.length === 0 ? (
        <GlobalEmptyPage
          title="No Audit Logs Yet"
          message="Audit activity will appear here once users start creating, updating, or deleting records."
        />
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2 }}>
          <Table sx={{ width: '100%' }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#FAFAFA' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#666', width: '30%' }}>Timestamp</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#666', width: '15%' }}>User</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#666', width: '20%' }}>Action</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#666', width: '35%' }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.details || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {!loading && logs.length > 0 && logs.length < total && (
        <Box ref={loadMoreRef} sx={{ pt: 2 }}>
          {loadingMore ? <TableSkeleton rows={3} columns={4} /> : null}
        </Box>
      )}
    </Box>
  );
};

export default AuditLog;
