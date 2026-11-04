const MIDI_A4 = 69;
const A4 = 440;

const toFrequency = (midi: number) => A4 * 2 ** ((midi - MIDI_A4) / 12);

const PAD_CHORDS: number[][] = [
  [57, 60, 64, 67, 72],
  [57, 60, 64, 65, 69],
  [58, 62, 65, 69, 72],
  [55, 60, 62, 64, 67],
];

const BASS_NOTES = [53, 50, 46, 48];
const MELODY_NOTES = [72, 74, 77, 79, 81, 84];

class Soundtrack {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private delaySend: GainNode | null = null;
  private timer: number | null = null;
  private pauseTimer: number | null = null;
  private step = 0;
  private nextNoteTime = 0;
  private lastMelody = -1;
  private playing = false;

  private readonly bpm = 64;
  private readonly stepDuration = 60 / this.bpm / 2;

  private build() {
    const context = new AudioContext();
    const master = context.createGain();
    master.gain.value = 0.0001;

    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -26;
    compressor.knee.value = 30;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.2;
    compressor.release.value = 1.6;

    const delay = context.createDelay(1.5);
    delay.delayTime.value = 0.42;
    const feedback = context.createGain();
    feedback.gain.value = 0.3;
    const delayTone = context.createBiquadFilter();
    delayTone.type = 'lowpass';
    delayTone.frequency.value = 1800;
    const wet = context.createGain();
    wet.gain.value = 0.24;

    const delaySend = context.createGain();
    delaySend.gain.value = 1;

    delaySend.connect(delay);
    delay.connect(delayTone);
    delayTone.connect(wet);
    wet.connect(master);
    delayTone.connect(feedback);
    feedback.connect(delay);

    master.connect(compressor);
    compressor.connect(context.destination);

    this.context = context;
    this.master = master;
    this.delaySend = delaySend;
  }

  private voice(
    frequency: number,
    start: number,
    duration: number,
    volume: number,
    type: OscillatorType,
    wetAmount: number,
    detune = 0,
  ) {
    const context = this.context;
    const master = this.master;
    if (!context || !master) return;

    const oscillator = context.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.detune.value = detune;

    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(volume, start + Math.min(1.4, duration * 0.35));
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    oscillator.connect(gain);
    gain.connect(master);

    if (wetAmount > 0 && this.delaySend) {
      const send = context.createGain();
      send.gain.value = wetAmount;
      gain.connect(send);
      send.connect(this.delaySend);
    }

    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
  }

  private scheduleStep(step: number, time: number) {
    const chordIndex = Math.floor(step / 8) % PAD_CHORDS.length;

    if (step % 8 === 0) {
      const chord = PAD_CHORDS[chordIndex];
      chord.forEach((note, index) => {
        const frequency = toFrequency(note);
        const opening = index === chord.length - 1;
        this.voice(frequency, time, 7.4, opening ? 0.008 : 0.012, 'triangle', 0.35, -4);
        this.voice(frequency * 2.001, time, 6.8, 0.0035, 'sine', 0.5, 3);
      });
      this.voice(toFrequency(BASS_NOTES[chordIndex]), time, 8, 0.02, 'sine', 0.1);
    }

    if (step % 2 === 0 && Math.random() < 0.34) {
      let note = MELODY_NOTES[Math.floor(Math.random() * MELODY_NOTES.length)];
      if (note === this.lastMelody) {
        note = MELODY_NOTES[(MELODY_NOTES.indexOf(note) + 2) % MELODY_NOTES.length];
      }
      this.lastMelody = note;
      this.voice(toFrequency(note), time + Math.random() * 0.04, 3.6, 0.017, 'sine', 0.85);
    }

    if (step % 32 === 0) {
      this.voice(toFrequency(step % 64 === 0 ? 89 : 86), time + 1.2, 4.6, 0.009, 'sine', 0.95);
    }
  }

  private tick() {
    const context = this.context;
    if (!context || !this.playing) return;

    while (this.nextNoteTime < context.currentTime + 1.4) {
      this.scheduleStep(this.step, this.nextNoteTime);
      this.nextNoteTime += this.stepDuration;
      this.step += 1;
    }
  }

  async start() {
    if (!this.context) this.build();
    const context = this.context;
    const master = this.master;
    if (!context || !master) return;

    if (this.pauseTimer !== null) {
      window.clearTimeout(this.pauseTimer);
      this.pauseTimer = null;
    }

    if (context.state === 'suspended') await context.resume();
    master.gain.cancelScheduledValues(context.currentTime);
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), context.currentTime);
    master.gain.linearRampToValueAtTime(0.6, context.currentTime + 2.4);

    if (this.playing) return;
    this.playing = true;
    this.step = 0;
    this.nextNoteTime = context.currentTime + 0.12;
    this.tick();
    this.timer = window.setInterval(() => this.tick(), 180);
  }

  stop() {
    const context = this.context;
    const master = this.master;
    if (!context || !master) return;

    this.playing = false;
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }

    master.gain.cancelScheduledValues(context.currentTime);
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), context.currentTime);
    master.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.1);

    this.pauseTimer = window.setTimeout(() => {
      if (!this.playing) void this.context?.suspend();
    }, 1400);
  }
}

const engine = new Soundtrack();
const STORAGE_KEY = 'little-world-music';

export function musicPreference(): 'on' | 'off' {
  return localStorage.getItem(STORAGE_KEY) === 'off' ? 'off' : 'on';
}

export async function startMusic(): Promise<boolean> {
  try {
    await engine.start();
    localStorage.setItem(STORAGE_KEY, 'on');
    return true;
  } catch {
    /* Audio is a grace note; the story works without it. */
    return false;
  }
}

export function stopMusic() {
  engine.stop();
  localStorage.setItem(STORAGE_KEY, 'off');
}
