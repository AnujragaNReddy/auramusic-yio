import { Component } from 'react';
import { RefreshCw } from 'lucide-react';
import './ErrorBoundary.css';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Aura crashed:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="crash-screen">
          <h2>Something went wrong</h2>
          <p>{this.state.error.message || 'An unexpected error occurred.'}</p>
          <button className="btn-reload" onClick={() => window.location.reload()}>
            <RefreshCw size={16} /> Reload Aura
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
