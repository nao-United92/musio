import { useEffect, useState } from 'react';
import { SongList } from './components/SongList';
import spotify from './lib/spotify';
import { SearchInput } from './components/SearchInput';
import { Pagination } from './components/Pagination';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'; // Import faArrowUp
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [popularSongs, setPopularSongs] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [searchedSongs, setSearchedSongs] = useState();
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [timeCapsuleSongs, setTimeCapsuleSongs] = useState([]);
  const [isTimeCapsuleLoading, setIsTimeCapsuleLoading] = useState(false);
  const [moodSongs, setMoodSongs] = useState([]);
  const [isMoodLoading, setIsMoodLoading] = useState(false);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [recentlyPlayedSongs, setRecentlyPlayedSongs] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false); // New state for scroll button

  const isSearchedResult = searchedSongs != null;
  const limit = 20;

  const moods = [
    { name: 'Happy', keyword: 'happy pop' },
    { name: 'Chill', keyword: 'chill acoustic' },
    { name: 'Energetic', keyword: 'energetic dance' },
    { name: 'Sad', keyword: 'sad indie' },
  ];

  useEffect(() => {
    fetchPopularSongs();
    const storedHistory = JSON.parse(localStorage.getItem('recentlyPlayedSongs')) || [];
    setRecentlyPlayedSongs(storedHistory);
  }, []);

  // New function to handle scroll event
  const handleScroll = () => {
    if (window.scrollY > 300) { // Show button after scrolling down 300px
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  // New useEffect for scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const allSongs = isSearchedResult ? searchedSongs : popularSongs;
    const genres = new Set();
    allSongs.forEach(song => {
      if (song.artists && song.artists[0] && song.artists[0].genres) {
        song.artists[0].genres.forEach(genre => genres.add(genre));
      }
    });
    setAvailableGenres(Array.from(genres).slice(0, 10)); // Limit to 10 genres
  }, [popularSongs, searchedSongs, isSearchedResult]);

  const fetchPopularSongs = async () => {
    setIsLoading(true);
    const result = await spotify.getPopularSongs();
    const popularSongs = result.items.map((item) => {
      return item.track;
    });
    setPopularSongs(popularSongs);
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const newKeyword = e.target.value;
    setKeyword(newKeyword);
    if (newKeyword.trim() !== '') {
      searchSongs(1, newKeyword); // Search with new keyword and reset page to 1
    } else {
      setSearchedSongs(null); // Clear search results if keyword is empty
      setPage(1);
    }
  };

  const handleClearInput = () => {
    setKeyword('');
    setSearchedSongs(null);
    setPage(1);
  };

  const searchSongs = async (page, searchKeyword = keyword) => {
    setIsLoading(true);
    const offset = parseInt(page) ? (parseInt(page) - 1) * limit : 0;
    const result = await spotify.searchSongs(searchKeyword, limit, offset);
    setHasNext(result.next != null);
    setHasPrev(result.previous != null);
    setSearchedSongs(result.items);
    setIsLoading(false);
  };

  const fetchTimeCapsuleSongs = async () => {
    setIsTimeCapsuleLoading(true);
    const currentYear = new Date().getFullYear();
    const randomYear = Math.floor(Math.random() * (currentYear - 1980 + 1)) + 1980;
    try {
      const result = await spotify.searchSongsByYear(randomYear);
      setTimeCapsuleSongs(result.items);
    } catch (error) {
      console.error("Failed to fetch time capsule songs:", error);
    } finally {
      setIsTimeCapsuleLoading(false);
    }
  };

  const handleMoodSearch = async (moodKeyword) => {
    setIsMoodLoading(true);
    try {
      const result = await spotify.searchSongs(moodKeyword, limit, 0);
      setMoodSongs(result.items);
    } catch (error) {
      console.error("Failed to fetch mood songs:", error);
    } finally {
      setIsMoodLoading(false);
    }
  };

  const handleGenreSearch = (genre) => {
    searchSongs(1, `genre:"${genre}"`);
  };

  const handleArtistClick = (artistName) => {
    setKeyword(artistName);
    searchSongs(1, `artist:"${artistName}"`);
    window.scrollTo(0, 0); // Scroll to top
  };

  const moveToNext = async () => {
    const nextPage = page + 1;
    await searchSongs(nextPage);
    setPage(nextPage);
  };

  const moveToPrev = async () => {
    const prevPage = page - 1;
    await searchSongs(prevPage);
    setPage(prevPage);
  };

  const handleSongPlay = (song) => {
    setRecentlyPlayedSongs(prevSongs => {
      const newSongs = [song, ...prevSongs.filter(s => s.id !== song.id)];
      const limitedSongs = newSongs.slice(0, 10); // Limit to 10 songs
      localStorage.setItem('recentlyPlayedSongs', JSON.stringify(limitedSongs));
      return limitedSongs;
    });
  };

  // New function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8 mb-20">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Musio</h1>
        </header>
        <SearchInput
          onInputChange={handleInputChange}
          onSubmit={searchSongs}
          value={keyword}
          onClearInput={handleClearInput}
        />
        <section>
          <h2 className="text-2xl font-semibold mb-5">
            {isSearchedResult ? 'Search Results' : 'Popular Songs'}
          </h2>
          <SongList
            isLoading={isLoading}
            songs={isSearchedResult ? searchedSongs : popularSongs}
            onArtistClick={handleArtistClick}
            onSongPlay={handleSongPlay}
          />
          {isSearchedResult && (
            <Pagination
              onPrev={hasPrev ? moveToPrev : null}
              onNext={hasNext ? moveToNext : null}
            />
          )}
        </section>
        {availableGenres.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-semibold mb-5">Explore Genres</h2>
            <div className="flex flex-wrap gap-2 mb-5">
              {availableGenres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleGenreSearch(genre)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                >
                  {genre}
                </button>
              ))}
            </div>
          </section>
        )}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-5">Time Capsule</h2>
          <button
            onClick={fetchTimeCapsuleSongs}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-5"
          >
            Discover a Random Year
          </button>
          <SongList
            isLoading={isTimeCapsuleLoading}
            songs={timeCapsuleSongs}
            onArtistClick={handleArtistClick}
          />
        </section>
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-5">Mood Mixer</h2>
          <div className="flex space-x-4 mb-5">
            {moods.map((mood) => (
              <button
                key={mood.name}
                onClick={() => handleMoodSearch(mood.keyword)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                {mood.name}
              </button>
            ))}
          </div>
          <SongList
            isLoading={isMoodLoading}
            songs={moodSongs}
            onArtistClick={handleArtistClick}
          />
        </section>
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-5">Recently Played</h2>
          <SongList
            isLoading={false} // Always false for local storage
            songs={recentlyPlayedSongs}
            onArtistClick={handleArtistClick}
          />
        </section>
      </main>
      {showScrollButton && ( // Conditionally render the button
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-opacity duration-300"
        >
          <FontAwesomeIcon icon={faArrowUp} size="lg" />
        </button>
      )}
    </div>
  );
}
