import axios from 'axios';

class SpotifyClient {
  static async initialize() {
    //  Spotifyに直接ではなく、/api/token にリクエストを送る
    const response = await axios.get('/api/token');

    let spotify = new SpotifyClient();
    spotify.token = response.data.access_token;
    return spotify;
  }

  async getPopularSongs() {
    const response = await axios.get(
      'https://api.spotify.com/v1/playlists/5SLPaOxQyJ8Ne9zpmTOvSe',
      {
        headers: {
          Authorization: `Bearer ` + this.token,
        },
      }
    );
    return response.data.tracks;
  }

  async searchSongs(keyword, limit, offset) {
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ` + this.token,
      },
      params: { q: keyword, type: 'track', limit, offset },
    });
    return response.data.tracks;
  }

  async searchSongsByYear(year, limit = 20, offset = 0) {
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ` + this.token,
      },
      params: { q: `year:${year}`, type: 'track', limit, offset },
    });
    return response.data.tracks;
  }
}

const spotify = await SpotifyClient.initialize();
export default spotify;
