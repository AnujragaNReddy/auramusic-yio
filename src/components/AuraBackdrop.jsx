import { usePlayer } from '../store/PlayerContext.jsx';
import './AuraBackdrop.css';

export default function AuraBackdrop() {
  const { auraColors, isPlaying } = usePlayer();

  return (
    <div className="aura-backdrop" aria-hidden="true">
      <div
        className={`aura-blob aura-blob-1 ${isPlaying ? 'is-live' : ''}`}
        style={{ background: auraColors.primary }}
      />
      <div
        className={`aura-blob aura-blob-2 ${isPlaying ? 'is-live' : ''}`}
        style={{ background: auraColors.secondary }}
      />
      <div className="aura-grain" />
    </div>
  );
}
