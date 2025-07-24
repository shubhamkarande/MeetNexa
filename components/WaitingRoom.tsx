'use client'

import { useState, useEffect } from 'react'
import { useMeetingStore } from '@/lib/store'
import { Clock, Users } from 'lucide-react'

export default function WaitingRoom() {
  const [dots, setDots] = useState('')
  const { meetingCode, user } = useMeetingStore()

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return ''
        return prev + '.'
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
          {/* Animated waiting icon */}
          <div className="mb-8">
            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-4 bg-blue-600/20 rounded-full flex items-center justify-center">
                <Clock className="w-10 h-10 text-blue-400 animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full animate-bounce"></div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            Waiting to be admitted{dots}
          </h1>
          
          <p className="text-gray-400 mb-6">
            The meeting host will let you in soon
          </p>

          <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
              <Users className="w-4 h-4" />
              <span>Meeting Code:</span>
              <span className="font-mono text-blue-400 font-semibold">{meetingCode}</span>
            </div>
          </div>

          <div className="space-y-3 text-sm text-gray-400">
            <p>✓ Your microphone and camera are ready</p>
            <p>✓ Connection is secure</p>
            <p>✓ Waiting for host approval</p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              Joined as: <span className="text-gray-300">{user?.email || 'Guest'}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Having trouble? Check your internet connection
          </p>
        </div>
      </div>
    </div>
  )
}