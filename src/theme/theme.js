
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4C6FFF' },
    secondary: { main: '#00C2A8' },
    background: { default: '#F7F8FC', paper: '#FFFFFF' },
    text: { primary: '#111827', secondary: '#6B7280' }
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial'].join(','),
    h6: { fontWeight: 700 },
    body2: { color: '#6B7280' }
  },
  components: {
    MuiPaper: { styleOverrides: { root: { borderRadius: 14 } } },
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
    MuiAppBar: { styleOverrides: { root: { backgroundColor: '#fff' } } }
  }
});

export default theme;
