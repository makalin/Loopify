import React, { useState, useCallback, useEffect, useMemo } from 'react';
import * as Tone from 'tone';
import { WebMidi, MIDIInput } from 'webmidi';

interface EffectConfig {
  enabled: boolean;
  wet?: number;
  feedback?: number;
  amount?: number;
  frequency?: number;
}

interface Effects {
  reverb: EffectConfig;
  delay: EffectConfig;
  distortion: EffectConfig;
  filter: EffectConfig;
}

// Instrument definitions
const createInstrument = (type) => {
  switch (type) {
    case 'synth':
      return new Tone.Synth();
    case 'bass':
      return new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.2, decay: 0.2, sustain: 0.5, release: 1.2 }
      });
    case 'pad':
      return new Tone.PolySynth(Tone.Synth, {
        envelope: { attack: 0.5, decay: 0.5, sustain: 0.8, release: 2 }
      });
    case 'lead':
      return new Tone.MonoSynth({
        oscillator: { type: 'square' }
      });
    case 'drums':
      return new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.005, decay: 0.1, sustain: 0 }
      });
    default:
      return new Tone.Synth();
  }
};

// Effect definitions
const createEffect = (type: string): Tone.Reverb | Tone.FeedbackDelay | Tone.Distortion | Tone.Filter | null => {
  switch (type) {
    case 'reverb':
      return new Tone.Reverb({ decay: 2.5, wet: 0.5 });
    case 'delay':
      return new Tone.FeedbackDelay({ delayTime: 0.25, feedback: 0.5 });
    case 'distortion':
      return new Tone.Distortion(0.4);
    case 'filter':
      return new Tone.Filter(1000, 'lowpass');
    default:
      return null;
  }
};

const InstrumentButton = ({ name, active, onClick }) => (
  <button
    className={`p-4 rounded-lg border-2 transition-all ${
      active ? 'bg-green-500 text-white border-green-600' : 'bg-white border-gray-300 hover:border-gray-400'
    }`}
    onClick={onClick}
  >
    {name}
  </button>
);

const Slider = ({ id, label, value, onChange, min, max }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="text-sm font-medium">
      {label}
    </label>
    <input
      type="range"
      id={id}
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full"
    />
  </div>
);

const EffectControl = ({ name, value, onChange, min = 0, max = 1, step = 0.01 }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium">{name}</label>
    <input
      type="range"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step}
      className="w-full"
    />
    <span className="text-xs text-gray-500">{value.toFixed(2)}</span>
  </div>
);

