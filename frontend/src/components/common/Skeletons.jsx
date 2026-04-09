import React from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton } from '@mui/material';

const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2 }}>
      <Table sx={{ width: '100%' }}>
        <TableHead>
          <TableRow sx={{ bgcolor: '#FAFAFA' }}>
            {[...Array(columns)].map((_, i) => (
              <TableCell key={`head-${i}`}>
                <Skeleton variant="text" width="60%" height={24} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(rows)].map((_, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              {[...Array(columns)].map((_, colIndex) => (
                <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                  <Skeleton variant="text" width="80%" height={20} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const CardSkeleton = ({ count = 3 }) => {
  return (
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
      {[...Array(count)].map((_, i) => (
        <Paper key={i} sx={{ p: 3, borderRadius: 2, border: '1px solid #E0E0E0' }} elevation={0}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
        </Paper>
      ))}
    </Box>
  );
};

export { TableSkeleton, CardSkeleton };
