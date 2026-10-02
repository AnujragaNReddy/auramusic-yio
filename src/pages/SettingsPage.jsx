import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import './SettingsPage.css';

export default function SettingsPage() {
  const [cleared, setCleared] = useState(false);

  function handleClearCache() {
    try {
      localStorage.removeItem('aura.search-cache.v2');
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
          <Trash2 size={20} />
          <h3>Search Cache</h3>
        </div>
        <p className="settings-desc">
          Song searches are cached locally so repeat searches load instantly. Clearing this only affects lookup
          speed, never your Liked Songs or Playlists.
        </p>
        <button className="btn-ghost" onClick={handleClearCache}>
          {cleared ? 'Cleared!' : 'Clear search cache'}
        </button>
      </section>
    </div>
  );
}
