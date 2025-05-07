declare module 'tone' {
  export class Synth {
    toDestination(): void;
    triggerAttackRelease(note: string, duration: string, time?: number): void;
    dispose(): void;
    disconnect(): void;
    chain(...nodes: any[]): void;
  }

  export class PolySynth {
    constructor(synth: any, options?: any);
    toDestination(): void;
    triggerAttackRelease(note: string, duration: string, time?: number): void;
    dispose(): void;
    disconnect(): void;
    chain(...nodes: any[]): void;
  }

  export class MonoSynth {
    constructor(options?: any);
    toDestination(): void;
    triggerAttackRelease(note: string, duration: string, time?: number): void;
    dispose(): void;
    disconnect(): void;
    chain(...nodes: any[]): void;
  }

  export class NoiseSynth {
    constructor(options?: any);
    toDestination(): void;
    triggerAttackRelease(duration: string, time?: number): void;
    dispose(): void;
    disconnect(): void;
    chain(...nodes: any[]): void;
  }

  export class Reverb {
    constructor(options?: any);
    wet: { value: number };
    dispose(): void;
  }

  export class FeedbackDelay {
    constructor(options?: any);
    wet: { value: number };
    dispose(): void;
  }

  export class Distortion {
    constructor(amount: number);
    wet: { value: number };
    dispose(): void;
  }

  export class Filter {
    constructor(frequency: number, type: string);
    wet: { value: number };
    frequency: { value: number };
    dispose(): void;
  }

  export class Sequence {
    constructor(callback: (time: number, note: string | null) => void, notes: (string | null)[], subdivision: string);
    start(time?: number): void;
    dispose(): void;
  }

  export const Transport: {
    start(): void;
    stop(): void;
    cancel(): void;
    bpm: { value: number };
  };

  export const Destination: any;

  export function start(): Promise<void>;
}

declare module 'webmidi' {
  export interface MIDIInput {
    id: string;
    name: string;
    addListener(event: string, callback: (e: any) => void): void;
  }

  export class WebMidi {
    static enable(): Promise<void>;
    static disable(): void;
    static inputs: MIDIInput[];
  }
} 