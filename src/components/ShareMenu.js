import { faFacebook, faXTwitter, faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, forwardRef } from 'react';

export const ShareMenu = forwardRef(({ song }, ref) => {
  const shareUrl = song.external_urls.spotify;
  const shareText = `Check out this song: ${song.name} by ${song.artists[0].name}`;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  const socialMediaPlatforms = [
    {
      name: 'Facebook',
      icon: faFacebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: 'X',
      icon: faXTwitter,
      url: `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      color: 'bg-black hover:bg-gray-800',
    },
    {
      name: 'WhatsApp',
      icon: faWhatsapp,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      name: 'Instagram',
      icon: faInstagram,
      action: copyToClipboard,
      color: 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500',
    },
  ];

  return (
    <div ref={ref} className="absolute bottom-12 right-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-10">
      {copied && <div className="text-center text-sm text-green-500 mb-2">Copied!</div>}
      <ul className="flex flex-col space-y-2">
        {socialMediaPlatforms.map((platform) => (
          <li key={platform.name}>
            {platform.url ? (
              <a
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center space-x-2 text-white p-2 rounded-lg ${platform.color}`}
              >
                <FontAwesomeIcon icon={platform.icon} size="lg" />
                <span>{platform.name}</span>
              </a>
            ) : (
              <button
                onClick={platform.action}
                className={`flex items-center space-x-2 text-white p-2 rounded-lg w-full ${platform.color}`}
              >
                <FontAwesomeIcon icon={platform.icon} size="lg" />
                <span>{platform.name}</span>
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
});