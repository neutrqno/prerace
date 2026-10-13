import React, { useState, useMemo } from 'react';
import AsciiBackground from './components/AsciiBackground';
import { CATEGORIES, MOTORSPORT_LINKS } from './data/motorsportLinks';
import { Search, ExternalLink, Copy, Check, X } from 'lucide-react';
import './App.css';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const copyToClipboard = (text, name) => {
    navigator.clipboard.writeText(text);
    setToastMessage(`Copied ${name}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  // Filter links based on search query
  const filteredLinks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return MOTORSPORT_LINKS;

    return MOTORSPORT_LINKS.filter((item) => {
      const matchName = item.name.toLowerCase().includes(query);
      const matchDesc = item.description.toLowerCase().includes(query);
      const matchDomain = item.domain.toLowerCase().includes(query);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(query));
      return matchName || matchDesc || matchDomain || matchTags;
    });
  }, [searchQuery]);

  // Group by category
  const groupedSections = useMemo(() => {
    return CATEGORIES.filter((c) => c.id !== 'all')
      .map((cat) => ({
        category: cat,
        items: filteredLinks.filter((l) => l.category === cat.id),
      }))
      .filter((group) => group.items.length > 0);
  }, [filteredLinks]);

  return (
    <div className="app">
      {/* Enlarged Self-Contained ASCII Noise Background Component */}
      <AsciiBackground
        chars=" .:-=+*%#@"
        color="#e8e8ea"
        bgColor="#0b0b0d"
        speed={0.14}
        density={0.42}
        vignette={true}
        cellWidth={20}
        cellHeight={24}
        fontSize={17}
      />

      {/* Clean Header */}
      <header className="site-header">
        <div className="header-container">
          <a href="/" className="brand">
            <span className="brand-symbol">🏁</span>
            <span className="brand-name">
              prerace<span className="brand-dot">.io</span>
            </span>
          </a>

          <div className="header-search">
            <div className="search-input-wrapper">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search links, series, tags (e.g. F1, WEC, Replays)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search motorsport links"
              />
              {searchQuery && (
                <button
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-wrapper">
        <section className="intro-section">
          <h1 className="intro-title">Motorsport Directory</h1>
          <p className="intro-desc">
            Curated index of motorsport livestreams, full race replays, live timing telemetry, and schedules. Direct links without clutter.
          </p>
        </section>

        {/* Directory Groups */}
        {groupedSections.length === 0 ? (
          <div className="empty-directory">
            <p>No sites match your search criteria.</p>
            <button
              className="reset-filter-btn"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </button>
          </div>
        ) : (
          groupedSections.map(({ category, items }) => (
            <section key={category.id} className="directory-group" id={category.id}>
              <div className="group-header">
                <h2 className="group-title">
                  <span className="icon">{category.icon}</span>
                  <span>{category.label}</span>
                </h2>
                <span className="group-meta">{items.length} links</span>
              </div>

              <div className="links-list">
                {items.map((item) => (
                  <article key={item.id} className="link-entry">
                    <div className="link-main">
                      <div className="link-headline">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-url"
                          title={`Go to ${item.name}`}
                        >
                          <span>{item.name}</span>
                          <ExternalLink size={13} />
                        </a>
                        <span className="link-domain">{item.domain}</span>
                        {item.starred && (
                          <span className="link-star" title="Recommended pick">
                            ★
                          </span>
                        )}
                      </div>

                      <p className="link-desc">{item.description}</p>

                      <div className="link-tags">
                        {item.badges.map((badge, idx) => (
                          <span
                            key={idx}
                            className={`tag-badge ${
                              badge.includes('⭐') || badge.includes('Free')
                                ? 'star-tag'
                                : badge.includes('uBlock')
                                ? 'warn-tag'
                                : ''
                            }`}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="link-actions">
                      <button
                        className="copy-btn"
                        onClick={() => copyToClipboard(item.url, item.name)}
                        title="Copy link address"
                        aria-label={`Copy link address for ${item.name}`}
                      >
                        <Copy size={14} />
                      </button>

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="direct-visit-btn"
                        id={`link-${item.id}`}
                      >
                        <span>Visit</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <aside className="toast" role="status">
          <Check size={14} />
          <span>{toastMessage}</span>
        </aside>
      )}

      {/* Clean Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <strong>prerace.io</strong> — Direct motorsport resources index
          </div>

          <div className="footer-collab">
            <span className="collab-text">Connect / Collab:</span>
            <button
              className="discord-btn"
              onClick={() => copyToClipboard('pixelqted', 'Discord ID')}
              title="Click to copy Discord ID: pixelqted"
              aria-label="Copy Discord ID: pixelqted"
            >
              <svg className="discord-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span>Discord: <code>pixelqted</code></span>
            </button>
          </div>

          <div className="footer-nav">
            <a href="https://reddit.com/r/motorsports" target="_blank" rel="noopener noreferrer">
              r/motorsports
            </a>
            <a href="https://ublockorigin.com" target="_blank" rel="noopener noreferrer">
              uBlock Origin
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
