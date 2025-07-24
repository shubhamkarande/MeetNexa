'use client'

import { useState, useEffect } from 'react'
import { useMeetingStore } from '@/lib/store'
import { Users, Video, VideoOff, Mic, MicOff, Settings } from 'lucide-react'

export default function Lobby() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [previewVideo, setPreviewVideo] = useState(true)
  const [previewAudio, setPreviewAudio] = useState(true)
  
  const {
    meetingCode,
    waitingParticipants,
    setMeetingStarted,
    setIsInLobby,
    setLocalStream: setStoreLocalStream,
    setIsMuted,
    setIsVideoOff
  } = useMeetingStore()

  useEffect(() => {
    // Get user media for preview
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
        setLocalStream(stream)
        setStoreLocalStream(stream)
      } catch (error) {
        console.error('Error accessing media devices:', error)
      }
    }

    getMedia()

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !previewVideo
        setPreviewVideo(!previewVideo)
        setIsVideoOff(previewVideo)
      }
    }
  }

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !previewAudio
        setPreviewAudio(!previewAudio)
        setIsMuted(!previewAudio)
      }
    }
  }

  const startMeeting = () => {
    setMeetingStarted(true)
    setIsInLobby(false)
  }

  const admitParticipant = (participantId: string) => {
    // TODO: Implement admit participant logic
    console.log('Admitting participant:', participantId)
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Meeting Lobby</h1>
          <p className="text-gray-400">Meeting Code: <span className="font-mono text-blue-400">{meetingCode}</span></p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Preview */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Your Preview</h2>
              
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6">
                {localStream && previewVideo ? (
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
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <VideoOff className="w-16 h-16 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400">Camera is off</p>
                    </div>
                  </div>
                )}
                
                {/* User name overlay */}
                <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg">
                  <span className="text-white text-sm">You</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-full ${
                    previewAudio ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                  } transition-colors`}
                >
                  {previewAudio ? (
                    <Mic className="w-6 h-6 text-white" />
                  ) : (
                    <MicOff className="w-6 h-6 text-white" />
                  )}
                </button>
                
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full ${
                    previewVideo ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                  } transition-colors`}
                >
                  {previewVideo ? (
                    <Video className="w-6 h-6 text-white" />
                  ) : (
                    <VideoOff className="w-6 h-6 text-white" />
                  )}
                </button>
                
                <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
                  <Settings className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Waiting Participants & Controls */}
          <div className="space-y-6">
            {/* Waiting Participants */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Waiting to Join ({waitingParticipants.length})
              </h3>
              
              {waitingParticipants.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No one is waiting to join</p>
              ) : (
                <div className="space-y-3">
                  {waitingParticipants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{participant.name}</p>
                        <p className="text-gray-400 text-sm">{participant.email}</p>
                      </div>
                      <button
                        onClick={() => admitParticipant(participant.id)}
                        className="btn-primary px-4 py-2 text-sm"
                      >
                        Admit
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Start Meeting */}
            <button
              onClick={startMeeting}
              className="w-full btn-primary py-4 text-lg font-semibold rounded-xl"
            >
              Start Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}