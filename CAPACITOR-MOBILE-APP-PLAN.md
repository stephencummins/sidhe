# SÍDHE Mobile App Implementation Plan
## Converting to iOS & Android with Capacitor

---

## Overview
This document outlines the step-by-step process to convert the SÍDHE web app into native iOS and Android applications using Capacitor.

**Timeline Estimate:** 1-2 weeks
**Difficulty:** Medium
**Cost to Publish:** $99/year (Apple) + $25 one-time (Google)

---

## Phase 1: Capacitor Setup (Day 1)

### 1.1 Install Capacitor Dependencies

```bash
# Core Capacitor packages
npm install @capacitor/core @capacitor/cli

# Platform-specific packages
npm install @capacitor/ios @capacitor/android

# Useful plugins
npm install @capacitor/app @capacitor/splash-screen @capacitor/status-bar @capacitor/haptics @capacitor/share @capacitor/preferences
```

### 1.2 Initialize Capacitor

```bash
npx cap init
```

When prompted:
- **App name:** SÍDHE
- **App ID:** com.sidhe.tarot (or your domain reversed)
- **Web directory:** dist

### 1.3 Update package.json Scripts

Add these scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:mobile": "vite build && npx cap sync",
    "ios": "npm run build:mobile && npx cap open ios",
    "android": "npm run build:mobile && npx cap open android",
    "sync": "npx cap sync",
    "preview": "vite preview",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit -p tsconfig.app.json"
  }
}
```

### 1.4 Add Platform Projects

```bash
# Add iOS (requires macOS)
npx cap add ios

# Add Android
npx cap add android
```

---

## Phase 2: Configuration (Day 2)

### 2.1 Create capacitor.config.ts

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sidhe.tarot',
  appName: 'SÍDHE',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // For local development:
    // url: 'http://192.168.1.x:5173',
    // cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#1a1a2e",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#d4af37",
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#1a1a2e'
    }
  }
};

export default config;
```

### 2.2 Update vite.config.ts

Ensure the base path is correct for mobile:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Important for Capacitor
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase': ['@supabase/supabase-js']
        }
      }
    }
  }
})
```

---

## Phase 3: Mobile Optimizations (Day 3-4)

### 3.1 Add Safe Area Support

Create `src/hooks/useSafeArea.ts`:

```typescript
import { useEffect, useState } from 'react';
import { SafeArea } from '@capacitor/core';

export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });

  useEffect(() => {
    const getSafeArea = async () => {
      try {
        const area = await SafeArea.getSafeAreaInsets();
        setSafeArea(area.insets);
      } catch (error) {
        console.log('Running on web, no safe area needed');
      }
    };
    getSafeArea();
  }, []);

  return safeArea;
}
```

### 3.2 Update Layout Component

Modify `src/components/Layout.tsx` to handle safe areas:

```typescript
import { useSafeArea } from '../hooks/useSafeArea';
import { StatusBar } from '@capacitor/status-bar';
import { useEffect } from 'react';

export default function Layout({ children }) {
  const safeArea = useSafeArea();

  useEffect(() => {
    // Set status bar style for mobile
    const setStatusBar = async () => {
      try {
        await StatusBar.setStyle({ style: 'DARK' });
        await StatusBar.setBackgroundColor({ color: '#1a1a2e' });
      } catch (error) {
        console.log('Running on web');
      }
    };
    setStatusBar();
  }, []);

  return (
    <div
      style={{
        paddingTop: `${safeArea.top}px`,
        paddingBottom: `${safeArea.bottom}px`
      }}
    >
      {children}
    </div>
  );
}
```

### 3.3 Add Haptic Feedback

Update card selection to add haptic feedback:

```typescript
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const handleCardClick = async () => {
  // Add haptic feedback on mobile
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch (error) {
    // Running on web
  }
  // ... rest of card selection logic
};
```

### 3.4 Add Share Functionality

Create `src/utils/share.ts`:

```typescript
import { Share } from '@capacitor/share';

export async function shareReading(readingUrl: string) {
  try {
    await Share.share({
      title: 'My SÍDHE Tarot Reading',
      text: 'Check out my tarot reading!',
      url: readingUrl,
      dialogTitle: 'Share your reading'
    });
  } catch (error) {
    // Fallback to web share API or copy to clipboard
    if (navigator.share) {
      await navigator.share({
        title: 'My SÍDHE Tarot Reading',
        text: 'Check out my tarot reading!',
        url: readingUrl
      });
    } else {
      await navigator.clipboard.writeText(readingUrl);
      alert('Link copied to clipboard!');
    }
  }
}
```

### 3.5 Offline Support (Optional but Recommended)

Create a service worker or use Capacitor's Preferences plugin to cache readings:

```typescript
import { Preferences } from '@capacitor/preferences';

