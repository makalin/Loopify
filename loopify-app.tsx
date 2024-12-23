import React, { useState, useCallback, useEffect } from 'react';
import * as Tone from 'tone';

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

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [mood, setMood] = useState('happy');
  const [activeInstruments, setActiveInstruments] = useState([]);
  const [error, setError] = useState(null);

  const INSTRUMENTS = [
    { id: 'synth', name: 'Synth' },
    { id: 'bass', name: 'Bass' },
    { id: 'drums', name: 'Drums' },
    { id: 'pad', name: 'Pad' },
    { id: 'lead', name: 'Lead' }
  ];

  const MOODS = ['happy', 'melancholic', 'energetic', 'chill', 'intense'];

  const [instruments, setInstruments] = useState({});

  useEffect(() => {
    // Initialize instruments
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
          const pattern = createPattern(instrument, id, mood);
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
  }, [tempo, activeInstruments, instruments, mood]);

  const stopLoop = useCallback(() => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    setIsPlaying(false);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Loopify</h1>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-gray-50 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-semibold mb-4">Instruments</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
      
      <div className="bg-gray-50 p-6 rounded-xl mb-8">
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
      </div>
    </div>
  );
};

// Pattern creation utility
const createPattern = (instrument, instrumentType, mood) => {
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

export default App;
