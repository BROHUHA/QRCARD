import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './i18n';
import './style.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('QR Studio ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            backgroundColor: '#030303',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: 'Space Grotesk, sans-serif',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '2rem',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                marginBottom: '0.5rem',
              }}
            >
              Specimen Rendering Notice
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#888',
                marginBottom: '1.5rem',
              }}
            >
              {this.state.error?.message ||
                'An unexpected rendering condition occurred.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.625rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reload Studio
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const container = document.getElementById('root');

if (ReactDOM.createRoot) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  ReactDOM.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
    container
  );
}
