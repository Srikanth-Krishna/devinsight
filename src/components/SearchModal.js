import { Modal, Card, Typography, TextField, Button } from '@mui/material';
import React, { useState } from 'react';

export default function GitHubSearchModal({ open, onClose, onSearch }) {
  const [username, setUsername] = useState('');

  const handleSearch = () => {
    if (username.trim()) {
      onSearch(username.trim());
      setUsername('');
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Card
        sx={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -30%)',
          p: 4,
          minWidth: 300,
        }}
      >
        <Typography variant='h6' gutterBottom>
          Search GitHub User
        </Typography>
        <TextField
          fullWidth
          label='GitHub Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ mb: 2 }}
        />
        <Button variant='contained' onClick={handleSearch}>
          Search User
        </Button>
      </Card>
    </Modal>
  );
}
