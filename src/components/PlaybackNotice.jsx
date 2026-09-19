import { AlertCircle } from 'lucide-react';
import { usePlayer } from '../store/PlayerContext.jsx';
import './PlaybackNotice.css';

export default function PlaybackNotice() {
  const { notice } = usePlayer();
  if (!notice) return null;

  return (
    <div className="playback-notice">
      <AlertCircle size={16} />
      <span>{notice}</span>
    </div>
  );
}
