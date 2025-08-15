import {
  faSpinner,
  faCopy,
  faCheck,
  faHeart,
  faShareAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useRef } from 'react';
import { ShareMenu } from './ShareMenu';

export function SongList(props) {
  const [copiedSongId, setCopiedSongId] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(null);
  const shareMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target) &&
        !event.target.closest('.share-button')
      ) {
        setShowShareMenu(null);
      }
    };

    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

  const handleCopyLink = async (songId, link) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedSongId(songId);
      setTimeout(() => {
        setCopiedSongId(null);
      }, 2000); // Clear copied state after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Failed to copy link.');
    }
  };

  if (props.isLoading) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="flex-none animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 mb-2 rounded w-full h-48"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!props.isLoading && props.songs.length === 0) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400 text-xl mt-10">
        No songs found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
      {props.songs.map((song) => {
        const isCopied = copiedSongId === song.id;
        const isFavorite = props.favoriteSongs.some(
          (favSong) => favSong.id === song.id
        );
        return (
          <a
            href={song.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => props.onSongPlay && props.onSongPlay(song)}
            className="block bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 relative"
            key={song.id}
          >
            <img
              alt="thumbnail"
              src={song.album.images[0].url}
              className="mb-2 rounded"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{song.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                By{' '}
                <span
                  className="cursor-pointer hover:underline hover:text-[#3B82F6]"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    props.onArtistClick(song.artists[0].name);
                  }}
                >
                  {song.artists[0].name}
                </span>
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleCopyLink(song.id, song.external_urls.spotify);
              }}
              className="absolute top-2 right-2 bg-gray-800 bg-opacity-75 rounded-full p-2 text-white hover:bg-gray-700 transition-colors"
            >
              <FontAwesomeIcon icon={isCopied ? faCheck : faCopy} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                props.onToggleFavorite(song);
              }}
              className="absolute top-2 left-2 bg-gray-800 bg-opacity-75 rounded-full p-2 text-white hover:bg-gray-700 transition-colors"
            >
              <FontAwesomeIcon
                icon={faHeart}
                className={isFavorite ? 'text-pink-500' : 'text-white'}
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setShowShareMenu(showShareMenu === song.id ? null : song.id);
              }}
              className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-75 rounded-full p-2 text-white hover:bg-gray-700 transition-colors share-button"
            >
              <FontAwesomeIcon icon={faShareAlt} />
            </button>
            {showShareMenu === song.id && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <ShareMenu song={song} ref={shareMenuRef} />
              </div>
            )}
          </a>
        );
      })}
    </div>
  );
}