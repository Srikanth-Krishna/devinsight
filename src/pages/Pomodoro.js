import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Fade from '@mui/material/Fade';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import React, { useEffect, useRef, useState } from 'react';

export default function Pomodoro() {
  const WORK_DURATION = 25 * 60;
  const SHORT_BREAK = 5 * 60;
  const LONG_BREAK = 15 * 60;

  const [secondsLeft, setSecondsLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // 'work', 'short', 'long'
  const [completedSessions, setCompletedSessions] = useState(() =>
    Number(localStorage.getItem('completedPomodoros') || 0)
  );
  const intervalRef = useRef(null);

  const playSound = () => {
    const audio = new Audio(
      'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg'
    );
    audio.play();
  };

  useEffect(() => {
    localStorage.setItem('completedPomodoros', completedSessions);
  }, [completedSessions]);

  const toggleTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
    } else {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            playSound();
            if (mode === 'work') setCompletedSessions((cs) => cs + 1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    let duration = WORK_DURATION;
    if (mode === 'short') duration = SHORT_BREAK;
    else if (mode === 'long') duration = LONG_BREAK;
    setSecondsLeft(duration);
    setIsRunning(false);
  };

  const handleModeChange = (e) => {
    setMode(e.target.value);
    clearInterval(intervalRef.current);
    let duration = WORK_DURATION;
    if (e.target.value === 'short') duration = SHORT_BREAK;
    if (e.target.value === 'long') duration = LONG_BREAK;
    setSecondsLeft(duration);
    setIsRunning(false);
  };

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return (
    <Fade in={true} timeout={600}>
      <Container>
        <Typography variant='h4' gutterBottom>
          Pomodoro Timer
        </Typography>
        <Card sx={{ textAlign: 'center', p: 4, maxWidth: 400, margin: 'auto' }}>
          <CardContent>
            <Typography variant='body1' gutterBottom>
              Mode:
            </Typography>
            <Select
              fullWidth
              value={mode}
              onChange={handleModeChange}
              sx={{ mb: 3 }}
            >
              <MenuItem value='work'>Work (25 min)</MenuItem>
              <MenuItem value='short'>Short Break (5 min)</MenuItem>
              <MenuItem value='long'>Long Break (15 min)</MenuItem>
            </Select>
            <Typography variant='h2'>
              {minutes}:{seconds}
            </Typography>
            <Box mt={3} display='flex' justifyContent='center' gap={2}>
              <Button variant='contained' onClick={toggleTimer}>
                {isRunning ? 'Pause' : 'Start'}
              </Button>
              <Button variant='outlined' onClick={resetTimer}>
                Reset
              </Button>
            </Box>
            <Typography variant='body2' mt={3}>
              ✅ Completed Pomodoros: {completedSessions}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Fade>
  );
}
