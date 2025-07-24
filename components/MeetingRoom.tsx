'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useMeetingStore } from '@/lib/store'
import { getVideoGridClass, formatTime } from '@/lib/utils'
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  MessageSquare, 
  Monitor,
  MoreVertical,
  Users
} from 'lucide-react'

export default function MeetingRoom() {
  const router = useRouter()
  const [meetingDuration, setMeetingDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()
  
  const {
    meetingCode,
    participants,
    localStream,
    isMuted,
    isVideoOff,
    isScreenSharing,
    isChatOpen,
    messages,
    setIsMuted,
    setIsVideoOff,
    setIsScreenSharing,
    setIsChatOpen,
    addMessage
  } = useMeetingStore()

  useEffect(() => {
    const interval = setInterval(() => {
      setMeetingDuration(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = isMuted
        setIsMuted(!isMuted)
      }
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = isVideoOff
        setIsVideoOff(!isVideoOff)
      }
    }
  }

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        // Stop screen sharing
        setIsScreenSharing(false)
        // TODO: Replace screen share stream with camera stream
      } else {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        })
        setIsScreenSharing(true)
        // TODO: Replace camera stream with screen share stream
      }
    } catch (error) {
      console.error('Error toggling screen share:', error)
    }
  }

  const leaveMeeting = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
    }
    router.push('/')
  }

  const sendMessage = (message: string) => {
    const newMessage = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      message,
      timestamp: Date.now()
    }
    addMessage(newMessage)
  }

  const participantCount = participants.length + 1 // +1 for local user
  const gridClass = getVideoGridClass(participantCount)

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Header */}
      <div className={`absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/50 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-white font-semibold">MeetNexa</h1>
            <span className="text-gray-300 text-sm">
              {formatTime(meetingDuration)}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 text-sm font-mono">{meetingCode}</span>
            <div className="flex items-center space-x-1 text-gray-300">
              <Users className="w-4 h-4" />
              <span className="text-sm">{participantCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="h-screen p-4 pt-20 pb-24">
        <div className={`video-grid ${gridClass} h-full`}>
          {/* Local Video */}
          <div className="video-container">
            {localStream && !isVideoOff ? (
              <video
                ref={(video) => {
                  if (video && localStream) {
                    video.srcObject = localStream
                  }
                }}
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <div className="text-center">
                  <VideoOff className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">Camera is off</p>
                </div>
              </div>
            )}
            
            {/* User info overlay */}
            <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg">
              <span className="text-white text-sm">You {isMuted && '(muted)'}</span>
            </div>
          </div>

          {/* Remote Participants */}
          {participants.map((participant) => (
            <div key={participant.id} className="video-container">
              {participant.stream && !participant.isVideoOff ? (
                <video
                  ref={(video) => {
                    if (video && participant.stream) {
                      video.srcObject = participant.stream
                    }
                  }}
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white text-xl font-semibold">
                        {participant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-400">{participant.name}</p>
                  </div>
                </div>
              )}
              
              <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg">
                <span className="text-white text-sm">
                  {participant.name} {participant.isMuted && '(muted)'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/50 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full ${
              isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            } transition-colors`}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>
          
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full ${
              isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            } transition-colors`}
          >
            {isVideoOff ? (
              <VideoOff className="w-6 h-6 text-white" />
            ) : (
              <Video className="w-6 h-6 text-white" />
            )}
          </button>
          
          <button
            onClick={toggleScreenShare}
            className={`p-4 rounded-full ${
              isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
            } transition-colors`}
          >
            <Monitor className="w-6 h-6 text-white" />
          </button>
          
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors relative"
          >
            <MessageSquare className="w-6 h-6 text-white" />
            {messages.length > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">{messages.length}</span>
              </div>
            )}
          </button>
          
          <button
            onClick={leaveMeeting}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
          
          <button className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
            <MoreVertical className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Chat Panel */}
      {isChatOpen && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-800 border-l border-gray-700 z-30">
          <ChatPanel onSendMessage={sendMessage} />
        </div>
      )}
    </div>
  )
}

function ChatPanel({ onSendMessage }: { onSendMessage: (message: string) => void }) {
  const [message, setMessage] = useState('')
  const { messages, setIsChatOpen } = useMeetingStore()

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-white font-semibold">Chat</h3>
        <button
          onClick={() => setIsChatOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center">No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-white">{msg.userName}</span>
                <span className="text-xs text-gray-400">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-300 text-sm">{msg.message}</p>
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={handleSend} className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 input-field py-2"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="btn-primary px-4 py-2 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}