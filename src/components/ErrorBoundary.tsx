import React from 'react';

interface State {
  hasError: boolean;
  error?: Error | null;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
     
    console.error('Unhandled error captured by ErrorBoundary:', error, info);
     
    console.error('COMPONENT STACK:\n', info?.componentStack || '(unavailable)');
  }

  handleReload = () => {
    // Try a hard reload which bypasses service worker cache
    if ('serviceWorker' in navigator) {
      // Ask service worker to update, then reload
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => reg.update());
        window.location.reload();
      }).catch(() => window.location.reload());
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] text-white p-6">
          <div className="max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-sm text-gray-300 mb-6">An unexpected error occurred while loading the app. You can try reloading the page — this will fetch the latest files from the network.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={this.handleReload} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold">Reload</button>
              <button onClick={() => { this.setState({ hasError: false, error: null }); }} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white">Dismiss</button>
            </div>
            <details className="mt-4 text-xs text-gray-400 text-left">
              <summary>Technical details</summary>
              <pre className="whitespace-pre-wrap text-xs mt-2">{String(this.state.error)}</pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
