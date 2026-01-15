# Modern Tic Tac Toe

A stunning, modern take on the classic Tic Tac Toe game with glassmorphism UI, neon aesthetics, and intelligent CPU opponent. Play against the computer or challenge a friend in this visually striking implementation.

## Key Features

### 🎨 Glassmorphism UI

- Semi-transparent backgrounds using `rgba` for a frosted glass effect
- Smooth background blur with `backdrop-filter` for modern aesthetics
- Subtle borders and layered depth create a floating, premium feel

### ✨ Neon Aesthetics

- **Cyan X marks** with glowing text-shadow for striking visibility
- **Pink O marks** with matching neon glow effect
- CSS gradients create a vibrant, eye-catching design
- Dark background with gradient overlay enhances the neon pop

### 🎬 Reactive Animations

- **Pop-in Effect**: Marks scale up and rotate dynamically as they're placed
- **Floating Orbs**: Pure CSS background animations add subtle movement and life to empty space without distracting from gameplay
- **Hover States**: Cells lift up slightly and brighten on hover for interactive feedback
- Smooth transitions throughout the entire interface

### 🧠 Smart Game Logic

- **Instant Winner Detection**: Calculates the winner immediately upon winning move
- **Winning Cell Highlighting**: Highlights the three winning cells in glowing green
- **Draw Detection**: Automatically identifies and announces draws
- **CPU AI**: Intelligent opponent with strategic decision-making:
  - Priority 1: Seeks winning moves
  - Priority 2: Blocks player winning moves
  - Priority 3: Takes center if available
  - Priority 4: Random move selection

### 🎮 Game Modes

- **Player vs CPU**: Challenge an intelligent computer opponent with strategic gameplay
- **2-Player Mode**: Play locally with a friend on the same device
- Easy mode toggle to switch between game modes mid-session

### 📱 Progressive Web App (PWA)

- **Installable**: Add to home screen on mobile and desktop devices
- **Offline Support**: Play without internet connection after first load
- **One-Click Install**: Prominent install button in the UI for easy installation
- **App-Like Experience**: Runs in standalone mode without browser UI
- **Fast Loading**: Instant loading after first visit with cached resources

## 💻 Technology Stack

| Category     | Technologies                                            |
| :----------- | :------------------------------------------------------ |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript                         |
| **Styling**  | Glassmorphism, Neon Aesthetics, CSS Grid/Flexbox        |
| **PWA**      | Service Workers, Web App Manifest, Cache API            |
| **SEO**      | Meta Tags, Open Graph, JSON-LD, Robots.txt, Sitemap.xml |
| **Hosting**  | Vercel                                                  |

## 📁 Project Structure

```text
modern-tic-tac-toe/
├── icons/              # PWA app icons (72x72 to 512x512)
├── docs/               # Documentation and guides
├── index.html          # Main application entry point
├── styles.css          # Modern neon glassmorphism styles
├── scripts.js          # Core game logic and AI opponent
├── pwa.js              # PWA initialization and install handling
├── sw.js               # Service Worker for offline support
├── manifest.json       # Web App Manifest for installability
├── vercel.json         # Vercel deployment configuration
├── robots.txt          # Search engine crawler configuration
├── sitemap.xml         # SEO sitemap
└── icon-generator.html # Helper tool for generating PWA icons
```

## Getting Started

Simply open `index.html` in your web browser. No installation or build process required!

### How to Play

1. Click on any empty cell to make your move (X)
2. If playing vs CPU, watch as the computer makes its move (O)
3. First player to get three marks in a row (horizontal, vertical, or diagonal) wins!
4. Use the "Mode" button to switch between Player vs CPU and 2-Player modes
5. Click "Reset" to start a new game anytime

## Browser Compatibility

Works on all modern browsers including:

- Chrome/Chromium
- Firefox
- Safari
- Edge

Fully responsive and mobile-friendly!
