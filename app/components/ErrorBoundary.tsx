'use client';

import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              height: '400px',
              width: '100%',
              background: '#f8d7da',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              border: '1px solid #f5c6cb',
              color: '#721c24'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Error loading map</p>
              <p style={{ margin: 0, fontSize: '0.9em' }}>
                {this.state.error?.message || 'An unknown error occurred'}
              </p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
