import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Pomodoro from './pages/Pomodoro';
import GitHubStats from './pages/GitHubStats';

function App() {
  return (
    <Router>
      <div className='app' style={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <div style={{ padding: '1rem' }}>
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/tasks' element={<Tasks />} />
              <Route path='/pomodoro' element={<Pomodoro />} />
              <Route path='/github' element={<GitHubStats />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
