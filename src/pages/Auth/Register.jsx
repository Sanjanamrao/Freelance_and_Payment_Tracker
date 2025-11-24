// src/pages/Auth/Register.jsx
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
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'freelancer',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signUp } = useAuth();
  const { notify } = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) {
      setFormData({ ...formData, role: newRole });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role,
      });
      notify('Registration successful! Please check your email to verify your account.', 'success');
      onSwitchToLogin();
    } catch (err) {
      setError(err.message || 'Failed to register');
      notify('Registration failed', 'error');
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
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 450 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Join as a freelancer or client
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Role Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                I am a:
              </Typography>
              <ToggleButtonGroup
                value={formData.role}
                exclusive
                onChange={handleRoleChange}
                fullWidth
                color="primary"
              >
                <ToggleButton value="freelancer">Freelancer</ToggleButton>
                <ToggleButton value="client">Client</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              helperText="At least 6 characters"
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
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
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link
                  component="button"
                  type="button"
                  onClick={onSwitchToLogin}
                  sx={{ cursor: 'pointer' }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}