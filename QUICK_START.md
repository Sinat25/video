# Quick Start - Build & Install Guide

Get your iOS app built and installed in under 15 minutes.

## 5-Minute Setup

### 1. Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Seamless Video Steps app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/seamless-video-steps.git
git push -u origin main
```

### 2. Connect to Codemagic

1. Go to [codemagic.io](https://codemagic.io)
2. Click **Sign up** → Choose **GitHub**
3. Authorize Codemagic
4. Find `seamless-video-steps` → Click **Set up build**
5. Click **Start new build** → Watch it build

### 3. Download IPA

When build finishes (10-15 minutes):
- Go to **Artifacts** tab
- Download `app.ipa`

### 4. Install on iPhone

**Using AltStore (Easiest):**
1. Download [AltStore](https://altstore.io)
2. Install AltStore on iPhone
3. Open AltStore → **My Apps** → **+**
4. Select your IPA
5. Done! App installs automatically

**Using Sideloadly:**
1. Download [Sideloadly](https://sideloadly.io)
2. Connect iPhone to Mac
3. Select IPA → Enter Apple ID → Click Start
4. Done!

## That's It!

Your app is now on your iPhone and valid for 7 days.

### Next Steps

- Upload videos in the app
- Test seamless playback
- Reinstall every 7 days (or use paid Apple Developer account for longer validity)

## Troubleshooting

### Build failed?
- Check Codemagic build log
- Ensure code is pushed to GitHub
- Try rebuilding

### Can't install IPA?
- Make sure you're using free Apple ID
- Check device has 1GB+ storage
- Try different installation method (AltStore vs Sideloadly)

### App crashes?
- Grant photo/media permissions
- Check device storage
- Try reinstalling

## What's Next?

- **Customize**: Edit `src/screens/UploadScreen.tsx` to change UI
- **Add features**: Create new screens in `src/screens/`
- **Deploy**: Push changes → Codemagic builds automatically

---

**Need help?** See `README.md` and `CODEMAGIC_SETUP.md` for detailed guides.
