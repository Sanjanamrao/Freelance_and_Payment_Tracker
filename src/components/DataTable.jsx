
import {
  Paper, Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, TablePagination, Box, Typography, LinearProgress
} from '@mui/material';

export default function DataTable({
  columns, rows, loading = false, page = 0, rowsPerPage = 10,
  onPageChange, onRowsPerPageChange, onRowClick, emptyLabel = 'No data'
}) {
  const paginated = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper>
      {loading && <LinearProgress />}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell key={col.field} sx={{ fontWeight: 700 }}>{col.headerName}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Box sx={{ py: 6, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">{emptyLabel}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {paginated.map(row => (
              <TableRow
                key={row.id || row.InvoiceID || row.ProjectID || row.TaskID || row.PaymentID}
                hover
                sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map(col => (
                  <TableCell key={col.field}>
                    {col.render ? col.render(row[col.field], row) : row[col.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={(_, newPage) => onPageChange?.(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={e => onRowsPerPageChange?.(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
}
