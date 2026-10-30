# Qapp - 100% Offline Progressive Web App (PWA)

A vibrant, playful, and accessible child learning and routine assessment app designed for high tactile engagement, visual feedback, and text-to-speech interaction.

---

## ✨ Highlights & Features

- **📱 100% Offline Progressive Web App (PWA)**:
  - Powered by `vite-plugin-pwa` and Service Worker Workbox precaching.
  - Installable directly to the home screen on Android, iOS, iPadOS, macOS, Windows, and Linux.
  - No internet connection required after first load.
- **🚫 Completely Free of Supabase & Cloud Dependencies**:
  - Replaced cloud database and remote storage with high-capacity local **IndexedDB** (`picksy_offline_db`).
  - Seamless localStorage fallback.
  - Fast, private, and resilient offline persistence for custom questions, routines, and images.
- **🎨 Vibrant, Playful & Accessible Design**:
  - High-energy gradients (electric purple, radiant berry, emerald green, sunshine amber).
  - Glassmorphic translucent cards with glowing highlights and smooth rounded corners.
  - Bouncy 3D tactile buttons optimized for children, seniors, and touch screens.
  - Confetti celebrations (`canvas-confetti`) when completing questions and earning stars.
- **🔊 Sound & Text-to-Speech (TTS)**:
  - Zero-latency Web Audio API synthesizer for playful pops, chimes, dings, and fanfare.
  - Bilingual text-to-speech (Hindi & English) with customizable speed (rate) and voice pitch.
  - Animated sound wave equalizer during audio playback.
  - Quick mute/unmute toggle in the top bar.
- **📋 Supported Question Formats**:
  1. **Yes / No**: Extra-large bouncy emerald and crimson action buttons with smiling feedback.
  2. **Right or Wrong (ROR)**: Dual side-by-side comparison cards with custom or glowing check/cross badges.
  3. **Visual Image Choices**: Multi-option picture cards (1 to 4+) with bold captions and animated glows.
- **🌅 Daily Routine Categories**:
  - 🌅 Morning Routine (M)
  - 🌇 Evening Routine (E)
  - 🌙 Night Routine (N)
  - 🎨 Custom categories with instant tags.
- **💾 Backup & Data Portability**:
  - One-click JSON backup export with offline images and questions.
  - JSON backup restore/import.
  - Reset to default starter pack with built-in illustrated routine questions.
- **✂️ Offline Image Cropper & Preset Stickers**:
  - Interactive canvas cropper with 1:1 aspect ratio.
  - Built-in library of SVG routine stickers (toothbrush, milk, fruits, bed, ball, bicycle, drawing, etc.).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm or bun

### Installation & Run

```sh
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production offline PWA
npm run build

# Preview production build locally
npm run preview
```

---

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Offline Storage**: IndexedDB + localStorage fallback
- **Styling**: Tailwind CSS + Shadcn UI + Lucide Icons
- **PWA**: `vite-plugin-pwa` + Workbox Service Worker
- **Audio & FX**: Web Audio API Synthesizer + Web Speech API + `canvas-confetti`
- **Image Editing**: `react-image-crop` + HTML5 Canvas
