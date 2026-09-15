// Simple worker that computes slider percentage and pixel X based on container rect
let rect = { left: 0, width: 1 };

self.onmessage = (e) => {
  const data = e.data;
  if (!data) return;

  if (data.type === 'init' && data.rect) {
    rect.left = data.rect.left || 0;
    rect.width = data.rect.width || 1;
    return;
  }

  if (data.type === 'compute' && typeof data.clientX === 'number') {
    const clientX = data.clientX;
    const rawPercent = ((clientX - rect.left) / rect.width) * 100;
    const percent = Math.max(0, Math.min(100, rawPercent));
    const x = clientX - rect.left; // px from left edge
    // send back rounded values to reduce message churn
    self.postMessage({ percent: Math.round(percent * 100) / 100, x: Math.round(x) });
  }
};
