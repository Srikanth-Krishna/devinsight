import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { useGlobalState } from '../context/GlobalState';

export default function Tasks() {
  const { state, dispatch } = useGlobalState();
  const [newTask, setNewTask] = useState({ text: '', pomodoroCount: 1 });

  const handleAddTask = () => {
    if (newTask.text.trim()) {
      dispatch({
        type: 'ADD_TASK',
        payload: { ...newTask, completed: false, pomodoroDone: 0 },
      });
      setNewTask({ text: '', pomodoroCount: 1 });
    }
  };

  const handleDeleteTask = (index) => {
    dispatch({ type: 'DELETE_TASK', payload: index });
  };

  const toggleTaskComplete = (index) => {
    dispatch({ type: 'TOGGLE_TASK', payload: index });
  };

  const incrementPomodoroDone = (index) => {
    dispatch({ type: 'INCREMENT_POMODORO', payload: index });
  };

  const completedTasks = state.tasks.filter((t) => t.completed).length;
  const totalPomodoros = state.tasks.reduce(
    (sum, t) => sum + (t.pomodoroCount || 0),
    0
  );
  const completedPomodoros = state.tasks.reduce(
    (sum, t) => sum + (t.pomodoroDone || 0),
    0
  );

  return (
    <Fade in timeout={600}>
      <Container>
        <Typography variant='h4' gutterBottom>
          Add Tasks
        </Typography>

        <Card sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            label='Task Description'
            value={newTask.text}
            onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type='number'
            label='Pomodoro Sessions'
            value={newTask.pomodoroCount}
            onChange={(e) =>
              setNewTask({ ...newTask, pomodoroCount: Number(e.target.value) })
            }
            sx={{ mb: 2 }}
            inputProps={{ min: 1 }}
          />
          <Button variant='contained' onClick={handleAddTask}>
            Add Task
          </Button>
        </Card>

        <Card sx={{ p: 2, mb: 3 }}>
          <Typography variant='subtitle1'>
            Total Tasks: {state.tasks.length}
          </Typography>
          <Typography variant='subtitle1'>
            Completed Tasks: {completedTasks}
          </Typography>
          <Typography variant='subtitle1'>
            Pomodoro Sessions: {completedPomodoros} / {totalPomodoros}
          </Typography>
        </Card>

        <Grid container spacing={2}>
          {state.tasks.map((task, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ p: 2 }}>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='flex-start'
                >
                  <Box sx={{ flex: 1 }}>
                    <Box display='flex' alignItems='center' gap={1}>
                      <input
                        type='checkbox'
                        checked={task.completed}
                        onChange={() => toggleTaskComplete(index)}
                      />
                      <Typography
                        variant='subtitle1'
                        sx={{
                          textDecoration: task.completed
                            ? 'line-through'
                            : 'none',
                        }}
                      >
                        {task.text}
                      </Typography>
                    </Box>
                    <Typography variant='caption' display='block'>
                      Pomodoro: {task.pomodoroDone} / {task.pomodoroCount}
                    </Typography>
                    <Button
                      size='small'
                      onClick={() => incrementPomodoroDone(index)}
                      disabled={task.pomodoroDone >= task.pomodoroCount}
                    >
                      +1 Pomodoro
                    </Button>
                  </Box>
                  <IconButton onClick={() => handleDeleteTask(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Fade>
  );
}
