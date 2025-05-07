# Loopify 🎵

Loopify is an interactive web-based music creation tool that allows users to create dynamic musical loops by combining different instruments and moods. Built with React and Tone.js, it offers an intuitive interface for real-time music generation.

## Features

- 🎹 Multiple instrument tracks (Synth, Bass, Drums, Pad, Lead)
- 🎨 Five different mood presets (Happy, Melancholic, Energetic, Chill, Intense)
- ⚡ Real-time tempo control (60-200 BPM)
- 🎛️ Interactive instrument toggles
- 🎯 Pattern-based music generation
- 🎼 Dynamic audio synthesis using Tone.js
- 🎚️ Advanced audio effects (Reverb, Delay, Distortion, Filter)
- 🎹 MIDI device support for external controllers
- 📱 Mobile-responsive design
- 🔗 Social sharing capabilities
- ⚡ Performance optimized audio engine

## Technologies Used

- React
- TypeScript
- Tone.js for audio synthesis and sequencing
- WebMidi API for MIDI device support
- Tailwind CSS for styling
- Modern JavaScript (ES6+)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Modern web browser with Web Audio API support
- (Optional) MIDI device for external control

### Installation

1. Clone the repository:
```bash
git clone https://github.com/makalin/Loopify.git
cd Loopify
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

## Usage

1. Select instruments by clicking on the instrument buttons
2. Choose a mood that matches your desired musical style
3. Adjust the tempo using the slider
4. Enable and configure audio effects as desired
5. (Optional) Connect a MIDI device for external control
6. Click "Play" to start the loop
7. Click "Stop" to end playback
8. Share your creation using the share button

### Audio Effects

- **Reverb**: Add space and depth to your sound
- **Delay**: Create echo and rhythmic patterns
- **Distortion**: Add grit and character
- **Filter**: Shape the frequency content

### MIDI Support

Connect your MIDI device to:
- Trigger notes in real-time
- Control multiple instruments simultaneously
- Create dynamic performances

## Contributing

Contributions are welcome! Here are a few ways you can help:

1. Report bugs
2. Suggest new features
3. Submit pull requests
4. Improve documentation

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Future Enhancements

- [ ] Custom pattern creation
- [ ] More instruments and sound presets
- [ ] Effect controls (reverb, delay, etc.)
- [ ] Pattern export/import functionality
- [ ] MIDI device support
- [ ] User authentication and saved projects
- [ ] Collaborative music creation
- [ ] Mobile-responsive design
- [ ] Audio visualization
- [ ] Custom instrument uploads
- [ ] Social sharing features
- [ ] Performance optimization for low-latency audio

## Testing

The project uses Jest and React Testing Library for testing. To run the tests:

```bash
npm test
# or
yarn test
```

### Test Coverage

To generate a test coverage report:

```bash
npm test -- --coverage
# or
yarn test --coverage
```

Key areas covered by tests:
- Component rendering
- User interactions
- Audio synthesis functionality
- State management
- Integration tests for audio playback

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to [Tone.js](https://tonejs.github.io/) for providing the audio synthesis capabilities
- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- MIDI support powered by [WebMidi API](https://www.w3.org/TR/webmidi/)
