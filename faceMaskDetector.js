const startButton = document.getElementById('start-button');
const videoElement = document.getElementById('video');
const resultElement = document.getElementById('result');

startButton.addEventListener('click', async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('getUserMedia is not supported on your browser!');
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;

    const videoSettings = stream.getVideoTracks()[0].getSettings();
    const canvas = document.createElement('canvas');
    canvas.width = videoSettings.width;
    canvas.height = videoSettings.height;
    const context = canvas.getContext('2d');

    setInterval(() => {
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const maskPercentage = calculateMaskPercentage(imageData);
      resultElement.textContent = `Mask Percentage: ${maskPercentage}%`;
    }, 1000);
  } catch (error) {
    console.error('Error starting face mask detection:', error);
  }
});

function calculateMaskPercentage(imageData) {
  const pixels = imageData.data;
  const pixelCount = imageData.width * imageData.height;
  let totalBrightness = 0;

  for (let i = 0; i < pixelCount; i++) {
    const pixelIndex = i * 4;
    const red = pixels[pixelIndex];
    const green = pixels[pixelIndex + 1];
    const blue = pixels[pixelIndex + 2];

    // Calculate brightness using the average of RGB values
    const brightness = (red + green + blue) / 3;
    totalBrightness += brightness;
  }

  // Calculate the average brightness
  const averageBrightness = totalBrightness / pixelCount;

  // Determine the brightness range (e.g., from 0 to 255)
  const minBrightness = 0;
  const maxBrightness = 255;

  // Calculate the mask percentage based on the average brightness and brightness range
  const maskPercentage = ((averageBrightness - minBrightness) / (maxBrightness - minBrightness)) * 100;

  return maskPercentage;
}

