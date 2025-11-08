import { decodeText, fadeInBlur, wordReveal } from '../utils/textAnimations';

export default function vision() {
  return `
    <div class="vision-page">
      <nav class="page-nav">
        <a href="/" class="back-button interactive" data-route="home">
          <span>←</span> Back
        </a>
        <div class="page-title">The Vision</div>
      </nav>

      <main class="vision-content">
        <section class="intro-section">
          <h1 class="page-heading">
            <span class="line">Apollo Finance</span>
            <span class="line accent">A Three-Act Launch</span>
          </h1>
          <p class="lead-text">
            Complete rebrand from concept to execution. I created an astronaut identity, 
            built three immersive websites, and composed soundtracks for each stage of the journey.
          </p>
        </section>

        <section class="apollo-timeline">
          <!-- Act 1: Pre-Launch -->
          <article class="apollo-act act-one" data-act="1">
            <div class="act-header">
              <span class="act-number">Act One</span>
              <h2 class="act-title">Pre-Launch</h2>
            </div>
            
            <div class="act-content">
              <div class="act-visuals">
                <div class="act-image-container">
                  <img src="/act_1.png" alt="Apollo Pre-Launch" class="act-image" />
                </div>
              </div>
              
              <div class="act-description">
                <p>
                  The launch process begins. Pre-prepping, final checks. Tension builds. 
                  Everything must be perfect. One mistake could end it all.
                </p>
                
                <div class="act-meta">
                  <span>Brand Identity</span>
                  <span>Website Design</span>
                  <span>Sound Design</span>
                </div>
                
                <div class="audio-player" data-track="ACT_I_PREP">
                  <button class="play-btn interactive" aria-label="Play Act 1">
                    <span class="play-icon">▶</span>
                  </button>
                  <div class="progress-bar">
                    <div class="progress-fill"></div>
                  </div>
                  <span class="time-display">0:00</span>
                </div>
                
                <a href="#" class="act-link interactive">View Website</a>
              </div>
            </div>
          </article>

          <!-- Act 2: Launch -->
          <article class="apollo-act act-two" data-act="2">
            <div class="act-header">
              <span class="act-number">Act Two</span>
              <h2 class="act-title">Launch</h2>
            </div>
            
            <div class="act-content">
              <div class="act-description">
                <p>
                  Engines ignite. The ground shakes. Noise, chaos, fear. Critical moment. 
                  Gripping seats, holding tight, fighting to survive the ascent through the atmosphere.
                </p>
                
                <div class="act-meta">
                  <span>Web Development</span>
                  <span>Motion Design</span>
                  <span>Music Production</span>
                </div>
                
                <div class="audio-player" data-track="ACT_II_LAUNCH">
                  <button class="play-btn interactive" aria-label="Play Act 2">
                    <span class="play-icon">▶</span>
                  </button>
                  <div class="progress-bar">
                    <div class="progress-fill"></div>
                  </div>
                  <span class="time-display">0:00</span>
                </div>
                
                <a href="#" class="act-link interactive">View Website</a>
              </div>
              
              <div class="act-visuals">
                <div class="act-image-container">
                  <img src="/act_2.png" alt="Apollo Launch" class="act-image" />
                </div>
              </div>
            </div>
          </article>

          <!-- Act 3: Ether -->
          <article class="apollo-act act-three" data-act="3">
            <div class="act-header">
              <span class="act-number">Act Three</span>
              <h2 class="act-title">Ether</h2>
            </div>
            
            <div class="act-content">
              <div class="act-visuals">
                <div class="act-image-container">
                  <img src="/act_3.png" alt="Apollo in Ether" class="act-image" />
                </div>
              </div>
              
              <div class="act-description">
                <p>
                  Through the atmosphere. Sudden silence. Peace. You can see clearly now. 
                  The beauty of space. It was worth it. Calm, clarity, accomplishment.
                </p>
                
                <div class="act-meta">
                  <span>Interactive Experience</span>
                  <span>Audio Engineering</span>
                  <span>Final Polish</span>
                </div>
                
                <div class="audio-player" data-track="ACT_III_ETHER">
                  <button class="play-btn interactive" aria-label="Play Act 3">
                    <span class="play-icon">▶</span>
                  </button>
                  <div class="progress-bar">
                    <div class="progress-fill"></div>
                  </div>
                  <span class="time-display">0:00</span>
                </div>
                
                <a href="#" class="act-link interactive">View Website</a>
              </div>
            </div>
          </article>
        </section>

        <section class="case-study-cta">
          <h3>Full Case Study</h3>
          <p>Deep dive into the creative process, technical decisions, and final results</p>
          <a href="#" class="cta-button interactive">View Complete Case Study</a>
        </section>
      </main>
    </div>
  `;
}

