import './styles/global.css';
import './styles/home.css';
import './styles/pages.css';
import './styles/configurator.css';
import './styles/components.css';
import { CustomCursor } from './utils/cursor';
import { Router } from './utils/router';
import { initI18n, t } from './utils/i18n';
import { languageSwitcherMarkup, bindLanguageSwitcher } from './components/LanguageSwitcher';

// Initialize app
(async () => {
  // Initialize i18n first
  await initI18n();

  // Initialize custom cursor
  const cursor = new CustomCursor();

  // Initialize router
  const app = document.querySelector<HTMLDivElement>('#app')!;
  const router = new Router(app);

  // Add language switcher to body
  const langSwitcher = document.createElement('div');
  langSwitcher.innerHTML = languageSwitcherMarkup();
  document.body.appendChild(langSwitcher);
  bindLanguageSwitcher(langSwitcher);

  // Add mini player to body
  const miniPlayer = document.createElement('div');
  miniPlayer.className = 'mini-player';
  miniPlayer.innerHTML = `
    <div class="mini-player-main">
      <div class="mini-player-controls">
        <button class="mini-player-btn" type="button" data-mini-prev aria-label="${t('miniPlayer.previousTrack')}">⏮</button>
        <button class="mini-player-btn" type="button" data-mini-toggle aria-label="${t('miniPlayer.playOrPause')}">
          <span>⏸</span>
        </button>
        <button class="mini-player-btn" type="button" data-mini-next aria-label="${t('miniPlayer.nextTrack')}">⏭</button>
      </div>
      <div class="mini-player-info">
        <div class="mini-player-track" id="miniTrackName">Apollo Act I</div>
        <div class="mini-player-time" id="miniTime">0:00 / 0:00</div>
      </div>
      <button class="mini-player-btn mini-player-btn--ghost" type="button" data-mini-playlist-toggle aria-label="${t('miniPlayer.togglePlaylist')}">☰</button>
    </div>
    <div class="mini-player-bottom">
      <div class="mini-player-progress">
        <div class="mini-player-progress-fill" id="miniProgress"></div>
      </div>
      <div class="mini-player-volume">
        <span>🔊</span>
        <input type="range" min="0" max="1" step="0.05" value="1" data-mini-volume />
      </div>
    </div>
    <div class="mini-player-playlist" data-mini-playlist hidden>
      <ul data-mini-playlist-items></ul>
    </div>
  `;
  document.body.appendChild(miniPlayer);

  // Make router globally accessible for navigation
  (window as any).router = router;
  (window as any).cursor = cursor;
  const miniToggleBtn = miniPlayer.querySelector<HTMLButtonElement>('[data-mini-toggle]');
  const miniPrevBtn = miniPlayer.querySelector<HTMLButtonElement>('[data-mini-prev]');
  const miniNextBtn = miniPlayer.querySelector<HTMLButtonElement>('[data-mini-next]');
  const miniVolumeSlider = miniPlayer.querySelector<HTMLInputElement>('[data-mini-volume]');
  const miniPlaylistToggle = miniPlayer.querySelector<HTMLButtonElement>('[data-mini-playlist-toggle]');
  const miniPlaylist = miniPlayer.querySelector<HTMLElement>('[data-mini-playlist]');
  const miniPlaylistItems = miniPlayer.querySelector<HTMLUListElement>('[data-mini-playlist-items]');
  const miniTrackName = document.getElementById('miniTrackName');
  const miniTime = document.getElementById('miniTime');
  const miniProgress = document.getElementById('miniProgress');
  const miniProgressContainer = miniPlayer.querySelector<HTMLElement>('.mini-player-progress');

  let currentAudio: HTMLAudioElement | null = null;
  let timeUpdateListener: ((this: HTMLAudioElement) => void) | null = null;
  let endedListener: ((this: HTMLAudioElement) => void) | null = null;
  let onNext: (() => void) | null = null;
  let onPrev: (() => void) | null = null;
  let onSelectTrack: ((index: number) => void) | null = null;
  let playlistData: { title: string; subtitle?: string }[] = [];
  let playlistActiveIndex = 0;

  const renderPlaylist = () => {
    if (!miniPlaylistItems) return;
    miniPlaylistItems.innerHTML = playlistData
      .map(
        (track, index) => `
          <li class="${index === playlistActiveIndex ? 'active' : ''}">
            <button type="button" data-mini-playlist-index="${index}">
              <span class="mini-playlist-title">${track.title}</span>
              ${track.subtitle ? `<span class="mini-playlist-subtitle">${track.subtitle}</span>` : ''}
            </button>
          </li>
        `
      )
      .join('');

    miniPlaylistItems.querySelectorAll<HTMLButtonElement>('[data-mini-playlist-index]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = Number(btn.dataset.miniPlaylistIndex);
        playlistActiveIndex = index;
        renderPlaylist();
        onSelectTrack?.(index);
      });
    });
  };

  (window as any).miniPlayer = {
    element: miniPlayer,
    setAudio: (
      audio: HTMLAudioElement,
      trackName: string,
      controls?: {
        onNext?: () => void;
        onPrev?: () => void;
        onSelectTrack?: (index: number) => void;
        tracks?: { title: string; subtitle?: string }[];
        currentIndex?: number;
      }
    ) => {
      if (currentAudio && timeUpdateListener) {
        currentAudio.removeEventListener('timeupdate', timeUpdateListener);
      }
      if (currentAudio && endedListener) {
        currentAudio.removeEventListener('ended', endedListener);
      }

      currentAudio = audio;
      miniPlayer.classList.add('active');

      if (miniTrackName) miniTrackName.textContent = trackName;

      const updateTime = () => {
        if (!currentAudio || !miniTime || !miniProgress) return;
        const progress = currentAudio.duration ? (currentAudio.currentTime / currentAudio.duration) * 100 : 0;
        miniProgress.style.width = `${progress}%`;

        const currentMin = Math.floor(currentAudio.currentTime / 60);
        const currentSec = Math.floor(currentAudio.currentTime % 60);
        const totalMin = Math.floor(currentAudio.duration / 60) || 0;
        const totalSec = Math.floor(currentAudio.duration % 60) || 0;

        miniTime.textContent = `${currentMin}:${currentSec.toString().padStart(2, '0')} / ${totalMin}:${totalSec
          .toString()
          .padStart(2, '0')}`;
      };

      timeUpdateListener = updateTime;
      currentAudio.addEventListener('timeupdate', updateTime);

      endedListener = () => {
        miniPlayer.classList.remove('active');
        miniToggleBtn?.classList.remove('is-playing');
        if (miniToggleBtn) {
          const icon = miniToggleBtn.querySelector('span');
          if (icon) icon.textContent = '▶';
        }
      };
      currentAudio.addEventListener('ended', endedListener);

      onNext = controls?.onNext || null;
      onPrev = controls?.onPrev || null;
      onSelectTrack = controls?.onSelectTrack || null;
      playlistData = controls?.tracks || playlistData;
      if (typeof controls?.currentIndex === 'number') {
        playlistActiveIndex = controls.currentIndex;
      }
      renderPlaylist();
      if (miniVolumeSlider) {
        miniVolumeSlider.value = String(currentAudio.volume);
      }
    },
    updatePlayState: (isPlaying: boolean) => {
      if (!miniToggleBtn) return;
      miniToggleBtn.querySelector('span')!.textContent = isPlaying ? '⏸' : '▶';
      miniToggleBtn.classList.toggle('is-playing', isPlaying);
    },
    updateVolumeSlider: (value: number) => {
      if (miniVolumeSlider) {
        miniVolumeSlider.value = String(value);
      }
    },
    hide: () => {
      miniPlayer.classList.remove('active');
      miniPlaylist?.setAttribute('hidden', 'true');
    },
  };

  miniToggleBtn?.addEventListener('click', () => {
    if (!currentAudio) return;
    if (currentAudio.paused) {
      currentAudio.play();
      (window as any).miniPlayer.updatePlayState(true);
    } else {
      currentAudio.pause();
      (window as any).miniPlayer.updatePlayState(false);
    }
  });

  miniPrevBtn?.addEventListener('click', () => {
    if (onPrev) {
      onPrev();
    } else if (currentAudio) {
      currentAudio.currentTime = 0;
    }
  });

  miniNextBtn?.addEventListener('click', () => {
    if (onNext) {
      onNext();
    }
  });

  miniVolumeSlider?.addEventListener('input', (event) => {
    const slider = event.target as HTMLInputElement;
    const volume = parseFloat(slider.value);
    if (currentAudio) {
      currentAudio.volume = volume;
    }
  });

  miniPlaylistToggle?.addEventListener('click', () => {
    if (!miniPlaylist || playlistData.length === 0) return;
    const isHidden = miniPlaylist.hasAttribute('hidden');
    if (isHidden) {
      miniPlaylist.removeAttribute('hidden');
    } else {
      miniPlaylist.setAttribute('hidden', 'true');
    }
  });

  const scrubMiniPlayer = (clientX: number) => {
    if (!currentAudio || !miniProgressContainer || !currentAudio.duration) return;
    const rect = miniProgressContainer.getBoundingClientRect();
    const percent = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    currentAudio.currentTime = percent * currentAudio.duration;
  };

  miniProgressContainer?.addEventListener('pointerdown', (event) => {
    if (!miniProgressContainer) return;
    miniProgressContainer.setPointerCapture(event.pointerId);
    scrubMiniPlayer(event.clientX);

    const handleMove = (moveEvent: PointerEvent) => {
      scrubMiniPlayer(moveEvent.clientX);
    };

    const handleUp = () => {
      miniProgressContainer.releasePointerCapture(event.pointerId);
      miniProgressContainer.removeEventListener('pointermove', handleMove);
      miniProgressContainer.removeEventListener('pointerup', handleUp);
    };

    miniProgressContainer.addEventListener('pointermove', handleMove);
    miniProgressContainer.addEventListener('pointerup', handleUp);
  });

  // Start with home page
  router.navigate('home', false);

  // Refresh cursor on page changes
  document.addEventListener('DOMContentLoaded', () => {
    cursor.refresh();
  });

  // Update mini player aria-labels on language change
  window.addEventListener('languageChanged', () => {
    const prevBtn = miniPlayer.querySelector<HTMLButtonElement>('[data-mini-prev]');
    const toggleBtn = miniPlayer.querySelector<HTMLButtonElement>('[data-mini-toggle]');
    const nextBtn = miniPlayer.querySelector<HTMLButtonElement>('[data-mini-next]');
    const playlistBtn = miniPlayer.querySelector<HTMLButtonElement>('[data-mini-playlist-toggle]');
    
    if (prevBtn) prevBtn.setAttribute('aria-label', t('miniPlayer.previousTrack'));
    if (toggleBtn) toggleBtn.setAttribute('aria-label', t('miniPlayer.playOrPause'));
    if (nextBtn) nextBtn.setAttribute('aria-label', t('miniPlayer.nextTrack'));
    if (playlistBtn) playlistBtn.setAttribute('aria-label', t('miniPlayer.togglePlaylist'));
  });
})();

