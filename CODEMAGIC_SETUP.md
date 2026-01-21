# Codemagic Setup Guide

This guide explains how to build and sign your iOS app using Codemagic with a free Apple ID.

## Prerequisites

- GitHub, GitLab, or Bitbucket account
- Free Apple ID (no paid developer account needed)
- This repository pushed to your Git service

## Step 1: Connect Repository to Codemagic

1. Go to [codemagic.io](https://codemagic.io)
2. Click **Sign up** or **Sign in**
3. Choose your Git provider (GitHub/GitLab/Bitbucket)
4. Authorize Codemagic to access your repositories
5. Find and select `seamless-video-steps` repository
6. Click **Set up build**

## Step 2: Configure iOS Signing

### Option A: Automatic Signing (Recommended)

1. In Codemagic project settings, go to **iOS signing**
2. Click **Create new certificate**
3. Select **Automatic signing**
4. Enter your Apple ID email
5. Codemagic generates certificates automatically
6. No additional action needed

### Option B: Manual Signing

If automatic signing doesn't work:

1. Go to **iOS signing** in Codemagic
2. Upload your signing certificates (if you have them)
3. Or let Codemagic generate them for you

## Step 3: Configure Build Settings

1. In Codemagic, go to **Build configuration**
2. Ensure these settings are correct:

   ```yaml
   Instance type: Mac Mini M1 (or Mac Standard)
   Xcode version: Latest
   Node version: 18+
   ```

3. The `codemagic.yaml` file in your repo handles the rest

## Step 4: Trigger Your First Build

### Option A: Push to Main Branch

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

Codemagic automatically detects the push and starts building.

### Option B: Manual Trigger

1. Go to your Codemagic project
2. Click **Start new build**
3. Select **ios-build** workflow
4. Click **Start build**

## Step 5: Monitor Build Progress

1. Watch the build log in real-time
2. Common stages:
   - Installing dependencies
   - Building iOS app
   - Signing with certificate
   - Creating IPA file

3. Build typically takes 10-15 minutes

## Step 6: Download IPA

When build completes:

1. Go to **Artifacts** tab
2. Download `app.ipa` or `release.ipa`
3. Keep the IPA file safe

## Step 7: Install on iPhone

### Using AltStore (Recommended)

1. Download [AltStore](https://altstore.io) on your Mac
2. Install AltStore on your iPhone (via Mac)
3. Open AltStore on iPhone
4. Go to **My Apps** → **+**
5. Select the IPA file
6. AltStore installs it automatically
7. App is valid for 7 days

### Using Sideloadly

1. Download [Sideloadly](https://sideloadly.io)
2. Connect iPhone to Mac
3. Open Sideloadly
4. Select the IPA file
5. Enter your Apple ID
6. Click **Start**
7. App installs and is valid for 7 days

### Using Xcode (Advanced)

1. Connect iPhone to Mac
2. Open Xcode
3. Go to **Window** → **Devices and Simulators**
4. Select your iPhone
5. Drag the IPA onto the window
6. App installs automatically

## Troubleshooting

### Build fails with signing error

**Problem**: "Signing certificate not found"

**Solution**:
1. Go to Codemagic project settings
2. Delete existing signing configuration
3. Click **Create new certificate**
4. Let Codemagic generate new certificates
5. Retry build

### Build fails with Xcode error

**Problem**: "Xcode build failed"

**Solution**:
1. Check Codemagic build log for specific error
2. Ensure `app.config.ts` has correct bundle ID
3. Verify all dependencies are installed
4. Try rebuilding

### IPA won't install on device

**Problem**: "Cannot install app"

**Solution**:
1. Ensure you're using free Apple ID (not enterprise)
2. Check device has enough storage (1GB+)
3. Try reinstalling with AltStore
4. Ensure device is on iOS 14.0 or later

### App crashes on launch

**Problem**: "App crashes immediately after opening"

**Solution**:
1. Check device logs in Xcode
2. Ensure all permissions are granted (Photos, Files)
3. Try reinstalling the app
4. Check for TypeScript errors in build log

## Automating Builds

### Build on Every Push

The `codemagic.yaml` is already configured to build on push to `main`:

```yaml
triggering:
  events:
    - push
  branch:
    pattern: main
```

### Build on Tag (Release)

Builds automatically when you create a release tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

This triggers the `ios-release` workflow.

## Environment Variables

Add secrets to Codemagic for sensitive data:

1. Go to **Settings** → **Environment variables**
2. Click **Add variable**
3. Name: `CM_EMAIL`
4. Value: Your email
5. Mark as **Secure**

These are available in build scripts as `$CM_EMAIL`, etc.

## Advanced Configuration

### Custom Build Scripts

Edit `codemagic.yaml` to customize build process:

```yaml
scripts:
  - name: Custom step
    script: |
      echo "Running custom commands"
      npm run custom-build
```

### Publishing to App Store

To publish to App Store (requires paid developer account):

1. Add App Store Connect credentials to Codemagic
2. Update `codemagic.yaml` with publishing configuration
3. Codemagic uploads to App Store automatically

## Support

- **Codemagic Docs**: [codemagic.io/docs](https://codemagic.io/docs)
- **Expo Docs**: [docs.expo.dev](https://docs.expo.dev)
- **iOS Signing**: [Apple Developer](https://developer.apple.com)

## Notes

- Free Apple ID allows 7-day app validity
- No paid developer account required
- Codemagic free tier includes 500 build minutes/month
- Builds are encrypted and secure
- All certificates managed by Codemagic

---

**Last Updated**: January 2026