export function init() {
  const lines = document.querySelectorAll('.page-heading .line');
  lines.forEach((line, i) => {
    setTimeout(() => {
      decodeText(line as HTMLElement, 1.5);
    }, i * 300);
  });

  setTimeout(() => {
    const leadText = document.querySelector('.lead-text') as HTMLElement;
    if (leadText) wordReveal(leadText, 0);
  }, 800);

  const acts = document.querySelectorAll('.apollo-act');
  fadeInBlur(acts as any, 1.2, 0.4);

  initAudioPlayers();

  const backButton = document.querySelector('[data-route="home"]');
  backButton?.addEventListener('click', (e) => {
    e.preventDefault();
    (window as any).router.navigate('home');
  });

  if ((window as any).cursor) {
    (window as any).cursor.refresh();
  }
}
function initAudioPlayers() {
  const players = document.querySelectorAll('.audio-player');
  const audioInstances: HTMLAudioElement[] = [];
  
  players.forEach((player) => {
    const playBtn = player.querySelector('.play-btn');
    const progressBar = player.querySelector('.progress-fill') as HTMLElement;
    const timeDisplay = player.querySelector('.time-display');
    const track = player.getAttribute('data-track');
    
    if (!playBtn || !progressBar || !timeDisplay || !track) return;
    
    const audio = new Audio(`/${track}.mp3`);
    audioInstances.push(audio);
    let isPlaying = false;
    
    // Get friendly track name
    const trackNames: { [key: string]: string } = {
      'ACT_I_PREP': 'Apollo Act I: Prep',
      'ACT_II_LAUNCH': 'Apollo Act II: Launch',
      'ACT_III_ETHER': 'Apollo Act III: Ether'
    };
    const friendlyName = trackNames[track] || track;
    
    playBtn.addEventListener('click', () => {
      if (isPlaying) {
        audio.pause();
        const icon = playBtn.querySelector('.play-icon');
        if (icon) icon.textContent = '▶';
        isPlaying = false;
        (window as any).miniPlayer.updatePlayState(false);
      } else {
        // Stop ALL other audio players
        audioInstances.forEach((otherAudio) => {
          if (otherAudio !== audio) {
            otherAudio.pause();
            otherAudio.currentTime = 0;
          }
        });
        
        // Reset all play buttons
        document.querySelectorAll('.audio-player').forEach((otherPlayer) => {
          if (otherPlayer !== player) {
            const otherBtn = otherPlayer.querySelector('.play-btn');
            const otherIcon = otherBtn?.querySelector('.play-icon');
            if (otherIcon) otherIcon.textContent = '▶';
            const otherProgress = otherPlayer.querySelector('.progress-fill') as HTMLElement;
            if (otherProgress) otherProgress.style.width = '0%';
            const otherTime = otherPlayer.querySelector('.time-display');
            if (otherTime) otherTime.textContent = '0:00';
          }
        });
        
        audio.play();
        const icon = playBtn.querySelector('.play-icon');
        if (icon) icon.textContent = '⏸';
        isPlaying = true;
        
        // Show mini player
        (window as any).miniPlayer.setAudio(audio, friendlyName);
        (window as any).miniPlayer.updatePlayState(true);
      }
    });
    
    audio.addEventListener('timeupdate', () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = `${progress}%`;
      
      const minutes = Math.floor(audio.currentTime / 60);
      const seconds = Math.floor(audio.currentTime % 60);
      timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    });
    
    audio.addEventListener('ended', () => {
      const icon = playBtn.querySelector('.play-icon');
      if (icon) icon.textContent = '▶';
      isPlaying = false;
      progressBar.style.width = '0%';
      timeDisplay.textContent = '0:00';
    });
    
    const progressBarContainer = player.querySelector('.progress-bar');
    progressBarContainer?.addEventListener('click', (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rect = (progressBarContainer as HTMLElement).getBoundingClientRect();
      const percent = (mouseEvent.clientX - rect.left) / rect.width;
      audio.currentTime = percent * audio.duration;
    });
  });
}