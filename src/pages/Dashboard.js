import Container from '@mui/material/Container';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';
import RepoIcon from '@mui/icons-material/Book';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import TimerIcon from '@mui/icons-material/Timer';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { useGlobalState } from '../context/GlobalState';
import Avatar from '@mui/material/Avatar';

export default function Dashboard() {
  const { state } = useGlobalState();
  const user = state.githubUser;
  const repos = state.githubRepos;
  const tasks = state.tasks;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalPomodoros = tasks.reduce((sum, t) => sum + t.pomodoroCount, 0);
  const completedPomodoros = tasks.reduce((sum, t) => sum + t.pomodoroDone, 0);
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

  return (
    <Fade in timeout={600}>
      <Container sx={{ mt: 4 }}>
        {user && (
          <Box display='flex' alignItems='center' mb={3}>
            <Avatar
              src={user.avatar_url}
              sx={{ width: 64, height: 64, mr: 2 }}
            />
            <Box>
              <Typography variant='h5'>{user.name || user.login}</Typography>
              <Typography variant='body2'>{user.bio}</Typography>
            </Box>
          </Box>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ p: 2, boxShadow: 2 }}>
              <CardContent>
                <Box display='flex' alignItems='center' gap={1}>
                  <RepoIcon color='primary' />
                  <Typography variant='subtitle1'>Repositories</Typography>
                </Box>
                <Typography variant='h5'>{repos.length}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ p: 2, boxShadow: 2 }}>
              <CardContent>
                <Box display='flex' alignItems='center' gap={1}>
                  <StarIcon color='warning' />
                  <Typography variant='subtitle1'>Stars</Typography>
                </Box>
                <Typography variant='h5'>{totalStars}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ p: 2, boxShadow: 2 }}>
              <CardContent>
                <Box display='flex' alignItems='center' gap={1}>
                  <GroupIcon color='success' />
                  <Typography variant='subtitle1'>Followers</Typography>
                </Box>
                <Typography variant='h5'>{user?.followers || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ p: 2, boxShadow: 2 }}>
              <CardContent>
                <Box display='flex' alignItems='center' gap={1}>
                  <AssignmentTurnedInIcon color='secondary' />
                  <Typography variant='subtitle1'>Completed Tasks</Typography>
                </Box>
                <Typography variant='h5'>
                  {completedTasks} / {totalTasks}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ p: 2, boxShadow: 2 }}>
              <CardContent>
                <Box display='flex' alignItems='center' gap={1}>
                  <TimerIcon color='error' />
                  <Typography variant='subtitle1'>Pomodoros Done</Typography>
                </Box>
                <Typography variant='h5'>
                  {completedPomodoros} / {totalPomodoros}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Fade>
  );
}
