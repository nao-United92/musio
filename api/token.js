require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;

app.get('/api/token', async (req, res) => {
  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', process.env.SPOTIFY_CLIENT_ID);
    params.append('client_secret', process.env.SPOTIFY_CLIENT_SECRET);

    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching Spotify token:', error.message);
    res.status(500).json({ error: 'Failed to fetch token' });
  }
});

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
