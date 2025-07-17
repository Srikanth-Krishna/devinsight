import debounce from 'lodash.debounce';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';

import { useGlobalState } from '../context/GlobalState';

export default function GitHubStats() {
  const { state, dispatch } = useGlobalState();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
  const user = state.githubUser;
  const repos = state.githubRepos;

  // const fetchLimit = async () => {
  //   const reslimit = await fetch('https://api.github.com/rate_limit', {
  //     headers: { Authorization: `token ${GITHUB_TOKEN}` },
  //   });
  //   const datalimit = await reslimit.json();
  //   console.log(datalimit);
  // };

  // fetchLimit();

  const fetchGitHubData = async (user) => {
    if (!user) return;
    try {
      setLoading(true);
      setError('');

      const headers = {
        Authorization: `token ${GITHUB_TOKEN}`,
      };
      const userRes = await fetch(`https://api.github.com/users/${user}`, {
        headers,
      });
      if (!userRes.ok) throw new Error('User not found');
      const userData = await userRes.json();

      const repoRes = await fetch(
        `https://api.github.com/users/${user}/repos?per_page=100`,
        {
          headers,
        }
      );
      const repoData = await repoRes.json();

      dispatch({ type: 'SET_GITHUB_USER', payload: userData });

      dispatch({ type: 'SET_GITHUB_REPOS', payload: repoData });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce((val) => fetchGitHubData(val), 800);

  const handleSearch = (e) => {
    setUsername(e.target.value);
    debouncedFetch(e.target.value.trim());
  };

  return (
    <Fade in={true} timeout={600}>
      <Container>
        <TextField
          fullWidth
          label='Search GitHub username'
          value={username}
          onChange={handleSearch}
          sx={{ my: 3 }}
        />

        {loading && <CircularProgress />}
        {error && <Typography color='error'>{error}</Typography>}

        {user && (
          <Card sx={{ display: 'flex', p: 2, mb: 4 }}>
            <Avatar
              src={user.avatar_url}
              sx={{ width: 60, height: 60, mr: 2 }}
            />
            <Box>
              <Typography variant='h6'>{user.name || user.login}</Typography>
              <Typography variant='body2'>{user.bio}</Typography>
              <Typography variant='caption'>{user.location}</Typography>
            </Box>
          </Card>
        )}

        {repos?.length > 0 && (
          <>
            <Typography variant='h6'>Top Repositories</Typography>
            <Grid container spacing={2}>
              {repos
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 6)
                .map((repo) => (
                  <Grid item xs={12} md={6} key={repo.id}>
                    <Card>
                      <CardContent>
                        <Typography variant='subtitle1'>{repo.name}</Typography>
                        <Typography variant='body2'>
                          {repo.description}
                        </Typography>
                        <Typography variant='caption'>
                          ⭐ {repo.stargazers_count}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </>
        )}
      </Container>
    </Fade>
  );
}
