import { lazy, type ComponentType } from 'react';

const RELOAD_FLAG = 'autospark-chunk-reload';
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 800;

/** True for stale-deploy / network chunk failures that a reload fixes. */
export function isChunkLoadError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error ?? '');
  return (
    /loading chunk [\w-]+ failed/i.test(msg) ||
    /failed to fetch dynamically imported module/i.test(msg) ||
    /failed to fetch/i.test(msg) ||
    /importing a module script failed/i.test(msg) ||
    /chunkloaderror/i.test(msg) ||
    /load failed/i.test(msg)
  );
}

function alreadyReloadedThisSession(): boolean {
  try {
    return sessionStorage.getItem(RELOAD_FLAG) === '1';
  } catch {
    return false;
  }
}

function markReloaded() {
  try {
    sessionStorage.setItem(RELOAD_FLAG, '1');
  } catch {
    /* ignore */
  }
}

export function clearChunkReloadFlag() {
  try {
    sessionStorage.removeItem(RELOAD_FLAG);
  } catch {
    /* ignore */
  }
}

function hardReloadForNewDeploy() {
  markReloaded();
  try {
    // Ask any waiting service worker to activate, then reload from network.
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => {
          regs.forEach((r) => {
            try {
              r.update().catch(() => {});
            } catch {
              /* ignore */
            }
          });
        })
        .catch(() => {})
        .finally(() => window.location.reload());
      // Safety net in case getRegistrations hangs.
      setTimeout(() => window.location.reload(), 1500);
    } else {
      window.location.reload();
    }
  } catch {
    window.location.reload();
  }
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Drop-in replacement for React.lazy() that survives deploys:
 * retries transient failures, then performs ONE hard reload per session
 * when a stale hashed chunk 404s (the classic "sometimes Something went wrong").
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importer: () => Promise<{ default: T }>,
  retries = MAX_RETRIES,
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    let lastError: unknown = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const mod = await importer();
        // Successful load — allow future chunk errors to reload again.
        clearChunkReloadFlag();
        return mod;
      } catch (err) {
        lastError = err;
        if (attempt < retries) {
          await wait(RETRY_DELAY_MS * (attempt + 1));
          continue;
        }
        // Final failure: if it looks like a stale chunk, reload once to
        // fetch the fresh index.html + asset manifest from the network.
        if (isChunkLoadError(err) && !alreadyReloadedThisSession()) {
          hardReloadForNewDeploy();
          // Suspend while the reload happens; re-throw so Suspense stays.
          await new Promise(() => {});
        }
      }
    }
    throw lastError;
  });
}
