import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Fade from '@mui/material/Fade';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function GitHubStats() {
  const [inputValue, setInputValue] = useState('octocat');
  const [githubUser, setGithubUser] = useState('octocat');
  const [userData, setUserData] = useState(null);
  const [repoData, setRepoData] = useState([]);
  const [commitData, setCommitData] = useState([]);
  const [loading, setLoading] = useState(true);

  const githubToken = process.env.REACT_APP_GITHUB_TOKEN || '';

  useEffect(() => {
    const fetchGitHub = async () => {
      setLoading(true);
      try {
        const headers = githubToken
          ? { Authorization: `token ${githubToken}` }
          : {};

        const userRes = await fetch(
          `https://api.github.com/users/${githubUser}`,
          { headers }
        );
        const user = await userRes.json();
        const reposRes = await fetch(
          `https://api.github.com/users/${githubUser}/repos?per_page=100`,
          { headers }
        );
        const repos = await reposRes.json();

        if (!Array.isArray(repos)) {
          setRepoData([]);
        } else {
          setRepoData(repos);
        }

        setUserData(user);

        // Optional: fetch commits for the most starred repo
        if (Array.isArray(repos) && repos.length > 0) {
          const topRepo = [...repos].sort(
            (a, b) => b.stargazers_count - a.stargazers_count
          )[0];
          const commitsRes = await fetch(
            `https://api.github.com/repos/${githubUser}/${topRepo.name}/commits?per_page=30`,
            { headers }
          );
          const commits = await commitsRes.json();

          if (Array.isArray(commits)) {
            const chartData = commits
              .map((commit, index) => ({
                name: commit.commit.author.date.split('T')[0],
                commits: 1,
              }))
              .reduce((acc, cur) => {
                const existing = acc.find((i) => i.name === cur.name);
                if (existing) existing.commits++;
                else acc.push(cur);
                return acc;
              }, []);
            setCommitData(chartData);
          }
        }
      } catch (error) {
        console.error('GitHub API error:', error);
      }
      setLoading(false);
    };
    fetchGitHub();
  }, [githubUser, githubToken]);

  const topRepos = Array.isArray(repoData)
    ? repoData
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5)
        .map((repo) => ({ name: repo.name, stars: repo.stargazers_count }))
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setGithubUser(inputValue.trim());
    }
  };

  return (
    <Fade in timeout={600}>
      <Container>
        <Typography variant='h4' gutterBottom>
          GitHub Stats
        </Typography>
        <form onSubmit={handleSearchSubmit}>
          <TextField
            fullWidth
            label='GitHub Username'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            sx={{ mb: 3 }}
          />
        </form>

        {loading ? (
          <Box display='flex' justifyContent='center' py={4}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          userData && (
            <>
              <Card sx={{ mb: 4, p: 2 }}>
                <Box display='flex' alignItems='center' gap={2}>
                  <Avatar
                    src={userData.avatar_url}
                    sx={{ width: 60, height: 60 }}
                  />
                  <Box>
                    <Typography variant='h6'>
                      {userData.name || userData.login}
                    </Typography>
                    <Typography variant='body2'>{userData.bio}</Typography>
                    <Typography variant='caption'>
                      Followers: {userData.followers} | Repos:{' '}
                      {userData.public_repos}
                    </Typography>
                  </Box>
                </Box>
              </Card>

              {topRepos.length > 0 && (
                <Card sx={{ p: 2, mb: 4 }}>
                  <Typography variant='h6' gutterBottom>
                    Top Starred Repos
                  </Typography>
                  <ResponsiveContainer width='100%' height={250}>
                    <BarChart data={topRepos}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='name' />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey='stars' fill='#8884d8' />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {commitData.length > 0 && (
                <Card sx={{ p: 2 }}>
                  <Typography variant='h6' gutterBottom>
                    Recent Commit Activity (Top Repo)
                  </Typography>
                  <ResponsiveContainer width='100%' height={250}>
                    <LineChart data={commitData}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='name' />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type='monotone'
                        dataKey='commits'
                        stroke='#82ca9d'
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              )}
            </>
          )
        )}
      </Container>
    </Fade>
  );
}