export async function saveReadingOffline(reading: Reading) {
  await Preferences.set({
    key: `reading_${reading.id}`,
    value: JSON.stringify(reading)
  });
}

export async function getOfflineReading(id: string) {
  const { value } = await Preferences.get({ key: `reading_${id}` });
  return value ? JSON.parse(value) : null;
}
```

---

## Phase 4: Assets & Branding (Day 5)

### 4.1 App Icons

You'll need icons in various sizes. Create these in the following locations:

**iOS (ios/App/App/Assets.xcassets/AppIcon.appiconset/)**
- 1024x1024px (App Store)
- 180x180px (iPhone)
- 167x167px (iPad Pro)
- 152x152px (iPad)
- 120x120px (iPhone)
- 87x87px (iPhone)
- 80x80px (iPad)
- 76x76px (iPad)
- 60x60px (iPhone)
- 58x58px (iPhone)
- 40x40px (Spotlight)
- 29x29px (Settings)
- 20x20px (Notifications)

**Android (android/app/src/main/res/)**
- mipmap-xxxhdpi: 192x192px
- mipmap-xxhdpi: 144x144px
- mipmap-xhdpi: 96x96px
- mipmap-hdpi: 72x72px
- mipmap-mdpi: 48x48px

**Tip:** Use a tool like https://icon.kitchen/ or https://appicon.co/ to generate all sizes from a single 1024x1024 icon.

### 4.2 Splash Screens

Create splash screens with your moon logo:

**iOS:** Use Xcode's LaunchScreen.storyboard
**Android:** Create `drawable-*` folders with splash images

Recommended: Use `@capacitor/assets` to automate this:

```bash
npm install @capacitor/assets -D
```

Create `assets/icon.png` (1024x1024) and `assets/splash.png` (2732x2732)

```bash
npx capacitor-assets generate
```

### 4.3 Update App Metadata

**iOS** - Edit `ios/App/App/Info.plist`:
```xml
<key>CFBundleDisplayName</key>
<string>SÍDHE</string>
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
```

**Android** - Edit `android/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">SÍDHE</string>
<string name="title_activity_main">SÍDHE Celtic Tarot</string>
<string name="package_name">com.sidhe.tarot</string>
```

---

## Phase 5: Testing (Day 6-7)

### 5.1 iOS Testing (requires macOS)

```bash
# Build and open in Xcode
npm run ios

# In Xcode:
# 1. Select a simulator (iPhone 15, etc.)
# 2. Click Run (⌘R)
# 3. Test all features
```

**Test checklist:**
- ✅ Navigation works
- ✅ Card selection and animations
- ✅ Reading generation
- ✅ Supabase authentication
- ✅ Saved readings
- ✅ Share functionality
- ✅ Subscription flow (Stripe)
- ✅ Daily reading emails still work
- ✅ Safe areas (notch handling)
- ✅ Status bar appearance

### 5.2 Android Testing

```bash
# Build and open in Android Studio
npm run android

# In Android Studio:
# 1. Create an emulator (Pixel 7, Android 14)
# 2. Click Run
# 3. Test all features
```

**Test the same checklist as iOS**

### 5.3 Live Reload for Development

For faster development, use live reload:

```bash
# Get your local IP address
# macOS/Linux: ifconfig | grep "inet "
# Windows: ipconfig

# Update capacitor.config.ts
server: {
  url: 'http://192.168.1.x:5173',
  cleartext: true
}

# Start dev server
npm run dev