const ShareButton = ({ onShare }) => (
  <button
    onClick={onShare}
    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
  >
    Share
  </button>
);

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [mood, setMood] = useState('happy');
  const [activeInstruments, setActiveInstruments] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [effects, setEffects] = useState<Effects>({
    reverb: { enabled: false, wet: 0.5 },
    delay: { enabled: false, feedback: 0.5 },
    distortion: { enabled: false, amount: 0.4 },
    filter: { enabled: false, frequency: 1000 }
  });
  const [midiDevices, setMidiDevices] = useState<MIDIInput[]>([]);
  const [selectedMidiDevice, setSelectedMidiDevice] = useState<string | null>(null);

  const INSTRUMENTS = [
    { id: 'synth', name: 'Synth' },
    { id: 'bass', name: 'Bass' },
    { id: 'drums', name: 'Drums' },
    { id: 'pad', name: 'Pad' },
    { id: 'lead', name: 'Lead' }
  ];

  const MOODS = ['happy', 'melancholic', 'energetic', 'chill', 'intense'];

  const [instruments, setInstruments] = useState<Record<string, Tone.Synth | Tone.PolySynth | Tone.MonoSynth | Tone.NoiseSynth>>({});
  const [effectNodes, setEffectNodes] = useState<Record<string, Tone.Reverb | Tone.FeedbackDelay | Tone.Distortion | Tone.Filter | null>>({});

  // Initialize instruments
  useEffect(() => {
    const newInstruments = {};
    INSTRUMENTS.forEach(({ id }) => {
      const instrument = createInstrument(id);
      instrument.toDestination();
      newInstruments[id] = instrument;
    });
    setInstruments(newInstruments);

    return () => {
      // Cleanup instruments
      Object.values(newInstruments).forEach(instrument => instrument.dispose());
    };
  }, []);

  // Initialize MIDI
  useEffect(() => {
    const initMidi = async () => {
      try {
        await WebMidi.enable();
        setMidiDevices(WebMidi.inputs);
        
        WebMidi.inputs.forEach(input => {
          input.addListener('noteon', e => {
            if (selectedMidiDevice === input.id) {
              const note = e.note.name + e.note.octave;
              Object.values(instruments).forEach(instrument => {
                if (instrument instanceof Tone.NoiseSynth) {
                  instrument.triggerAttackRelease('16n');
                } else if (instrument instanceof Tone.Synth || 
                          instrument instanceof Tone.PolySynth || 
                          instrument instanceof Tone.MonoSynth) {
                  instrument.triggerAttackRelease(note, '8n');
                }
              });
            }
          });
        });
      } catch (err) {
        console.error('MIDI initialization failed:', err);
      }
    };

    initMidi();
    return () => {
      WebMidi.disable();
    };
  }, [selectedMidiDevice, instruments]);

  // Initialize effects
  useEffect(() => {
    const newEffectNodes: Record<string, Tone.Reverb | Tone.FeedbackDelay | Tone.Distortion | Tone.Filter | null> = {};
    Object.keys(effects).forEach(effectType => {
      newEffectNodes[effectType] = createEffect(effectType);
    });
    setEffectNodes(newEffectNodes);

    return () => {
      Object.values(newEffectNodes).forEach(effect => effect?.dispose());
    };
  }, []);

  // Connect effects when enabled
  useEffect(() => {
    Object.entries(effects).forEach(([type, config]) => {
      const effect = effectNodes[type];
      if (effect && config.enabled) {
        if ('wet' in effect) {
          effect.wet.value = config.wet || config.amount || (config.frequency || 1000) / 2000;
        }
        Object.values(instruments).forEach(instrument => {
          instrument.disconnect();
          instrument.chain(effect, Tone.Destination);
        });
      } else if (effect) {
        Object.values(instruments).forEach(instrument => {
          instrument.disconnect();
          instrument.toDestination();
        });
      }
    });
  }, [effects, effectNodes, instruments]);

  // Performance optimization: Memoize pattern creation
  const createPatternMemo = useMemo(() => {
    return (instrument, instrumentType, mood) => {
      const patterns = {
        happy: {
          synth: ['C4', 'E4', 'G4', 'E4'],
          bass: ['C2', null, 'G2', null],
          drums: ['C1', null, 'G1', 'C1'],
          pad: ['C3', 'E3', 'G3', 'E3'],
          lead: ['G4', 'C5', 'E5', 'G5']
        },
        melancholic: {
          synth: ['C4', 'Eb4', 'G4', 'Eb4'],
          bass: ['C2', null, 'G2', null],
          drums: ['C1', null, null, 'C1'],
          pad: ['C3', 'Eb3', 'G3', 'Eb3'],
          lead: ['G4', 'C5', 'Eb5', 'G5']
        },
        energetic: {
          synth: ['C4', 'D4', 'E4', 'G4', 'E4', 'D4'],
          bass: ['C2', null, 'G2', null, 'E2', null],
          drums: ['C1', 'G1', 'C1', 'G1', 'C1', 'G1'],
          pad: ['C3', 'G3', 'E3', 'G3'],
          lead: ['C5', 'D5', 'E5', 'G5', 'E5', 'D5']
        },
        chill: {
          synth: ['C4', 'E4', 'G4', null],
          bass: ['C2', null, null, null],
          drums: ['C1', null, 'G1', null],
          pad: ['C3', null, 'G3', null],
          lead: ['G4', null, 'E5', null]
        },
        intense: {
          synth: ['C4', 'E4', 'G4', 'C5', 'G4', 'E4'],
          bass: ['C1', 'C1', 'G1', 'G1'],
          drums: ['C1', 'G1', 'C1', 'G1'],
          pad: ['C3', 'G3', 'C4', 'G3'],
          lead: ['C5', 'G5', 'C6', 'G5']
        }
      };

      return new Tone.Sequence(
        (time, note) => {
          if (note) {
            if (instrumentType === 'drums') {
              instrument.triggerAttackRelease('16n', time);
            } else {
              instrument.triggerAttackRelease(note, '8n', time);
            }
          }
        },
        patterns[mood][instrumentType] || patterns[mood].synth,
        '4n'
      );
    };
  }, [mood]);

  const toggleInstrument = (instrumentId) => {
    setActiveInstruments(prev => 
      prev.includes(instrumentId)
        ? prev.filter(id => id !== instrumentId)
        : [...prev, instrumentId]
    );
  };

  const startLoop = useCallback(async () => {
    try {
      await Tone.start();
      Tone.Transport.bpm.value = tempo;
      
      activeInstruments.forEach(id => {
        const instrument = instruments[id];
        if (instrument) {
          const pattern = createPatternMemo(instrument, id, mood);
          pattern.start(0);
        }
      });
      
      Tone.Transport.start();
      setIsPlaying(true);
      setError(null);
    } catch (err) {
      setError('Failed to start playback. Please try again.');
      console.error(err);
    }
  }, [tempo, activeInstruments, instruments, mood, createPatternMemo]);

  const stopLoop = useCallback(() => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    setIsPlaying(false);
  }, []);

  const handleShare = useCallback(async () => {
    try {
      const shareData = {
        tempo,
        mood,
        activeInstruments,
        effects
      };
      
      const shareUrl = `${window.location.origin}?data=${encodeURIComponent(JSON.stringify(shareData))}`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'My Loopify Creation',
          text: 'Check out my music creation on Loopify!',
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('Share URL copied to clipboard!');
      }
    } catch (err) {
      console.error('Sharing failed:', err);
    }
  }, [tempo, mood, activeInstruments, effects]);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">Loopify</h1>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 md:p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Instruments</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {INSTRUMENTS.map(({ id, name }) => (
              <InstrumentButton
                key={id}
                name={name}
                active={activeInstruments.includes(id)}
                onClick={() => toggleInstrument(id)}
              />
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 md:p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Effects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(effects).map(([type, config]) => (
              <div key={type} className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(e) => setEffects(prev => ({
                      ...prev,
                      [type]: { ...prev[type], enabled: e.target.checked }
                    }))}
                    className="rounded"
                  />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
                {config.enabled && (
                  <EffectControl
                    name={`${type} Amount`}
                    value={config.wet || config.amount || config.frequency / 2000}
                    onChange={(value) => setEffects(prev => ({
                      ...prev,
                      [type]: { ...prev[type], [type === 'filter' ? 'frequency' : type === 'distortion' ? 'amount' : 'wet']: value }
                    }))}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 md:p-6 rounded-xl my-6">
        <h2 className="text-xl font-semibold mb-4">MIDI Control</h2>
        <select
          value={selectedMidiDevice || ''}
          onChange={(e) => setSelectedMidiDevice(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300"
        >
          <option value="">Select MIDI Device</option>
          {midiDevices.map(device => (
            <option key={device.id} value={device.id}>
              {device.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="bg-gray-50 p-4 md:p-6 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-4">Controls</h2>
        <Slider
          id="tempo"
          label={`Tempo: ${tempo} BPM`}
          value={tempo}
          onChange={setTempo}
          min={60}
          max={200}
        />
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Mood</h3>
          <div className="flex flex-wrap gap-3">
            {MOODS.map(m => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  mood === m 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center gap-4">
        <button
          onClick={isPlaying ? stopLoop : startLoop}
          disabled={activeInstruments.length === 0}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            isPlaying
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-green-500 text-white hover:bg-green-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isPlaying ? 'Stop' : 'Play'}
        </button>
        <ShareButton onShare={handleShare} />
      </div>
    </div>
  );
};

export default App;
