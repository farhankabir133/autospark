// Audio utility for managing sound effects
export class AudioManager {
  private static audioContext: AudioContext | null = null;
  private static sounds: Record<string, HTMLAudioElement> = {};
  // Only allow audio playback after an explicit user gesture (pointerdown/touchstart)
  private static userGestureAllowed = false;

  static initialize() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  static loadSound(name: string, url: string) {
    const audio = new Audio(url);
    audio.preload = 'auto';
    this.sounds[name] = audio;
  }

  static playSound(name: string, volume: number = 0.3) {
    try {
      // Respect global user-gesture guard
      if (!this.userGestureAllowed) {
        // Do not attempt playback until a user gesture is observed (prevents autoplay noise)
        return;
      }
      this.initialize();
      if (this.sounds[name]) {
        const audio = this.sounds[name].cloneNode() as HTMLAudioElement;
        audio.volume = volume;
        audio.play().catch(() => {
          // Silently fail if audio can't play (e.g., browser autoplay restriction)
        });
      }
    } catch (error) {
      console.debug('Audio playback not available');
    }
  }

  /**
   * Allow audio playback after observing a user gesture (pointerdown/touchstart).
   * Call this from a one-time global event handler so later clicks can play sounds.
   */
  static allowUserGesture() {
    try {
      this.userGestureAllowed = true;
      this.initialize();
    } catch (e) {
      /* ignore */
    }
  }

  static playButtonClick() {
    this.playSound('click');
  }

  static playClick() {
    this.playButtonClick();
  }

  static playVehicleSelect() {
    this.playSound('select');
  }

  static stopSound(name: string) {
    if (this.sounds[name]) {
      this.sounds[name].pause();
      this.sounds[name].currentTime = 0;
    }
  }

  static stopAll() {
    Object.values(this.sounds).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  static preloadSounds() {
    // Load essential sound effects
    const soundUrls: Record<string, string> = {
      click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj==',
      select: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBg==',
    };

    Object.entries(soundUrls).forEach(([name, url]) => {
      this.loadSound(name, url);
    });
  }
}

// Initialize audio when module loads
if (typeof window !== 'undefined') {
  AudioManager.preloadSounds();
}
