const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')

const app = express()
const server = http.createServer(app)

app.use(cors())
app.use(express.json())

const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

// Store active rooms and participants
const rooms = new Map()
const participants = new Map()

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  // Join room
  socket.on('join-room', ({ roomId, userInfo }) => {
    socket.join(roomId)
    
    // Store participant info
    participants.set(socket.id, {
      ...userInfo,
      socketId: socket.id,
      roomId
    })

    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        id: roomId,
        participants: new Set(),
        host: socket.id,
        isActive: false
      })
    }

    const room = rooms.get(roomId)
    room.participants.add(socket.id)

    // Notify others in the room
    socket.to(roomId).emit('user-joined', {
      userId: socket.id,
      userInfo: participants.get(socket.id)
    })

    // Send current participants to the new user
    const currentParticipants = Array.from(room.participants)
      .filter(id => id !== socket.id)
      .map(id => ({
        userId: id,
        userInfo: participants.get(id)
      }))

    socket.emit('room-participants', currentParticipants)

    console.log(`User ${socket.id} joined room ${roomId}`)
  })

  // WebRTC signaling
  socket.on('offer', ({ offer, targetUserId }) => {
    socket.to(targetUserId).emit('offer', {
      offer,
      fromUserId: socket.id
    })
  })

  socket.on('answer', ({ answer, targetUserId }) => {
    socket.to(targetUserId).emit('answer', {
      answer,
      fromUserId: socket.id
    })
  })

  socket.on('ice-candidate', ({ candidate, targetUserId }) => {
    socket.to(targetUserId).emit('ice-candidate', {
      candidate,
      fromUserId: socket.id
    })
  })

  // Chat messages
  socket.on('chat-message', ({ roomId, message }) => {
    const participant = participants.get(socket.id)
    if (participant) {
      io.to(roomId).emit('chat-message', {
        id: Date.now().toString(),
        userId: socket.id,
        userName: participant.name,
        message,
        timestamp: Date.now()
      })
    }
  })

  // Media state updates
  socket.on('media-state-change', ({ roomId, mediaState }) => {
    socket.to(roomId).emit('participant-media-change', {
      userId: socket.id,
      mediaState
    })
  })

  // Start meeting (host only)
  socket.on('start-meeting', ({ roomId }) => {
    const room = rooms.get(roomId)
    if (room && room.host === socket.id) {
      room.isActive = true
      io.to(roomId).emit('meeting-started')
      console.log(`Meeting ${roomId} started by host ${socket.id}`)
    }
  })

  // Admit participant (host only)
  socket.on('admit-participant', ({ roomId, participantId }) => {
    const room = rooms.get(roomId)
    if (room && room.host === socket.id) {
      socket.to(participantId).emit('admitted-to-meeting')
      console.log(`Participant ${participantId} admitted to ${roomId}`)
    }
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
    
    const participant = participants.get(socket.id)
    if (participant) {
      const { roomId } = participant
      const room = rooms.get(roomId)
      
      if (room) {
        room.participants.delete(socket.id)
        
        // Notify others in the room
        socket.to(roomId).emit('user-left', {
          userId: socket.id
        })

        // If room is empty, clean it up
        if (room.participants.size === 0) {
          rooms.delete(roomId)
          console.log(`Room ${roomId} deleted`)
        }
        // If host left, assign new host
        else if (room.host === socket.id) {
          const newHost = Array.from(room.participants)[0]
          room.host = newHost
          io.to(roomId).emit('new-host', { hostId: newHost })
          console.log(`New host assigned for room ${roomId}: ${newHost}`)
        }
      }
      
      participants.delete(socket.id)
    }
  })

  // Leave room
  socket.on('leave-room', ({ roomId }) => {
    socket.leave(roomId)
    
    const room = rooms.get(roomId)
    if (room) {
      room.participants.delete(socket.id)
      socket.to(roomId).emit('user-left', {
        userId: socket.id
      })
    }
    
    participants.delete(socket.id)
    console.log(`User ${socket.id} left room ${roomId}`)
  })
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    rooms: rooms.size, 
    participants: participants.size 
  })
})

// Get room info
app.get('/room/:roomId', (req, res) => {
  const { roomId } = req.params
  const room = rooms.get(roomId)
  
  if (room) {
    res.json({
      exists: true,
      isActive: room.isActive,
      participantCount: room.participants.size
    })
  } else {
    res.json({
      exists: false,
      isActive: false,
      participantCount: 0
    })
  }
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`MeetNexa server running on port ${PORT}`)
})