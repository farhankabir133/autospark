import React from 'react';
import { useLocation } from 'react-router-dom';
import { isChunkLoadError, clearChunkReloadFlag } from '../utils/lazyWithRetry';

interface State {
  hasError: boolean;
  error?: Error | null;
  autoReloaded: boolean;
}

interface Props extends React.PropsWithChildren {
  /** When this changes the boundary resets (wired to the route path). */
  resetKey?: string;
}

const CHUNK_RELOAD_FLAG = 'autospark-chunk-reload';

function didAutoReload(): boolean {
  try {
    return sessionStorage.getItem(CHUNK_RELOAD_FLAG) === '1';
  } catch {
    return true; // storage unavailable → don't loop
  }
}

function doHardReload() {
  try {
    sessionStorage.setItem(CHUNK_RELOAD_FLAG, '1');
  } catch {
    /* ignore */
  }
  try {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => {
          regs.forEach((reg) => {
            try {
              reg.update().catch(() => {});
            } catch {
              /* ignore */
            }
          });
        })
        .catch(() => {})
        .finally(() => window.location.reload());
      setTimeout(() => window.location.reload(), 1500);
    } else {
      window.location.reload();
    }
  } catch {
    window.location.reload();
  }
}

class ErrorBoundaryInner extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, autoReloaded: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Unhandled error captured by ErrorBoundary:', error, info);
    console.error('COMPONENT STACK:\n', info?.componentStack || '(unavailable)');

    // Stale-deploy chunk failure: reload ONCE per session to fetch fresh assets.
    // lazyWithRetry already handles most of these; this is the backstop for
    // errors thrown outside lazy() (e.g. preload / Suspense race).
    if (isChunkLoadError(error) && !this.state.autoReloaded && !didAutoReload()) {
      this.setState({ autoReloaded: true });
      doHardReload();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null, autoReloaded: false });
    }
  }

  handleReload = () => {
    doHardReload();
  };

  handleRetry = () => {
    clearChunkReloadFlag();
    this.setState({ hasError: false, error: null, autoReloaded: false });
  };

  render() {
    if (this.state.hasError) {
      const chunkError = isChunkLoadError(this.state.error);
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] text-white p-6">
          <div className="max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-sm text-gray-300 mb-6">
              {chunkError
                ? 'A new version of the site was just published. Reload to load the latest files.'
                : 'An unexpected error occurred while loading the app. You can try reloading the page — this will fetch the latest files from the network.'}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={this.handleReload} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold">Reload</button>
              <button onClick={this.handleRetry} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white">Try again</button>
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

/** ErrorBoundary that automatically resets when the route changes. */
export function ErrorBoundary({ children }: React.PropsWithChildren) {
  const location = useLocation();
  return <ErrorBoundaryInner resetKey={location.pathname}>{children}</ErrorBoundaryInner>;
}

export default ErrorBoundary;
