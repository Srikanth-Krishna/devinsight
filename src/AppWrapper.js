import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useMemo, useState, createContext } from 'react';
import App from './App';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function AppWrapper() {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App /> {/* this is your existing main component */}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default AppWrapper;
