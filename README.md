# Classic Macintosh Landing Page

A stunning Three.js landing page featuring a 3D classic Macintosh computer model with smooth scroll animations and a terminal overlay with typing effects.

## Features

- **3D Classic Macintosh Model**: Authentic recreation of the iconic all-in-one Macintosh design with:
  - Beige color scheme
  - Built-in CRT monitor
  - Disk drive slot
  - Apple logo
  - Matching keyboard and mouse
- **Cinematic Scroll Animation**: Camera smoothly zooms out from the screen to reveal the full computer
- **Terminal Overlay**: Authentic retro terminal interface with:
  - Blinking cursor
  - Typing animation
  - Green phosphor glow effect
  - Classic terminal window styling
- **Visual Effects**:
  - Animated CRT scan lines on the monitor
  - Pulsing screen glow
  - Subtle floating animation
  - Fog and atmospheric lighting
- **Responsive Design**: Works on desktop and mobile devices

## How to Run

### Option 1: Using Python (if installed)
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000 in your browser.

### Option 2: Using Node.js
```bash
npm start
# or
npm run serve
```
Then open http://localhost:8000 in your browser.

### Option 3: Using any static file server
Simply serve the files using any static file server of your choice.

## Project Structure

- `index.html` - Main HTML structure with terminal overlay
- `style.css` - Styling for terminal, layout, and animations
- `script.js` - Three.js scene setup, 3D model creation, and animations
- `package.json` - Project configuration

## How It Works

1. The page starts with the camera zoomed in on the Macintosh screen
2. The terminal overlay displays classic Mac-themed typing animations
3. As you scroll down, the camera zooms out to reveal the full Macintosh computer
4. The computer rotates slightly during scroll for a cinematic effect
5. The terminal overlay fades out as you scroll further

## Technologies Used

- Three.js for 3D graphics
- Vanilla JavaScript for animations
- CSS3 for styling and effects
- WebGL shaders for scan line effects