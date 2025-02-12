export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";

  const isDarkEnough = (hex) => {
    // Convert hex to RGB
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);

    // Calculate luminance (YIQ formula)
    const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

    return luminance < 0.5; // Return true if the color is dark enough
  };

  let color;
  do {
    color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  } while (!isDarkEnough(color)); // Regenerate if too light

  return color;
};

// enter/exit full screen
export const toggleFullScreen = (iframeRef) => {
  if (
    !document.fullscreenElement &&
    !document.mozFullScreenElement &&
    !document.webkitFullscreenElement &&
    !document.msFullscreenElement
  ) {
    if (iframeRef.current.requestFullscreen) {
      iframeRef.current.requestFullscreen();
    } else if (iframeRef.current.mozRequestFullScreen) {
      iframeRef.current.mozRequestFullScreen();
    } else if (iframeRef.current.webkitRequestFullScreen) {
      iframeRef.current.webkitRequestFullScreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
};