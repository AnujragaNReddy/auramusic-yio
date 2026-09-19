import { useState } from 'react';
import { KeyRound, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { hasApiKey } from '../api/youtube.js';
import './SettingsPage.css';

export default function SettingsPage() {
  const [cleared, setCleared] = useState(false);

  function handleClearCache() {
    try {
      localStorage.removeItem('aura.search-cache.v1');
      setCleared(true);
      setTimeout(() => setCleared(false), 2500);
    } catch {
      /* localStorage unavailable — nothing to clear */
    }
  }

  return (
    <div className="settings-page">
      <section className="settings-card">
        <div className="settings-card-head">
          <KeyRound size={20} />
          <h3>YouTube API Key</h3>
        </div>
        <p className="settings-status">
          {hasApiKey ? (
            <><CheckCircle2 size={16} className="ok" /> A key is configured for this app.</>
          ) : (
            <><XCircle size={16} className="warn" /> No key configured — search beyond the starter catalog is disabled.</>
          )}
        </p>
        <p className="settings-desc">
          Set <code>VITE_YT_API_KEY</code> in a <code>.env</code> file at the project root, then restart the dev
          server. Get a free key from the{' '}
          <a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noreferrer">
            Google Cloud Console
          </a>.
        </p>
      </section>

      <section className="settings-card">
        <div className="settings-card-head">
          <Trash2 size={20} />
          <h3>Search Cache</h3>
        </div>
        <p className="settings-desc">
          Resolved song lookups are cached locally so you never spend YouTube quota twice on the same song. Clearing
          this only affects lookup speed, never your Liked Songs or Playlists.
        </p>
        <button className="btn-ghost" onClick={handleClearCache}>
          {cleared ? 'Cleared!' : 'Clear search cache'}
        </button>
      </section>
    </div>
  );
}
