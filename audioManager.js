let music;

// Ensure audio keeps playing across different pages
window.onload = function() {
  const musicElement = document.getElementById('background-music');

  if (!music) {
    // If the audio object doesn't exist, create one
    music = musicElement;
    music.play();
  }

  // Store the music object and prevent it from being stopped across pages
  sessionStorage.setItem('isPlaying', music.paused ? 'false' : 'true');
};

window.onbeforeunload = function() {
  // Remember whether music is playing or not
  sessionStorage.setItem('musicTime', music.currentTime);
};

document.addEventListener('DOMContentLoaded', () => {
  const musicElement = document.getElementById('background-music');

  // Resume playing the music if the state says it should be playing
  const isPlaying = sessionStorage.getItem('isPlaying') === 'true';
  const storedTime = sessionStorage.getItem('musicTime');

  if (storedTime) {
    musicElement.currentTime = parseFloat(storedTime);
  }

  if (isPlaying) {
    musicElement.play();
  }
});
document.addEventListener('DOMContentLoaded', () => {
    const musicElement = document.getElementById('background-music');
    const volumeSlider = document.getElementById('volume-slider');
  
    // Set initial volume (if previously adjusted)
    const storedVolume = sessionStorage.getItem('musicVolume');
    if (storedVolume) {
      musicElement.volume = parseFloat(storedVolume);
      volumeSlider.value = storedVolume * 100; // Display volume in percentage
    }
  
    // Adjust volume when slider is moved
    volumeSlider.addEventListener('input', function() {
      const volumeValue = volumeSlider.value / 100; // Convert percentage to value between 0 and 1
      musicElement.volume = volumeValue;
      sessionStorage.setItem('musicVolume', volumeValue); // Store the volume level
    });
  });
  