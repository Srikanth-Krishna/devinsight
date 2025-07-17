import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TimerIcon from '@mui/icons-material/Timer';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import GitHubSearchModal from './SearchModal';
import { useGlobalState } from '../context/GlobalState';
import { ColorModeContext } from '../AppWrapper';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      },
    },
  ],
}));

const icons = [
  <DashboardIcon />,
  <FormatListBulletedIcon />,
  <TimerIcon />,
  <QueryStatsIcon />,
];

export default function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const { dispatch } = useGlobalState();

  const searchHandler = async (user) => {
    const headers = {
      Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
    };

    const userRes = await fetch(`https://api.github.com/users/${user}`, {
      headers,
    });
    if (!userRes.ok) throw new Error('User not found');
    const userData = await userRes.json();

    const repoRes = await fetch(
      `https://api.github.com/users/${user}/repos?per_page=100`,
      { headers }
    );
    const repoData = await repoRes.json();

    dispatch({ type: 'SET_GITHUB_USER', payload: userData });
    dispatch({ type: 'SET_GITHUB_REPOS', payload: repoData });
    navigate('/github');
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <AppBar position='fixed'>
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
              <span
                style={{
                  color: theme.palette.mode === 'dark' ? 'crimson' : '#0b1957',
                  fontWeight: 600,
                }}
              >
                Dev
              </span>
              Insight
            </Typography>
            <IconButton color='inherit' onClick={colorMode.toggleColorMode}>
              {theme.palette.mode === 'dark' ? (
                <LightModeIcon />
              ) : (
                <DarkModeIcon />
              )}
            </IconButton>
            <Button color='inherit' onClick={() => setSearchOpen(true)}>
              Search User
            </Button>
          </Toolbar>
        </AppBar>
        <GitHubSearchModal
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSearch={(username) => searchHandler(username)}
        />
        <Drawer variant='permanent' open={open}>
          <DrawerHeader>
            <IconButton onClick={() => setOpen(!open)}>
              {theme.direction === 'rtl' ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {[
              { text: 'Dashboard', key: '/' },
              { text: 'Task Manager', key: '/tasks' },
              { text: 'Pomodoro', key: '/pomodoro' },
              { text: 'Stats', key: '/github' },
            ].map((item, index) => (
              <ListItem
                key={item.text}
                disablePadding
                sx={{
                  display: 'block',
                  backgroundColor:
                    location.pathname === item.key ? '#d5ebfec7' : null,
                  transition: '0.3s ease-in-out',
                }}
                onClick={() => navigate(`${item.key}`)}
              >
                <ListItemButton
                  sx={[
                    {
                      minHeight: 48,
                      px: 2.5,
                    },
                    open
                      ? {
                          justifyContent: 'initial',
                        }
                      : {
                          justifyContent: 'center',
                        },
                  ]}
                >
                  <ListItemIcon
                    sx={[
                      {
                        minWidth: 0,
                        justifyContent: 'center',
                      },
                      open
                        ? {
                            mr: 3,
                          }
                        : {
                            mr: 'auto',
                          },
                    ]}
                  >
                    {icons[index]}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={[
                      open
                        ? {
                            opacity: 1,
                          }
                        : {
                            opacity: 0,
                          },
                    ]}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
}
