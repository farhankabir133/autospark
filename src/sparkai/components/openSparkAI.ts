// Global helper: open the floating SparkAI assistant from anywhere (e.g. product pages).
export const SPARKAI_OPEN_EVENT = 'sparkai:open';

export function openSparkAI(contextMessage?: string) {
  window.dispatchEvent(new CustomEvent(SPARKAI_OPEN_EVENT, { detail: { message: contextMessage } }));
}
