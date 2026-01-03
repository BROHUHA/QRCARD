import { toPng } from 'html-to-image';

const downloader = require('downloadjs');

export const downloadHDCard = (nodeId, imageName) => {
  if (!nodeId || !imageName) return;

  const node = document.getElementById(nodeId);
  if (!node) return;

  // Get the actual dimensions for perfect aspect ratio
  const rect = node.getBoundingClientRect();
  const aspectRatio = rect.width / rect.height;

  // High quality settings - 4x resolution for crisp output
  const options = {
    quality: 1,
    pixelRatio: 4, // 4x for ultra HD
    backgroundColor: '#ffffff',
    width: rect.width,
    height: rect.height,
    style: {
      transform: 'none',
      borderRadius: '0',
    },
    filter: (node) => {
      // Remove any elements that shouldn't be in the export
      if (node.classList?.contains('no-export')) return false;
      return true;
    },
  };

  // Show loading state
  const buttons = document.querySelectorAll('.action-btn');
  buttons.forEach(btn => btn.disabled = true);

  toPng(node, options)
    .then((dataUrl) => {
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      downloader(dataUrl, `${imageName}-${timestamp}.png`);

      // Reset buttons
      buttons.forEach(btn => btn.disabled = false);
    })
    .catch((error) => {
      console.error('Download failed:', error);
      buttons.forEach(btn => btn.disabled = false);
      alert('Download failed. Please try again.');
    });
};

// Alias for backward compatibility
export const nodeToImageDownloader = ({ nodeId, imageName }) => {
  downloadHDCard(nodeId, imageName);
};
