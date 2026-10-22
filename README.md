# MeetFlow

MeetFlow is a browser-based video meeting application with account authentication, meeting rooms, camera/microphone controls, and peer-to-peer video calling.

The project is split into two applications:

- `frontend/` — React 19 + Vite client application.
- `backend/` — Express API and Socket.IO signaling server with MongoDB persistence.

WebRTC carries media directly between participants. Socket.IO is used for authentication, room membership, WebRTC offers/answers, ICE candidates, and room events.

## Features

- Sign up, log in, view the current profile, and log out.
- Create a short meeting ID or join an existing active room.
- Preview camera and microphone before joining.
- Toggle audio and video during a call.
- Exchange video streams with other participants using WebRTC.
- Persist users and room hosts in MongoDB.
- Allow the room host to remove a participant.
- Show participant count and handle participant departures.

## Requirements

- Node.js with npm
- MongoDB running locally
- A modern browser with camera and microphone support

The backend currently connects to:

```text
mongodb://localhost:27017/zoom-user
```

The frontend expects the backend at `http://localhost:8080`, and the backend allows the Vite client origin `http://localhost:5173`.

## Installation

Install dependencies for both applications:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Start MongoDB before starting the backend.

## Running locally

Open two terminals from the repository root.

Terminal 1 — backend:

```bash
cd backend
node index.js
```

The API and Socket.IO server listen on `http://localhost:8080`.

Terminal 2 — frontend:

```bash
cd frontend
npm run dev
```


Open the URL printed by Vite, normally `http://localhost:5173`.


To create a production frontend bundle:


```bash
cd frontend
npm run build
```

To preview that bundle:

```bash
npm run preview
```

To run the frontend linter:

```bash
npm run lint
```

The backend currently has no automated test command; its `npm test` script is the default placeholder and exits with an error.

## Typical user flow

1. Create an account at `/signup` or log in at `/login`.
2. From `/`, create a meeting or enter an active meeting ID.
3. On `/lobby/:roomId`, grant camera/microphone permissions, enter a display name, and adjust the preview controls.
4. Select **Join meeting** to enter `/room/:roomId`.
5. Use the in-call controls to mute, disable video, leave, or—if you are the host—remove another participant.

## Application routes

| Route | Purpose | Authentication |
| --- | --- | --- |
| `/` | Create or join a meeting | Required |
| `/login` | Log in | Public when logged out |
| `/signup` | Create an account | Public when logged out |
| `/lobby/:roomId` | Camera/microphone preview | Required |
| `/room/:roomId` | Active video room | Required |

## Backend API

All endpoints are served from `http://localhost:8080`.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/signup` | Create a user and set the authentication cookie |
| `POST` | `/login` | Validate credentials and set the authentication cookie |
| `GET` | `/profile` | Return the authenticated user |
| `POST` | `/logout` | Clear the authentication cookie |
| `GET` | `/generateId` | Generate a six-character meeting ID |
| `GET` | `/check/:id` | Check whether a meeting is currently active |

Authentication uses an HTTP-only `token` cookie. Requests from the frontend send credentials with CORS enabled.

## Socket.IO events

The Socket.IO server authenticates connections from the same cookie used by the REST API.

Room and signaling events currently include:

- `join-room`
- `existing-users`
- `user-joined`
- `user-left`
- `leave-room`
- `offer`
- `answer`
- `ice-candidate`
- `kick-user`
- `kicked`

The browser creates `RTCPeerConnection` instances using Google's public STUN server (`stun:stun.l.google.com:19302`).

## Project structure

```text
.
├── backend/
│   ├── index.js              # Express, REST routes, Socket.IO, and room state
│   └── models/
│       ├── User.js           # User schema
│       └── Room.js           # Room/host schema
├── frontend/
│   ├── src/
│   │   ├── components/       # Auth, header, and video components
│   │   ├── contexts/         # Local media state
│   │   ├── pages/             # Home, lobby, login, signup, and room screens
│   │   ├── services/          # REST and Socket.IO clients
│   │   └── main.jsx           # Router and Redux entry point
│   └── store/                # Redux authentication state
└── README.md
```

## Development notes

- Room membership is held in an in-memory `rooms` object, so active rooms disappear when the backend restarts and are not shared across multiple backend instances.
- Room documents remain in MongoDB, while the live participant list is in memory.
- The JWT secret, MongoDB URI, frontend origin, and backend origin are currently hard-coded in source. Before deployment, move them to environment variables and use a strong secret.
- The current cookie options are intended for local development. Production deployment should configure `secure`, `sameSite`, expiration, and HTTPS appropriately.
- Camera and microphone access normally requires `localhost` or HTTPS and must be granted by the browser.
- WebRTC can require a TURN server in networks where direct peer-to-peer connectivity is unavailable; the current client config includes only a public STUN server.
- The frontend and backend must run on the origins configured in the source unless those values are changed together.

## License

No project license is currently defined.