# Sync and open
npx cap sync
npx cap open ios  # or android
```

---

## Phase 6: Platform-Specific Features (Optional)

### 6.1 Push Notifications for Daily Readings

```bash
npm install @capacitor/push-notifications
```

Implement in your daily reading subscription flow to send push notifications when new readings are available.

### 6.2 In-App Purchases (Alternative to Stripe)

For mobile app purchases, consider using Apple's In-App Purchase and Google Play Billing:

```bash
npm install @capacitor-community/in-app-purchases
```

This would replace Stripe for mobile-only subscriptions.

### 6.3 Native Calendar Integration

Allow users to save readings to their calendar:

```bash
npm install @capacitor-community/calendar
```

---

## Phase 7: App Store Submission (Day 8-14)

### 7.1 iOS App Store

**Prerequisites:**
- Apple Developer Account ($99/year)
- macOS with Xcode
- Valid app icons and screenshots

**Steps:**
1. Archive app in Xcode (Product > Archive)
2. Validate app
3. Upload to App Store Connect
4. Fill out app information:
   - Name: SÍDHE
   - Subtitle: Celtic Tarot Readings
   - Description: (write compelling copy)
   - Keywords: tarot, celtic, divination, oracle, cards
   - Screenshots: (5-8 screenshots showing key features)
   - Privacy Policy URL
   - Support URL
5. Submit for review (typically 1-3 days)

**App Store Copy Suggestions:**

**Description:**
```
SÍDHE - Celtic Tarot Readings

Discover ancient wisdom through the mystical art of Celtic tarot. SÍDHE combines traditional tarot with rich Celtic mythology to provide profound insights into your life's journey.

Features:
• Multiple Spreads: Single card, three-card, and Celtic Cross
• AI-Powered Interpretations: Deep, contextual readings powered by advanced AI
• Celtic & Traditional: Choose between Celtic mythology or traditional meanings
• Daily Readings: Get your daily three-card reading delivered
• Save & Review: Keep a journal of your readings
• Beautiful Design: Immersive Celtic-inspired interface
• Privacy First: Your readings are personal and secure

Whether you're seeking guidance, clarity, or connection to ancient wisdom, SÍDHE is your portal to the mystical realm of Celtic divination.

Subscription includes:
• Unlimited readings
• Daily reading notifications
• Advanced spreads
• Reading analytics
• Priority support

Download SÍDHE and begin your journey today.
```

### 7.2 Google Play Store

**Prerequisites:**
- Google Play Console account ($25 one-time)
- Android app bundle (.aab)
- Screenshots and graphics

**Steps:**
1. Build release bundle in Android Studio
2. Sign the app with a keystore
3. Upload to Play Console
4. Fill out store listing
5. Submit for review (typically same day)

---

## Phase 8: Post-Launch (Ongoing)

### 8.1 Analytics

Add mobile analytics:

```bash
npm install @capacitor-community/firebase-analytics
```

Track:
- Daily active users
- Reading completion rate
- Subscription conversions
- Feature usage

### 8.2 Updates

When you update the app:

```bash
# 1. Update version in package.json
# 2. Build
npm run build:mobile

# 3. Open in IDE and bump version
npm run ios  # or android

# 4. Archive and submit update
```

### 8.3 Marketing

- Add "Download on App Store" badges to website
- Social media announcement
- Email existing subscribers
- App Store Optimization (ASO)

---

## Troubleshooting

### Common Issues:

**1. White screen on launch**
- Check `base: './'` in vite.config.ts
- Run `npx cap sync` after building
- Check browser console in dev tools

**2. API calls failing**
- Update CORS settings in Supabase
- Check network requests in dev tools
- Ensure Supabase URL is accessible

**3. Status bar issues**
- Import StatusBar plugin
- Set style in Layout component
- Check safe area insets

**4. Build errors**
- Clear cache: `rm -rf node_modules dist && npm install`
- Clean platform projects:
  - iOS: `cd ios/App && pod install`
  - Android: Clean project in Android Studio

---

## Cost Breakdown

| Item | Cost | Frequency |
|------|------|-----------|
| Apple Developer Account | $99 | Annual |
| Google Play Console | $25 | One-time |
| Icon/Asset Tools (optional) | Free-$50 | One-time |
| **Total Year 1** | **$124-174** | - |
| **Subsequent Years** | **$99** | Annual |

---

## Revenue Potential

**Web App (Current):**
- Monthly subscriptions: $4.99/month
- Annual subscriptions: ~$50/year

**Mobile App (Additional Revenue):**
- One-time purchase: $2.99-$4.99
- OR In-app subscription: $4.99/month
- OR Freemium: Free with in-app purchase for premium

**Estimated Impact:**
- 2-3x higher conversion rates on mobile
- Better user retention
- Push notifications = higher engagement
- App Store discoverability = new customers

---

## Next Steps

1. ✅ Review this plan
2. 🔨 Install Capacitor dependencies
3. 📱 Add iOS and Android platforms
4. 🎨 Create app icons and branding
5. 🧪 Test on simulators/devices
6. 📤 Submit to app stores

Would you like me to start implementing Phase 1?
