# Seamless Video Steps - Design Document

## App Vision

A fullscreen video player app that delivers a seamless, immersive experience where users can upload and manage their own videos organized by steps. The app eliminates all visual interruptions between video transitions, creating the illusion of a single continuous video.

## Screen List

1. **Upload Screen** — Initial interface with buttons to upload videos for each step
2. **Loading Screen** — Preloading progress indicator with accurate progress tracking
3. **Player Screen** — Fullscreen video playback with seamless transitions

## Primary Content and Functionality

### Upload Screen
- Grid of upload buttons (Step 1, Step 2, Step 3, etc.)
- Each button allows selecting a video from iPhone Files or Photos
- Display selected video count per step
- "Start Playback" button (enabled when at least one video is uploaded)
- Clean, minimal UI that doesn't distract from the primary action

### Loading Screen
- Centered progress indicator (circular or linear)
- Accurate progress percentage (0-100%)
- Loading status text
- Prevents interaction until loading completes
- Never gets stuck (robust error handling)

### Player Screen
- True fullscreen video playback
- No UI elements during playback (status bar hidden)
- Tap anywhere to advance to next video
- Seamless transitions with zero visible pause
- Automatic progression when video ends (if next video is preloaded)
- Tap to return to upload screen (optional: long press)

## Key User Flows

### Upload Flow
1. User sees Upload Screen with step buttons
2. Taps "Upload Step 1" → Opens file picker
3. Selects video from Files or Photos
4. Video is stored locally in app's document directory
5. Button shows "✓ Video Selected"
6. Repeat for other steps
7. Taps "Start Playback" → Loading Screen appears

### Loading Flow
1. Loading Screen displays with progress indicator
2. App preloads all uploaded videos into memory
3. Progress updates accurately (0% → 100%)
4. When complete, "Start" button appears
5. User taps "Start" → Player Screen launches

### Playback Flow
1. Player Screen displays in fullscreen
2. First video plays automatically
3. User taps screen → Next video plays seamlessly (zero pause)
4. Transitions are invisible and silent
5. When all videos complete, returns to Upload Screen

## Color Choices

- **Primary Background**: Deep charcoal (#1a1a1a) — immersive, reduces eye strain
- **Accent Color**: Vibrant cyan (#00d4ff) — modern, high contrast
- **Text Primary**: Pure white (#ffffff) — maximum readability
- **Text Secondary**: Light gray (#b0b0b0) — subtle, secondary information
- **Success State**: Bright green (#22ff00) — clear feedback for uploaded videos
- **Button Background**: Charcoal with cyan border (#2a2a2a, border: #00d4ff)

## Typography & Spacing

- **Heading**: SF Pro Display, 28pt, bold
- **Body**: SF Pro Display, 16pt, regular
- **Button**: SF Pro Display, 16pt, semibold
- **Spacing**: 16pt base unit (multiples of 4pt for fine-tuning)

## Animations & Interactions

- **Button Press**: Subtle scale (0.95) + opacity change (0.8)
- **Progress Indicator**: Smooth circular progress animation
- **Video Transitions**: Zero animation (instant cut, no fade/dissolve)
- **Screen Transitions**: Minimal fade (100ms) for screen changes

## Technical Constraints

- **Local Storage Only**: Videos stored in app's document directory
- **No Cloud Sync**: All data persists locally on device
- **Offline Ready**: App functions completely offline
- **iOS Only**: Optimized for iPhone (portrait orientation)
- **Video Formats**: All iOS-supported formats (MP4, MOV, etc.)
- **Memory Management**: Preload videos efficiently, release after playback
- **Seamless Playback**: Use AVPlayer with buffering strategy to eliminate gaps

## Accessibility

- Large touch targets (minimum 44pt)
- High contrast text (white on dark background)
- Simple, intuitive navigation
- No flashing or rapid animations
- Clear feedback for all interactions
