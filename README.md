# Seamless Video Steps - iOS App

A native iOS app for seamless fullscreen video playback with local storage. Upload your own videos organized by steps and experience uninterrupted playback with zero visible transitions.

## Features

- **Local Video Storage** — Videos stored securely in app's document directory
- **Seamless Playback** — Zero-pause transitions between videos
- **Fullscreen Experience** — Immersive video playback with hidden status bar
- **Offline Ready** — All functionality works completely offline
- **Simple Management** — Upload, delete, and organize videos by step
- **Codemagic Ready** — Pre-configured for automated iOS builds

## Tech Stack

- **React Native** with Expo SDK 54
- **TypeScript** for type safety
- **NativeWind** (Tailwind CSS) for styling
- **expo-video** for video playback
- **expo-media-library** for video access
- **AsyncStorage** for local persistence

## Project Structure

```
seamless-video-steps/
├── app/
│   └── (tabs)/
│       ├── _layout.tsx          # Tab navigation
│       └── index.tsx            # Main app screen
├── src/
│   ├── screens/
│   │   └── UploadScreen.tsx     # Video upload interface
│   ├── video/
│   │   ├── SeamlessPlayer.tsx   # Video player component
│   │   └── useVideoPreloader.ts # Preloading hook
│   └── storage/
│       └── videoStorage.ts      # Local storage management
├── components/                  # Reusable UI components
├── codemagic.yaml              # CI/CD configuration
├── app.config.ts               # Expo configuration
└── tailwind.config.js          # Styling configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Xcode 15+ (for iOS development)
- Expo CLI: `npm install -g expo-cli`

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Run on iOS simulator**
   ```bash
   npm run ios
   ```

4. **Run on physical device**
   - Scan the QR code with Expo Go app
   - Or use `npm run ios` and select device

## Usage

### Upload Videos

1. Launch the app
2. Tap "Add Step 1" to select your first video
3. Choose a video from your Photos or Files
4. Repeat for additional steps
5. Tap "Start Playback" to begin

### Playback Controls

- **Tap screen** — Advance to next video
- **Auto-play** — Videos play automatically when ready
- **Seamless transitions** — No visible pause between videos
- **End of playback** — Returns to upload screen

## Building for iOS

### Development Build

```bash
npm run dev
# Then use Expo Go app to test on device
```

### Production Build (Local)

```bash
# Using EAS (Expo Application Services)
npm install -g eas-cli
eas build --platform ios --local
```

### Production Build (Codemagic)

1. **Connect repository to Codemagic**
   - Go to [codemagic.io](https://codemagic.io)
   - Sign in with GitHub/GitLab/Bitbucket
   - Select this repository

2. **Configure signing**
   - Use free Apple ID (no paid account required)
   - Codemagic handles certificate generation
   - No manual signing needed

3. **Trigger build**
   - Push to main branch or create a tag
   - Codemagic automatically builds and signs
   - Download IPA from build artifacts

4. **Install on device**
   - Use [AltStore](https://altstore.io) or [Sideloadly](https://sideloadly.io)
   - Install IPA to iPhone (7-day validity with free Apple ID)

## Video Format Support

The app supports all iOS-native video formats:

- **MP4** (H.264 codec) — Recommended
- **MOV** (Apple ProRes)
- **HEVC** (H.265)
- **WebM** (VP9)

**Recommended specs for best performance:**
- Resolution: 1080p or higher
- Frame rate: 24-60 fps
- Bitrate: 5-15 Mbps
- Codec: H.264 or HEVC

## Storage & Persistence

Videos are stored in the app's document directory:
- **Location**: `Documents/seamless-videos/`
- **Persistence**: Survives app updates and device restarts
- **Capacity**: Limited by device storage (typically 64GB+)
- **Deletion**: Manual via app UI or app uninstall

## Troubleshooting

### Videos not loading
- Check file permissions in Settings → Privacy → Photos
- Ensure video format is iOS-compatible
- Try converting to MP4 with H.264 codec

### Build fails on Codemagic
- Verify `app.config.ts` has correct bundle ID
- Check iOS signing configuration
- Review Codemagic logs for specific errors

### Playback stutters
- Close other apps to free memory
- Reduce video resolution if very large
- Check device storage (needs 1GB+ free)

### Seamless transitions not smooth
- Ensure videos are similar resolution
- Pre-encode videos with consistent settings
- Test with shorter videos first

## Development

### Adding new features

1. **Create new screen**
   ```tsx
   // src/screens/NewScreen.tsx
   export function NewScreen() {
     return <ScreenContainer>...</ScreenContainer>;
   }
   ```

2. **Update app navigation**
   ```tsx
   // app/(tabs)/index.tsx
   const [screen, setScreen] = useState<'upload' | 'player' | 'new'>('upload');
   ```

3. **Test on device**
   ```bash
   npm run dev
   ```

### Code style

- Use TypeScript for all components
- Follow React hooks patterns
- Use NativeWind classes for styling
- Keep components under 300 lines

## Performance Optimization

The app implements several optimizations for smooth playback:

- **Video preloading** — All videos preloaded before playback starts
- **Memory management** — Efficient video buffering
- **Progress tracking** — Accurate loading indicators
- **Screen persistence** — Prevents unnecessary re-renders

## Deployment

### Manual Deployment

1. Build locally with EAS
2. Download IPA file
3. Use AltStore or Sideloadly to install
4. Enjoy 7-day validity with free Apple ID

### Automated Deployment (Codemagic)

1. Push code to repository
2. Codemagic automatically builds
3. Download from build artifacts
4. Install using preferred method

## License

This project is provided as-is for personal use.

## Support

For issues or questions:

1. Check the Troubleshooting section
2. Review Codemagic build logs
3. Ensure all dependencies are installed
4. Try rebuilding from scratch

## Notes

- **No cloud sync** — All data stored locally
- **Offline only** — No internet required
- **Free Apple ID** — Works with free developer account
- **7-day validity** — Standard for free Apple ID installations
- **No ads or tracking** — Completely private

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Compatibility**: iOS 14.0+
