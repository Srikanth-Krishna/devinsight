import Container from '@mui/material/Container';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { CardStat } from '../components/CardStat';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function Dashboard() {
  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0 });
  const [pomodoroCount, setPomodoroCount] = useState(8);
  const [githubStats, setGithubStats] = useState({ repos: 0, followers: 0 });
  const [taskTrend, setTaskTrend] = useState([
    { day: 'Mon', tasks: 2 },
    { day: 'Tue', tasks: 3 },
    { day: 'Wed', tasks: 1 },
    { day: 'Thu', tasks: 4 },
    { day: 'Fri', tasks: 3 },
    { day: 'Sat', tasks: 5 },
    { day: 'Sun', tasks: 2 },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      const parsed = JSON.parse(saved);
      const completed = parsed.filter((t) => t.completed).length;
      setTaskStats({ total: parsed.length, completed });
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      const parsed = JSON.parse(saved);
      const completed = parsed.filter((t) => t.completed).length;
      setTaskStats({ total: parsed.length, completed });
    }
  }, []);

  useEffect(() => {
    fetch('https://api.github.com/users/octocat')
      .then((res) => res.json())
      .then((data) =>
        setGithubStats({ repos: data.public_repos, followers: data.followers })
      );
  }, []);

  const todayTasks = 3;
  const goal = 5;
  const activeCount = 5;

  return (
    <Fade in={true} timeout={600}>
      <Container>
        <Typography variant='h4' gutterBottom>
          Welcome to DevInsight
        </Typography>
        <Typography variant='body1' mb={4}>
          Your productivity metrics at a glance
        </Typography>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <CardStat title='Total Tasks' value={taskStats.total} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardStat title='Completed Tasks' value={taskStats.completed} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardStat title='Pomodoro Sessions' value={pomodoroCount} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardStat title='GitHub Repos' value={githubStats.repos} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardStat title='GitHub Followers' value={githubStats.followers} />
          </Grid>
        </Grid>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, borderRadius: 2, boxShadow: 2, width: 350 }}>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  📈 Task Trend This Week
                </Typography>
                <ResponsiveContainer width='100%' height={200}>
                  <LineChart data={taskTrend}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='day' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type='monotone'
                      dataKey='tasks'
                      stroke='#8884d8'
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '89%', p: 2, borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  🎯 Today's Goal
                </Typography>
                <Typography variant='body2'>
                  {todayTasks} of {goal} tasks completed
                </Typography>
                <Box mt={2}>
                  <LinearProgress
                    variant='determinate'
                    value={(todayTasks / goal) * 100}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '89%',
                p: 2,
                borderRadius: 2,
                boxShadow: 2,
                width: 320,
              }}
            >
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  🌙 Productivity Streak
                </Typography>
                <Typography variant='body2'>
                  You've been active for {activeCount} consecutive days!
                </Typography>
                <Box mt={2} display='flex' gap={1}>
                  {[...Array(7)].map((_, i) => (
                    <Box
                      key={i}
                      width={30}
                      height={30}
                      borderRadius={1}
                      bgcolor={i < activeCount ? 'primary.main' : 'grey.300'}
                      flexWrap={1}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Fade>
  );
}
