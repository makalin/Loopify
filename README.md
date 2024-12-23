# Loopify

Loopify is a desktop application designed for audio processing. Built with [Electron](https://www.electronjs.org/), it provides a user-friendly interface for handling audio files and integrates [Fluent-FFmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) to support a variety of audio export and processing options.

## Features

- **Audio Export**: Export audio files in different formats using FFmpeg.
- **Responsive UI**: Built with Electron for a smooth and intuitive user experience.
- **Platform Support**: Compatible with Windows, macOS, and Linux.
- **Customizable Settings**: Flexible configuration options for different workflows.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/loopify.git
   cd loopify
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

## Usage

1. Launch Loopify by running the above commands or the packaged app.
2. Import an audio file using the interface.
3. Process the audio using the available tools.
4. Export the audio file in the desired format.

## Development

If you want to contribute or customize the app, follow these steps:

1. Run the application in development mode:
   ```bash
   npm run dev
   ```

2. Access developer tools for debugging:
   - Use the Electron Developer Tools accessible from the app window.

## File Structure

- `src/main.js`: Main Electron process file for initializing the app and managing IPC communication.
- `index.html`: Front-end interface file loaded by the Electron app.
- `package.json`: Dependency and script management for the project.

## Contribution Guidelines

We welcome contributions! Feel free to:

1. Fork the repository.
2. Create a new feature branch:
   ```bash
   git checkout -b feature-name
   ```

3. Commit your changes and open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Acknowledgments

- [Electron](https://www.electronjs.org/) for enabling cross-platform desktop development.
- [Fluent-FFmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) for audio processing capabilities.
