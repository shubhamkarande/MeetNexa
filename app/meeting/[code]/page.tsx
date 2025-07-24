'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useMeetingStore } from '@/lib/store'
import { auth } from '@/lib/firebase'
import { signInAnonymously } from 'firebase/auth'
import MeetingRoom from '@/components/MeetingRoom'
import Lobby from '@/components/Lobby'
import WaitingRoom from '@/components/WaitingRoom'
import AuthModal from '@/components/AuthModal'

export default function MeetingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  
  const {
    user,
    setUser,
    meetingCode,
    setMeetingCode,
    isHost,
    setIsHost,
    meetingStarted,
    isInLobby,
    setIsInLobby
  } = useMeetingStore()

  useEffect(() => {
    const code = params.code as string
    const hostParam = searchParams.get('host')
    
    if (!code) {
      router.push('/')
      return
    }

    setMeetingCode(code)
    setIsHost(hostParam === 'true')
    
    // Check if Firebase is configured
    const isFirebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'AIzaSyC-REPLACE-WITH-YOUR-ACTUAL-API-KEY'
    
    if (isFirebaseConfigured) {
      // Check if user is authenticated
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          setUser(user)
          if (hostParam === 'true') {
            setIsInLobby(true)
          }
          setLoading(false)
        } else {
          setShowAuth(true)
          setLoading(false)
        }
      })

      return () => unsubscribe()
    } else {
      // Skip authentication for demo
      console.warn('Firebase not configured - running in demo mode')
      setUser({ uid: 'demo-user', email: 'demo@example.com' } as any)
      if (hostParam === 'true') {
        setIsInLobby(true)
      }
      setLoading(false)
    }
  }, [params.code, searchParams, router, setMeetingCode, setIsHost, setUser, setIsInLobby])

  const handleAuthSuccess = () => {
    setShowAuth(false)
    if (isHost) {
      setIsInLobby(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading meeting...</p>
        </div>
      </div>
    )
  }

  if (showAuth) {
    return <AuthModal onSuccess={handleAuthSuccess} />
  }

  if (isHost && isInLobby && !meetingStarted) {
    return <Lobby />
  }

  if (!isHost && !meetingStarted) {
    return <WaitingRoom />
  }

  return <MeetingRoom />
}