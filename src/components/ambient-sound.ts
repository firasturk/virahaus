/*
 * A rainforest at night, synthesised in the browser: steady rain from filtered
 * noise with slow gusts, single drops, two kinds of tree frog calling at random,
 * and a roll of distant thunder now and then. Nothing is downloaded and nothing
 * loops audibly. Everything hangs off one master gain so it can fade in and out.
 */

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export class Soundscape {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timers: number[] = [];
  private noise: AudioBuffer | null = null;
  running = false;

  private later(fn: () => void, ms: number) {
    const id = window.setTimeout(() => {
      this.timers = this.timers.filter((t) => t !== id);
      if (this.running) fn();
    }, ms);
    this.timers.push(id);
  }

  private noiseBuffer(ctx: AudioContext) {
    if (this.noise) return this.noise;
    const seconds = 4;
    const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    this.noise = buf;
    return buf;
  }

  private panner(ctx: AudioContext, pan: number) {
    const p = ctx.createStereoPanner();
    p.pan.value = pan;
    return p;
  }

  /* Steady rain: a bright hiss and a low wash, both breathing slowly. */
  private rain(ctx: AudioContext, out: AudioNode) {
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(ctx);
    src.loop = true;

    const hiss = ctx.createBiquadFilter();
    hiss.type = "bandpass";
    hiss.frequency.value = 2600;
    hiss.Q.value = 0.6;
    const hissGain = ctx.createGain();
    hissGain.gain.value = 0.16;

    const wash = ctx.createBiquadFilter();
    wash.type = "lowpass";
    wash.frequency.value = 420;
    const washGain = ctx.createGain();
    washGain.gain.value = 0.22;

    /* Gusts: a slow LFO on the hiss level. */
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.05;
    lfo.connect(lfoGain).connect(hissGain.gain);

    src.connect(hiss).connect(hissGain).connect(out);
    src.connect(wash).connect(washGain).connect(out);
    src.start();
    lfo.start();
  }

  /* Single drops landing on leaves, scattered left and right. */
  private drops(ctx: AudioContext, out: AudioNode) {
    const tick = () => {
      const t = ctx.currentTime;
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer(ctx);
      const hp = ctx.createBiquadFilter();
      hp.type = "bandpass";
      hp.frequency.value = rand(3200, 6500);
      hp.Q.value = 3;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(rand(0.05, 0.14), t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0005, t + rand(0.05, 0.11));
      src.connect(hp).connect(g).connect(this.panner(ctx, rand(-0.9, 0.9))).connect(out);
      src.start(t, rand(0, 3));
      src.stop(t + 0.2);
      this.later(tick, rand(90, 420));
    };
    this.later(tick, 300);
  }

  /* A small tree frog: a fast trill of sine pulses, high and bright. */
  private trill(ctx: AudioContext, out: AudioNode) {
    const t0 = ctx.currentTime;
    const freq = rand(1900, 2700);
    const pulses = Math.round(rand(5, 11));
    const period = 1 / rand(11, 16);
    const pan = this.panner(ctx, rand(-0.8, 0.8));
    const level = rand(0.05, 0.1);
    pan.connect(out);
    for (let i = 0; i < pulses; i++) {
      const t = t0 + i * period;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.12, t + 0.02);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(level, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0005, t + 0.03);
      osc.connect(g).connect(pan);
      osc.start(t);
      osc.stop(t + 0.05);
    }
  }

  /* A larger frog: a low, rough croak, two or three in a row. */
  private croak(ctx: AudioContext, out: AudioNode) {
    const t0 = ctx.currentTime;
    const count = Math.round(rand(2, 4));
    const pan = this.panner(ctx, rand(-0.6, 0.6));
    pan.connect(out);
    for (let i = 0; i < count; i++) {
      const t = t0 + i * rand(0.28, 0.4);
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      const f = rand(240, 360);
      osc.frequency.setValueAtTime(f, t);
      osc.frequency.linearRampToValueAtTime(f * 0.8, t + 0.14);
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 900;
      const trem = ctx.createOscillator();
      trem.frequency.value = 38;
      const tremGain = ctx.createGain();
      tremGain.gain.value = 0.5;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.045, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0005, t + 0.16);
      trem.connect(tremGain).connect(g.gain);
      osc.connect(lp).connect(g).connect(pan);
      osc.start(t);
      trem.start(t);
      osc.stop(t + 0.2);
      trem.stop(t + 0.2);
    }
  }

  private frogs(ctx: AudioContext, out: AudioNode) {
    const next = () => {
      if (Math.random() < 0.7) this.trill(ctx, out);
      else this.croak(ctx, out);
      /* Sometimes another answers straight away. */
      if (Math.random() < 0.35) this.later(() => this.trill(ctx, out), rand(250, 700));
      this.later(next, rand(1200, 4500));
    };
    this.later(next, 1500);
  }

  /* Distant thunder: a slow swell of very low noise. */
  private thunder(ctx: AudioContext, out: AudioNode) {
    const roll = () => {
      const t = ctx.currentTime;
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer(ctx);
      src.loop = true;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(140, t);
      lp.frequency.linearRampToValueAtTime(70, t + 5);
      const g = ctx.createGain();
      const dur = rand(3.5, 6);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(rand(0.35, 0.6), t + rand(0.4, 1.1));
      g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
      src.connect(lp).connect(g).connect(out);
      src.start(t);
      src.stop(t + dur + 0.1);
      this.later(roll, rand(35000, 85000));
    };
    this.later(roll, rand(9000, 20000));
  }

  async start() {
    if (this.running) return;
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    this.ctx = ctx;
    await ctx.resume();

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(1, ctx.currentTime + 2);
    master.connect(ctx.destination);
    this.master = master;
    this.running = true;

    this.rain(ctx, master);
    this.drops(ctx, master);
    this.frogs(ctx, master);
    this.thunder(ctx, master);
  }

  stop() {
    if (!this.running || !this.ctx || !this.master) return;
    this.running = false;
    this.timers.forEach((t) => window.clearTimeout(t));
    this.timers = [];
    const ctx = this.ctx;
    const master = this.master;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    window.setTimeout(() => void ctx.close(), 1200);
    this.ctx = null;
    this.master = null;
  }
}
