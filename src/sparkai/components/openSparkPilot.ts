// Global helper: open the floating SparkPilot assistant from anywhere (e.g. product pages).
export const SPARKPILOT_OPEN_EVENT = 'sparkai:open';

export function openSparkPilot(contextMessage?: string) {
  window.dispatchEvent(new CustomEvent(SPARKPILOT_OPEN_EVENT, { detail: { message: contextMessage } }));
}
