// import React from 'react';

// const Navbar = () => {
//   return (
//     <nav style={{ padding: '0.5rem', borderBottom: '1px solid #ccc' }}>
//       <h2 style={{ margin: 0 }}>
//         <span style={{ color: 'red' }}>Dev</span>Insight
//       </h2>
//     </nav>
//   );
// };

// export default Navbar;
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
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
    </Box>
  );
}
