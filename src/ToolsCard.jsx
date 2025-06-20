import React from 'react';
import './ContactCard.css'; // Reuse the same styles for consistency

const toolLinks = [
  { icon: '▶️', label: 'YouTube (No Ads, Download)', url: 'https://utube.khoavo.i234.me' },
  { icon: '🎬', label: 'Tiktok & Facebook (No Ads)', url: 'https://tiktok.khoavo.i234.me' },
  { icon: '📄', label: 'PDF Tools', url: 'https://pdf.khoavo.i234.me' },
  { icon: '🖼️', label: 'JPG Tools', url: 'https://jpg.khoavo.i234.me' },
  { icon: '💻', label: 'IT Utilities', url: 'https://it.khoavo.i234.me' },
  { icon: '🎥', label: 'Movies (Jellyfin)', url: 'https://jellyfin.khoavo.i234.me' },
  { icon: '🎵', label: 'Music Streaming', url: 'https://music.khoavo.i234.me' },
];

const labelStyle = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '180px',
  display: 'inline-block',
  verticalAlign: 'middle',
};

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
            title={item.label}
          >
            <span className="contactcard-link-icon">{item.icon}</span>
            <span className="contactcard-link-label" style={labelStyle}>{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  </div>
);

export default ToolsCard; 