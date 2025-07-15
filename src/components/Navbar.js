import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar({ open, setOpen }) {
  return (
    <AppBar position='fixed' open={open}>
      <Toolbar>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          onClick={() => setOpen(!open)}
          edge='start'
          sx={[
            {
              marginRight: 5,
            },
          ]}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant='h5' component='div' sx={{ flexGrow: 1 }}>
          <span style={{ color: '#0b1957', fontWeight: 600 }}>Dev</span>
          Insight
        </Typography>
        <Button color='inherit'>Login</Button>
      </Toolbar>
    </AppBar>
  );
}
