import './styles/global.css';
import './styles/home.css';
import './styles/pages.css';
import { CustomCursor } from './utils/cursor';
import { Router } from './utils/router';

// Initialize custom cursor
const cursor = new CustomCursor();

// Initialize router
const app = document.querySelector<HTMLDivElement>('#app')!;
const router = new Router(app);

// Add mini player to body
const miniPlayer = document.createElement('div');
miniPlayer.className = 'mini-player';
miniPlayer.innerHTML = `
  <button class="mini-player-btn" id="miniPlayPause">
    <span>⏸</span>
  </button>
  <div class="mini-player-info">
    <div class="mini-player-track" id="miniTrackName">Apollo Act I</div>
    <div class="mini-player-time" id="miniTime">0:00 / 0:00</div>
  </div>
  <div class="mini-player-progress">
    <div class="mini-player-progress-fill" id="miniProgress"></div>
  </div>
`;
document.body.appendChild(miniPlayer);

// Make router globally accessible for navigation
(window as any).router = router;
(window as any).cursor = cursor;
(window as any).miniPlayer = {
  element: miniPlayer,
  setAudio: (audio: HTMLAudioElement, trackName: string) => {
    (window as any).currentAudio = audio;
    (window as any).currentTrackName = trackName;
    miniPlayer.classList.add('active');

    const trackNameEl = document.getElementById('miniTrackName');
    if (trackNameEl) trackNameEl.textContent = trackName;

    // Update time and progress
    audio.addEventListener('timeupdate', () => {
      const progress = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      const progressEl = document.getElementById('miniProgress');
      if (progressEl) progressEl.style.width = `${progress}%`;

      const currentMin = Math.floor(audio.currentTime / 60);
      const currentSec = Math.floor(audio.currentTime % 60);
      const totalMin = Math.floor(audio.duration / 60) || 0;
      const totalSec = Math.floor(audio.duration % 60) || 0;

      const timeEl = document.getElementById('miniTime');
      if (timeEl) {
        timeEl.textContent = `${currentMin}:${currentSec.toString().padStart(2, '0')} / ${totalMin}:${totalSec.toString().padStart(2, '0')}`;
      }
    });

    audio.addEventListener('ended', () => {
      miniPlayer.classList.remove('active');
      const btn = document.getElementById('miniPlayPause');
      if (btn) btn.innerHTML = '<span>▶</span>';
    });
  },
  updatePlayState: (isPlaying: boolean) => {
    const btn = document.getElementById('miniPlayPause');
    if (btn) btn.innerHTML = isPlaying ? '<span>⏸</span>' : '<span>▶</span>';
  },
  hide: () => {
    miniPlayer.classList.remove('active');
  }
};

// Mini player controls
document.getElementById('miniPlayPause')?.addEventListener('click', () => {
  const audio = (window as any).currentAudio as HTMLAudioElement;
  if (!audio) return;

  if (audio.paused) {
    audio.play();
    (window as any).miniPlayer.updatePlayState(true);
  } else {
    audio.pause();
    (window as any).miniPlayer.updatePlayState(false);
  }
});

// Start with home page
router.navigate('home', false);

// Refresh cursor on page changes
document.addEventListener('DOMContentLoaded', () => {
  cursor.refresh();
});

