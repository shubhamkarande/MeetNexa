'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Video, Users, Shield, Smartphone } from 'lucide-react'
import { generateMeetingCode } from '@/lib/utils'

export default function HomePage() {
  const [meetingCode, setMeetingCode] = useState('')
  const router = useRouter()

  const handleCreateMeeting = () => {
    const code = generateMeetingCode()
    router.push(`/meeting/${code}?host=true`)
  }

  const handleJoinMeeting = () => {
    if (meetingCode.trim()) {
      router.push(`/meeting/${meetingCode.trim()}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Meet<span className="text-blue-400">Nexa</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Connect Visually, Anywhere. Secure video conferencing for teams and individuals.
          </p>
        </header>

        {/* Main Actions */}
        <div className="max-w-md mx-auto mb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <div className="space-y-6">
              <button
                onClick={handleCreateMeeting}
                className="w-full btn-primary py-4 text-lg font-semibold rounded-xl"
              >
                <Video className="inline-block w-6 h-6 mr-2" />
                New Meeting
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">or</span>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter meeting code"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  className="w-full input-field py-3 text-center text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleJoinMeeting()}
                />
                <button
                  onClick={handleJoinMeeting}
                  disabled={!meetingCode.trim()}
                  className="w-full btn-secondary py-3 text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Join Meeting
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">HD Video Calls</h3>
            <p className="text-gray-400">Crystal clear video quality for all your meetings</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Group Meetings</h3>
            <p className="text-gray-400">Connect with multiple participants seamlessly</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Secure & Private</h3>
            <p className="text-gray-400">End-to-end encryption for all communications</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Mobile Ready</h3>
            <p className="text-gray-400">Works perfectly on desktop and mobile devices</p>
          </div>
        </div>
      </div>
    </div>
  )
}