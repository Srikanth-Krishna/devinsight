import React, { createContext, useReducer, useContext, useEffect } from 'react';

const initialState = {
  githubUser: null,
  githubRepos: [],
  tasks: [],
  timer: {
    secondsLeft: 25 * 60,
    phase: 'work',
    isRunning: false,
    selectedTaskIndex: null,
    cycleCount: 0,
  },
};

function globalReducer(state, action) {
  switch (action.type) {
    case 'SET_GITHUB_USER':
      return { ...state, githubUser: action.payload };
    case 'SET_GITHUB_REPOS':
      return { ...state, githubRepos: action.payload };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case 'DELETE_TASK': {
      const updatedTasks = state.tasks.filter((_, i) => i !== action.payload);
      const deletingActiveTask =
        action.payload === state.timer.selectedTaskIndex;

      return {
        ...state,
        tasks: updatedTasks,
        timer: deletingActiveTask
          ? {
              secondsLeft: 25 * 60,
              phase: 'work',
              isRunning: false,
              selectedTaskIndex: null,
              cycleCount: 0,
            }
          : {
              ...state.timer,
              selectedTaskIndex:
                state.timer.selectedTaskIndex > action.payload
                  ? state.timer.selectedTaskIndex - 1
                  : state.timer.selectedTaskIndex,
            },
      };
    }
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t, i) =>
          i === action.payload ? { ...t, completed: !t.completed } : t
        ),
      };
    case 'INCREMENT_POMODORO':
      return {
        ...state,
        tasks: state.tasks.map((t, i) =>
          i === action.payload && t.pomodoroDone < t.pomodoroCount
            ? { ...t, pomodoroDone: t.pomodoroDone + 1 }
            : t
        ),
      };
    case 'START_TIMER':
      return {
        ...state,
        timer: {
          ...state.timer,
          isRunning: true,
          selectedTaskIndex: action.payload ?? state.timer.selectedTaskIndex,
        },
      };
    case 'TICK':
      return {
        ...state,
        timer: {
          ...state.timer,
          secondsLeft: state.timer.secondsLeft - 1,
        },
      };

    case 'RESET_TIMER':
      return {
        ...state,
        timer: {
          ...state.timer,
          secondsLeft: action.payload.seconds,
          phase: action.payload.phase,
          isRunning: false,
        },
      };

    case 'INCREMENT_CYCLE':
      return {
        ...state,
        timer: {
          ...state.timer,
          cycleCount: state.timer.cycleCount + 1,
        },
      };

    case 'SET_TIMER_PHASE':
      return {
        ...state,
        timer: {
          ...state.timer,
          phase: action.payload,
          secondsLeft: action.seconds,
        },
      };
    default:
      return state;
  }
}

const GlobalStateContext = createContext();

export function GlobalStateProvider({ children }) {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  useEffect(() => {
    const fetchDefaultUser = async () => {
      try {
        const userRes = await fetch(`https://api.github.com/users/octocat`);
        const userData = await userRes.json();
        const repoRes = await fetch(
          `https://api.github.com/users/octocat/repos?per_page=100`
        );
        const repoData = await repoRes.json();

        dispatch({ type: 'SET_GITHUB_USER', payload: userData });
        dispatch({ type: 'SET_GITHUB_REPOS', payload: repoData });
      } catch (err) {
        console.error('Failed to load default GitHub user', err);
      }
    };

    fetchDefaultUser();
  }, []);

  useEffect(() => {
    let interval;

    if (state.timer.isRunning) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK' });

        if (state.timer.secondsLeft <= 1) {
          clearInterval(interval);

          if (typeof Audio !== 'undefined') {
            const bell = new Audio('/bell.mp3');
            bell.play();
          }
          navigator.vibrate?.([200, 100, 200]);

          dispatch({ type: 'INCREMENT_CYCLE' });

          if (state.timer.phase === 'work') {
            if (state.timer.selectedTaskIndex !== null) {
              dispatch({
                type: 'INCREMENT_POMODORO',
                payload: state.timer.selectedTaskIndex,
              });
            }

            const longBreak = (state.timer.cycleCount + 1) % 4 === 0;
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
              payload: { phase: 'work', seconds: 25 * 60 },
            });
          }
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [state.timer.isRunning, state.timer.secondsLeft, state.timer]);

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(GlobalStateContext);
}
