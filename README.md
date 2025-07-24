# MeetNexa – Connect Visually, Anywhere

A real-time video conferencing platform similar to Google Meet, built with Next.js, WebRTC, and Socket.io.

## Features

- 🎥 **HD Video Calls** - Crystal clear video quality for 1-on-1 and group meetings
- 🎤 **Audio Controls** - Mute/unmute with real-time audio processing
- 💬 **Real-time Chat** - Live messaging during meetings
- 🖥️ **Screen Sharing** - Share your screen with participants
- 🚪 **Lobby System** - Host controls with waiting room for participants
- 🔐 **Secure Authentication** - Firebase Auth with email/password and guest access
- 📱 **Mobile Responsive** - Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI** - Dark theme with intuitive controls

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Firebase** for authentication and database
- **Socket.io Client** for real-time communication
- **WebRTC** for peer-to-peer video/audio

### Backend
- **Node.js + Express**
- **Socket.io** for signaling server
- **WebRTC** for media streaming

## Quick Start

### Prerequisites
- Node.js 18+ installed
- Firebase project set up
- Modern browser with WebRTC support

### 1. Clone and Install

```bash
# Install frontend dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 2. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password and Anonymous)
3. Create a Firestore database
4. Get your Firebase config and create `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### 3. Run the Application

```bash
# Terminal 1: Start the signaling server
cd server
npm run dev

# Terminal 2: Start the Next.js app
npm run dev
```

Visit `http://localhost:3000` to start using MeetNexa!

## How to Use

### Creating a Meeting
1. Click "New Meeting" on the homepage
2. You'll be redirected to the lobby as the host
3. Test your camera and microphone
4. Wait for participants to join or start the meeting immediately

### Joining a Meeting
1. Enter the meeting code on the homepage
2. Click "Join Meeting"
3. Sign in or join as a guest
4. Wait in the waiting room until the host admits you

### During the Meeting
- **Mute/Unmute**: Click the microphone button
- **Camera On/Off**: Click the camera button
- **Screen Share**: Click the monitor button
- **Chat**: Click the message button to open/close chat
- **Leave**: Click the red phone button to leave the meeting

## Project Structure

```
meetnexa/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Homepage
│   └── meeting/[code]/    # Dynamic meeting pages
├── components/            # React components
│   ├── AuthModal.tsx     # Authentication modal
│   ├── Lobby.tsx         # Host lobby component
│   ├── MeetingRoom.tsx   # Main meeting interface
│   └── WaitingRoom.tsx   # Participant waiting room
├── lib/                  # Utility libraries
│   ├── firebase.ts       # Firebase configuration
│   ├── store.ts          # Zustand state management
│   └── utils.ts          # Helper functions
└── server/               # Node.js signaling server
    ├── index.js          # Socket.io server
    └── package.json      # Server dependencies
```

## Key Features Implementation

### WebRTC Integration
- Peer-to-peer video/audio streaming
- ICE candidate exchange via Socket.io
- Screen sharing with `getDisplayMedia()`

### Real-time Communication
- Socket.io for signaling and chat
- Room-based participant management
- Media state synchronization

### Authentication & Security
- Firebase Authentication
- Anonymous guest access
- Secure room codes

### Responsive Design
- Mobile-first approach
- Adaptive video grid layouts
- Touch-friendly controls

## Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel
```

### Backend (Render/Railway)
```bash
cd server
# Deploy to your preferred platform
```

### Environment Variables for Production
Update your `.env.local` with production URLs:
```env
NEXT_PUBLIC_SOCKET_URL=https://your-server-domain.com
```

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review browser console for WebRTC errors

---

**MeetNexa** - Bringing people together through seamless video communication! 🚀