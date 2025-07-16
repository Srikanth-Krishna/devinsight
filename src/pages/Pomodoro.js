import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  Button,
  Box,
  Fade,
} from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { useGlobalState } from '../context/GlobalState';

function Pomodoro() {
  const { state, dispatch } = useGlobalState();
  const { timer } = state;
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(
    timer.selectedTaskIndex
  );
  const bell = useRef(
    typeof Audio !== 'undefined' ? new Audio('/bell.mp3') : null
  );

  const formatTime = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${m}:${sec}`;
  };

  const handleStart = () => {
    if (!timer.isRunning && selectedTaskIndex !== null) {
      dispatch({ type: 'START_TIMER', payload: selectedTaskIndex });
    }
  };

  useEffect(() => {
    let interval;
    if (timer.isRunning) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer.isRunning, dispatch]);

  useEffect(() => {
    if (timer.secondsLeft <= 0 && timer.isRunning) {
      bell.current?.play();
      navigator.vibrate?.([200, 100, 200]);

      dispatch({ type: 'INCREMENT_CYCLE' });

      if (timer.phase === 'work') {
        if (timer.selectedTaskIndex !== null) {
          dispatch({
            type: 'INCREMENT_POMODORO',
            payload: timer.selectedTaskIndex,
          });
        }
        const longBreak = (timer.cycleCount + 1) % 4 === 0;
        dispatch({
          type: 'RESET_TIMER',
          payload: {
            phase: longBreak ? 'longBreak' : 'shortBreak',
            seconds: longBreak ? 15 * 60 : 5 * 60,
          },
        });
      } else {
        dispatch({
          type: 'RESET_TIMER',
          payload: {
            phase: 'work',
            seconds: 25 * 60,
          },
        });
      }
    }
  }, [
    timer.secondsLeft,
    timer.isRunning,
    dispatch,
    timer.cycleCount,
    timer.phase,
    timer.selectedTaskIndex,
  ]);

  return (
    <Fade in={true} timeout={600}>
      <Container sx={{ mt: 4 }}>
        <Typography variant='h4' gutterBottom>
          Pomodoro Timer
        </Typography>

        <Typography variant='h6' color='textSecondary' gutterBottom>
          {timer.phase === 'work'
            ? 'Focus Time'
            : timer.phase === 'shortBreak'
              ? 'Short Break'
              : 'Long Break'}
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Task</InputLabel>
          <Select
            value={selectedTaskIndex ?? ''}
            onChange={(e) => setSelectedTaskIndex(Number(e.target.value))}
            label='Select Task'
          >
            {state.tasks.map((task, index) => (
              <MenuItem key={index} value={index}>
                {task.text} ({task.pomodoroDone}/{task.pomodoroCount})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant='h2' sx={{ fontWeight: 600 }}>
            {formatTime(timer.secondsLeft)}
          </Typography>
          <Button
            variant='contained'
            color='primary'
            onClick={handleStart}
            disabled={timer.isRunning || selectedTaskIndex === null}
            sx={{ mt: 2 }}
          >
            {timer.phase === 'work' ? 'Start Focus' : 'Start Break'}
          </Button>
        </Card>

        <Box sx={{ mt: 4 }}>
          <Typography variant='h6' gutterBottom>
            Pomodoro Progress
          </Typography>
          <ResponsiveContainer width='100%' height={220}>
            <BarChart data={state.tasks}>
              <XAxis dataKey='text' />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey='pomodoroDone' name='Completed' fill='#1976d2' />
              <Bar dataKey='pomodoroCount' name='Planned' fill='#90caf9' />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Container>
    </Fade>
  );
}

export default Pomodoro;
