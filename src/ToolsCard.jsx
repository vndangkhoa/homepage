import React from 'react';
import './ContactCard.css'; // Reuse the same styles for consistency

const toolLinks = [
  { icon: '▶️', label: 'YouTube (no Ads + Downloads)', url: 'https://utube.khoavo.i234.me' },
  { icon: '🎬', label: 'Tiktok + FB (no Ads)', url: 'https://tiktok.khoavo.i234.me' },
  { icon: '📄', label: 'PDF tools', url: 'https://pdf.khoavo.i234.me' },
  { icon: '🖼️', label: 'JPG tools', url: 'https://jpg.khoavo.i234.me' },
  { icon: '💻', label: 'IT tools', url: 'https://it.khoavo.i234.me' },
  { icon: '🎥', label: 'Movies', url: 'https://jellyfin.khoavo.i234.me' },
  { icon: '🎵', label: 'Music', url: 'https://music.khoavo.i234.me' },
];

const ToolsCard = () => (
  <div className="contactcard-mobile-outer contact-card-wrapper">
    <div className="contactcard-mobile-inner contact-card">
      <div className="contactcard-links-grid">
        {toolLinks.map((item) => (
          <a
            className="contactcard-link"
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            key={item.label}
          >
            <span className="contactcard-link-icon">{item.icon}</span>
            <span className="contactcard-link-label">{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  </div>
);

export default ToolsCard; 