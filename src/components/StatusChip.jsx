
import { Chip } from '@mui/material';

export default function StatusChip({ status }) {
  const color =
    status === 'Completed' ? 'success' :
    status === 'In Progress' ? 'info' :
    status === 'Pending' ? 'warning' :
    status === 'Overdue' ? 'error' :
    'default';
  return <Chip label={status} color={color} size="small" />;
}


