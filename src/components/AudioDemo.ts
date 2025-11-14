type DemoTrack = {
  id: string;
  title: string;
  subtitle: string;
  file: string;
  length: string;
};

const DEMO_TRACKS: DemoTrack[] = [
  {
    id: 'act-i',
    title: 'Apollo Act I',
    subtitle: 'Prep · atmospheric build',
    file: '/ACT_I_PREP.mp3',
    length: '2:42',
  },
  {
    id: 'act-ii',
    title: 'Apollo Act II',
    subtitle: 'Launch · dynamic lift-off',
    file: '/ACT_II_LAUNCH.mp3',
    length: '3:08',
  },
  {
    id: 'act-iii',
    title: 'Apollo Act III',
    subtitle: 'Ether · immersive finale',
    file: '/ACT_III_ETHER.mp3',
    length: '3:24',
  },
];

export const audioDemoMarkup = (id: string) => `
  <div class="audio-demo audio-demo--compact" data-audio-demo-root="${id}">
    <div class="audio-demo__player" data-audio-player>
      <div class="audio-demo__now-playing">
        <span class="audio-demo__label">Now playing</span>
        <h3 class="audio-demo__title" data-audio-title>${DEMO_TRACKS[0].title}</h3>
        <p class="audio-demo__subtitle" data-audio-subtitle>${DEMO_TRACKS[0].subtitle}</p>
      </div>
      <div class="audio-demo__controls">
        <div class="audio-demo__primary-controls">
          <button class="audio-demo__button interactive" type="button" data-audio-prev aria-label="Previous track">
            ⏮
          </button>
          <button class="audio-demo__button interactive" type="button" data-audio-toggle aria-label="Play audio">
            <span class="audio-demo__icon">▶</span>
          </button>
          <button class="audio-demo__button interactive" type="button" data-audio-next aria-label="Next track">
            ⏭
          </button>
        </div>
        <div class="audio-demo__timeline">
          <div class="audio-demo__progress" data-audio-progress></div>
        </div>
        <div class="audio-demo__time">
          <span data-audio-current>0:00</span>
          <span data-audio-duration>${DEMO_TRACKS[0].length}</span>
        </div>
        <div class="audio-demo__volume">
          <span class="audio-demo__volume-icon">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value="1"
            data-audio-volume
            aria-label="Volume"
          />
        </div>
      </div>
      <button class="audio-demo__hand-off interactive" type="button" data-audio-handoff>
        Open mini player →
      </button>
    </div>
    <aside class="audio-demo__playlist">
      <ul>
        ${DEMO_TRACKS.map(
          (track, index) => `
            <li class="${index === 0 ? 'active' : ''}" data-track-id="${track.id}">
              <button class="playlist-item interactive" type="button">
                <span class="playlist-index">0${index + 1}</span>
                <div class="playlist-meta">
                  <span class="playlist-title">${track.title}</span>
                  <span class="playlist-subtitle">${track.subtitle}</span>
                </div>
                <span class="playlist-length">${track.length}</span>
              </button>
            </li>
          `
        ).join('')}
      </ul>
    </aside>
  </div>
`;

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const bindAudioDemo = (root: HTMLElement) => {
  if (root.dataset.audioBound === 'true') return;
  root.dataset.audioBound = 'true';

  const playerRoot = root.querySelector<HTMLElement>('[data-audio-player]');
  if (!playerRoot) return;

  const toggleButton = playerRoot.querySelector<HTMLButtonElement>('[data-audio-toggle]');
  const prevButton = playerRoot.querySelector<HTMLButtonElement>('[data-audio-prev]');
  const nextButton = playerRoot.querySelector<HTMLButtonElement>('[data-audio-next]');
  const currentTimeEl = playerRoot.querySelector<HTMLElement>('[data-audio-current]');
  const durationEl = playerRoot.querySelector<HTMLElement>('[data-audio-duration]');
  const titleEl = playerRoot.querySelector<HTMLElement>('[data-audio-title]');
  const subtitleEl = playerRoot.querySelector<HTMLElement>('[data-audio-subtitle]');
  const progressEl = playerRoot.querySelector<HTMLElement>('[data-audio-progress]');
  const volumeSlider = playerRoot.querySelector<HTMLInputElement>('[data-audio-volume]');
  const timeline = playerRoot.querySelector<HTMLElement>('.audio-demo__timeline');
  const handoffButton = playerRoot.querySelector<HTMLButtonElement>('[data-audio-handoff]');
  const playlistButtons = Array.from(
    root.querySelectorAll<HTMLButtonElement>('.audio-demo__playlist .playlist-item')
  );

  if (
    !toggleButton ||
    !currentTimeEl ||
    !durationEl ||
    !titleEl ||
    !subtitleEl ||
    !progressEl ||
    !volumeSlider ||
    playlistButtons.length === 0
  ) {
    return;
  }

  const toggleBtn = toggleButton;
  const currentTimeLabel = currentTimeEl;
  const durationLabel = durationEl;
  const titleLabel = titleEl;
  const subtitleLabel = subtitleEl;
  const progressBar = progressEl;
  const volumeControl = volumeSlider;
  const progressBarContainer = timeline;
  const playlistItems = playlistButtons.map((button) => button.closest('li')).filter(Boolean) as HTMLElement[];
  const playlistMeta = DEMO_TRACKS.map((track) => ({
    title: track.title,
    subtitle: track.subtitle,
  }));

  let currentIndex = 0;
  let currentTrack = DEMO_TRACKS[currentIndex];
  let audio = new Audio(currentTrack.file);
  let isPlaying = false;

  const updatePlaylistUI = () => {
    playlistItems.forEach((li, index) => {
      li?.classList.toggle('active', index === currentIndex);
    });
  };

  const syncMiniPlayerVolume = (value: number) => {
    if ((window as any).miniPlayer?.updateVolumeSlider) {
      (window as any).miniPlayer.updateVolumeSlider(value);
    }
  };

  const handleMiniSelect = (index: number) => {
    const wasPlaying = isPlaying;
    loadTrack(index, wasPlaying);
    syncMiniPlayer(wasPlaying);
    (window as any).miniPlayer?.updatePlayState(wasPlaying);
  };

  const syncMiniPlayer = (shouldPlay = false) => {
    if (!(window as any).miniPlayer) return;
    (window as any).miniPlayer.setAudio(audio, currentTrack.title, {
      onNext: goToNext,
      onPrev: goToPrev,
      onSelectTrack: handleMiniSelect,
      tracks: playlistMeta,
      currentIndex,
    });
    if (shouldPlay) {
      (window as any).miniPlayer.updatePlayState(true);
    }
    syncMiniPlayerVolume(audio.volume);
  };

  function loadTrack(index: number, autoplay = false) {
    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
    }

    currentIndex = (index + DEMO_TRACKS.length) % DEMO_TRACKS.length;
    currentTrack = DEMO_TRACKS[currentIndex];
    audio = new Audio(currentTrack.file);
    audio.volume = parseFloat(volumeControl.value);
    volumeControl.value = String(audio.volume);

    titleLabel.textContent = currentTrack.title;
    subtitleLabel.textContent = currentTrack.subtitle;
    durationLabel.textContent = currentTrack.length;
    currentTimeLabel.textContent = '0:00';
    progressBar.style.width = '0%';
    isPlaying = false;
    toggleBtn.querySelector('.audio-demo__icon')!.textContent = '▶';
    updatePlaylistUI();

    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      currentTimeLabel.textContent = formatTime(audio.currentTime);
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = `${progress}%`;
    });

    audio.addEventListener('ended', () => {
      isPlaying = false;
      toggleBtn.querySelector('.audio-demo__icon')!.textContent = '▶';
    });

    audio.addEventListener('volumechange', () => {
      const volume = Math.round(audio.volume * 100) / 100;
      volumeControl.value = String(volume);
      syncMiniPlayerVolume(volume);
    });

    if (autoplay) {
      play();
    }
  }

  function play() {
    audio.play();
    isPlaying = true;
    toggleBtn.querySelector('.audio-demo__icon')!.textContent = '⏸';
  }

  function pause() {
    audio.pause();
    isPlaying = false;
    toggleBtn.querySelector('.audio-demo__icon')!.textContent = '▶';
  }

  function goToNext() {
    const wasPlaying = isPlaying;
    loadTrack(currentIndex + 1, wasPlaying);
    syncMiniPlayer(wasPlaying);
    if (wasPlaying) {
      (window as any).miniPlayer?.updatePlayState(true);
    }
  }

  function goToPrev() {
    const wasPlaying = isPlaying;
    loadTrack(currentIndex - 1, wasPlaying);
    syncMiniPlayer(wasPlaying);
    if (wasPlaying) {
      (window as any).miniPlayer?.updatePlayState(true);
    }
  }

  toggleBtn.addEventListener('click', () => {
    if (isPlaying) {
      pause();
      (window as any).miniPlayer?.updatePlayState(false);
    } else {
      play();
      syncMiniPlayer(true);
    }
  });

  prevButton?.addEventListener('click', () => {
    goToPrev();
  });

  nextButton?.addEventListener('click', () => {
    goToNext();
  });

  volumeControl.addEventListener('input', (event) => {
    const slider = event.target as HTMLInputElement;
    const volume = parseFloat(slider.value);
    audio.volume = volume;
    syncMiniPlayerVolume(volume);
  });

  playlistButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const wasPlaying = isPlaying;
      loadTrack(index, wasPlaying);
      syncMiniPlayer(wasPlaying);
      if (wasPlaying) {
        (window as any).miniPlayer?.updatePlayState(true);
      } else {
        (window as any).miniPlayer?.updatePlayState(false);
      }
    });
  });

  handoffButton?.addEventListener('click', () => {
    syncMiniPlayer(isPlaying);
    if (!isPlaying) {
      play();
      (window as any).miniPlayer?.updatePlayState(true);
    }
  });

  loadTrack(currentIndex, false);
  updatePlaylistUI();
  syncMiniPlayerVolume(audio.volume);
  progressBarContainer?.addEventListener('click', (event) => {
    if (!audio.duration) return;
    const rect = progressBarContainer.getBoundingClientRect();
    const percent = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    audio.currentTime = percent * audio.duration;
    syncMiniPlayer(!audio.paused);
  });
};

