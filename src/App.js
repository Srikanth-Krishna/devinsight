import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Pomodoro from './pages/Pomodoro';
import GitHubStats from './pages/GitHubStats';

function App() {
  const [open, setOpen] = React.useState(false);

  const drawerWidth = open ? 270 : 100;

  return (
    <Router>
      <div className='app' style={{ display: 'flex', height: '100vh' }}>
        <div
          style={{
            padding: `50px 20px 0 ${drawerWidth}px`,
            flex: 1,
            transition: '0.3s ease-in-out',
          }}
        >
          <Sidebar open={open} setOpen={setOpen} />
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/tasks' element={<Tasks />} />
            <Route path='/pomodoro' element={<Pomodoro />} />
            <Route path='/github' element={<GitHubStats />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
