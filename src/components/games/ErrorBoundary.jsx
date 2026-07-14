import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Game crashed:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: '1rem', padding: '3rem 1rem',
          textAlign: 'center', color: 'var(--text)',
        }}>
          <AlertTriangle size={36} color="#f59e0b" />
          <p style={{ color: 'var(--text-h)', fontWeight: 600 }}>
            Something went wrong with this game.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              background: 'var(--gradient)', color: '#fff', border: 'none',
              borderRadius: 'var(--radius-sm)', padding: '0.6rem 1.2rem',
              cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 600,
            }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
