// src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Container,
  Alert,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Login({ onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useAuth();
  const { notify } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn({ email, password });
      notify('Login successful!', 'success');
    } catch (err) {
      setError(err.message || 'Failed to login');
      notify('Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoFocus
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link
                  component="button"
                  type="button"
                  onClick={onSwitchToRegister}
                  sx={{ cursor: 'pointer' }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}